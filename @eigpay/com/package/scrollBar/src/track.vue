<template>
  <transition :name="cssName('scrollbar-track')">
    <div
      v-show="(visible || alwaysShow) && scale < 1"
      ref="trackRef"
      :class="[
        ns.e('track'),
        ns.is('vertical', props.direction === 'vertical'),
        ns.is('horizontal', props.direction === 'horizontal')
      ]"
      @mousedown="handleTrackClick"
    >
      <div
        ref="thumbRef"
        :class="ns.e('thumb')"
        :style="thumbStyle"
        @mousedown.stop="handleThumbMousedown"
      ></div>
    </div>
  </transition>
</template>
<script setup>
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  onBeforeUnmount,
  watch,
  nextTick
} from 'vue'
import { componetName } from '@package/constant'
import { buildCssNamespace } from '../../util'
import { cssName } from '../../constant'
import { scrollBarKey } from './lib'
import { useEventListener } from '@vueuse/core'

const ns = buildCssNamespace('scrollbar')
const DirectionMap = {
  vertical: {
    axis: 'Y',
    client: 'clientY',
    size: 'height',
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    direction: 'top'
  },
  horizontal: {
    axis: 'X',
    client: 'clientX',
    size: 'width',
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    direction: 'left'
  }
}
defineComponent({
  name: componetName('ScrollTrack')
})
const props = defineProps({
  direction: {
    // 滚动条方向
    type: String,
    default: 'vertical'
  },
  scale: {
    // thumb 缩放比例
    type: Number,
    default: 1
  },
  alwaysShow: {
    // 是否一直显示滚动条
    type: Boolean,
    default: false
  },
  thumbMinSize: {
    type: Number,
    default: 20
  }
})
const scrollContext = inject(scrollBarKey)
const move = ref(0)
const trackRef = ref(null)
const thumbRef = ref(null)
let translateRecord = 0
const eleAttrMap = DirectionMap[props.direction]

const thumbStyle = ref({})
const computeThumbStyle = () => {
  const trackOffset = trackRef.value && trackRef.value[eleAttrMap.offset] // 整个滚动条的size
  let size
  if (trackOffset) {
    size = trackOffset * props.scale
  }
  const originSize = size
  // 如果计算出来滑块的size小于了设定的最小值，使它固定为设定的最小值
  if (size < props.thumbMinSize) {
    size = props.thumbMinSize
  }
  let translateValue = (move.value * originSize) / 100 // 按照比例滑块应该偏移的量

  // 如果滑块使用了固定值20，也是按比例运算出来的滑块的size小于了设定的最小值，但又给它赋值设定的最小值时
  // 偏移量应该考虑加上校正，校正的算法是，按比例计算出来的偏移量比上整个滚动条的高度, 再乘以滑块的比例计算高度与实际应用高度之差
  translateValue =
    translateValue + (translateValue / trackOffset) * (originSize - size)
  translateRecord = translateValue
  translateValue += 'px'
  const translate = (
    eleAttrMap.axis === 'X' ? [translateValue, 0] : [0, translateValue]
  ).join(' ')

  thumbStyle.value = {
    [eleAttrMap.size]: `${size}px`,
    translate
    // transform: `translate${eleAttrMap.axis}(${move.value}%)`
  }
}
const thumbState = {
  X: {},
  Y: {}
}
const visible = ref(false) // 是否可见
let cursorIn = false // 鼠标是否在滚动区内
let cursorDown = false // 鼠标是否在thumb上被按下
const handleScroll = (wrapElement) => {
  if (!wrapElement) {
    return
  }
  const scroll = wrapElement[eleAttrMap.scroll]
  const offset = wrapElement[eleAttrMap.offset]
  // 移动的位置相当于，scrollTop/offsetHeight 或是 scrollLeft/offsetWidth
  move.value = (scroll / offset) * 100
}

const handleTrackClick = (e) => {
  const position = e[eleAttrMap.client]
  const start = trackRef.value.getBoundingClientRect()[eleAttrMap.direction]
  const offset = position - start
  const thumbHalf = thumbRef.value[eleAttrMap.offset] / 2

  const wrapElement = scrollContext.wrapElement.value
  wrapElement[eleAttrMap.scroll] = (offset - thumbHalf) / props.scale
}
// thumb被按下，准备处理拖动事件
const handleThumbMousedown = (e) => {
  const { ctrlKey, button, currentTarget: el } = e
  if (ctrlKey || [1, 2].includes(button)) {
    return
  }

  window.getSelection()?.removeAllRanges()
  startDrag(e)

  if (!el) return
  thumbState[eleAttrMap.axis] = {
    cursor: e[eleAttrMap.client],
    [eleAttrMap.direction]: translateRecord
  }
}
// 鼠标按下并移动的处理逻辑
const handleMouseMove = (e) => {
  if (cursorDown === false) return
  const prevPage = thumbState[eleAttrMap.axis]
  if (!prevPage) return

  const position = e[eleAttrMap.client]
  // const start = trackRef.value.getBoundingClientRect()[eleAttrMap.direction]
  const offset = position - thumbState[eleAttrMap.axis]?.cursor

  const wrapElement = scrollContext.wrapElement.value
  wrapElement[eleAttrMap.scroll] =
    (thumbState[eleAttrMap.axis][eleAttrMap.direction] + offset) / props.scale
}
let mouseUpHandleStop
let mouseMoveHandleStop
let originalOnSelectStart
// 做开始拖动thumb的准备，在document上注册鼠标滑动和鼠标抬起的事件
const startDrag = (e) => {
  e.stopImmediatePropagation()
  cursorDown = true
  mouseMoveHandleStop = useEventListener(document, 'mousemove', handleMouseMove)
  mouseUpHandleStop = useEventListener(
    document,
    'mouseup',
    mouseUpDocumentHandler
  )
  originalOnSelectStart = document.onselectstart
  document.onselectstart = () => false
}

// 在document上鼠标抬起, 取消事件监听
const mouseUpDocumentHandler = () => {
  cursorDown = false
  thumbState[eleAttrMap.axis] = 0
  mouseMoveHandleStop?.()
  mouseUpHandleStop?.()
  restoreOnselectstart()
  if (!cursorIn) visible.value = false
}

// 恢复原有document上注册的选择事件
const restoreOnselectstart = () => {
  if (document.onselectstart !== originalOnSelectStart)
    document.onselectstart = originalOnSelectStart
}
// 鼠标划入可滚动区
const moveInScrollArea = () => {
  cursorIn = true
  visible.value = props.scale < 1
}
// 鼠标划出入可滚动区
const moveOutScollArea = () => {
  cursorIn = false
  visible.value = cursorDown // 是否显示，取决于鼠标是否在拖到thumb
}
useEventListener(scrollContext.scrollElement, 'mousemove', moveInScrollArea)
useEventListener(scrollContext.scrollElement, 'mouseleave', moveOutScollArea)

onBeforeUnmount(() => {
  restoreOnselectstart()
  mouseUpHandleStop?.()
})
// 显示或是，有滚动，或是比例变化时重新计算thumb的大小和位置
watch([visible, move, () => props.scale], async () => {
  await nextTick()
  computeThumbStyle()
})
onMounted(() => {
  computeThumbStyle()
})
defineExpose({
  handleScroll
})
</script>
