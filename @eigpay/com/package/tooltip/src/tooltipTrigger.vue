<template>
  <slot />
</template>
<script>
import { inject, onMounted, getCurrentInstance } from 'vue'
import { tooltipContextKey } from './tooltip.js'
import { useEventListener } from '@vueuse/core'
// import { buildCssNamespace } from '../../util'
import { componetName } from '@package/constant'

export default {
  name: componetName('TooltipTrigger'),
  setup() {
    const {
      trigger,
      disabled,
      triggerRef,
      onMouseenter,
      onMouseleave,
      onClick,
      onFocus,
      onBlur
    } = inject(tooltipContextKey, undefined)

    // const ns = buildCssNamespace('tooltip__trigger')
    const vm = getCurrentInstance()

    onMounted(() => {
      let reference = vm.proxy.$el

      if (reference && reference.nodeType === 3) {
        reference = reference.nextElementSibling
      }
      if (!reference) {
        reference = vm.proxy.$el?.parentElement
      }
      triggerRef.value = reference
      const slotEl = triggerRef.value
      if (disabled && slotEl) {
        return
      }
      if (trigger === 'hover') {
        useEventListener(slotEl, 'mouseenter', onMouseenter)
        useEventListener(slotEl, 'mouseleave', onMouseleave)
      }
      if (trigger === 'click') {
        useEventListener(slotEl, 'click', onClick)
      }
      if (trigger === 'focus') {
        useEventListener(slotEl, 'focus', onFocus)
        useEventListener(slotEl, 'blur', onBlur)
      }
    })
  }
}
</script>
