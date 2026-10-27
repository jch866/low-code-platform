<template>
  <ep-tooltip
    v-model="panelIsOpen"
    trigger="click"
    :disabled="disabled"
    :teleported="teleported"
    :offset="5"
    effect="light"
    :pure="true"
    :click-out-side-to-hide="clickOutSideToHideDatePanel"
    :show-arrow="false"
    placement="bottom-start"
  >
    <div
      :class="[
        isSinglePanelBlock ? '' : inputNs.b(),
        ns.b(),
        $attrs.class,
        inputNs.is('focus', isFocus || panelIsOpen),
        inputNs.is('disabled', !isSinglePanelBlock && disabled)
      ]"
      @mouseover="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <ep-input
        v-if="isSinglePanelBlock"
        v-model="displayValue"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :validate-event="false"
        :readonly="!editable"
        :class="inputNs.is('focus', panelIsOpen)"
        @blur="onDisplayBlur"
      >
        <template #suffix>
          <span v-if="showClear" @click.stop="handleClearClick">
            <ep-icon icon="ep-i-delete" :size="16" />
          </span>
          <ep-icon v-else icon="ep-i-calendar21" :size="16" />
        </template>
      </ep-input>

      <div
        v-else
        :class="[inputNs.e('wrapper'), ns.e('wrapper')]"
        @focusin="isFocus = true"
        @focusout="isFocus = false"
      >
        <input
          ref="inputRef"
          v-model="leftDisplay"
          data-type="dateRange-left"
          :data-name="dataName"
          type="text"
          :class="[inputNs.e('inner'), ns.e('range-inner')]"
          :placeholder="startPlaceholder"
          :disabled="disabled"
          :readonly="!editable"
          @blur="onLeftBlur($event.target.value)"
        />
        <span :class="ns.e('range-separator')">{{ rangeSeparator }}</span>
        <input
          v-model="rightDisplay"
          data-type="dateRange-right"
          :data-name="dataName"
          type="text"
          :class="[inputNs.e('inner'), ns.e('range-inner')]"
          :placeholder="endPlaceholder"
          :disabled="disabled"
          :readonly="!editable"
          @blur="onRightBlur($event.target.value)"
        />
        <span :class="ns.e('range-operation')">
          <span v-if="showClear" @click.stop="handleClearClick">
            <ep-icon icon="ep-i-delete" :size="16" />
          </span>
          <ep-icon v-else icon="ep-i-calendar21" :size="16" />
        </span>
      </div>
    </div>

    <template #content>
      <div v-show="panelIsOpen && !disabled">
        <tempalte v-if="isSinglePanelBlock">
          <SingleDateTimePanelManager
            v-if="type === 'datetime'"
            :type="type"
            :model-date="actualValue"
          />
          <SinglePanelManager v-else :type="type" :model-date="actualValue" />
        </tempalte>
        <tempalte v-else>
          <RangePanelManager :type="type" />
        </tempalte>
      </div>
    </template>
  </ep-tooltip>
</template>
<script setup>
import { reactive, toRefs, provide, inject, useAttrs, ref, computed } from 'vue'
import datepickerProps from './datepickerProps'
import { formItemContextKey } from '../../form/src/formLib'
import { useDatepicker, datePickerContextKey } from './useDatepiker'
import { buildCssNamespace } from '../../util'
import SinglePanelManager from './components/singlePanelManager.vue'
import RangePanelManager from './components/RangePanelManager.vue'
import SingleDateTimePanelManager from './components/dateTime/singleDateTimePanelManager.vue'
const props = defineProps(datepickerProps)

const ns = buildCssNamespace('date-picker')
const inputNs = buildCssNamespace('input')
const inputRef = ref(null)

const emit = defineEmits([
  'visible-change',
  'change',
  'update:modelValue',
  'blur'
])

const $attrs = useAttrs()

// const attrs = computed(() => {
//   return omit($attrs, 'class')
// })

const isFocus = ref(false)

const formItemContext = inject(formItemContextKey, undefined)

const dataName = computed(() => {
  const targetEle = inputRef.value?.closest('td')
  if (targetEle) {
    return targetEle.getAttribute('tmpcolumnlabel')
  } else if (formItemContext) {
    return formItemContext.formItemLabel
  } else {
    return undefined
  }
})

const {
  panelIsOpen,
  displayValue,
  actualValue,
  lastActualValue,
  displayDateValue,
  displayTimeValue,
  leftDisplay,
  leftActual,
  rightDisplay,
  rightActual,
  displayFormat,
  valueFormat,
  isSinglePanelBlock,
  showClear,
  clickOutSideToHideDatePanel,
  timePanelIsOpen,

  onDisplayBlur,
  onLeftBlur,
  onRightBlur,
  changeYear,
  changeMonth,
  changeDate,
  isDisabledItem,
  handleMouseEnter,
  handleMouseLeave,
  handleClearClick,
  handleCancel,
  handleConfirm,
  handleCancelSelectTime,
  handleConfirmSelectTime,
  closeTimePanel,
  setSelected,
  setRangeSelected
} = useDatepicker(props, emit, formItemContext)

const dataType = 'datePicker'

provide(
  datePickerContextKey,
  reactive({
    ...toRefs(props),
    actualValue,
    lastActualValue,
    displayValue,
    displayDateValue,
    displayTimeValue,
    leftActual,
    rightActual,
    displayFormat,
    valueFormat,
    isSinglePanelBlock,
    timePanelIsOpen,

    changeYear,
    changeMonth,
    changeDate,
    handleCancel,
    handleConfirm,
    handleCancelSelectTime,
    handleConfirmSelectTime,
    closeTimePanel,
    isDisabledItem,
    setSelected,
    setRangeSelected,
    dataType
  })
)
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('DatePicker'),
  inheritAttrs: false
}
</script>
