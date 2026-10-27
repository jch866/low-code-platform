<template>
  <div :class="[ns.b(), ns.is('left', isLeft), ns.is('right', isRight)]">
    <span :class="[ns.e('nav-prev'), ns.is('visible', prevIsVisible)]">
      <span
        v-if="prevYearIsVisble"
        :class="[ns.m('icon'), ns.is('disabled', prevYearIsDisabled)]"
        @click.stop="prevYearIsDisabled ? void 0 : handleChangeYear(-1)"
      >
        <ep-icon icon="ep-i-vector" :class="ns.m('icon-rotate')" />
      </span>
      <span
        v-if="prevMonthIsVisble"
        :class="[ns.m('icon'), ns.is('disabled', prevMonthIsDisabled)]"
        @click.stop="prevMonthIsDisabled ? void 0 : handleChangeMonth(-1)"
      >
        <ep-icon icon="ep-i-a-to-left" />
      </span>
    </span>
    <span :class="ns.e('nav-manipulate')">
      <span v-if="viewType === 'year'" :class="ns.e('nav-manipulate-year')">
        {{ date.year() - (date.year() % 10) }} -
        {{ date.year() - (date.year() % 10) + 9 }}
      </span>
      <template v-else>
        <span :class="ns.e('nav-manipulate-year')" @click="changeView('year')">
          {{ t(`datePicker.arg_year`, { year: date.year() }) }}
        </span>
        <span
          v-if="monthIsVisible"
          :class="ns.e('nav-manipulate-month')"
          @click="changeView('month')"
        >
          {{ t(`datePicker.m_${date.month()}`) }}
        </span>
      </template>
    </span>
    <span :class="[ns.e('nav-next'), ns.is('visible', nextIsVisible)]">
      <span
        v-if="nextMonthIsVisble"
        :class="[ns.m('icon'), ns.is('disabled', nextMonthIsDisabled)]"
        @click.stop="nextMonthIsDisabled ? void 0 : handleChangeMonth(+1)"
      >
        <ep-icon icon="ep-i-arrow-to-right" />
      </span>
      <span
        v-if="nextYearIsVisble"
        :class="[ns.m('icon'), ns.is('disabled', nextYearIsDisabled)]"
        @click.stop="nextYearIsDisabled ? void 0 : handleChangeYear(+1)"
      >
        <ep-icon icon="ep-i-vector" />
      </span>
    </span>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import dayjs from 'dayjs'
import { useLocale } from '../../../hooks/locale'
import { buildCssNamespace } from '../../../util'

import { datePickerContextKey } from '../useDatepiker'

const props = defineProps({
  place: {
    type: String,
    default: undefined
  },
  date: {
    type: dayjs.Dayjs,
    required: true
  },
  peerDate: {
    type: dayjs.Dayjs,
    default: undefined
  },
  viewType: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['dateChange', 'viewChange'])

const datePicker = inject(datePickerContextKey)

const { t } = useLocale()

const ns = buildCssNamespace('date-picker-panel-header')

const isLeft = computed(() => props.place === 'left')
const isRight = computed(() => props.place === 'right')

const handleChangeYear = (quantity) => {
  if (props.viewType === 'year') {
    quantity *= 10
  }
  const newDate = props.date.clone().add(quantity, 'year')
  emit('dateChange', newDate)
}

const handleChangeMonth = (quantity) => {
  const newDate = props.date.clone().add(quantity, 'month')
  emit('dateChange', newDate)
}

const changeView = (view) => {
  emit('viewChange', view)
}

const prevIsVisible = computed(() => {
  if (!datePicker.unlinkPanels && props.place === 'right') {
    return false
  }
  return true
})
const nextIsVisible = computed(() => {
  if (!datePicker.unlinkPanels && props.place === 'left') {
    return false
  }
  return true
})
const prevYearIsVisble = ref(true)
const prevMonthIsVisble = computed(() => props.viewType === 'date')
const nextYearIsVisble = ref(true)
const nextMonthIsVisble = computed(() => props.viewType === 'date')

const prevYearIsDisabled = computed(() => {
  if (datePicker.unlinkPanels && props.place === 'right') {
    const peer = dayjs(props.peerDate)
    if (peer.isValid()) {
      // 对方面板的年 >= 本面板的年
      if (props.viewType === 'date') {
        return !peer
          .add(1, 'year')
          .startOf('month')
          .isBefore(props.date.startOf('month'))
      } else if (props.viewType === 'month') {
        return !peer
          .add(1, 'year')
          .startOf('year')
          .isBefore(props.date.startOf('year'))
      } else if (props.viewType === 'year') {
        const peerYearMod = peer.year() % 10
        const thidYearMod = props.date.year() % 10
        return !peer
          .add(-peerYearMod, 'year')
          .add(10, 'year')
          .startOf('year')
          .isBefore(props.date.add(-thidYearMod, 'year').startOf('year'))
      }
    }
  }

  return false
})
const prevMonthIsDisabled = computed(() => {
  if (datePicker.unlinkPanels && props.place === 'right') {
    const peer = dayjs(props.peerDate)
    if (peer.isValid()) {
      // return 对方面板的year和月 >= 本面板的年和月
      return !peer
        .startOf('month')
        .add(1, 'month')
        .isBefore(props.date.startOf('month'))
    }
  }

  return false
})
const nextYearIsDisabled = computed(() => {
  if (datePicker.unlinkPanels && props.place === 'left') {
    const peer = dayjs(props.peerDate)
    if (peer.isValid()) {
      // return 对方面板的年 <= 本面板的年
      if (props.viewType === 'date') {
        return !peer
          .add(-1, 'year')
          .startOf('month')
          .isAfter(props.date.startOf('month'))
      } else if (props.viewType === 'month') {
        return !peer
          .add(-1, 'year')
          .startOf('year')
          .isAfter(props.date.startOf('year'))
      } else if (props.viewType === 'year') {
        const peerYearMod = peer.year() % 10
        const thidYearMod = props.date.year() % 10
        return !peer
          .add(-peerYearMod, 'year')
          .add(-10, 'year')
          .startOf('year')
          .isAfter(props.date.add(-thidYearMod, 'year').startOf('year'))
      }
    }
  }

  return false
})
const nextMonthIsDisabled = computed(() => {
  if (datePicker.unlinkPanels && props.place === 'left') {
    const peer = dayjs(props.peerDate)
    if (peer.isValid()) {
      // return 对方面板的year和月 <= 本面板的年和月
      return !peer
        .startOf('month')
        .add(-1, 'month')
        .isAfter(props.date.startOf('month'))
    }
  }

  return false
})

const monthIsVisible = computed(
  () => !['year', 'month'].includes(props.viewType)
)
</script>
