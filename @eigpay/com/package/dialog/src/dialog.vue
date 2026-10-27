<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition name="ep-dialog-fade" @after-leave="afterLeave">
      <div v-show="visible" :class="ns.b()" :style="{ zIndex: zIdx }">
        <div
          :class="[ns.e('overlay'), ns.is('modal', modal)]"
          :style="{ display: alignCenter ? 'flex' : 'block' }"
          @click="clickedOverlay"
        >
          <div
            :class="[
              ns.e('content'),
              ns.is('fullscreen', fullscreen),
              ns.is('center', center),
              ns.is('align-center', alignCenter)
            ]"
            :style="contentStyle"
            @click.stop="() => undefined"
          >
            <div
              v-if="showClose"
              :class="ns.e('closebtn')"
              @click="handleClose"
            >
              <ep-icon icon="ep-i-delete"></ep-icon>
            </div>
            <header
              v-if="!!title || !!useSlots().header"
              :class="ns.e('header')"
            >
              <slot name="header">
                <span :class="ns.e('title')">{{ title }}</span>
              </slot>
            </header>
            <div :class="ns.e('body')">
              <slot></slot>
            </div>
            <footer v-if="!!useSlots().footer" :class="ns.e('footer')">
              <slot name="footer"></slot>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useSlots, ref, watch, computed } from 'vue'
import { buildCssNamespace, useZIndex } from '@package/util'
import isFinite from 'lodash/isFinite'
import isUndefined from 'lodash/isUndefined'
import isString from 'lodash/isString'
import { useScrollLock, onKeyStroke } from '@vueuse/core'
import { dialogLevel } from './dialogLib.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: ''
  },
  fullscreen: Boolean,
  top: {
    type: String,
    default: ''
  },
  modal: {
    type: Boolean,
    default: true
  },
  appendToBody: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  beforeClose: {
    type: Function,
    default: undefined
  },
  zIndex: {
    type: Number,
    default: undefined
  },
  center: Boolean,
  alignCenter: Boolean,
  destoryOnClose: Boolean
})
const { nextZIndex } = useZIndex()

const zIdx = ref(props.zIndex || nextZIndex())

const emits = defineEmits(['update:modelValue', 'open', 'close'])
const ns = buildCssNamespace('dialog')
// 使用 useScrollLock 方法，将`document.body`滚动锁定
const isLocked = useScrollLock(document.body)
isLocked.value = false
const visible = ref(props.modelValue)

const openDialog = () => {
  visible.value = true
  emits('update:modelValue', true)
  emits('open')
}

const closeDialog = () => {
  visible.value = false
  emits('update:modelValue', false)
  emits('close')
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      dialogLevel.value++
      isLocked.value = props.lockScroll
      if (visible.value !== props.modelValue) {
        openDialog()
      }
      zIdx.value = props.zIndex ? zIdx.value++ : nextZIndex()
    } else {
      dialogLevel.value--
      if (visible.value !== props.modelValue) {
        closeDialog()
      }
    }
  }
)

const afterLeave = () => {
  if (dialogLevel.value === 0) {
    isLocked.value = false
  }
}

onKeyStroke(['Escape'], () => {
  if (!props.closeOnPressEscape) return
  closeDialog()
})

const contentStyle = computed(() => {
  let widthStyle
  if (!isUndefined(props.width)) {
    if (isString(props.width)) {
      widthStyle = props.width
    } else if (isFinite(props.width)) {
      widthStyle = `${props.width}px`
    }
  }
  return { width: widthStyle, marginTop: props.top }
})

const clickedOverlay = () => {
  if (!props.closeOnClickModal) return
  handleClose()
}

function handleClose() {
  if (props.beforeClose) {
    props.beforeClose(closeDialog)
  } else {
    closeDialog()
  }
}
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Dialog')
}
</script>
