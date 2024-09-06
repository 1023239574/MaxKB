from rest_framework.decorators import action
from rest_framework.views import APIView
from common.auth import TokenAuth, has_permissions
from common.constants.permission_constants import Permission, Group, Operate
from rest_framework.views import Request
from law_enforcement_experience.models.law_enforcement_experience import DatasetTableMapping, FieldNameMapping, GenericModel
from common.response import result


# Create your views here.


class LawEnforcementExperience(APIView):
    authentication_classes = [TokenAuth]

    @action(methods=['GET'], detail=False)
    @has_permissions(
        lambda r, k: Permission(group=Group.DATASET, operate=Operate.USE,
                                dynamic_tag=k.get('dataset_id')))
    def get(self, request: Request, dataset_id: str, current_page, page_size):

        # 从dataset和tableName的映射表中获取应该查询哪张表
        table_name = DatasetTableMapping.objects.get(dataset=dataset_id).table_name

        if table_name is None or table_name == '':
            return result.success(result.Page(total=0, records=[], current_page=current_page, page_size=page_size))

        # 从dataset和字段名称的映射表中获取应该查询哪些字段
        fields = FieldNameMapping.objects.filter(dataset=dataset_id).values_list('field')

        # 分页查询对应的表
        page = GenericModel.dynamic_query_paginated(table_name, fields, current_page, page_size)

        return result.success(page)
