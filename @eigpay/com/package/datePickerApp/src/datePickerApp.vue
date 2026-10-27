<template>
  <div
    :class="[ns.b(), $attrs.class, inputNs.is('focus', isFocus || panelIsOpen)]"
  >
    <ep-input
      v-model="displayValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :validate-event="false"
      :readonly="!editable"
      :class="inputNs.is('focus', panelIsOpen)"
      @click="showCalendar"
    >
      <template #suffix>
        <ep-icon icon="ep-i-calendar21" :size="16" />
      </template>
    </ep-input>

    <div v-show="panelIsOpen && !disabled">
      <div class="light-box" @click="close"></div>
      <div class="calendar">
        <header>
          <span class="calender-cancel" @click="close">取消</span>
          <span class="title">{{ title }}</span>
          <span class="calender-submit" @click="close" @click.stop="submit">
            确认
          </span>
        </header>
        <section
          :style="
            styleMaxHeight +
            'background-position: 0px ' +
            lineHeight * 2 +
            'px;'
          "
        >
          <div class="calendar-mask"></div>
          <ul
            id="year"
            v-if="format.includes('yy')"
            @mousedown.prevent="onTouchStart($event, DateEnum.year)"
            @touchstart.prevent="onTouchStart($event, DateEnum.year)"
            :style="styleMaxHeight"
            ref="yearRef"
          >
            <li v-for="(item, index) in yearRange" :key="item">
              {{ item }}
            </li>
          </ul>
          <ul
            v-if="format.includes('MM')"
            @mousedown.prevent="onTouchStart($event, DateEnum.month)"
            @touchstart.prevent="onTouchStart($event, DateEnum.month)"
            :style="styleMaxHeight"
            ref="monthRef"
          >
            <li v-for="(item, index) in monthRange" :key="item">
              {{ item }}
            </li>
          </ul>
          <ul
            v-if="format.includes('dd')"
            @mousedown.prevent="onTouchStart($event, DateEnum.day)"
            @touchstart.prevent="onTouchStart($event, DateEnum.day)"
            :style="styleMaxHeight"
            ref="dayRef"
          >
            <li v-for="(item, index) in dayRange" :key="item">
              {{ item }}
            </li>
          </ul>
          <ul
            v-if="format.includes('hh')"
            @mousedown="onTouchStart($event, DateEnum.hour)"
            @touchstart="onTouchStart($event, DateEnum.hour)"
            :style="styleMaxHeight"
            ref="hourRef"
          >
            <li v-for="(item, index) in hourRange" :key="item">
              {{ item }}
            </li>
          </ul>
          <ul
            v-if="format.includes('mm')"
            @mousedown="onTouchStart($event, DateEnum.minute)"
            @touchstart="onTouchStart($event, DateEnum.minute)"
            :style="styleMaxHeight"
            ref="minuteRef"
          >
            <li v-for="(item, index) in minuteRange" :key="item">
              {{ item }}
            </li>
          </ul>
          <ul
            v-if="format.includes('ss')"
            @mousedown="onTouchStart($event, DateEnum.second)"
            @touchstart="onTouchStart($event, DateEnum.second)"
            :style="styleMaxHeight"
            ref="secondRef"
          >
            <li v-for="(item, index) in secondRange" :key="item">
              {{ item }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  reactive,
  toRefs,
  provide,
  inject,
  useAttrs,
  ref,
  computed,
  onMounted
} from 'vue'
import { buildCssNamespace, formatDate } from '../../util'
import { formItemContextKey } from '../../form/src/formLib'

const isFocus = false
const lineHeight = 40
const styleMaxHeight = 'height:' + lineHeight * 5 + 'px;'
const props = defineProps({
  range: {
    type: Array,
    default: ['1950-01-01', new Date()]
  },
  title: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: true
  },
  //通过format控制可先栏位
  format: {
    type: String,
    default: 'yyyy-MM-dd hh:mm:ss'
  },
  valueFormat: {
    type: String,
    default: undefined
  },

  modelValue: {
    type: [String, Array],
    default: undefined
  },
  /*
  type: {
    type: String,
    default: 'date'
  },
  clearable: {
    type: Boolean,
    default: false
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  unlinkPanels: {
    type: Boolean,
    default: false
  },
  rangeSeparator: {
    type: String,
    default: '-'
  },
  startPlaceholder: {
    type: String,
    default: '开始日期'
  },
  endPlaceholder: {
    type: String,
    default: '结束日期'
  },
  teleported: {
    type: Boolean,
    default: true
  },
  */
  disabledDate: Function
})
let displayValue = ref(props.modelValue)
const DateEnum = {
  year: 'yy',
  month: 'MM',
  day: 'dd',
  hour: 'hh',
  minute: 'mm',
  second: 'ss'
}
const DateEnumAbbr = {
  yy: 'year',
  MM: 'month',
  dd: 'day',
  hh: 'hour',
  mm: 'minute',
  ss: 'second'
}
const ns = buildCssNamespace('date-picker-app')
const inputNs = buildCssNamespace('input')
const yearRef = ref(null)
const monthRef = ref(null)
const dayRef = ref(null)
const hourRef = ref(null)
const minuteRef = ref(null)
const secondRef = ref(null)
const panelIsOpen = ref(false)
const close = function () {
  panelIsOpen.value = false
}
let counter = 0
const showCalendar = (evt) => {
  panelIsOpen.value = true
  bindWindowEvent()
  if (counter < 2) {
    if (yearRef.value != null)
      yearRef.value.scrollTop = dateIndexObj.year * lineHeight
    if (monthRef.value != null)
      monthRef.value.scrollTop = dateIndexObj.month * lineHeight
    if (dayRef.value != null)
      dayRef.value.scrollTop = dateIndexObj.day * lineHeight
    if (hourRef.value != null)
      hourRef.value.scrollTop = dateIndexObj.hour * lineHeight
    if (minuteRef.value != null)
      minuteRef.value.scrollTop = dateIndexObj.minute * lineHeight
    if (secondRef.value != null)
      secondRef.value.scrollTop = dateIndexObj.second * lineHeight
  }
  counter++
}

const emit = defineEmits(['change', 'update:modelValue'])

let date = displayValue.value ? new Date(displayValue.value) : new Date(),
  outputDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  }

const getMonthDays = (year, month) => {
  return new Date(year, month, 0).getDate()
}
//yyyyMMddhhmmss下拉初始化
let yearRange = [],
  monthRange = [],
  dayRange = reactive([]),
  hourRange = [],
  minuteRange = [],
  secondRange = [],
  dateIndexObj = reactive({
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  })
const renderDays = () => {
  let maxDays = getMonthDays(outputDate.year, outputDate.month)
  dayRange.length = 0;
  for (let i = 1; i <= maxDays; i++) {
    if (i == outputDate.day) {
      dateIndexObj.day = i - 1
    } else if (i === maxDays && maxDays < outputDate.day) {
      outputDate.day = maxDays;
      dateIndexObj.day = maxDays
    }
    dayRange.push(i.toString().padStart(2, '0'))
  }
}
const init = () => {
  //这块可以合成一个二层循环，有空优化
  let i,
    n = 0
  for (
    i = new Date(props.range[0]).getFullYear();
    i <= new Date(props.range[1]).getFullYear();
    i++
  ) {
    if (i == outputDate.year) {
      dateIndexObj.year = n
    }
    n++
    yearRange.push(i)
  }

  for (i = 1; i <= 12; i++) {
    if (i == outputDate.month) dateIndexObj.month = i - 1
    monthRange.push(i.toString().padStart(2, '0'))
  }

  renderDays()

  for (i = 1; i <= 24; i++) {
    if (i == outputDate.hour) dateIndexObj.hour = i - 1
    hourRange.push(i.toString().padStart(2, '0'))
  }

  for (i = 1; i <= 60; i++) {
    if (i == outputDate.minute) dateIndexObj.minute = i - 1
    minuteRange.push(i.toString().padStart(2, '0'))
  }

  for (i = 1; i <= 60; i++) {
    if (i == outputDate.second) dateIndexObj.second = i - 1
    secondRange.push(i.toString().padStart(2, '0'))
  }
}
init()

let timer,
  befortop = 0,
  aftertop,
  dateCollection = {
    year: yearRange,
    month: monthRange,
    day: dayRange,
    hour: hourRange,
    minute: minuteRange,
    second: secondRange
  },
  fromY = 0,
  currY,
  draggable,
  fromTarget,
  fromType
const onTouchStart = function (evt, _type) {
  fromType = _type
  fromY = evt.pageY || evt.targetTouches[0].pageY
  fromTarget = evt.currentTarget
  befortop = fromTarget.scrollTop
  aftertop = befortop
  draggable = true
}
const bindWindowEvent = () => {
  //日期滑动
  window.ontouchmove = window.onmousemove = (evt) => {
    if (!draggable) return
    clearTimeout(timer)
    currY = evt.pageY || evt.targetTouches[0].pageY
    aftertop = befortop + fromY - currY
    fromTarget.scrollTo(0, aftertop)
  }
  window.ontouchend = window.onmouseup = () => {
    if (!draggable) return
    draggable = false

    //fix position
    let num = aftertop % lineHeight
    if (num != 0) {
      aftertop =
        fromY < currY
          ? num < lineHeight * 0.3
            ? aftertop - num
            : aftertop + lineHeight - num
          : num > lineHeight * 0.7
          ? aftertop + lineHeight - num
          : aftertop - num
      fromTarget.scrollTo(0, aftertop)
      //修复超出最大可scroll范围时取值
      aftertop = fromTarget.scrollTop
      //滚动赋值
      outputDate[DateEnumAbbr[fromType]] =
        dateCollection[DateEnumAbbr[fromType]][aftertop / lineHeight]
      //年月改变，且天数大于28
      if (fromType == DateEnum.year || fromType == DateEnum.month) renderDays()
    }
  }
}
const getSelectedDate = (format) => {
  const { year, month, day, hour, minute, second } = outputDate
  let date = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  if (/iPhone|iPad|iPod|Safari/.test(navigator.userAgent)) {
    date = date.replace(/-/g, '/')
  }
  return formatDate(date, format)
}
const submit = (evt) => {
  displayValue.value = getSelectedDate(props.format)
  date = new Date(displayValue.value)

  let _val = getSelectedDate(props.valueFormat || props.format)
  emit('change', _val)
  emit('update:modelValue', _val)
  close()
}
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('DatePickerApp'),
  inheritAttrs: false
}
</script>
<style>
ul::-webkit-scrollbar {
  width: 0; /* 隐藏滚动条 */
}
.light-box {
  transition-duration: 350ms;
  transition-timing-function: ease-out;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  inset: 0px;
  z-index: 10070;
  background-color: rgba(0, 0, 0, 0.5);
}
.calendar {
  width: 100%;
  z-index: 10075;
  position: fixed;
  box-sizing: border-box;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: white;
}
.calendar header {
  display: flex;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  justify-content: center;
  line-height: 40px;
}
.calendar header .title {
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
}
.calendar section {
  padding: 0px 12px 12px 12px;
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  background-image: linear-gradient(
    rgba(192, 192, 192, 0.2) 40px,
    rgba(0, 0, 0, 0) 0%
  );
}
.calendar section > ul {
  user-select: none;
  flex-grow: 1;
  overflow: hidden;
  padding: 80px 0px;
  margin: 0;
  cursor: pointer;
}
.calendar section li {
  line-height: 40px;
  height: 40px;
  display: block;
  text-align: center;
}
.calendar-mask {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      180deg,
      hsla(0, 0%, 100%, 0.95),
      hsla(0, 0%, 100%, 0.6)
    ),
    linear-gradient(0deg, hsla(0, 0%, 100%, 0.95), hsla(0, 0%, 100%, 0.6));
  background-position: top, bottom;
  background-size: 100% 102px;
  background-repeat: no-repeat;
  background-size: 100% 80px;
}
.calender-cancel,
.calender-submit {
  cursor: pointer;
  padding: 0px 16px;
}
.calender-cancel {
  color: gray;
}
.calender-submit {
  color: rgb(14 165 233);
}
</style>
