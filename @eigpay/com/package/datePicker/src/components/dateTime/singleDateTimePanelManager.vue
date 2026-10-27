<template>
  <div :class="[ns.b()]">
    <date-time-panel-header
      :date="innerDate"
      :model-date="modelDate"
      @pick="pickTime"
      @cancel-select-time="cancelSelectTime"
    />
    <panel-header
      :date="innerDate"
      :view-type="innerViewType"
      @date-change="handleHeaderDateChange"
      @view-change="handleViewChange"
    />
    <div :class="ns.e('content')">
      <date-panel :date="innerDate" :model-date="modelDate" @pick="pickDate" />
    </div>
    <date-time-panel-footer @pick="setAsDataTime" @confirm="handleConfirm" />
  </div>
</template>

<script setup>
import { ref, shallowRef, inject, onBeforeMount } from 'vue'
import {
  datePickerContextKey,
  parseToDayjs,
  getUnits
} from '../../useDatepiker'
import PanelHeader from '../panelHeader.vue'
import DateTimePanelHeader from './dateTimePanelHeader.vue'
import DateTimePanelFooter from './dateTimePanelFooter.vue'
import { buildCssNamespace } from '../../../../util'
import DatePanel from '../datePanel.vue'

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
// 选择当前时间
const setAsDataTime = () => {
  const now = dayjs().format()
  datePicker.setSelected(now)

  const temp = parseToDayjs(now, datePicker.valueFormat)
  innerDate.value = temp
}

const handleConfirm = () => {
  datePicker.handleConfirm()
}

const handleHeaderDateChange = (date) => {
  innerDate.value = dayjs(date)
}

// 取消选择时间
const cancelSelectTime = () => {
  // 只将时间还原到上一次，不改变选择的日期
  if (!datePicker.lastActualValue) {
    datePicker.closeTimePanel()
    return
  }
  const { hour, minute, second } = getUnits(datePicker.lastActualValue)
  const newTemp = innerDate.value.hour(hour).minute(minute).second(second)
  innerDate.value = newTemp
  datePicker.handleCancelSelectTime()
}

const pickDate = (value) => {
  // 替换日期
  const temp = datePicker.actualValue ?? value
  const { year, month, date } = getUnits(value)
  const newTemp = temp.year(year).month(month).date(date)
  datePicker.changeDate(newTemp)
  innerDate.value = newTemp
}

const pickTime = (value) => {
  // 替换时间
  const temp = datePicker.actualValue ?? value
  const { hour, minute, second } = getUnits(value)
  const newTemp = temp.hour(hour).minute(minute).second(second)
  datePicker.changeDate(newTemp)
  innerDate.value = newTemp
}

onBeforeMount(() => {
  const modelDayjs = parseToDayjs(datePicker.modelValue, datePicker.valueFormat)
  innerDate.value = modelDayjs && modelDayjs.isValid() ? modelDayjs : dayjs()
  innerViewType.value = props.type.replace(/range/gi, '')
})
</script>
