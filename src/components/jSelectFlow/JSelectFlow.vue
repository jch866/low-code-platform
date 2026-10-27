<template>
  <!-- 原 JSelectBizComponent 外壳：a-select(multiple, tags 展示 displayKey) + 选择按钮；ep 组件库无 open=false 的多选标签框，
       按参考实现 jSelectProjectByDep 模式改为 readonly ep-input + suffix × + 选择按钮 -->
  <div class="j-select-flow">
    <ep-input
      :model-value="displayText"
      readonly
      :disabled="disabled"
      :placeholder="'请选择'"
      @click="openModal"
    >
      <template #suffix>
        <span
          v-if="displayText && !disabled"
          class="clear-icon"
          title="清空"
          @click.stop="handleEmpty"
        >×</span>
      </template>
    </ep-input>
    <!-- 原 a-button type=primary icon=search，文案=LC0654 选择 -->
    <ep-button type="primary" :disabled="disabled" @click="openModal">选择</ep-button>

    <JSelectFlowModal
      ref="modalRef"
      :modal-width="modalWidth"
      :multiple="multiple"
      :return-id="returnId"
      :selected-rows="selectedRows"
      @ok="handleOK"
      @select-records="selectRecords"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JSelectFlowModal from './JSelectFlowModal.vue'

const props = defineProps({
  // v-model 值：逗号拼接的 epfFlowCode（源 returnKeys=['id','epfFlowCode']，returnId=false 时 valueKey=epfFlowCode；
  // 流程页使用 :multiple="false"，即 parentFlowId 实际存单个 epfFlowCode，与源 FlowModal v-decorator=['parentFlowId'] 一致）
  modelValue: {
    type: String,
    default: ''
  },
  // 弹窗宽度（原 a-modal width 默认 '900'）
  modalWidth: {
    type: Number,
    default: 900
  },
  // 是否支持多选（默认 true；流程页使用 :multiple="false" → 弹窗单选 radio）
  multiple: {
    type: Boolean,
    default: true
  },
  // 是否返回 id（默认 false 返回 epfFlowCode，源 returnId）
  returnId: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'selectRecords'])

// 输入框展示的已选流程名称（逗号拼接 displayKey=epfFlowName）
const displayText = ref('')
// 已选行数据（回传弹窗恢复勾选与已选表）
const selectedRows = ref([])
const modalRef = ref(null)

const openModal = () => {
  modalRef.value?.showModal()
}

/** 确认回调（原 modal handleOk → selectValue join：rows 展示名、values 拼接为 v-model，并透传 selectRecords） */
const handleOK = (rows, values) => {
  selectedRows.value = rows || []
  displayText.value = (rows || []).map((item) => item.epfFlowName).join(',')
  emit('update:modelValue', values)
  emit('change', values)
}

/** 透传 selectRecords（原 shell selectRecords 转发 modal 同名事件） */
const selectRecords = (rows) => {
  emit('selectRecords', rows)
}

/** 清空选择（suffix × 图标） */
const handleEmpty = () => {
  selectedRows.value = []
  displayText.value = ''
  emit('update:modelValue', '')
  emit('change', '')
}

// 说明（与源差异）：源弹窗 watch value → valueWatchHandler 在当前页 dataSource 中按 epfFlowCode 匹配回显已选表（跨页/跨次打开基本失效），
// 此处简化：外壳在 ok 回调持有已选行并回传弹窗恢复，外层已有 epfFlowCode 回显时输入框暂不显示流程名（同参考实现 jSelectProjectByDep）。
</script>

<style scoped>
.j-select-flow {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}
.clear-icon {
  cursor: pointer;
  font-size: 14px;
  color: #999;
  line-height: 1;
}
.clear-icon:hover {
  color: #666;
}
</style>
