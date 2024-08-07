<template>
  <div class="chat-embed" v-loading="loading" @click="closePopover($event)">
    <div class="chat-embed__header">
      <div class="chat-width">
        <h4 class="ml-24">{{ applicationDetail?.name }}</h4>
      </div>
    </div>
    <div class="chat-embed__main chat-width">
      <AiChat
        ref="AiChatRef"
        v-model:data="applicationDetail"
        :available="applicationAvailable"
        :appId="applicationDetail?.id"
        :record="currentRecordList"
        :chatId="currentChatId"
        :mainAccount = "mainAccount"
        @refresh="refresh"
        @scroll="handleScroll"
        class="AiChat-embed"
      >
      </AiChat>
    </div>

    <el-button type="primary" link class="new-chat-button" @click="newChat" title="新建对话">
      <!-- <el-icon><Plus /></el-icon><span class="ml-4">新建对话</span> -->
       <img src="../../../assets/new.png" style="width: 26px;">
    </el-button>
    <!-- 历史记录弹出层 -->
    <div @click.prevent.stop="show = !show" class="chat-popover-button cursor color-secondary">
      <AppIcon iconName="app-history-outlined"></AppIcon>
    </div>

    <el-collapse-transition>
      <div v-show="show" class="chat-popover w-full" id="chat-popover">
        <div class="border-b p-16-24">
          <span>历史记录</span>
        </div>

        <el-scrollbar max-height="300">
          <div class="p-8">
            <common-list
              :data="chatLogeData"
              v-loading="left_loading"
              :defaultActive="currentChatId"
              @click="clickListHandle"
            >
              <template #default="{ row }">
                <auto-tooltip :content="row.abstract">
                  {{ row.abstract }}
                </auto-tooltip>
              </template>
              <template #empty>
                <div class="text-center">
                  <el-text type="info">暂无历史记录</el-text>
                </div>
              </template>
            </common-list>
          </div>
          <div v-if="chatLogeData.length" class="gradient-divider lighter mt-8">
            <span>仅显示最近 20 条对话</span>
          </div>
        </el-scrollbar>
      </div>
    </el-collapse-transition>
    <div class="chat-popover-mask" v-show="show"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import applicationApi from '@/api/application'
import useStore from '@/stores'
const route = useRoute()
const {
  params: { accessToken, mainAccount }
} = route as any

const { application, user, log } = useStore()

const AiChatRef = ref()
const loading = ref(false)
const left_loading = ref(false)
const applicationDetail = ref<any>({})
const applicationAvailable = ref<boolean>(true)
const chatLogeData = ref<any[]>([])
const show = ref(false)

const paginationConfig = reactive({
  current_page: 1,
  page_size: 20,
  total: 0
})

const currentRecordList = ref<any>([])
const currentChatId = ref('new') // 当前历史记录Id 默认为'new'

function handleScroll(event: any) {
  if (
    currentChatId.value !== 'new' &&
    event.scrollTop === 0 &&
    paginationConfig.total > currentRecordList.value.length
  ) {
    const history_height = event.dialogScrollbar.offsetHeight
    paginationConfig.current_page += 1
    getChatRecord().then(() => {
      event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height)
    })
  }
}

function closePopover(event: any) {
  const popover = document.getElementById('chat-popover')
  if (popover) {
    if (!popover.contains(event.target)) {
      show.value = false
    }
  }
}

function newChat() {
  paginationConfig.current_page = 1
  currentRecordList.value = []
  currentChatId.value = 'new'
}

function getAccessToken(token: string) {
  application
    .asyncAppAuthentication(token, loading)
    .then(() => {
      getProfile()
    })
    .catch(() => {
      applicationAvailable.value = false
    })
}
function getProfile() {
  applicationApi
    .getProfile(loading)
    .then((res) => {
      applicationDetail.value = res.data
      getChatLog(applicationDetail.value.id)
    })
    .catch(() => {
      applicationAvailable.value = false
    })
}

function getChatLog(id: string) {
  const page = {
    current_page: 1,
    page_size: 20
  }

  log.asyncGetChatLogClient(id, page, left_loading).then((res: any) => {
    chatLogeData.value = res.data.records
  })
}

function getChatRecord() {
  return log
    .asyncChatRecordLog(
      applicationDetail.value.id,
      currentChatId.value,
      paginationConfig,
      loading,
      false
    )
    .then((res: any) => {
      paginationConfig.total = res.data.total
      const list = res.data.records
      list.map((v: any) => {
        v['write_ed'] = true
        v['record_id'] = v.id
      })
      currentRecordList.value = [...list, ...currentRecordList.value].sort((a, b) =>
        a.create_time.localeCompare(b.create_time)
      )
      if (paginationConfig.current_page === 1) {
        nextTick(() => {
          // 将滚动条滚动到最下面
          AiChatRef.value.setScrollBottom()
        })
      }
    })
}

const clickListHandle = (item: any) => {
  if (item.id !== currentChatId.value) {
    paginationConfig.current_page = 1
    currentRecordList.value = []
    currentChatId.value = item.id
    if (currentChatId.value !== 'new') {
      getChatRecord()
    }
    show.value = false
  }
}

function refresh(id: string) {
  getChatLog(applicationDetail.value.id)
  currentChatId.value = id
}

onMounted(() => {
  user.changeUserType(2)
  getAccessToken(accessToken)
})
</script>
<style lang="scss">
.chat-embed {
  background-color: var(--app-layout-bg-color);
  overflow: hidden;
  &__header {
    background: var(--app-header-bg-color);
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    height: var(--app-header-height);
    line-height: var(--app-header-height);
    box-sizing: border-box;
    border-bottom: 1px solid var(--el-border-color);
  }
  &__main {
    padding-top: calc(var(--app-header-height) + 24px);
    height: calc(100vh - var(--app-header-height) - 24px);
    overflow: hidden;
  }
  .new-chat-button {
    position: absolute;
    bottom: 60px;
    right: 18px;
    z-index: 11;
  }
  // 历史对话弹出层
  .chat-popover {
    position: absolute;
    top: var(--app-header-height);
    background: #ffffff;
    padding-bottom: 24px;
    z-index: 2009;
  }
  .chat-popover-button {
    z-index: 2009;
    position: absolute;
    top: 16px;
    right: 85px;
    font-size: 22px;
  }
  .chat-popover-mask {
    background-color: var(--el-overlay-color-lighter);
    bottom: 0;
    height: 100%;
    left: 0;
    overflow: auto;
    position: fixed;
    right: 0;
    top: var(--app-header-height);
    z-index: 2008;
  }
  .gradient-divider {
    position: relative;
    text-align: center;
    color: var(--el-color-info);
    ::before {
      content: '';
      width: 17%;
      height: 1px;
      background: linear-gradient(90deg, rgba(222, 224, 227, 0) 0%, #dee0e3 100%);
      position: absolute;
      left: 16px;
      top: 50%;
    }
    ::after {
      content: '';
      width: 17%;
      height: 1px;
      background: linear-gradient(90deg, #dee0e3 0%, rgba(222, 224, 227, 0) 100%);
      position: absolute;
      right: 16px;
      top: 50%;
    }
  }
  .chat-width {
    max-width: var(--app-chat-width, 957px);
    margin: 0 auto;
  }
  .AiChat-embed {
    .ai-chat__operate {
     padding-top: 15px;
     padding-bottom: 40px;
     padding-right: 63px;
    }
    .ai-chat__content {
      padding-bottom: 120px
    }
  }
}
</style>
