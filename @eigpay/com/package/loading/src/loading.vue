<template>
  <Transition name="ep-loading-fade" @after-leave="afterLeave">
    <div
      v-show="visible"
      ref="epNormalLoadingRef"
      :class="ns.b()"
      :style="{ zIndex: zIndex }"
    >
      <div
        :class="[
          ns.e('overlay'),
          ns.is('modal', modal),
          ns.is('body', isAppendToBody)
        ]"
        :style="computedBackgroundStyle"
      >
        <div :class="[ns.e('icon'), ns.b('iconAnimation'), animationClass]">
          <div v-if="!icon" :class="ns.e('loaderImage')"></div>
          <slot name="icon">
            <ep-icon :icon="iconName" size="40" color="#fff"></ep-icon>
          </slot>
        </div>
        <div
          v-if="!!text"
          :class="[ns.e('textlabel')]"
          :style="computedTextStyle"
        >
          {{ text }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { buildCssNamespace } from '@package/util'
import { useScrollLock } from '@vueuse/core'
import { EpIcon } from '../../index'

const props = defineProps({
  target: {
    type: String,
    default: 'body'
  },
  modal: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: '加载中...'
  },
  textColor: {
    type: String,
    default: '#fff'
  },
  background: {
    type: String,
    default: 'rgba(0, 0, 0, 0.2)'
  },
  icon: {
    type: [String, Function],
    default: ''
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 2000
  },
  animationClass: {
    type: String,
    default: ''
  }
})

const epNormalLoadingRef = ref()
const ns = buildCssNamespace('loading')
const isLocked = useScrollLock(document.body)
const visible = ref(false)
const iconName = computed(() => {
  let icon = ''
  if (props.icon) {
    icon = props.icon
  }
  return icon
})
const isAppendToBody = computed(() => props.target === 'body')
const computedTextStyle = computed(() => ({ color: props.textColor }))
const computedBackgroundStyle = computed(() =>
  props.modal ? { backgroundColor: props.background } : {}
)

const close = () => {
  visible.value = false
}

const show = () => {
  if (props.target === 'body' && props.lockScroll) {
    // 如果添加到body上，需要锁定不能滚动
    isLocked.value = true
  }
  visible.value = true
}

const afterLeave = () => {
  isLocked.value = false
  if (props.target !== 'body') {
    epNormalLoadingRef.value && epNormalLoadingRef.value.remove()
  }
}

defineExpose({
  show,
  close
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Loading')
}
</script>
