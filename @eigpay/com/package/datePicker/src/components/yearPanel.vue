<template>
  <div :class="ns.b()">
    <div :class="[ns.e('pale'), ns.is('year', true)]">
      <div
        v-for="obj in dateList"
        :key="obj.ts"
        :class="[
          ns.e('date'),
          ns.is('selected', obj.isSelected && !(obj.isPrevious || obj.isNext)),
          ns.is('disabled', obj.isDisabled),
          ns.is('current', obj.isCurrent),
          ns.is('next', obj.isNext),
          ns.is('previous', obj.isPrevious),
          ns.is('in-range', obj.isInRange),
          ns.is('range-start', obj.isRangeStart),
          ns.is('range-end', obj.isRangeEnd)
        ]"
        @click="obj.isDisabled ? void 0 : handlePicker(obj.value)"
        @mouseover="obj.isDisabled ? void 0 : $emit('hoverItem', obj.value)"
      >
        <span :class="ns.e('date-inner')">{{ obj.value.year() }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import dayjs from 'dayjs'
import { datePickerContextKey } from '../useDatepiker'
// import { useLocale } from '../../../hooks/locale'
import { buildCssNamespace } from '../../../util'

const datePicker = inject(datePickerContextKey)

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

const emit = defineEmits(['pick', 'hoverItem'])

const ns = buildCssNamespace('date-picker-panel-body')
// const { t } = useLocale()
const firstDateOfYear = computed(() => props.date.startOf('year'))
const startDate = computed(() => {
  const year = firstDateOfYear.value.year() % 10
  return firstDateOfYear.value.clone().add(-year, 'year')
})

const dateList = computed(() => {
  const offset = startDate.value.year() % 3
  return Array.from({ length: 12 }).map((_, i) => {
    const dayjsObj = startDate.value.clone().add(i - offset, 'year')
    return {
      ts: dayjsObj.valueOf(),
      date: dayjsObj.date(),
      value: dayjsObj,
      isDisabled: datePicker.isDisabledItem(dayjsObj.toDate()),
      isPrevious: isPrevious(dayjsObj),
      isNext: isNext(dayjsObj),
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

const isPrevious = (date) => {
  return date.isBefore(startDate.value)
}
const isNext = (date) => {
  return date.isAfter(startDate.value.add(9, 'year'))
}

const isCurrent = (date) => {
  return dayjs().year() === date.year()
}

const isSelected = (date) => {
  if (!props.modelDate) {
    return false
  }
  return date.startOf('year').isSame(dayjs(props.modelDate).startOf('year'))
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
    return date.isBetween(rangeStart, rangeEnd, 'year', '[]')
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
  name: componetName('DatePickerYearPanel')
}
</script>
