<template>
  <div :class="[ns.b()]">
    <time-spinner
      :class="ns.e('content')"
      :date="innerTime"
      :model-date="modelDate"
      @change="handleChange"
    />
    <time-footer :class="ns.e('footer')" @cancel="cancel" @confirm="confirm" />
  </div>
</template>

<script setup>
import { shallowRef, inject, onBeforeMount } from 'vue'
import { timePickerContextKey, parseToDayjs } from '../useTimePicker'
import TimeFooter from './timeFooter.vue'
import { buildCssNamespace } from '../../../util'
import TimeSpinner from './timeSpinner.vue'

import dayjs from 'dayjs'

defineProps({
  modelDate: {
    type: dayjs.Dayjs,
    required: true
  }
})
const ns = buildCssNamespace('time-picker-panel')
const timePicker = inject(timePickerContextKey)
// 管理器内部日期
const innerTime = shallowRef(dayjs())

// 改变时间
const handleChange = (date) => {
  const modelDayjs = parseToDayjs(date, timePicker.valueFormat)
  innerTime.value = modelDayjs && modelDayjs.isValid() ? modelDayjs : dayjs()
  timePicker.changeDate(date)
}

// 取消
const cancel = () => {
  innerTime.value = timePicker.lastActualValue
  timePicker.handleCancel()
}

// 确认
const confirm = () => {
  timePicker.handleConfirm(innerTime.value)
}

onBeforeMount(() => {
  const modelDayjs = parseToDayjs(timePicker.modelValue, timePicker.valueFormat)
  innerTime.value = modelDayjs && modelDayjs.isValid() ? modelDayjs : dayjs()
})
</script>
