from django.db import models
from common.mixins.app_model_mixin import AppModelMixin
from dataset.models import DataSet
import uuid
from django.db import connection as conn
from django.core.paginator import Paginator
from common.response.result import Page
from django.forms.models import model_to_dict


class VectorField(models.Field):

    def db_type(self, connection):
        return 'vector'


class HistoryCase(AppModelMixin):
    id = models.CharField(max_length=128, primary_key=True, verbose_name="主键id", default=uuid.uuid1)
    dataset = models.ForeignKey(DataSet, on_delete=models.DO_NOTHING, db_constraint=False, null=True)
    crime = models.CharField(max_length=1024, verbose_name="违法行为")
    crime_vector = VectorField(verbose_name="违法行为(向量)")
    regulation = models.CharField(max_length=512, verbose_name="涉嫌违反法律条文", null=True)
    decision = models.CharField(max_length=512, verbose_name="作出决定依据", null=True)
    decision_basis = models.CharField(max_length=512, verbose_name="建议行政决定", null=True)

    class Meta:
        db_table = "law_history_case"


class StandardCase(AppModelMixin):
    id = models.CharField(max_length=128, primary_key=True, verbose_name="主键id", default=uuid.uuid1)
    dataset = models.ForeignKey(DataSet, on_delete=models.DO_NOTHING, db_constraint=False, null=True)
    hazard_category = models.CharField(max_length=128, verbose_name="隐患项分类名称")
    illegal_content = models.CharField(max_length=1024, verbose_name="违法违规内容")
    illegal_content_vector = VectorField(verbose_name="违法违规内容(向量)")
    recognition_basis = models.CharField(max_length=512, verbose_name="认定依据", null=True)
    site_basis = models.CharField(max_length=512, verbose_name="现场处理决定", null=True)
    administrative_penalty_description = models.CharField(max_length=512, verbose_name="行政处罚决定描述", null=True)
    administrative_penalty_basis = models.CharField(max_length=512, verbose_name="行政处罚依据", null=True)

    class Meta:
        db_table = "law_standard_case"


class FieldNameMapping(AppModelMixin):
    id = models.CharField(max_length=128, primary_key=True, verbose_name="主键id", default=uuid.uuid1)
    dataset = models.ForeignKey(DataSet, on_delete=models.DO_NOTHING, db_constraint=False, null=True)
    field = models.CharField(max_length=128, verbose_name="字段")
    name = models.CharField(max_length=128, verbose_name="字段的中文名")

    class Meta:
        db_table = "dataset_field_name_mapping"


class DatasetTableMapping(AppModelMixin):
    id = models.CharField(max_length=128, primary_key=True, verbose_name="主键id", default=uuid.uuid1)
    dataset = models.ForeignKey(DataSet, on_delete=models.DO_NOTHING, db_constraint=False, null=True)
    table_name = models.CharField(max_length=128, verbose_name="表名")

    class Meta:
        db_table = "dataset_table_mapping"


class GenericModel(models.Model):
    class Meta:
        managed = False

    @staticmethod
    def dynamic_query_paginated(table_name, fields, page_number, items_per_page):
        # 获取总记录数
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            total_items = cursor.fetchone()[0]

        # 计算偏移量
        offset = (page_number - 1) * items_per_page

        query_field = "*"
        if fields is not None:
            if type(fields) == 'str':
                query_field = fields
            elif type(fields) == 'list':
                query_field = ','.join(fields)

        # 执行分页查询
        query = f'SELECT {query_field} FROM {table_name} LIMIT {items_per_page} OFFSET {offset}'
        results = GenericModel.objects.raw(query)

        class ResultIterator:
            def __init__(self, results, total):
                self.results = list(results)  # 转换为列表
                self.total = total

            def __len__(self):
                return self.total

            def __iter__(self):
                return iter(self.results)

            def __getitem__(self, index):
                return self.results[index]

        result_iterator = ResultIterator(results, total_items)

        # 创建Paginator对象
        paginator = Paginator(result_iterator, items_per_page)
        page = paginator.get_page(page_number)

        return Page(total=page.paginator.count, records=[model_to_dict(record) for record in list(page.object_list)],
                    current_page=page.number, page_size=page.paginator.num_pages)