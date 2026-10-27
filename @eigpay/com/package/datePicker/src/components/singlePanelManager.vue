<template>
  <div :class="[ns.b()]">
    <panel-header
      :date="innerDate"
      :view-type="innerViewType"
      @date-change="handleHeaderDateChange"
      @view-change="handleViewChange"
    />
    <div :class="ns.e('content')">
      <year-panel
        v-if="innerViewType === 'year'"
        :date="innerDate"
        :model-date="modelDate"
        @pick="pickYear"
      />
      <month-panel
        v-if="innerViewType === 'month'"
        :date="innerDate"
        :model-date="modelDate"
        @pick="pickMonth"
      />
      <date-panel
        v-if="innerViewType === 'date'"
        :date="innerDate"
        :model-date="modelDate"
        @pick="pickDate"
      />
    </div>
    <panel-footer
      v-if="innerViewType === 'date'"
      @pick="setAsToday"
    ></panel-footer>
  </div>
</template>

<script setup>
import { ref, shallowRef, inject, onBeforeMount } from 'vue'
import { datePickerContextKey, parseToDayjs } from '../useDatepiker'
import PanelHeader from './panelHeader.vue'
import PanelFooter from './panelFooter.vue'
import { buildCssNamespace } from '../../../util'
import DatePanel from './datePanel.vue'
import MonthPanel from './monthPanel.vue'
import YearPanel from './yearPanel.vue'

import dayjs from 'dayjs'

const props = defineProps({
  type: {
    type: String,
    default: undefined
  },
  modelDate: {
    type: dayjs.Dayjs,
    required: true
  }
})
const ns = buildCssNamespace('date-picker-panel')
// const emit = defineEmits(['pickYear', 'pickMonth', 'pickDate', 'pickWeek'])
const datePicker = inject(datePickerContextKey)
// 管理器内部日期
const innerDate = shallowRef(dayjs())

// 当前显示面板类型
const innerViewType = ref(null)

// 面板显示类型改变
const handleViewChange = (type) => {
  innerViewType.value = type
}
// 选择当天
const setAsToday = () => {
  const today = dayjs().startOf('date')
  datePicker.setSelected(today)
}

const handleHeaderDateChange = (date) => {
  innerDate.value = dayjs(date)
}

const pickYear = (date) => {
  const temp = innerDate.value.clone().year(date.year())
  if (innerViewType.value === props.type) {
    datePicker.setSelected(temp.startOf('year'))
  } else {
    innerViewType.value = 'month'
    datePicker.changeYear(temp)
  }
  innerDate.value = temp
}

const pickMonth = (date) => {
  const temp = innerDate.value.clone().month(date.month())
  if (innerViewType.value === props.type) {
    datePicker.setSelected(temp.startOf('month'))
  } else {
    innerViewType.value = props.type === 'date' ? 'date' : 'week'
    datePicker.changeMonth(temp)
  }
  innerDate.value = temp
}

const pickDate = (date) => {
  const temp = date.startOf('date')
  if (innerViewType.value === props.type) {
    datePicker.setSelected(temp)
  } else {
    datePicker.changeDate(temp)
  }
  innerDate.value = temp
}

onBeforeMount(() => {
  const modelDayjs = parseToDayjs(datePicker.modelValue, datePicker.valueFormat)
  innerDate.value = modelDayjs && modelDayjs.isValid() ? modelDayjs : dayjs()
  innerViewType.value = props.type.replace(/range/gi, '')
})
</script>
