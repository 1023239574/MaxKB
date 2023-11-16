# coding=utf-8
"""
    @project: maxkb
    @Author：虎
    @file： paragraph_serializers.py
    @date：2023/10/16 15:51
    @desc:
"""
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.views import Request

from common.auth import TokenAuth, has_permissions
from common.constants.permission_constants import Permission, Group, Operate
from common.response import result
from common.util.common import query_params_to_single_dict
from dataset.serializers.paragraph_serializers import ParagraphSerializers


class Paragraph(APIView):
    authentication_classes = [TokenAuth]

    @action(methods=['GET'], detail=False)
    @swagger_auto_schema(operation_summary="段落列表",
                         operation_id="段落列表",
                         manual_parameters=ParagraphSerializers.Query.get_request_params_api(),
                         responses=result.get_api_array_response(ParagraphSerializers.Query.get_response_body_api()),
                         tags=["数据集/文档/段落"]
                         )
    @has_permissions(
        lambda r, k: Permission(group=Group.DATASET, operate=Operate.USE,
                                dynamic_tag=k.get('dataset_id')))
    def get(self, request: Request, dataset_id: str, document_id: str):
        q = ParagraphSerializers.Query(
            data={**query_params_to_single_dict(request.query_params), 'dataset_id': dataset_id,
                  'document_id': document_id})
        q.is_valid(raise_exception=True)
        return result.success(q.list())

    @action(methods=['POST'], detail=False)
    @swagger_auto_schema(operation_summary="创建段落",
                         operation_id="创建段落",
                         manual_parameters=ParagraphSerializers.Create.get_request_params_api(),
                         request_body=ParagraphSerializers.Create.get_request_body_api(),
                         responses=result.get_api_response(ParagraphSerializers.Query.get_response_body_api()),
                         tags=["数据集/文档/段落"])
    @has_permissions(
        lambda r, k: Permission(group=Group.DATASET, operate=Operate.MANAGE,
                                dynamic_tag=k.get('dataset_id')))
    def post(self, request: Request, dataset_id: str, document_id: str):
        return result.success(
            ParagraphSerializers.Create(data={'dataset_id': dataset_id, 'document_id': document_id}).save(request.data))

    class Operate(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['UPDATE'], detail=False)
        @swagger_auto_schema(operation_summary="修改段落数据",
                             operation_id="修改段落数据",
                             manual_parameters=ParagraphSerializers.Operate.get_request_params_api(),
                             request_body=ParagraphSerializers.Operate.get_request_body_api(),
                             responses=result.get_api_response(ParagraphSerializers.Operate.get_response_body_api())
                             ,tags=["数据集/文档/段落"])
        @has_permissions(
            lambda r, k: Permission(group=Group.DATASET, operate=Operate.MANAGE,
                                    dynamic_tag=k.get('dataset_id')))
        def put(self, request: Request, dataset_id: str, document_id: str, paragraph_id: str):
            o = ParagraphSerializers.Operate(
                data={"paragraph_id": paragraph_id, 'dataset_id': dataset_id, 'document_id': document_id})
            o.is_valid(raise_exception=True)
            return result.success(o.edit(request.data))

        @action(methods=['UPDATE'], detail=False)
        @swagger_auto_schema(operation_summary="获取段落详情",
                             operation_id="获取段落详情",
                             manual_parameters=ParagraphSerializers.Operate.get_request_params_api(),
                             responses=result.get_api_response(ParagraphSerializers.Operate.get_response_body_api()),
                             tags=["数据集/文档/段落"])
        @has_permissions(
            lambda r, k: Permission(group=Group.DATASET, operate=Operate.USE,
                                    dynamic_tag=k.get('dataset_id')))
        def get(self, request: Request, dataset_id: str, document_id: str, paragraph_id: str):
            o = ParagraphSerializers.Operate(
                data={"dataset_id": dataset_id, 'document_id': document_id, "paragraph_id": paragraph_id})
            o.is_valid(raise_exception=True)
            return result.success(o.one())

        @action(methods=['DELETE'], detail=False)
        @swagger_auto_schema(operation_summary="删除段落",
                             operation_id="删除段落",
                             manual_parameters=ParagraphSerializers.Operate.get_request_params_api(),
                             responses=result.get_default_response(),
                             tags=["数据集/文档/段落"])
        @has_permissions(
            lambda r, k: Permission(group=Group.DATASET, operate=Operate.MANAGE,
                                    dynamic_tag=k.get('dataset_id')))
        def delete(self, request: Request, dataset_id: str, document_id: str, paragraph_id: str):
            o = ParagraphSerializers.Operate(
                data={"dataset_id": dataset_id, 'document_id': document_id, "paragraph_id": paragraph_id})
            o.is_valid(raise_exception=True)
            return result.success(o.delete())

    class Page(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['GET'], detail=False)
        @swagger_auto_schema(operation_summary="分页获取段落列表",
                             operation_id="分页获取段落列表",
                             manual_parameters=result.get_page_request_params(
                                 ParagraphSerializers.Query.get_request_params_api()),
                             responses=result.get_page_api_response(ParagraphSerializers.Query.get_response_body_api()),
                             tags=["数据集/文档/段落"])
        @has_permissions(
            lambda r, k: Permission(group=Group.DATASET, operate=Operate.USE,
                                    dynamic_tag=k.get('dataset_id')))
        def get(self, request: Request, dataset_id: str, document_id: str, current_page, page_size):
            d = ParagraphSerializers.Query(
                data={**query_params_to_single_dict(request.query_params), 'dataset_id': dataset_id,
                      'document_id': document_id})
            d.is_valid(raise_exception=True)
            return result.success(d.page(current_page, page_size))
