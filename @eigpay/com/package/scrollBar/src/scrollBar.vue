<template>
  <div ref="scrollElement" :class="ns.b()">
    <div
      ref="wrapElement"
      :class="ns.e('wrapper')"
      :style="computedWrapperStyle"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resizeRef"
        :class="[ns.e('wrapper__view'), viewClass]"
        :style="viewStyle"
      >
        <slot />
      </component>
    </div>
    <virtual-bar
      ref="verticalBar"
      direction="vertical"
      :scale="scaleY"
      :always-show="alwaysShow"
      :thumb-min-size="thumbMinSize"
    />
    <virtual-bar
      ref="horizontalBar"
      direction="horizontal"
      :scale="scaleX"
      :always-show="alwaysShow"
      :thumb-min-size="thumbMinSize"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, nextTick, onUpdated, provide } from 'vue'
import { buildCssNamespace } from '../../util'
import isObject from 'lodash/isObject'
import isNumber from 'lodash/isNumber'
import VirtualBar from './track.vue'
import { scrollBarKey } from './lib'
import { useResizeObserver } from '@vueuse/core'

const scrollElement = ref(null)
const wrapElement = ref(null)
const resizeRef = ref(null)
const verticalBar = ref(null)
const horizontalBar = ref(null)

const ns = buildCssNamespace('scrollbar')
const props = defineProps({
  tag: {
    type: String,
    default: 'div'
  },
  wrapStyle: {
    type: [String, Array, Object],
    default: ''
  },
  viewStyle: {
    type: [String, Array, Object],
    default: ''
  },
  thumbMinSize: {
    type: Number,
    default: 20
  },
  height: {
    type: Number,
    default: undefined
  },
  maxHeight: {
    type: Number,
    default: undefined
  },
  alwaysShow: {
    // 是否一直显示滚动条
    type: Boolean,
    default: false
  },
  viewClass: {
    type: [String, Array],
    default: ''
  }
})

const emit = defineEmits(['scroll'])

const computedWrapperStyle = computed(() => {
  const style = {}
  if (props.height) {
    style.height = props.height + 'px'
  }
  if (props.maxHeight) {
    style.maxHeight = props.maxHeight + 'px'
  }
  return [props.wrapStyle, style]
})

const handleScroll = () => {
  if (wrapElement.value) {
    verticalBar.value?.handleScroll(wrapElement.value)
    horizontalBar.value?.handleScroll(wrapElement.value)
    emit('scroll', {
      scrollTop: wrapElement.value.scrollTop,
      scrollLeft: wrapElement.value.scrollLeft
    })
  }
}
const scrollTo = (left, top) => {
  if (isObject(left)) {
    wrapElement.value?.scrollTo(left)
  } else if (isNumber(left) && isNumber(top)) {
    wrapElement.value?.scrollTo(left, top)
  }
}

const scaleY = ref(1)
const scaleX = ref(1)

const update = () => {
  if (!wrapElement.value) {
    return
  }
  const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } =
    wrapElement.value

  scaleX.value = offsetWidth / scrollWidth
  scaleY.value = offsetHeight / scrollHeight
}
useResizeObserver(resizeRef, update)
onMounted(async () => {
  await nextTick()
  update()
})
onUpdated(() => update())

provide(scrollBarKey, {
  wrapElement,
  scrollElement
})

defineExpose({
  scrollTo,
  wrapElement,
  scrollElement,
  handleScroll
})
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('ScrollBar')
}
</script>
