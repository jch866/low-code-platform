<template>
  <Transition
    :name="ns.b('fade')"
    @before-leave="onClose(currentInstance.uid)"
    @after-leave="onDestory()"
  >
    <div
      v-show="visible"
      ref="messageRef"
      :class="[
        ns.b(),
        ns.is(currentType, true),
        ns.is(currentStyleType, true),
        ns.is('nocenter', !isIconCenter),
        customClass
      ]"
      :style="customStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div :class="ns.e('icon')">
        <slot name="icon">
          <ep-icon :icon="iconName"></ep-icon>
        </slot>
      </div>
      <div :class="ns.e('content')">
        <slot>{{ message }}</slot>
      </div>
      <ep-icon
        v-if="isShowCloseBtn"
        :class="ns.e('closeBtn')"
        icon="ep-i-cross"
        @click.stop="close"
      ></ep-icon>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, onMounted, getCurrentInstance } from 'vue'
import { buildCssNamespace } from '@package/util'
import { EpIcon } from '../../index'
import { useTimeoutFn, useResizeObserver } from '@vueuse/core'
import { getLastOffset } from './instance'
const props = defineProps({
  message: {
    type: [String, Function],
    default: ''
  },
  type: {
    type: String,
    values: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  icon: {
    type: [String, Function],
    default: ''
  },
  customClass: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  },
  showClose: Boolean,
  onClose: {
    type: Function,
    default: undefined
  },
  onDestory: {
    type: Function,
    default: undefined
  },
  offset: {
    type: Number,
    default: 20
  },
  appendTo: {
    type: [String, HTMLElement],
    default: document.body
  },
  styleType: {
    type: String,
    values: ['message', 'pagetip'],
    default: 'message'
  },
  iconCenter: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 100
  }
})

const ns = buildCssNamespace('message')
const messageRef = ref()
const visible = ref(false)
const currentHeight = ref(0)

const currentInstance = getCurrentInstance()
const currentType = computed(() => props.type)
const currentStyleType = computed(() => props.styleType)
const isIconCenter = computed(() => props.iconCenter)
const isShowCloseBtn = computed(() => props.showClose)
const lastOffset = computed(() => getLastOffset(currentInstance.uid))
const offset = computed(() => props.offset + lastOffset.value)
const bottom = computed(() => currentHeight.value + offset.value)
const customStyle = computed(() => {
  return { top: `${offset.value}px`, zIndex: props.zIndex }
})

useResizeObserver(messageRef, () => {
  currentHeight.value = messageRef.value.getBoundingClientRect().height
})

const iconName = computed(() => {
  let icon = ''
  if (props.icon) {
    icon = props.icon
  } else {
    if (props.type === 'info') {
      icon = 'ep-i-cycle-solid-exclamation-mark-inverted'
    } else if (props.type === 'success') {
      icon = 'ep-i-cycle-solid-tick'
    } else if (props.type === 'warning') {
      icon = 'ep-i-cycle-solid-exclamation-mark'
    } else if (props.type === 'error') {
      icon = 'ep-i-solid-cycle-cross'
    }
  }
  return icon
})

let timer = undefined

const close = () => {
  visible.value = false
}

const clearTimer = () => {
  timer && timer.stop()
}

const startTimer = () => {
  if (props.duration === 0) return
  timer = useTimeoutFn(() => {
    close()
  }, props.duration)
}

onMounted(() => {
  startTimer()
  visible.value = true
})

defineExpose({
  visible,
  bottom,
  close
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Message')
}
</script>
