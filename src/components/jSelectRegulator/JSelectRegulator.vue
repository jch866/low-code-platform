<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/components/jeecgbiz/JSelectRegulator.vue（JSelectBizComponent 规则选择器外壳）
       与已迁移的 jSelectRegulatorInfo（规则处理器选择器，返回 className）是两个不同组件：
       本组件 listUrl=/configuation/regulatorrule/config/listPage，returnKeys=[id,regulatorId]，v-model 默认返回 regulatorId -->
  <!-- 原 JSelectBizComponent 外壳：a-select(multiple, tags 展示 displayKey=regulatorName) + 选择按钮；
       ep 组件库无 open=false 的多选标签框，按参考实现 jSelectRegulatorInfo 模式改为 readonly ep-input + suffix × + 选择按钮 -->
  <div class="j-select-regulator">
    <ep-input
      :model-value="displayText"
      readonly
      :disabled="disabled"
      :placeholder="placeholder"
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

    <JSelectRegulatorModal
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
import { ref, watch } from 'vue'
import JSelectRegulatorModal from './JSelectRegulatorModal.vue'
import { SUCCESS_STATUS } from '@/config/config'
import { getRegulatorRuleList } from '@/api/lowCodePlatform/regulatorRule'

const props = defineProps({
  // v-model 值：逗号拼接的 regulatorId（源 returnKeys=['id','regulatorId']，returnId=false 时 valueKey=regulatorId；
  // 注意消费方字段名 regulatorName/validatorRegulator 等仅是后端存储字段，实际存的是 regulatorId，语义照搬源）
  modelValue: {
    type: String,
    default: ''
  },
  // 弹窗宽度（原 a-modal width 默认 '900'）
  modalWidth: {
    type: Number,
    default: 900
  },
  // 是否支持多选（默认 true；规则页均使用 :multiple="false" → 弹窗单选 radio）
  multiple: {
    type: Boolean,
    default: true
  },
  // 是否返回 id（默认 false 返回 regulatorId，源 returnId）
  returnId: {
    type: Boolean,
    default: false
  },
  // 输入框占位文案（源 actualPlaceholder = placeholder || common.select）
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'selectRecords'])

// 输入框展示的已选规则名称（displayKey=regulatorName，逗号拼接）
const displayText = ref('')
// 已选行数据（回传弹窗恢复勾选与已选表）
const selectedRows = ref([])
// 最近一次本组件对外发出的值（回显 watch 与外部写入的判重依据）
let lastEmitted = ''
const modalRef = ref(null)

const openModal = () => {
  if (props.disabled) return
  modalRef.value?.showModal()
}

/**
 * 回显（与源差异）：源外壳把已选展示为当前页 dataSource 匹配的 tags（跨页/回显基本失效），
 * 此处按 valueKey（默认 regulatorId）反查 listPage 解析已选行并展示 regulatorName；
 * 反查无结果时退化为直接展示原值（regulatorId），保证已有数据不丢展示。
 */
const echoSelected = async () => {
  const val = props.modelValue
  if (!val) {
    selectedRows.value = []
    displayText.value = ''
    return
  }
  if (val === lastEmitted) return
  const res = await getRegulatorRuleList({ [props.returnId ? 'id' : 'regulatorId']: val, pageNo: 1, pageSize: 10 })
  const rows = (res.returnCode === SUCCESS_STATUS ? res.result : []) || []
  const ids = val.split(',')
  const matched = ids.map((id) => rows.find((r) => String(r[props.returnId ? 'id' : 'regulatorId']) === id)).filter(Boolean)
  if (matched.length) {
    selectedRows.value = matched
    displayText.value = matched.map((item) => item.regulatorName).join(',')
  } else {
    selectedRows.value = []
    displayText.value = val
  }
}

watch(() => props.modelValue, echoSelected, { immediate: true })

/** 确认回调（原 modal handleOk → selectValue join：rows 展示名、values 拼接为 v-model，并透传 selectRecords） */
const handleOK = (rows, values) => {
  selectedRows.value = rows || []
  displayText.value = (rows || []).map((item) => item.regulatorName).join(',')
  lastEmitted = values
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
  lastEmitted = ''
  emit('update:modelValue', '')
  emit('change', '')
}
</script>

<style scoped>
.j-select-regulator {
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
