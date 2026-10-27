<template>
  <div :class="[ns.b(), ns.is('range', true)]">
    <div :class="[ns.e('content'), ns.is('left', true)]">
      <panel-header
        :date="leftInnerDate"
        :view-type="innerViewType"
        :peer-date="rightInnerDate"
        place="left"
        @date-change="handleLeftHeaderDateChange"
      />
      <year-panel
        v-if="innerViewType === 'year'"
        :date="leftInnerDate"
        :range-date="rangeDate"
        @hover-item="handleHover"
        @pick="picker"
      />
      <month-panel
        v-if="innerViewType === 'month'"
        :date="leftInnerDate"
        :range-date="rangeDate"
        @hover-item="handleHover"
        @pick="picker"
      />
      <date-panel
        v-if="innerViewType === 'date'"
        :date="leftInnerDate"
        :range-date="rangeDate"
        @pick="picker"
        @hover-item="handleHover"
      />
    </div>
    <div :class="[ns.e('content'), ns.is('right', true)]">
      <panel-header
        :date="rightInnerDate"
        :view-type="innerViewType"
        :peer-date="leftInnerDate"
        place="right"
        @date-change="handleRightHeaderDateChange"
      />
      <year-panel
        v-if="innerViewType === 'year'"
        :date="rightInnerDate"
        :range-date="rangeDate"
        @pick="picker"
        @hover-item="handleHover"
      />
      <month-panel
        v-if="innerViewType === 'month'"
        :date="rightInnerDate"
        :range-date="rangeDate"
        @pick="picker"
        @hover-item="handleHover"
      />
      <date-panel
        v-if="innerViewType === 'date'"
        :date="rightInnerDate"
        :range-date="rangeDate"
        @pick="picker"
        @hover-item="handleHover"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, shallowRef, inject, onBeforeMount, watch } from 'vue'
import { datePickerContextKey, parseToDayjs } from '../useDatepiker'
import PanelHeader from './panelHeader.vue'
import { buildCssNamespace } from '../../../util'
import DatePanel from './datePanel.vue'
import MonthPanel from './monthPanel.vue'
import YearPanel from './yearPanel.vue'
import isArray from 'lodash/isArray'
import compact from 'lodash/compact'

import dayjs from 'dayjs'

const props = defineProps({
  type: {
    type: String,
    default: undefined
  }
})
const ns = buildCssNamespace('date-picker-panel')
// const emit = defineEmits(['pickYear', 'pickMonth', 'pickDate', 'pickWeek'])
// 当前显示面板类型
const innerViewType = computed(() => {
  return props.type.replace(/range/gi, '').toLocaleLowerCase()
})
const datePicker = inject(datePickerContextKey)
// 管理器内部日期
const leftInnerDate = shallowRef(dayjs().startOf(innerViewType.value))
const rightInnerDate = shallowRef(dayjs().startOf(innerViewType.value))

const selectedDate = shallowRef(null)
const hoveredDate = shallowRef(null)

const rangeDate = shallowRef([])

const handleLeftHeaderDateChange = (date) => {
  leftInnerDate.value = dayjs(date)
  if (!datePicker.unlinkPanels) {
    rightInnerDate.value = transferDate(date, innerViewType.value, 1)
  }
}
const handleRightHeaderDateChange = (date) => {
  rightInnerDate.value = dayjs(date)
  if (!datePicker.unlinkPanels) {
    leftInnerDate.value = transferDate(date, innerViewType.value, -1)
  }
}

const picker = (date) => {
  if (selectedDate.value === null) {
    selectedDate.value = date
    rangeDate.value = rangeSort([selectedDate.value, hoveredDate.value])
  } else {
    const range = rangeSort([selectedDate.value, date])
    rangeDate.value = [...range]
    selectedDate.value = null
    hoveredDate.value = null
    datePicker.setRangeSelected(range[0], range[1])
  }
}
const handleHover = (date) => {
  hoveredDate.value = date
  if (selectedDate.value === null) return
  rangeDate.value = rangeSort([selectedDate.value, date])
}

const rangeSort = (range = []) => {
  return range.sort((a, b) => (a.isBefore(b) ? -1 : 0))
}

const transferDate = (date, unit, quantity) => {
  const transferMap = {
    date: 'month',
    month: 'year',
    year: 'year'
  }
  quantity = unit === 'year' ? quantity * 10 : quantity
  unit = transferMap[unit]

  return date.add(quantity, unit).startOf(unit)
}

watch(
  () => datePicker.modelValue,
  (val) => {
    // 清空数据处理
    if (isArray(val) && !val.length) {
      rangeDate.value = val
    }
  }
)

onBeforeMount(() => {
  const modelValue = datePicker.modelValue
  // 如果modelValue是一个数组，并且有2个元素
  if (isArray(modelValue) && modelValue.length === 2) {
    let left = parseToDayjs(modelValue[0], datePicker.valueFormat)
    let right = parseToDayjs(modelValue[1], datePicker.valueFormat)
    const range = [left, right].sort((a, b) => (a.isBefore(b) ? -1 : 0))

    ;[left, right] = range

    rangeDate.value = compact(range)
    leftInnerDate.value = (left ?? dayjs().startOf(innerViewType.value)).clone()
    const next = transferDate(leftInnerDate.value, innerViewType.value, 1)
    // 左右面板在非联动的情况下
    if (datePicker.unlinkPanels) {
      right = right ?? dayjs().startOf(innerViewType.value)
      rightInnerDate.value = right.isAfter(next) ? right : next
    } else {
      rightInnerDate.value = next
    }
  } else {
    leftInnerDate.value = dayjs().startOf(innerViewType.value)
    rightInnerDate.value = transferDate(
      leftInnerDate.value,
      innerViewType.value,
      1
    )
  }
})
</script>
