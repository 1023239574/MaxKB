<template>
  <div v-if="!isAsk" class="chat-pc-home">
    <div class="center-box">
      <div class="banner">
        <img src="../../../assets/pc/banner.png">
      </div>
      <div class="input-box">
        <el-input
          v-model="inputValue"
          placeholder="请输入您的问题"
          :rows="1"
          :maxlength="1024"
          @keydown.enter="sendChatHandle($event)"
        />
        <img :class="inputValue? '':'disable-btn'" src="../../../assets/pc/send.png"  @click="sendChatHandle">
      </div>
      <div class="intro">
        <img src="../../../assets/pc/pc-icon0.png">
        <div>快来了解下面这些信息，大家都在问~</div>
      </div>
      <div class="recommend-box">
        <div v-for="(item,index) in topQuestion" :key="index" class="recommend-item" @click="quickProblemHandle(item)">
          <div class="icons-box"></div>
          {{ item }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="chat-pc" :class="classObj" v-loading="loading">
    <div class="chat-pc__header">
      <h4 class="ml-24">{{ applicationDetail?.name }}</h4>
    </div>
    <div class="flex">
      <div class="chat-pc__left border-r">
        <div class="p-24 pb-0">
          <el-button class="add-button w-full primary" @click="newChat">
            <el-icon>
              <Plus />
            </el-icon>
            <span class="ml-4">新建对话</span>
          </el-button>
          <p class="mt-20 mb-8">历史记录</p>
        </div>
        <div class="left-height pt-0">
          <el-scrollbar>
            <div class="p-8 pt-0">
              <common-list
                :data="chatLogeData"
                class="mt-8"
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
      </div>
      <div class="chat-pc__right">
        <div class="right-header border-b mb-24 p-16-24 flex-between">
          <h4 class="ellipsis-1" style="width: 70%">
            {{ currentChatName }}
          </h4>

          <span class="flex align-center" v-if="currentRecordList.length">
            <AppIcon
              v-if="paginationConfig.total"
              iconName="app-chat-record"
              class="info mr-8"
              style="font-size: 16px"
            ></AppIcon>
            <span v-if="paginationConfig.total" class="lighter">
              {{ paginationConfig.total }} 条提问
            </span>
            <el-dropdown class="ml-8">
              <AppIcon iconName="app-export" class="cursor" title="导出聊天记录"></AppIcon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="exportMarkdown">导出 Markdown</el-dropdown-item>
                  <el-dropdown-item @click="exportHTML">导出 HTML</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </div>
        <div class="right-height chat-width">
          <!-- 对话 -->
          <AiChat
            ref="AiChatRef"
            v-model:data="applicationDetail"
            :available="applicationAvailable"
            :appId="applicationDetail?.id"
            :record="currentRecordList"
            :chatId="currentChatId"
            :mainAccount = "mainAccount"
            :quickProblem = "quickProblem"
            @refresh="refresh"
            @scroll="handleScroll"
          ></AiChat>
        </div>
      </div>
    </div>

    <div class="collapse">
      <el-button @click="isCollapse = !isCollapse">
        <el-icon> <component :is="isCollapse ? 'Fold' : 'Expand'" /></el-icon>
      </el-button>
    </div>
  </div>

</template>
<script setup lang="ts">
import { reactive, ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { saveAs } from 'file-saver'
import applicationApi from '@/api/application'
import useStore from '@/stores'

import useResize from '@/layout/hooks/useResize'
useResize()

const route = useRoute()

const {
  params: { accessToken, mainAccount }
} = route as any

const { application, user, log, common } = useStore()

const isCollapse = ref(false)

const classObj = computed(() => {
  return {
    mobile: common.isMobile(),
    hideLeft: !isCollapse.value,
    openLeft: isCollapse.value
  }
})

const newObj = {
  id: 'new',
  abstract: '新建对话'
}

const AiChatRef = ref()
const loading = ref(false)
const left_loading = ref(false)
const applicationDetail = ref<any>({})
const applicationAvailable = ref<boolean>(true)
const chatLogeData = ref<any[]>([])
const isAsk = ref(false)
const inputValue = ref('')
const topQuestion = ref<any[]>([])
const quickProblem = ref()

const paginationConfig = ref({
  current_page: 1,
  page_size: 20,
  total: 0
})

const currentRecordList = ref<any>([])
const currentChatId = ref('new') // 当前历史记录Id 默认为'new'
const currentChatName = ref('新建对话')

function handleScroll(event: any) {
  if (
    currentChatId.value !== 'new' &&
    event.scrollTop === 0 &&
    paginationConfig.value.total > currentRecordList.value.length
  ) {
    const history_height = event.dialogScrollbar.offsetHeight
    paginationConfig.value.current_page += 1
    getChatRecord().then(() => {
      event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height)
    })
  }
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
      
      if(res.data.prologue){
        let rows = res.data.prologue?.split('-')
        rows.splice(0,1)
        topQuestion.value = rows
      }
     
      getChatLog(applicationDetail.value.id)
    })
    .catch(() => {
      applicationAvailable.value = false
    })
}

function newChat() {
  if (!chatLogeData.value.some((v) => v.id === 'new')) {
    paginationConfig.value.current_page = 1
    paginationConfig.value.total = 0
    currentRecordList.value = []
    chatLogeData.value.unshift(newObj)
  } else {
    paginationConfig.value.current_page = 1
    paginationConfig.value.total = 0
    currentRecordList.value = []
  }
  currentChatId.value = 'new'
  currentChatName.value = '新建对话'
  if (common.isMobile()) {
    isCollapse.value = false
  }
}

function getChatLog(id: string, refresh?: boolean) {
  const page = {
    current_page: 1,
    page_size: 20
  }

  log.asyncGetChatLogClient(id, page, left_loading).then((res: any) => {
    chatLogeData.value = res.data.records
    if (refresh) {
      currentChatName.value = chatLogeData.value[0].abstract
    }
  })
}

function getChatRecord() {
  return log
    .asyncChatRecordLog(
      applicationDetail.value.id,
      currentChatId.value,
      paginationConfig.value,
      loading,
      false
    )
    .then((res: any) => {
      paginationConfig.value.total = res.data.total
      const list = res.data.records
      list.map((v: any) => {
        v['write_ed'] = true
        v['record_id'] = v.id
      })
      currentRecordList.value = [...list, ...currentRecordList.value].sort((a, b) =>
        a.create_time.localeCompare(b.create_time)
      )
      if (paginationConfig.value.current_page === 1) {
        nextTick(() => {
          // 将滚动条滚动到最下面
          AiChatRef.value.setScrollBottom()
        })
      }
    })
}

const clickListHandle = (item: any) => {
  if (item.id !== currentChatId.value) {
    paginationConfig.value.current_page = 1
    paginationConfig.value.total = 0
    currentRecordList.value = []
    currentChatId.value = item.id
    currentChatName.value = item.abstract
    if (currentChatId.value !== 'new') {
      getChatRecord()
    }
  }
  if (common.isMobile()) {
    isCollapse.value = false
  }
}

function refresh(id: string) {
  getChatLog(applicationDetail.value.id, true)
  currentChatId.value = id
}

function sendChatHandle(event: any) {
  if (!event.ctrlKey) {
    // 如果没有按下组合键ctrl，则会阻止默认事件
    event.preventDefault()
    quickProblem.value = inputValue.value 
    isAsk.value = true
  } else {
    // 如果同时按下ctrl+回车键，则会换行
    inputValue.value += '\n'
  }
}
function quickProblemHandle(item: any){
  quickProblem.value = item
  isAsk.value = true
}
async function exportMarkdown(): Promise<void> {
  const suggestedName: string = `${currentChatId.value}.md`
  const markdownContent: string = currentRecordList.value
    .map((record: any) => `# ${record.problem_text}\n\n${record.answer_text}\n\n`)
    .join('\n')

  const blob: Blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
  saveAs(blob, suggestedName)
}

async function exportHTML(): Promise<void> {
  const suggestedName: string = `${currentChatId.value}.html`
  const markdownContent: string = currentRecordList.value
    .map((record: any) => `# ${record.problem_text}\n\n${record.answer_text}\n\n`)
    .join('\n')
  const htmlContent: any = marked(markdownContent)

  const blob: Blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  saveAs(blob, suggestedName)
}

onMounted(() => {
  user.changeUserType(2)
  getAccessToken(accessToken)
})
</script>
<style lang="scss">
.chat-pc-home{
  height: 100%;
  width: 100%;
  background:url('../../../assets/pc/pc-bg.png');
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;

  .center-box{
    width: 51%;
    height: fit-content;
    .banner{
      img{
       width: 100%;
      }
    }

    .input-box{
      position: relative;
      margin: 25px 0 0 0;
      .el-input{
        line-height: 60px;
        height: 60px;
      }
      .el-input__inner{
        font-size: 18px;
      }

      .el-input__wrapper{
        border-radius: 39px;
        box-shadow: none;
        padding: 1px 50px 1px 20px !important;
      }

      img{
        position: absolute;
        right: 20px;
        top: 16px;
        cursor: pointer;
      }

      .disable-btn{
        pointer-events: none;  /* 禁止点击 */
        cursor: not-allowed;
        filter: grayscale(100%) opacity(40%);  /* 灰色滤镜效果 */
      }
    }

    .intro{
      margin-top: 6%;
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 16px;
      color: #19191f;
      font-family: Microsoft YaHei;
      margin-bottom: 20px;

      img{
        margin-right: 10px;
      }
    }

    .recommend-box{
      .recommend-item{
        background: #FFFFFF;
        border-radius: 6px;
        margin-bottom: 10px;
        padding: 13px 10px 13px 0px;
        display: flex;
        align-items: center;
        cursor: pointer;
        overflow: hidden;

        &:hover{
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        }

        .icons-box{
          height: 54px;
          width: 54px;
          margin-bottom: -28px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 18px;
          color: #0B0B0C;
        }
      }

      
      .recommend-item:nth-child(4n + 1) {
        .icons-box {
          background: url('../../../assets/pc/pc-iocn1.png');
        }
      }

      .recommend-item:nth-child(4n + 2) {
        .icons-box {
          background: url('../../../assets/pc/pc-iocn2.png');
        }
      }

      .recommend-item:nth-child(4n + 3) {
        .icons-box {
          background: url('../../../assets/pc/pc-iocn3.png');
        }
      }

      .recommend-item:nth-child(4n + 4) {
        .icons-box {
          background: url('../../../assets/pc/pc-iocn4.png');
        }
      }
    }
  }
}
.chat-pc {
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

  &__left {
    padding-top: calc(var(--app-header-height) - 8px);
    background: #ffffff;
    width: 280px;

    .add-button {
      border: 1px solid var(--el-color-primary);
    }

    .left-height {
      height: calc(100vh - var(--app-header-height) - 135px);
    }
  }

  &__right {
    width: calc(100% - 280px);
    padding-top: calc(var(--app-header-height));
    overflow: hidden;
    position: relative;
    box-sizing: border-box;

    .right-header {
      background: #ffffff;
      box-sizing: border-box;
    }

    .right-height {
      height: calc(100vh - var(--app-header-height) * 2 - 24px);
    }
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
    max-width: var(--app-chat-width, 860px);
    margin: 0 auto;
  }
  .collapse {
    display: none;
  }
}
// 适配移动端
.mobile {
  .chat-pc {
    &__right {
      width: 100%;
    }
    &__left {
      display: none;
      width: 0;
    }
  }
  .collapse {
    display: block;
    position: fixed;
    bottom: 90px;
    z-index: 99;
  }
  &.openLeft {
    .chat-pc {
      &__left {
        display: block;
        position: fixed;
        width: 100%;
        z-index: 99;
        height: calc(100vh - var(--app-header-height) + 6px);
      }
    }
    .collapse {
      display: block;
      position: absolute;
      bottom: 90px;
      right: 0;
      z-index: 99;
    }
  }
}
</style>
