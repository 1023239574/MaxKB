<template>
  <div class="dataset-list-page">
    <div class="left-menu">
      <div class="doc-type-item" v-for="i in docType" :key="i.doc_type" :class="{ selected: i.doc_type === currentdocType }" @click="changeDocType(i.doc_type)">{{ i.doc_type_name }}</div>
    </div>
    <div class="dataset-list-container p-24" style="padding-top: 16px">
      <div class="flex-between mb-16">
        <h3>知识库</h3>
        <el-input
          v-model="searchValue"
          @change="searchHandle"
          placeholder="按名称搜索"
          prefix-icon="Search"
          class="w-240"
          clearable
        />
      </div>
      <div v-loading.fullscreen.lock="paginationConfig.current_page === 1 && loading">
        <InfiniteScroll
          :size="datasetList.length"
          :total="paginationConfig.total"
          :page_size="paginationConfig.page_size"
          v-model:current_page="paginationConfig.current_page"
          @load="getList"
          :loading="loading"
        >
          <el-row :gutter="15">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb-16" v-if="currentdocType!='2'">
              <CardAdd title="创建知识库" @click="router.push({ path: '/dataset/create',query: { doc_type: currentdocType} })" />
            </el-col>
            <template v-for="(item, index) in datasetList" :key="index">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb-16">
                <CardBox
                  :title="item.name"
                  :description="item.desc"
                  class="cursor"
                  @click="router.push({ path: `/dataset/${item.id}/document` ,query:{doc_type: currentdocType}})"
                >
                  <template #icon>
                    <AppAvatar
                      v-if="item.type === '1'"
                      class="mr-8 avatar-purple"
                      shape="square"
                      :size="32"
                    >
                      <img src="@/assets/icon_web.svg" style="width: 58%" alt="" />
                    </AppAvatar>
                    <AppAvatar v-else class="mr-8" shape="square" :size="32">
                      <img src="@/assets/icon_document.svg" style="width: 58%" alt="" />
                    </AppAvatar>
                  </template>
                  <div class="delete-button">
                    <el-tag v-if="item.type === '0'">通用型</el-tag>
                    <el-tag class="purple-tag" v-else-if="item.type === '1'" type="warning"
                      >Web 站点</el-tag
                    >
                  </div>

                  <template #footer>
                    <div class="footer-content flex-between">
                      <div>
                        <span class="bold">{{ item?.document_count || 0 }}</span>
                        文档
                        <span v-if="currentdocType!='2'"><el-divider direction="vertical" /><span class="bold">{{ numberFormat(item?.char_length) || 0 }}</span>
                        字符</span>
                        <span v-if="currentdocType!='2'"><el-divider direction="vertical" /><span class="bold">{{ item?.application_mapping_count || 0 }}</span>
                        关联应用</span>
                      </div>
                      <div @click.stop>
                        <el-dropdown trigger="click">
                          <el-button text @click.stop>
                            <el-icon><MoreFilled /></el-icon>
                          </el-button>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item
                                icon="Refresh"
                                @click.stop="syncDataset(item)"
                                v-if="item.type === '1'"
                                >同步</el-dropdown-item
                              >
                              <el-dropdown-item @click="reEmbeddingDataset(item)" v-if="currentdocType!='2'">
                                <AppIcon
                                  iconName="app-document-refresh"
                                  style="font-size: 16px"
                                ></AppIcon>
                                重新向量化</el-dropdown-item
                              >
                              <el-dropdown-item
                                icon="Setting"
                                 v-if="currentdocType!='2'"
                                @click.stop="router.push({ path: `/dataset/${item.id}/setting` })"
                              >
                                设置</el-dropdown-item
                              >
                              <el-dropdown-item @click.stop="export_dataset(item)" v-if="currentdocType!='2'">
                                <AppIcon iconName="app-export"></AppIcon>导出</el-dropdown-item
                              >
                              <el-dropdown-item icon="Delete" @click.stop="deleteDataset(item)"
                                >删除</el-dropdown-item
                              >
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div>
                    </div>
                  </template>
                </CardBox>
              </el-col>
            </template>
          </el-row>
        </InfiniteScroll>
      </div>
      <SyncWebDialog ref="SyncWebDialogRef" @refresh="refresh" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import SyncWebDialog from '@/views/dataset/component/SyncWebDialog.vue'
import datasetApi from '@/api/dataset'
import { MsgSuccess, MsgConfirm } from '@/utils/message'
import { useRouter } from 'vue-router'
import { numberFormat } from '@/utils/utils'
const router = useRouter()

const SyncWebDialogRef = ref()
const loading = ref(false)
const datasetList = ref<any[]>([])
const paginationConfig = reactive({
  current_page: 1,
  page_size: 20,
  total: 0
})

const docType = ref<any[]>([])

const searchValue = ref('')

let currentdocType = ref('')

function refresh() {
  MsgSuccess('同步任务发送成功')
}

function reEmbeddingDataset(row: any) {
  datasetApi.putReEmbeddingDataset(row.id).then(() => {
    MsgSuccess('提交成功')
  })
}

function syncDataset(row: any) {
  SyncWebDialogRef.value.open(row.id)
}

function searchHandle() {
  paginationConfig.current_page = 1
  datasetList.value = []
  getList()
}
const export_dataset = (item: any) => {
  datasetApi.exportDataset(item.name, item.id, loading).then((ok) => {
    MsgSuccess('导出成功')
  })
}

function deleteDataset(row: any) {
  MsgConfirm(
    `是否删除知识库：${row.name} ?`,
    `此知识库关联 ${row.application_mapping_count} 个应用，删除后无法恢复，请谨慎操作。`,
    {
      confirmButtonText: '删除',
      confirmButtonClass: 'danger'
    }
  )
    .then(() => {
      datasetApi.delDataset(row.id, loading).then(() => {
        const index = datasetList.value.findIndex((v) => v.id === row.id)
        datasetList.value.splice(index, 1)
        MsgSuccess('删除成功')
      })
    })
    .catch(() => {})
}

function getList(isRefresh?:boolean) {
  datasetApi
    .getDataset(paginationConfig, {... searchValue.value && { name: searchValue.value },doc_type:currentdocType.value}, loading)
    .then((res) => {
      paginationConfig.total = res.data.total
      datasetList.value =isRefresh?res.data.records: [...datasetList.value, ...res.data.records]
    })
}

function getDocumentType(){
  docType.value = []
  datasetApi
    .getDoctype(loading)
    .then((res) => {
      docType.value = res.data||[]
      currentdocType.value = res.data[0].doc_type
      getList()
    })
}
function changeDocType(val:any){
  currentdocType.value = val
  paginationConfig.current_page = 1
  getList(true)
}

onMounted( () => {
  getDocumentType()
})
</script>
<style lang="scss" scoped>
.dataset-list-page{
  display: flex;
  height: 100%;
  .left-menu{
    width: 200px;
    height: 100%;
    background: #1E2B3C;
    padding: 0 10px;

    .doc-type-item{
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
      margin: 5px 0;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;
      background: transparent;
      &.selected{
        background: #3C73E1;
      }
      &:hover{
        background: #3C73E1;
      }
    }
  }
}
.dataset-list-container {
  flex: 1;
  .delete-button {
    position: absolute;
    right: 12px;
    top: 18px;
    height: auto;
  }
  .footer-content {
    .bold {
      color: var(--app-text-color);
    }
  }
  :deep(.el-divider__text) {
    background: var(--app-layout-bg-color);
  }
}
</style>
