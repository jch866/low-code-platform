<template>
  <div
    :class="[
      ns.b(),
      ns.m(type),
      ns.is(status, true),
      { [ns.m('without-text')]: !showText, [ns.m('text-inside')]: textInside }
    ]"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div v-if="type === 'line'" :class="ns.b('bar')">
      <div
        :class="processBe('bar', 'outer')"
        :style="{ height: `${strokeWidth}px` }"
      >
        <div :class="processBe('bar', 'inner')" :style="barStyle">
          <div
            v-if="(showText || slotDefault) && textInside"
            :class="processBe('bar', 'innerText')"
          >
            <slot :percentage="percentage">{{ content }}</slot>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      :class="ns.b('circle')"
      :style="{ height: `${width}px`, width: `${width}px` }"
    >
      <!-- 
        定义的画布尺寸是 width * width px, viewBox属性定义了画布上可以显示的区域：
        从(0,0)开始，100 * 100的区域，这个区域会被放在`witdh*width`的画布上显示。形成放大或缩小的效果
      -->
      <svg viewBox="0 0 100 100">
        <path
          :class="processBe('circle', 'track')"
          :d="trackPath"
          :stroke="STATUS_COLOR_MAP.placeholder"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="trailPathStyle"
        />
        <path
          :class="processBe('circle', 'path')"
          :d="trackPath"
          :stroke="getCurrentColor"
          fill="none"
          :opacity="percentage ? 1 : 0"
          :stroke-linecap="strokeLinecap"
          :stroke-width="relativeStrokeWidth"
          :style="circlePathStyle"
        />
      </svg>
    </div>
    <div v-if="(showText || slotDefault) && !textInside" :class="ns.e('text')">
      <slot :percentage="percentage">
        <span v-if="isShowPercentageContent">{{ content }}</span>
        <ep-icon
          v-else
          :icon="statusIcon"
          :color="statusIconColor"
          size="12"
        ></ep-icon>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { useSlots, computed } from 'vue'
import { buildCssNamespace } from '@package/util'
const props = defineProps({
  type: {
    type: String,
    default: 'line',
    values: ['line', 'circle', 'dashboard']
  },
  percentage: {
    type: Number,
    default: 0,
    validator: (val) => val >= 0 && val <= 100
  },
  status: {
    type: String,
    default: '',
    values: ['paused', 'error', 'warning', 'success']
  },
  strokeWidth: {
    type: Number,
    default: 6
  },
  strokeLinecap: {
    type: String,
    default: 'round',
    values: ['round', 'butt', 'square']
  },
  textInside: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 126
  },
  showText: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: ''
  },
  format: {
    type: Function,
    default: (percentage) => `${percentage}%`
  }
})
const ns = buildCssNamespace('progress')
const slotDefault = !!useSlots().default
const STATUS_COLOR_MAP = {
  paused: '#C9CDD4',
  error: '#f53f3f',
  warning: '#ff7d00',
  success: '#00b42a',
  default: '#0163CA',
  placeholder: '#EEEEEE'
}

const processBe = (blockSuffix, element) => {
  const b = ns.b(blockSuffix)
  if (element) {
    return `${b}__${element}`
  } else {
    return b
  }
}

const barStyle = computed(() => ({
  width: `${props.percentage}%`,
  animationDuration: `3s`,
  backgroundColor: getCurrentColor.value
}))

// 根据画布比例计算相对的`strokeWidth`
const relativeStrokeWidth = computed(() => {
  return ((props.strokeWidth / props.width) * 100).toFixed(1)
})

//圆环半径
const radius = computed(() => {
  if (['circle', 'dashboard'].includes(props.type)) {
    return Number.parseInt(
      `${50 - Number.parseFloat(relativeStrokeWidth.value) / 2}`
    )
  }
  return 0
})

const trackPath = computed(() => {
  const r = radius.value
  const isDashboard = props.type === 'dashboard'
  return `
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${r}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? '-' : ''}${r * 2}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? '' : '-'}${r * 2}
          `
})

// 计算圆环周长
const perimeter = computed(() => 2 * Math.PI * radius.value)

// dashboard占总圆环的75%，270°
const rate = computed(() => (props.type === 'dashboard' ? 0.75 : 1))

const stokeDashoffset = computed(() => {
  const offset = (-1 * perimeter.value * (1 - rate.value)) / 2
  return `${offset}px`
})

// strokeDasharray 虚线描边
// strokeDashoffset 虚线偏移量
/**
 * 当是circle时
 * {
    strokeDasharray:'perimeter,perimeter',
    strokeDashoffset:0
   }

   当是dashboard时
   {
    strokeDasharray:'perimeter * 0.75,perimeter',
    strokeDashoffset:-0.25*perimeter/2
   }
 */
const trailPathStyle = computed(() => {
  return {
    strokeDasharray: `${perimeter.value * rate.value}px, ${perimeter.value}px`,
    strokeDashoffset: stokeDashoffset.value
  }
})

const circlePathStyle = computed(() => {
  return {
    strokeDasharray: `${
      perimeter.value * rate.value * (props.percentage / 100)
    }px, ${perimeter.value}px`,
    strokeDashoffset: stokeDashoffset.value,
    transition:
      'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease, opacity ease 0.6s'
  }
})

const isShowPercentageContent = computed(() => {
  return (
    props.status !== 'error' &&
    props.status !== 'success' &&
    props.status !== 'warning'
  )
})

// 只有`error`和`warning`，`success`状态有图标
const statusIcon = computed(() => {
  const state = props.status
  if (props.type === 'line') {
    if (state === 'error') {
      return 'ep-i-solid-cycle-cross'
    } else if (state === 'success') {
      return 'ep-i-cycle-solid-tick'
    } else if (state === 'warning') {
      return 'ep-i-cycle-solid-exclamation-mark'
    }
  } else {
    if (state === 'error') {
      return 'ep-i-solid-cycle-cross'
    } else if (state === 'success') {
      return 'ep-i-cycle-solid-tick'
    } else if (state === 'warning') {
      return 'ep-i-cycle-solid-exclamation-mark'
    }
  }
  return ''
})

const statusIconColor = computed(() => {
  return STATUS_COLOR_MAP[props.status]
})

const content = computed(() => props.format(props.percentage))

const getCurrentColor = computed(() => {
  if (props.color) {
    return props.color
  } else {
    return STATUS_COLOR_MAP[props.status] || STATUS_COLOR_MAP.default
  }
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Progress')
}
</script>
