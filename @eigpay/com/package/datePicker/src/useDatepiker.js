import { ref, shallowRef, computed, watch } from 'vue'
import dayjs from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'

import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import isDate from 'lodash/isDate'
import noop from 'lodash/noop'
import isFunction from 'lodash/isFunction'
import isNil from 'lodash/isNil'

dayjs.extend(objectSupport)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export const datePickerContextKey = Symbol('datePicker')

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

// 获取各单位时间
export const getUnits = (date) => {
  return {
    year: date.year(),
    month: date.month(),
    date: date.date(),
    hour: date.hour(),
    minute: date.minute(),
    second: date.second()
  }
}

const defaultDisplayFormat = {
  year: 'YYYY',
  yearrange: 'YYYY',
  month: 'YYYY-MM',
  monthrange: 'YYYY-MM',
  date: 'YYYY-MM-DD',
  daterange: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  time: 'HH:mm:ss'
}

export const useDatepicker = (props, emit, formItemContext) => {
  const displayValue = ref(null) // for single selected
  const displayDateValue = ref(null) // for single selected
  const displayTimeValue = ref(null) // for single selected
  const actualValue = shallowRef(null) // for single selected

  const leftDisplay = ref(null) // for range selected
  const leftActual = shallowRef(null) // for range selected
  const rightDisplay = ref(null) // for range selected
  const rightActual = shallowRef(null) // for range selected

  const panelIsOpen = ref(false)
  const timePanelIsOpen = ref(false)
  const clickOutSideToHideDatePanel = ref(true)

  // 显示日期的格式
  const displayFormat = computed(() => {
    return props.format || defaultDisplayFormat[props.type]
  })
  // 显示日期时间面板中日期的格式
  const displayDateFormat = computed(() => {
    return props.dateFormat || defaultDisplayFormat.date
  })
  // 显示日期时间面板中时间的格式
  const displayTimeFormat = computed(() => {
    return props.timeFormat || defaultDisplayFormat.time
  })
  // modelValue日期的格式
  const valueFormat = computed(() => {
    return props.valueFormat || defaultDisplayFormat[props.type]
  })

  const lastActualValue = ref(parseToDayjs(props.modelValue, valueFormat.value)) // for single selected

  // 是否显示的是单面板
  const isSinglePanelBlock = computed(() => {
    return ['date', 'month', 'year', 'datetime'].includes(props.type)
  })

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
  const onLeftBlur = (value) => {
    const dayjsObj = parseToDayjs(value, displayFormat.value, true)
    if (dayjsObj?.isValid() && !isDisabledItem(dayjsObj.toDate())) {
      // 新输入的内容和原有真实值不同时
      if (!dayjsObj.isSame(leftActual.value)) {
        leftActual.value = dayjsObj
        if (rightActual.value) {
          const value = [
            dayjsFormat(leftActual.value, valueFormat.value),
            dayjsFormat(rightActual.value, valueFormat.value)
          ]
          emit('update:modelValue', value)
          emit('change', value)
        }
      }
    } else {
      leftDisplay.value = dayjsFormat(leftActual.value, displayFormat.value)
    }
    emit('blur', props.modelValue)
    if (props.validateEvent) {
      formItemContext?.validate?.('blur').catch(noop)
    }
  }
  const onRightBlur = (value) => {
    const dayjsObj = parseToDayjs(value, displayFormat.value, true)
    if (dayjsObj?.isValid() && !isDisabledItem(dayjsObj.toDate())) {
      // 新输入的内容和原有真实值不同时
      if (!dayjsObj.isSame(rightActual.value)) {
        rightActual.value = dayjsObj
        if (leftActual.value) {
          const value = [
            dayjsFormat(leftActual.value, valueFormat.value),
            dayjsFormat(rightActual.value, valueFormat.value)
          ]
          emit('update:modelValue', value)
          emit('change', value)
        }
      }
    } else {
      rightDisplay.value = dayjsFormat(rightActual.value, displayFormat.value)
    }
    emit('blur', props.modelValue)
    if (props.validateEvent) {
      formItemContext?.validate?.('blur').catch(noop)
    }
  }
  // 年改变
  const changeYear = (date) => {
    if (dayjs.isDayjs(actualValue.value)) {
      actualValue.value = actualValue.value.year(date.year())
    } else {
      actualValue.value = dayjs(date).startOf('date')
    }
    const value = dayjsFormat(actualValue.value, valueFormat.value)
    emit('update:modelValue', value)
    emit('change', value)
  }
  // 月改变
  const changeMonth = (date) => {
    if (dayjs.isDayjs(actualValue.value)) {
      actualValue.value = actualValue.value.month(date.month())
    } else {
      actualValue.value = dayjs(date).startOf('date')
    }
    const value = dayjsFormat(actualValue.value, valueFormat.value)
    emit('update:modelValue', value)
    emit('change', value)
  }
  // 日期改变
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
  // 设置选中的日期
  const setSelected = (date) => {
    changeDate(date)
    panelIsOpen.value = false
  }

  const handleCancel = () => {
    panelIsOpen.value = false
  }

  const handleConfirm = () => {
    panelIsOpen.value = false
  }

  const handleCancelSelectTime = () => {
    // 只将时间还原到上一次，不改变选择的日期
    const { hour, minute, second } = getUnits(lastActualValue.value)
    const newTemp = actualValue.value.hour(hour).minute(minute).second(second)
    changeDate(newTemp)
    timePanelIsOpen.value = false
  }

  const closeTimePanel = () => {
    timePanelIsOpen.value = false
  }

  const handleConfirmSelectTime = (value) => {
    lastActualValue.value = parseToDayjs(value, valueFormat.value)
    timePanelIsOpen.value = false
  }

  const setRangeSelected = (leftDate, rightDate) => {
    const left = dayjsFormat(leftDate, valueFormat.value)
    const right = dayjsFormat(rightDate, valueFormat.value)
    const value = [left, right]
    emit('update:modelValue', value)
    emit('change', value)
    panelIsOpen.value = false
  }

  const handleClearClick = () => {
    if (isSinglePanelBlock.value) {
      displayValue.value = ''
      actualValue.value = ''
      const value = dayjsFormat(actualValue.value, valueFormat.value)
      emit('update:modelValue', value)
      emit('change', value)
    } else {
      leftDisplay.value = ''
      rightDisplay.value = ''

      leftActual.value = null
      rightActual.value = null
      const value = []
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (isSinglePanelBlock.value) {
        actualValue.value = parseToDayjs(modelValue, valueFormat.value)
        displayValue.value = dayjsFormat(actualValue.value, displayFormat.value)
        if (props.type === 'datetime') {
          displayDateValue.value = dayjsFormat(
            actualValue.value,
            displayDateFormat.value
          )
          displayTimeValue.value = dayjsFormat(
            actualValue.value,
            displayTimeFormat.value
          )
        }
      } else {
        const [left, right] = isNil(modelValue)
          ? []
          : isArray(modelValue)
          ? modelValue
          : [modelValue]

        leftActual.value = parseToDayjs(left, valueFormat.value)
        rightActual.value = parseToDayjs(right, valueFormat.value)

        leftDisplay.value = dayjsFormat(leftActual.value, displayFormat.value)
        rightDisplay.value = dayjsFormat(rightActual.value, displayFormat.value)
      }
    },
    { immediate: true }
  )
  watch(panelIsOpen, () => {
    emit('visible-change', panelIsOpen.value)
  })

  watch(timePanelIsOpen, (newValue) => {
    // 选择时间不关闭日期选择面板
    clickOutSideToHideDatePanel.value = !newValue
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
    panelIsOpen,
    timePanelIsOpen,
    displayValue,
    displayDateValue,
    displayTimeValue,
    actualValue,
    lastActualValue,
    leftDisplay,
    leftActual,
    rightDisplay,
    rightActual,
    displayFormat,
    valueFormat,
    isSinglePanelBlock,
    showClear,
    clickOutSideToHideDatePanel,

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
  }
}
