<template>
  <ep-tooltip
    v-model="timePanelIsOpen"
    trigger="click"
    :disabled="disabled"
    :teleported="teleported"
    :offset="5"
    effect="light"
    :pure="true"
    :show-arrow="false"
    placement="bottom-start"
  >
    <div
      :class="[
        ns.b(),
        $attrs.class,
        inputNs.is('focus', isFocus || timePanelIsOpen),
        inputNs.is('disabled', disabled)
      ]"
      @mouseover="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <ep-input
        v-model="displayValue"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :validate-event="false"
        :class="inputNs.is('focus', timePanelIsOpen)"
        @blur="onDisplayBlur"
      >
        <template #suffix>
          <span v-if="showClear" @click.stop="handleClearClick">
            <ep-icon icon="ep-i-delete" :size="16" />
          </span>
        </template>
      </ep-input>
    </div>

    <template #content>
      <div v-if="timePanelIsOpen && !disabled">
        <SinglePanelManager :type="type" :model-date="actualValue" />
      </div>
    </template>
  </ep-tooltip>
</template>
<script setup>
import { reactive, toRefs, provide, inject, useAttrs, ref } from 'vue'
import timePickerProps from './timePickerProps'
import { formItemContextKey } from '../../form/src/formLib'
import { useTimePicker, timePickerContextKey } from './useTimePicker'
import { buildCssNamespace } from '../../util'
import SinglePanelManager from './components/singlePanelManager.vue'
const props = defineProps(timePickerProps)

const ns = buildCssNamespace('time-picker')
const inputNs = buildCssNamespace('input')

const emit = defineEmits([
  'visible-change',
  'change',
  'update:modelValue',
  'blur'
])

const $attrs = useAttrs()

const isFocus = ref(false)

const formItemContext = inject(formItemContextKey, undefined)

const {
  timePanelIsOpen,
  displayValue,
  actualValue,
  displayFormat,
  valueFormat,
  lastActualValue,
  showClear,

  onDisplayBlur,
  changeDate,
  isDisabledItem,
  handleMouseEnter,
  handleMouseLeave,
  handleCancel,
  handleConfirm,
  handleClearClick,
  setPanelClose,
  setSelected
} = useTimePicker(props, emit, formItemContext)

provide(
  timePickerContextKey,
  reactive({
    ...toRefs(props),
    actualValue,
    displayFormat,
    valueFormat,
    lastActualValue,

    changeDate,
    isDisabledItem,
    handleCancel,
    handleConfirm,
    setPanelClose,
    setSelected
  })
)
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('TimePicker'),
  inheritAttrs: false
}
</script>
