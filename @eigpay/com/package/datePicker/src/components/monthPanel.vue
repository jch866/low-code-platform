<template>
  <div :class="[ns.b()]">
    <div :class="[ns.e('pale'), ns.is('month', true)]">
      <div
        v-for="obj in dateList"
        :key="obj.ts"
        :class="[
          ns.e('date'),
          ns.is('selected', obj.isSelected && !(obj.isPrevious || obj.isNext)),
          ns.is('disabled', obj.isDisabled),
          ns.is('current', obj.isCurrent),
          ns.is('in-range', obj.isInRange),
          ns.is('range-start', obj.isRangeStart),
          ns.is('range-end', obj.isRangeEnd)
        ]"
        @click="obj.isDisabled ? void 0 : handlePicker(obj.value)"
        @mouseover="obj.isDisabled ? void 0 : $emit('hoverItem', obj.value)"
      >
        <span :class="ns.e('date-inner')">
          {{ t(`datePicker.m_${obj.value.month()}`) }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import dayjs from 'dayjs'
import { datePickerContextKey } from '../useDatepiker'
import { useLocale } from '../../../hooks/locale'
import { buildCssNamespace } from '../../../util'

const props = defineProps({
  date: {
    type: dayjs.Dayjs,
    required: true
  },
  modelDate: {
    type: dayjs.Dayjs,
    default: undefined
  },
  rangeDate: {
    type: Array,
    default: undefined
  }
})
const ns = buildCssNamespace('date-picker-panel-body')

const { t } = useLocale()

const datePicker = inject(datePickerContextKey)

const emit = defineEmits(['pick', 'hoverItem'])

const firstMonthOfYear = computed(() => props.date.startOf('year'))

const dateList = computed(() => {
  return Array.from({ length: 12 }).map((_, i) => {
    const dayjsObj = firstMonthOfYear.value
      .clone()
      .add(i, 'month')
      .startOf('month')
    return {
      ts: dayjsObj.valueOf(),
      date: dayjsObj.date(),
      value: dayjsObj,
      isDisabled: datePicker.isDisabledItem(dayjsObj.toDate()),
      isSelected: isSelected(dayjsObj),
      isCurrent: isCurrent(dayjsObj),
      isInRange: isInRange(dayjsObj),
      isRangeStart: isRangeStart(dayjsObj),
      isRangeEnd: isRangeEnd(dayjsObj)
    }
  })
})

const handlePicker = (date) => {
  emit('pick', date)
}

const isSelected = (date) => {
  if (!props.modelDate) {
    return false
  }
  return date.startOf('month').isSame(dayjs(props.modelDate).startOf('month'))
}

const isCurrent = (date) => {
  return dayjs().startOf('month').isSame(date.startOf('month'))
}

const range = computed(() => {
  let start, end
  if (props.rangeDate && props.rangeDate.length === 2) {
    ;[start, end] = props.rangeDate
  }
  return {
    start,
    end
  }
})

const isInRange = (date) => {
  const rangeStart = range.value.start ?? dayjs('invalid')
  const rangeEnd = range.value.end ?? dayjs('invalid')

  if (rangeStart.isValid() && rangeEnd.isValid()) {
    return date.isBetween(rangeStart, rangeEnd, 'day', '[]')
  }
  return false
}

const isRangeStart = (date) => {
  const rangeStart = range.value.start ?? dayjs('invalid')
  return date.isSame(rangeStart)
}
const isRangeEnd = (date) => {
  const rangeEnd = range.value.end ?? dayjs('invalid')
  return date.isSame(rangeEnd)
}
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('DatePickerMonthPanel')
}
</script>
