<template>
  <tooltip-trigger>
    <slot />
  </tooltip-trigger>
  <tooltip-content :is-open="isOpen" @click-out-side="handleClickOutSide">
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
  </tooltip-content>
</template>
<script setup>
import {
  ref,
  reactive,
  toRefs,
  provide,
  watch,
  nextTick,
  onBeforeUnmount
} from 'vue'
import { tooltipContextKey } from './tooltip.js'
import tooltipTrigger from './tooltipTrigger.vue'
import tooltipContent from './tooltipContent.vue'
import { createPopper } from '@popperjs/core'

const props = defineProps({
  disabled: Boolean,
  pure: Boolean,
  trigger: {
    type: String,
    default: 'hover'
  },
  content: {
    type: String,
    default: ''
  },
  effect: {
    type: String,
    default: 'dark'
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  showAfter: {
    type: Number,
    default: 0
  },
  hideAfter: {
    type: Number,
    default: 200
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  teleported: {
    type: Boolean,
    default: true
  },
  placement: {
    type: String,
    default: 'top'
  },
  offset: {
    type: Number,
    default: 0
  },
  clickOutSideToHide: {
    type: Boolean,
    default: true
  },
  popperClass: {
    type: String,
    default: ''
  }
})

const isOpen = ref(props.modelValue)

const triggerRef = ref(null)

const contentRef = ref(null)

const popperInstanceRef = ref()

const emit = defineEmits(['update:modelValue', 'show', 'hide'])

const timeIdForClose = ref(-1)

const openPopper = () => {
  if (props.disabled) return
  if (timeIdForClose.value !== -1) {
    clearTimeout(timeIdForClose.value)
  }
  setTimeout(() => {
    isOpen.value = true
  }, props.showAfter)
}

const closePopper = () => {
  if (props.disabled) return
  timeIdForClose.value = setTimeout(() => {
    isOpen.value = false
  }, props.hideAfter)
}

const onMouseenter = () => {
  openPopper()
}

const onMouseleave = () => {
  closePopper()
}

const onClick = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const onFocus = () => {
  openPopper()
}

const onBlur = () => {
  closePopper()
}

const handleClickOutSide = (e) => {
  //是否点击外部隐藏
  if (!props.clickOutSideToHide) return
  //triggerRef.value为null时下面会报错
  //当将content加到其他网页元素上的时候，则点击trigger将会和onClick事件冲突。则对点击事件是否在trigger上，做了以下判断
  if (triggerRef.value && !triggerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

// mouseenter、mouseout、mouseover、mouseleave不触发父级的emit更新v-model事件，故写此法
watch(
  () => isOpen.value,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      popperInstanceRef.value?.destroy()
      popperInstanceRef.value = createPopper(
        triggerRef.value,
        contentRef.value,
        {
          placement: props.placement,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, props.offset]
              }
            }
          ]
        }
      )
      setTimeout(() => {
        popperInstanceRef.value.update()
      }, 200)
    } else {
      popperInstanceRef.value?.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: false }
        ]
      }))
    }
    emit('update:modelValue', newVal)
    emit(newVal ? 'show' : 'hide')
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  popperInstanceRef.value?.destroy()
})

// 用来监听当点击弹出框中的选项时，弹出框隐藏
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal
  }
)
const updatePopper = () => {
  popperInstanceRef.value?.update?.()
}
const isActiveElementInContent = () => {
  const contentEl = contentRef.value
  return contentEl.contains?.(document.activeElement)
}
provide(tooltipContextKey, {
  triggerRef,
  contentRef,
  ...reactive({
    ...toRefs(props),
    onMouseenter,
    onMouseleave,
    onClick,
    onFocus,
    onBlur
  })
})

defineExpose({
  updatePopper,
  isActiveElementInContent
})
</script>
<script>
import { componetName } from '@package/constant'

export default {
  name: componetName('Tooltip')
}
</script>
