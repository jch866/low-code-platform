<template>
  <!--
    业务模型面板（迁移自 Vue2 PayList.vue tab key=4 业务模型，i18n LC0345）：
    源按 moduleTreeData（loadModuleTree → queryProductModuleTreeList，真实 URL GET /product/module/queryModuleList）
    渲染模块卡片：卡片标题=模块 title，子链接=children（源 router-link →
    /product/channel?tableName=child.virtualTableName&title=child.title，渠道管理页不在本次迁移范围，
    点击以消息提示代替跳转）；
    无子表、无行内编辑、不参与交易保存 payload（源 submitCurrForm 仅合并 tab1 基本信息表单值）。
    mock 复用 api/lowCodePlatform/paymentBiz.js 既有 getPaymentModuleTreeList（原 queryProductModuleTreeList）。
    与源差异（加载时机）：源在页面 refresh()（loadTree 时）随交易树一并加载；此处按接线要求改为
    编辑态 tab 切换到「业务模型」时加载（active 置 true 触发，重复切换重新拉取）。
    与源差异（空态）：源无数据时渲染空 wrapper，此处补充「暂无数据」空态文案。
  -->
  <div v-if="state.moduleTreeData.length" class="channel-pannel-wrapper">
    <div
      v-for="(item, index) in state.moduleTreeData"
      :key="index"
      class="channel-pannel"
      :class="calLength(item.children) >= 24 ? 'pannel-single' : 'pannel-double'"
    >
      <div class="pannel-left">
        <!-- 与源差异：a-icon type="disconnect" → ep-icon（ep 组件库无 disconnect 图标，取近似 ep-i-vector） -->
        <ep-icon icon="ep-i-vector" size="16" color="#08c" />
      </div>
      <div class="pannel-right">
        <h3 class="pannel-title">{{ item.title }}</h3>
        <ul>
          <li v-for="(child, childKey) in item.children" :key="childKey">
            <!-- 原 a-tooltip :title=child.title → ep-tooltip；真实路由见 onLinkClick 注释 -->
            <ep-tooltip :content="child.title" trigger="hover" placement="top">
              <a href="javascript:void(0);" @click="onLinkClick(child)">{{ child.title }}</a>
            </ep-tooltip>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else class="model-empty">暂无数据</div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { EPMessageTips } from '@/utils/utils'
import { getPaymentModuleTreeList } from '@/api/lowCodePlatform/paymentBiz'

const props = defineProps({
  // 编辑态 tab 切换加载：activeTab === '4' 时置 true 触发加载（源为页面 refresh 时 loadModuleTree，见顶部与源差异注释）
  active: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  // 模块树数据（原 moduleTreeData）
  moduleTreeData: []
})

/** 卡片宽度（原 calLength 照搬）：children 为空/无 → 12（半宽 pannel-double），length>6 → 24（整行 pannel-single） */
const calLength = (object) => {
  if (object == null || object == undefined) {
    return 12
  }
  if (object.length > 6) {
    return 24
  }
  return 12
}

/** 加载模块树（原 loadModuleTree → queryProductModuleTreeList，真实 URL GET /product/module/queryModuleList） */
const loadModuleTree = async () => {
  const res = await getPaymentModuleTreeList()
  if (res.returnCode === SUCCESS_STATUS) {
    state.moduleTreeData = res.result || []
  }
}

// tab 组件懒渲染时以 active=true 挂载，onMounted 兜底加载一次（watch 不触发同值变更）
onMounted(() => {
  if (props.active) {
    loadModuleTree()
  }
})

// 编辑态 tab 切换到「业务模型」时加载（每次切回重新拉取，语义对齐源 refresh 全量刷新）
watch(
  () => props.active,
  (val) => {
    if (val) {
      loadModuleTree()
    }
  }
)

/** 子模块链接点击（原 router-link → /product/channel?tableName=virtualTableName&title=模块名，渠道管理页待迁移） */
const onLinkClick = (child) => {
  EPMessageTips(
    'info',
    `原路由跳转 /product/channel?tableName=${child.virtualTableName || ''}&title=${child.title || ''}（渠道管理页待迁移）`
  )
}
</script>

<style scoped>
/* 卡片容器：源 a-col md=24 channel-pannel-wrapper → flex 换行等价布局 */
.channel-pannel-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
  align-content: flex-start;
  align-items: flex-start;
}
.channel-pannel {
  display: flex;
  min-height: 158px;
  height: auto;
  position: relative;
  margin: 10px 15px;
  cursor: pointer;
  box-shadow: 0 0 2px rgb(0 0 0 / 20%);
  transition: all 0.15s;
  line-height: 1.2857;
  box-sizing: border-box;
}
/* 原 calLength>=24 整行 */
.pannel-single {
  width: 100%;
}
/* 原 calLength<24 半宽 */
.pannel-double {
  width: calc(50% - 30px);
}
.channel-pannel:hover {
  border: 1px solid #d9d9d9;
}
.channel-pannel ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.channel-pannel ul li {
  margin: 2px 0;
  display: inline-block;
  width: 115px;
}
.channel-pannel ul li a {
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
  color: rgb(55, 61, 65);
}
.channel-pannel ul li a:hover {
  text-decoration: underline;
}
.pannel-left {
  flex: 1;
  padding: 20px 20px 20px 20px;
}
.pannel-right {
  flex: 1;
  padding: 20px 20px 20px 0;
}
.pannel-title {
  font-size: 16px;
  margin-bottom: 10px;
}
.model-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #999;
  background: #f7f9fd;
}
</style>
