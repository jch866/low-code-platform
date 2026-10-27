<template>
  <div>
    <div :class="ns.b()">
      <ep-scroll-bar
        v-for="item in spinnerItems"
        :key="item"
        :ref="(scrollbar) => setRef(scrollbar, item)"
        :class="ns.e('wrapper')"
        :view-class="ns.e('list')"
      >
        <li
          v-for="key in timeList[item]"
          :key="key"
          :class="[ns.e('item'), ns.is('active', key === timePartials[item])]"
          @click="handlePicker(item, key)"
        >
          {{ ('0' + key).slice(-2) }}
        </li>
      </ep-scroll-bar>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, unref, watch, nextTick } from 'vue'
import dayjs from 'dayjs'
import { buildCssNamespace } from '../../../util'

const props = defineProps({
  date: {
    type: dayjs.Dayjs,
    required: true
  },
  modelDate: {
    type: dayjs.Dayjs,
    default: undefined
  }
})

const listHoursRef = ref()
const listMinutesRef = ref()
const listSecondsRef = ref()

const listRefsMap = {
  hours: listHoursRef,
  minutes: listMinutesRef,
  seconds: listSecondsRef
}

const emit = defineEmits(['change', 'hoverItem'])

const ns = buildCssNamespace('time-spinner')

const spinnerItems = ['hours', 'minutes', 'seconds']

watch(
  () => props.modelDate,
  (newValue) => {
    if (!newValue) return
    nextTick(() => {
      adjustSpinners()
    })
  },
  { immediate: true }
)

const timeList = computed(() => {
  return {
    hours: Array.from({ length: 24 }).map((_, i) => i),
    minutes: Array.from({ length: 60 }).map((_, i) => i),
    seconds: Array.from({ length: 60 }).map((_, i) => i)
  }
})

const timePartials = computed(() => {
  const hours = props.date.hour()
  const minutes = props.date.minute()
  const seconds = props.date.second()
  return { hours, minutes, seconds }
})

const handlePicker = (type, value) => {
  modifyDateField(type, value)
  adjustSpinner(type, value)
}

const modifyDateField = (type, value) => {
  const { hours, minutes, seconds } = timePartials.value

  let changeTo
  switch (type) {
    case 'hours':
      changeTo = props.date.hour(value).minute(minutes).second(seconds)
      break
    case 'minutes':
      changeTo = props.date.hour(hours).minute(value).second(seconds)
      break
    case 'seconds':
      changeTo = props.date.hour(hours).minute(minutes).second(value)
      break
  }
  emit('change', changeTo)
}

const setRef = (scrollbar, type) => {
  listRefsMap[type].value = scrollbar
}

const getScrollbarElement = (el) =>
  el.querySelector(`.${ns.namespace}-scrollbar__wrapper`)

const typeItemHeight = (type) => {
  const scrollbar = unref(listRefsMap[type])
  return scrollbar?.$el.querySelector('li').offsetHeight || 0
}

const adjustSpinner = (type, value) => {
  const scrollbar = unref(listRefsMap[type])
  if (scrollbar && scrollbar.$el) {
    getScrollbarElement(scrollbar.$el).scrollTop = Math.max(
      0,
      value * typeItemHeight(type)
    )
  }
}

const adjustCurrentSpinner = (type) => {
  adjustSpinner(type, unref(timePartials)[type])
}

const adjustSpinners = () => {
  adjustCurrentSpinner('hours')
  adjustCurrentSpinner('minutes')
  adjustCurrentSpinner('seconds')
}
</script>
