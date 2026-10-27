<template>
  <div :class="ns.b()">
    <div :class="[ns.e('pale')]">
      <div v-for="day in 7" :key="day" :class="[ns.e('week-day')]">
        <span class="item">{{ t(`datePicker.day_${day - 1}`) }}</span>
      </div>
      <div
        v-for="obj in dateList"
        :key="obj.ts"
        :class="[
          ns.e('date'),
          ns.is('selected', obj.isSelected && !(obj.isPrevious || obj.isNext)),
          ns.is('disabled', obj.isDisabled),
          ns.is('current', obj.isToday),
          ns.is('next', obj.isNext),
          ns.is('previous', obj.isPrevious),
          ns.is('in-range', obj.isInRange),
          ns.is('range-start', obj.isRangeStart),
          ns.is('range-end', obj.isRangeEnd)
        ]"
        @click="obj.isDisabled ? void 0 : handlePicker(obj.value)"
        @mouseover="obj.isDisabled ? void 0 : $emit('hoverItem', obj.value)"
      >
        <span :class="ns.e('date-inner')">{{ obj.date }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { datePickerContextKey } from '../useDatepiker'
import { useLocale } from '../../../hooks/locale'
import { buildCssNamespace } from '../../../util'
dayjs.extend(isBetween)

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
const { t } = useLocale()
const firstDateOfMonth = computed(() => props.date.startOf('month'))
const startDate = computed(() => {
  const day = firstDateOfMonth.value.day()
  return firstDateOfMonth.value.clone().add(-day, 'day').startOf('date')
})

const dateList = computed(() => {
  return Array.from({ length: 42 }).map((_, i) => {
    const dayjsObj = startDate.value.clone().add(i, 'day')
    return {
      ts: dayjsObj.valueOf(),
      date: dayjsObj.date(),
      value: dayjsObj,
      isDisabled: datePicker.isDisabledItem(dayjsObj.toDate()),
      isPrevious: isPrevious(dayjsObj),
      isNext: isNext(dayjsObj),
      isSelected: isSelected(dayjsObj),
      isToday: isToday(dayjsObj),
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
  return date.isBefore(firstDateOfMonth.value)
}
const isNext = (date) => {
  return date.isAfter(firstDateOfMonth.value.endOf('month'))
}

const isToday = (date) => {
  return dayjs().startOf('date').isSame(date.startOf('date'))
}

const isSelected = (date) => {
  if (props.modelDate && dayjs(props.modelDate).isValid()) {
    return date.startOf('date').isSame(dayjs(props.modelDate).startOf('date'))
  }
  return false
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
