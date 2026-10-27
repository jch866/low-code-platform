<template>
  <div :class="ns.b()">
    <ep-input v-model="displayDateValue" type="text" :validate-event="false" />
    <ep-tooltip
      v-model="timePanelIsOpen"
      trigger="click"
      :offset="5"
      effect="light"
      :pure="true"
      :show-arrow="false"
      placement="bottom-start"
    >
      <ep-input
        v-model="displayTimeValue"
        type="text"
        :validate-event="false"
        :class="[inputNs.is('focus', timePanelIsOpen), ns.e('input')]"
      />

      <template #content>
        <div v-if="timePanelIsOpen" :class="timePanelNs.b()">
          <time-spinner
            :class="timePanelNs.e('content')"
            :date="date"
            :model-date="modelDate"
            @change="handleChange"
          />
          <time-footer
            :class="timePanelNs.e('footer')"
            @cancel="cancel"
            @confirm="confirm"
          />
        </div>
      </template>
    </ep-tooltip>
  </div>
</template>
<script setup>
import { toRefs, inject } from 'vue'
import { buildCssNamespace } from '../../../../util'
import TimeSpinner from '../../../../timePicker/src/components/timeSpinner.vue'
import TimeFooter from '../../../../timePicker/src/components/timeFooter.vue'
import dayjs from 'dayjs'

import { datePickerContextKey } from '../../useDatepiker'

defineProps({
  date: {
    type: dayjs.Dayjs,
    required: true
  },
  modelDate: {
    type: dayjs.Dayjs,
    required: true
  }
})

const datePicker = inject(datePickerContextKey)
const { timePanelIsOpen, displayDateValue, displayTimeValue } =
  toRefs(datePicker) // 用toRefs解构会保持响应性

const ns = buildCssNamespace('date-time-panel-header')
const timePanelNs = buildCssNamespace('time-panel')
const inputNs = buildCssNamespace('input')

const emit = defineEmits(['pick', 'cancelSelectTime'])

// 取消
const cancel = () => {
  emit('cancelSelectTime')
}

// 确认
const confirm = () => {
  datePicker.handleConfirmSelectTime(datePicker.actualValue)
}

// 改变时间
const handleChange = (date) => {
  emit('pick', date)
}
</script>
