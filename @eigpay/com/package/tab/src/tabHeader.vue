<template>
  <div ref="tabHeaderRef" :class="ns.b()" :style="headerStyle">
    <div :class="ns.e('wrapper')">
      <div ref="wrapperRef" :class="ns.e('wrapper_nav')">
        <div v-if="isXOverflow" :class="ns.e('scroll-operator')">
          <span
            :class="[
              ns.e('scroll-thumb'),
              ns.e('scroll-thumb-left'),
              ns.is('scroll-thumb-disabled', arrivedState.left)
            ]"
            @click="triggerScroll('left')"
          >
            <ep-icon icon="ep-i-arrow-to-right" />
          </span>
          <!-- <span
            :class="[
              ns.e('scroll-thumb'),
              ns.is('scroll-thumb-disabled', arrivedState.right)
            ]"
            @click="triggerScroll('right')"
          >
            <ep-icon icon="ep-i-arrow-to-right" />
          </span> -->
        </div>
        <div ref="scrollRef" :class="ns.e('scroll')">
          <div
            v-if="
              tabContext.type !== 'card' && tabContext.type !== 'border-card'
            "
            :class="ns.e('active-bar')"
            :style="barStyle"
          ></div>
          <div ref="scrollInnerRef" :class="ns.e('scroll-inner')">
            <div
              v-for="item of options"
              :ref="item.isActive ? setItemRef : setNormalItemRef"
              :key="item.name"
              :custom-name="item.name"
              data-type="tab"
              :data-name="totalHeaderInnerTextMap[item.name]"
              :class="[
                ns.m('item'),
                ns.is('disabled', item.disabled),
                ns.is('active', item.isActive),
                ns.is('card', tabContext.type === 'card'),
                ns.is('custom-header', !!item.slots.header)
              ]"
              @click="handleClick($event, item.name, item)"
            >
              <component :is="item.slots.label" v-if="item.slots.label" />
              <component :is="item.slots.header" v-if="item.slots.header" />
              <span v-if="!item.slots.label && !item.slots.header">
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="isXOverflow" :class="ns.e('scroll-operator')">
          <!-- <span
            :class="[
              ns.e('scroll-thumb'),
              ns.e('scroll-thumb-left'),
              ns.is('scroll-thumb-disabled', arrivedState.left)
            ]"
            @click="triggerScroll('left')"
          >
            <ep-icon icon="ep-i-arrow-to-right" />
          </span> -->
          <span
            :class="[
              ns.e('scroll-thumb'),
              ns.is('scroll-thumb-disabled', arrivedState.right)
            ]"
            @click="triggerScroll('right')"
          >
            <ep-icon icon="ep-i-arrow-to-right" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, nextTick, computed, onUnmounted } from 'vue'
import { tabContextKey } from './tab'
import {
  useElementBounding,
  useScroll,
  useIntersectionObserver,
  useResizeObserver
} from '@vueuse/core'
import { buildCssNamespace } from '../../util'

const props = defineProps({
  options: {
    type: Array,
    default() {
      return []
    }
  }
})

const barStyle = ref()

const tabContext = inject(tabContextKey, undefined)

const tabHeaderRef = ref(null)

const activeRef = ref(null)
const scrollRef = ref(null)
const scrollInnerRef = ref(null)
const wrapperRef = ref(null)
const headerIsVisible = ref(false)
const totalHeaderInnerTextMap = ref({})

const headerStyle = tabContext.isSticky
  ? { position: 'sticky', top: 0, zIndex: 10 }
  : {}

const { stop } = useIntersectionObserver(
  tabHeaderRef,
  ([{ isIntersecting }]) => {
    headerIsVisible.value = isIntersecting
  },
  {
    root: window.document
  }
)

const ns = buildCssNamespace('tab-header')

// 动态ref赋值
const setItemRef = (el) => {
  if (el) {
    activeRef.value = el
    totalHeaderInnerTextMap.value[el.getAttribute('custom-name')] = el.innerText
  }
}

const setNormalItemRef = (el) => {
  if (el) {
    totalHeaderInnerTextMap.value[el.getAttribute('custom-name')] = el.innerText
  }
}

const handleClick = ($event, key, item) => {
  const option = props.options.find((val) => val.name === key)

  if (option.disabled) {
    return
  }

  if (option.isActive) {
    return
  }

  option.isActive = true

  const lastOption = props.options.find(
    (val) => val.name === tabContext.modelValue
  )
  lastOption && (lastOption.isActive = false)

  tabContext.handleSelectOption($event, key, item)
  // 如果当前点击元素处在水平位置的边缘，那么使它滚动到可见区域
  const targetEl = $event.target
  if (
    targetEl.clientLeft <= scrollRef.value.clientLeft ||
    targetEl.clientLeft + targetEl.clientWidth >=
      scrollRef.value.clientLeft + scrollRef.value.clientWidth
  ) {
    targetEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    })
  }
}

const scrollBarBounding = useElementBounding(wrapperRef)

const scrollWidth = ref(0)

const tabHeaderWidth = ref(0)

// 监听整体tabHeader的宽度变化，重新记录宽度。(屏幕窗口缩放等)
useResizeObserver(tabHeaderRef, () => {
  tabHeaderWidth.value = tabHeaderRef.value.clientWidth
})

useResizeObserver(scrollInnerRef, () => {
  scrollWidth.value = scrollInnerRef.value.scrollWidth
})

// 计算是否超出了header的水平宽度
const isXOverflow = computed(() => {
  return scrollWidth.value > (tabHeaderWidth.value ? tabHeaderWidth.value : 0)
})

const getBarStyle = () => {
  if (!activeRef.value) {
    return {}
  }
  const activeTabBounding = useElementBounding(activeRef.value)
  const activeParent = activeRef.value.parentElement
  // tab标签下指示器的宽度支持自定义, 默认是整个活动标签的宽度
  const width = tabContext.indicatorWidth || activeTabBounding.width.value
  const offset =
    activeTabBounding.left.value -
    activeParent.getBoundingClientRect().left +
    activeParent.scrollLeft +
    (activeTabBounding.width.value - width) / 2

  return {
    width: `${width}px`,
    transform: `translateX(${offset}px)`
  }
}

const { x: horizontal, arrivedState } = useScroll(scrollRef, {
  behavior: 'smooth',
  onStop: () => {
    barStyle.value = getBarStyle()
  }
})

// 点击按钮每次滚动的距离
const triggerScroll = (direction) => {
  if (direction === 'left' && !arrivedState.left) {
    horizontal.value -= scrollBarBounding.width.value / 2
  } else if (direction === 'right' && !arrivedState.right) {
    horizontal.value += scrollBarBounding.width.value / 2
  }
}

watch(
  () => tabContext.modelValue,
  async () => {
    await nextTick()
    if (tabContext.type !== 'card') {
      barStyle.value = getBarStyle()
    }
  },
  { immediate: true }
)
// 当options有变化时重新计算active指示器的位置
watch(
  () => props.options,
  async () => {
    await nextTick()
    if (tabContext.type !== 'card') {
      barStyle.value = getBarStyle()
    }
  }
)
// 当header 可见时重新计算active指示器的位置
watch(
  () => headerIsVisible.value,
  (val) => {
    if (val && tabContext.type !== 'card') {
      barStyle.value = getBarStyle()
    }
  }
)
onUnmounted(() => {
  stop()
})
</script>
