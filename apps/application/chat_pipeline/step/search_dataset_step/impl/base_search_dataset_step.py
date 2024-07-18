# coding=utf-8
"""
    @project: maxkb
    @Author：虎
    @file： base_search_dataset_step.py
    @date：2024/1/10 10:33
    @desc:
"""
import os
from typing import List, Dict

from django.db.models import QuerySet

from application.chat_pipeline.I_base_chat_pipeline import ParagraphPipelineModel
from application.chat_pipeline.step.search_dataset_step.i_search_dataset_step import ISearchDatasetStep
from common.config.embedding_config import VectorStore, EmbeddingModel, RerankModel
from common.db.search import native_search
from common.util.file_util import get_file_content
from dataset.models import Paragraph
from embedding.models import SearchMode
from smartdoc.conf import PROJECT_DIR
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models.base import BaseChatModel
import json
import logging
import traceback


prompt = ChatPromptTemplate.from_template("""

你是一位经验丰富的煤矿安全专家和教育培训师。我会给你一个与煤矿行业相关的问题或主题。你的任务是基于这个问题，从不同角度生成 5 个相关的问题。这些问题应该涵盖安全管理、技术操作、法律法规、应急处理、环境影响等方面。

请确保每个问题都与原始主题相关，但从不同的角度探讨问题。问题应该简洁明了，适合用于培训或讨论。原问题在xml标签<text></text>中。

原始问题/主题是：
<text>{original_question}</text>

请生成 5 个相关问题，并以 JSON 数组的格式返回结果。格式如下：

["问题1", "问题2", "问题3", "问题4", "问题5"]

请严格确保输出的是有效的 JSON 格式，可以直接被解析。只返回问题数组，不要包含其他文字说明。

""")


class BaseSearchDatasetStep(ISearchDatasetStep):

    def execute(self, problem_text: str, dataset_id_list: list[str], exclude_document_id_list: list[str],
                exclude_paragraph_id_list: list[str], top_n: int, similarity: float, padding_problem_text: str = None,
                search_mode: str = None,
                chat_model: BaseChatModel = None,
                **kwargs) -> List[ParagraphPipelineModel]:
        exec_problem_text = padding_problem_text if padding_problem_text is not None else problem_text

        # rag-fusion
        response = chat_model.invoke(prompt.format_messages(original_question=exec_problem_text))

        # 解析 JSON 结果
        questions = []
        try:
            questions = json.loads(response)
            print(f"生成的问题：{questions}")
        except Exception as e:
            logging.getLogger("max_kb_error").error(f'{str(e)}:{traceback.format_exc()}')

        exec_problem_text_list = [exec_problem_text]
        if len(questions) > 0:
            exec_problem_text_list.extend(questions)

        embedding_model = EmbeddingModel.get_embedding_model()
        vector = VectorStore.get_embedding_vector()

        embedding_list = []
        for exec_problem_text in exec_problem_text_list:

            # 默认召回topn+2个段落
            embedding_list.append(vector.query(exec_problem_text, embedding_model.embed_query(exec_problem_text),
                                               dataset_id_list, exclude_document_id_list, exclude_paragraph_id_list,
                                               True, top_n+2, similarity, SearchMode(search_mode)))
        if embedding_list is None:
            return []
        paragraph_list = self.list_paragraph(embedding_list, vector)
        result = [self.reset_paragraph(paragraph, embedding_list) for paragraph in paragraph_list]

        if result is None or len(result) == 0:
            return []

        # 重排序
        rerank_model = RerankModel.get_rerank_model()
        rerank_index = rerank_model.rerank(exec_problem_text, [f'{paragraph.title}:{paragraph.content}' for paragraph in result]).get('rerank_ids')
        rerank_result = [result[index] for index in rerank_index][:top_n]

        return rerank_result

    @staticmethod
    def reset_paragraph(paragraph: Dict, embedding_list: List) -> ParagraphPipelineModel:
        filter_embedding_list = [embedding for embedding in embedding_list if
                                 str(embedding.get('paragraph_id')) == str(paragraph.get('id'))]
        if filter_embedding_list is not None and len(filter_embedding_list) > 0:
            find_embedding = filter_embedding_list[-1]
            return (ParagraphPipelineModel.builder()
                    .add_paragraph(paragraph)
                    .add_similarity(find_embedding.get('similarity'))
                    .add_comprehensive_score(find_embedding.get('comprehensive_score'))
                    .add_dataset_name(paragraph.get('dataset_name'))
                    .add_document_name(paragraph.get('document_name'))
                    .add_hit_handling_method(paragraph.get('hit_handling_method'))
                    .add_directly_return_similarity(paragraph.get('directly_return_similarity'))
                    .build())

    @staticmethod
    def get_similarity(paragraph, embedding_list: List):
        filter_embedding_list = [embedding for embedding in embedding_list if
                                 str(embedding.get('paragraph_id')) == str(paragraph.get('id'))]
        if filter_embedding_list is not None and len(filter_embedding_list) > 0:
            find_embedding = filter_embedding_list[-1]
            return find_embedding.get('comprehensive_score')
        return 0

    @staticmethod
    def list_paragraph(embedding_list: List, vector):
        paragraph_id_list = [row.get('paragraph_id') for row in embedding_list]
        if paragraph_id_list is None or len(paragraph_id_list) == 0:
            return []
        paragraph_list = native_search(QuerySet(Paragraph).filter(id__in=paragraph_id_list),
                                       get_file_content(
                                           os.path.join(PROJECT_DIR, "apps", "application", 'sql',
                                                        'list_dataset_paragraph_by_paragraph_id.sql')),
                                       with_table_name=True)
        # 如果向量库中存在脏数据 直接删除
        if len(paragraph_list) != len(paragraph_id_list):
            exist_paragraph_list = [row.get('id') for row in paragraph_list]
            for paragraph_id in paragraph_id_list:
                if not exist_paragraph_list.__contains__(paragraph_id):
                    vector.delete_by_paragraph_id(paragraph_id)
        # 如果存在直接返回的则取直接返回段落
        hit_handling_method_paragraph = [paragraph for paragraph in paragraph_list if
                                         (paragraph.get(
                                             'hit_handling_method') == 'directly_return' and BaseSearchDatasetStep.get_similarity(
                                             paragraph, embedding_list) >= paragraph.get(
                                             'directly_return_similarity'))]
        if len(hit_handling_method_paragraph) > 0:
            # 找到评分最高的
            return [sorted(hit_handling_method_paragraph,
                           key=lambda p: BaseSearchDatasetStep.get_similarity(p, embedding_list))[-1]]
        return paragraph_list

    def get_details(self, manage, **kwargs):
        step_args = self.context['step_args']

        return {
            'step_type': 'search_step',
            'paragraph_list': [row.to_dict() for row in self.context['paragraph_list']],
            'run_time': self.context['run_time'],
            'problem_text': step_args.get(
                'padding_problem_text') if 'padding_problem_text' in step_args else step_args.get('problem_text'),
            'model_name': EmbeddingModel.get_embedding_model().model_name,
            'message_tokens': 0,
            'answer_tokens': 0,
            'cost': 0
        }
