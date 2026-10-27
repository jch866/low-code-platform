<template>
  <!-- 全屏流程设计（原组件: applicationAdd.vue 包 FlowDesignerApp，a-modal width=100% 无 footer，此处以 fullscreen ep-dialog 等价实现） -->
  <ep-dialog
    v-model="state.visible"
    :title="state.title"
    top="0px"
    width="100%"
    :fullscreen="true"
    destroy-on-close
    class="application-add-dialog"
  >
    <div class="application-add-wrapper">
      <FlowDesigner
        v-if="state.visible"
        :flow-data="state.flowData"
        :flow-info="state.flowInfo"
        :common-nodes="state.commonFlows"
        :view-only="false"
        @save="onSave"
      />
    </div>
  </ep-dialog>
</template>

<script setup>
import { reactive } from 'vue'
import FlowDesigner from '@/components/flowDesigner/FlowDesigner.vue'
import { EPMessageTips } from '@/utils/utils'
import { SUCCESS_STATUS } from '@/config/config'
import {
  getApplicationFlowData,
  getBusinessNodeListFroType,
  saveFlowDesign
} from '@/api/lowCodePlatform/paymentProduct'

const emit = defineEmits(['ok', 'close'])

const state = reactive({
  visible: false,
  title: '业务节点配置',
  id: '',
  // 流程数据（原 flowDataInfo = GET /flow/manage/config/getFlowData/{id} 的 result）
  flowData: null,
  flowInfo: {},
  // 业务节点列表（原 commonFlows = GET /business/node/listFroType 的 result）
  commonFlows: []
})

/** 加载业务节点列表（原 loadData：getAction('/business/node/listFroType')） */
const loadCommonFlows = async () => {
  const res = await getBusinessNodeListFroType()
  if (res.returnCode === SUCCESS_STATUS) {
    state.commonFlows = res.result || []
  }
}

/** 获取流程数据（原 getFormData：ajaxGetFlowData(id)） */
const getFormData = async (id) => {
  const res = await getApplicationFlowData({ flowId: id })
  if (res.returnCode === SUCCESS_STATUS) {
    state.flowData = res.result || { flowInfo: {}, nodeList: [], linkList: [] }
    state.flowInfo = state.flowData.flowInfo || {}
  }
}

/** 打开（原 add(id)：加载流程数据 + 展示） */
const add = async (id) => {
  state.id = id
  state.flowData = null
  state.flowInfo = {}
  state.visible = true
  loadCommonFlows()
  getFormData(id)
}

/** 关闭（原 close：$emit('close') + visible=false） */
const close = () => {
  state.visible = false
  emit('close')
}

/** 保存（原 saveFlow：JSON.parse(flowInfo) + epfFlowId=id → POST /flow/design/config/save） */
const onSave = async (flowData) => {
  const params = { ...flowData, epfFlowId: state.id }
  const res = await saveFlowDesign(params)
  if (res.returnCode === SUCCESS_STATUS) {
    // 原 LC0630 保存成功
    EPMessageTips('success', '保存成功')
    emit('ok')
    close()
  }
}

defineExpose({ add, close })
</script>

<style scoped>
.application-add-dialog :deep(.ep-dialog__body) {
  height: calc(100vh - 110px);
  overflow: hidden;
  padding: 0;
}
.application-add-wrapper {
  width: 100%;
  height: 100%;
}
</style>
