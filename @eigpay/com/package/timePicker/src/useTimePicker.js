import { ref, shallowRef, computed, watch } from 'vue'
import dayjs from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'

import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import isDate from 'lodash/isDate'
import noop from 'lodash/noop'
import isFunction from 'lodash/isFunction'

dayjs.extend(objectSupport)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export const timePickerContextKey = Symbol('timePicker')

// 解析为dayjs类型对象
export const parseToDayjs = (value, format, strict = false) => {
  if (isString(value)) {
    return dayjs(value, format, strict).isValid()
      ? dayjs(value, format, strict)
      : undefined
  }
  if (isDate(value)) {
    return dayjs(value)
  }
  if (dayjs.isDayjs(value)) {
    return value
  }
  return undefined
}
// dayjs类型对象格式为指定格式字符串
export const dayjsFormat = (dayjsObj, format) => {
  if (!dayjsObj) {
    return ''
  }
  return dayjs(dayjsObj).format(format)
}

export const useTimePicker = (props, emit, formItemContext) => {
  const displayValue = ref(null) // for single selected
  const actualValue = shallowRef(null) // for single selected

  const timePanelIsOpen = ref(false)

  // 显示日期的格式
  const displayFormat = computed(() => {
    return props.format || 'HH:mm:ss'
  })
  // modelValue日期的格式
  const valueFormat = computed(() => {
    return props.valueFormat || 'HH:mm:ss'
  })

  const lastActualValue = ref(parseToDayjs(props.modelValue, valueFormat.value)) // for single selected

  const hovering = ref(false)

  const handleMouseEnter = () => {
    hovering.value = true
  }
  const handleMouseLeave = () => {
    hovering.value = false
  }

  const showClear = computed(() => {
    return (
      props.clearable &&
      hovering.value &&
      !isEmpty(props.modelValue) &&
      !props.disabled
    )
  })

  // 日期输入框失焦处理
  const onDisplayBlur = (value) => {
    const dayjsObj = parseToDayjs(value, displayFormat.value, true)
    if (dayjsObj?.isValid() && !isDisabledItem(dayjsObj.toDate())) {
      // 新输入的内容和原有真实值不同时
      if (!dayjsObj.isSame(actualValue.value)) {
        actualValue.value = dayjsObj
        const value = dayjsFormat(actualValue.value, valueFormat.value)
        emit('update:modelValue', value)
        emit('change', value)
      }
    } else {
      displayValue.value = dayjsFormat(actualValue.value, displayFormat.value)
    }
    emit('blur', props.modelValue)
    if (props.validateEvent) {
      formItemContext?.validate?.('blur').catch(noop)
    }
  }
  // 时间改变
  const changeDate = (date) => {
    const dayjsObj = dayjs(date)
    if (!dayjsObj.isSame(actualValue.value)) {
      actualValue.value = dayjsObj
      const value = dayjsFormat(actualValue.value, valueFormat.value)
      emit('update:modelValue', value)
      emit('change', value)
    }
  }
  // 是否被禁用的日期
  const isDisabledItem = (date) => {
    if (isFunction(props.disabledDate)) {
      return !!props.disabledDate(date)
    }
    return false
  }
  // 关闭时间选择面板
  const setPanelClose = () => {
    timePanelIsOpen.value = false
  }

  // 设置选中的时间
  const setSelected = (date) => {
    changeDate(date)
    timePanelIsOpen.value = false
  }

  const handleCancel = () => {
    setSelected(lastActualValue.value)
  }

  const handleConfirm = (value) => {
    lastActualValue.value = parseToDayjs(value, valueFormat.value)
    setSelected(value)
  }

  const handleClearClick = () => {
    displayValue.value = ''
    actualValue.value = ''
    const value = dayjsFormat(actualValue.value, valueFormat.value)
    emit('update:modelValue', value)
    emit('change', value)
    timePanelIsOpen.value = false
  }

  watch(
    () => props.modelValue,
    (modelValue) => {
      actualValue.value = parseToDayjs(modelValue, valueFormat.value)
      displayValue.value = dayjsFormat(actualValue.value, displayFormat.value)
    },
    { immediate: true }
  )
  watch(timePanelIsOpen, () => {
    emit('visible-change', timePanelIsOpen.value)
  })

  watch(
    () => props.modelValue,
    () => {
      if (props.validateEvent) {
        const validate = formItemContext?.validate
        validate && validate('change').catch(noop)
      }
    }
  )

  return {
    timePanelIsOpen,
    displayValue,
    actualValue,
    displayFormat,
    valueFormat,
    showClear,
    lastActualValue,

    onDisplayBlur,
    changeDate,
    isDisabledItem,
    handleMouseEnter,
    handleMouseLeave,
    handleClearClick,
    handleCancel,
    handleConfirm,
    setPanelClose,
    setSelected
  }
}
