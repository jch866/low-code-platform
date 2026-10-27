<template>
  <teleport :disabled="!teleported" to="body">
    <transition :name="ns.b('expand')">
      <template v-if="isShowRef">
        <div
          v-show="isOpen"
          ref="contentRef"
          :class="contentClass"
          :data-popper-placement="placement"
          :style="{
            zIndex: zIndex
          }"
          @mouseenter="hanldeMouseenter"
          @mouseleave="hanldeMouseleave"
        >
          <slot v-if="$slots.content" name="content" />
          <template v-else>
            {{ content }}
          </template>
          <div
            v-show="showArrow"
            :class="arrowClass"
            :style="calcArrowStyle"
            data-popper-arrow
          ></div>
        </div>
      </template>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, inject, onBeforeUnmount, watch, computed, onMounted } from 'vue'
import { tooltipContextKey } from './tooltip.js'
import { onClickOutside } from '@vueuse/core'
import { buildCssNamespace, useZIndex } from '../../util'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const ns = buildCssNamespace('popper')
const {
  content,
  pure,
  effect,
  showArrow,
  placement,
  teleported,
  contentRef,
  trigger,
  onMouseenter,
  onMouseleave,
  popperClass
} = inject(tooltipContextKey, undefined)

const contentClass = computed(() => [
  ns.b(),
  ns.is('pure', pure),
  ns.is('dark', effect === 'dark' && !popperClass),
  ns.is('light', effect === 'light' && !popperClass),
  popperClass
])

const arrowClass = computed(() => [
  ns.e('arrow'),
  ns.is('dark', effect === 'dark' && !popperClass),
  ns.is('light', effect === 'light' && !popperClass),
  ns.is('custom', popperClass)
])

const arrowBg = ref('')
onMounted(() => {
  // 从popper-content中获取背景色,应用到 arrow 箭头上
  const cssStyle = document.defaultView.getComputedStyle(contentRef.value, null)
  const resultBg = cssStyle.getPropertyValue('background-color')
  arrowBg.value = resultBg || ''
})

const calcArrowStyle = computed(() => {
  return {
    [`--${ns.b()}-custom-arrow-bg`]: arrowBg.value
  }
})

const { nextZIndex } = useZIndex()

const emit = defineEmits(['clickOutSide'])

const isShowRef = ref(true)

const zIndex = ref(nextZIndex())

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      zIndex.value = nextZIndex()
    }
  }
)

onBeforeUnmount(() => {
  isShowRef.value = false
})

onClickOutside(contentRef, (e) => {
  emit('clickOutSide', e)
})
const hanldeMouseenter = () => {
  if (trigger === 'hover') {
    onMouseenter()
  }
}
const hanldeMouseleave = () => {
  if (trigger === 'hover') {
    onMouseleave()
  }
}
</script>
