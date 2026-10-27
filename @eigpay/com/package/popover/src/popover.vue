<template>
  <div :class="ns.b()">
    <ep-tooltip
      :trigger="trigger"
      :disabled="disabled"
      :model-value="modelValue"
      :content="content"
      :show-after="showAfter"
      :hide-after="hideAfter"
      :show-arrow="showArrow"
      :effect="effect"
      :teleported="teleported"
      :placement="placement"
      @show="handleShow"
      @hide="handleHide"
    >
      <template v-if="$slots.reference">
        <slot name="reference" />
      </template>

      <template #content>
        <div
          v-if="title"
          :class="[
            ns.e('title'),
            ns.is('dark', effect === 'dark'),
            ns.is('light', effect === 'light')
          ]"
        >
          {{ title }}
        </div>
        <slot>
          <!-- slot中的子元素，不能简写为content，否则找不到 -->
          {{ props.content }}
        </slot>
      </template>
    </ep-tooltip>
  </div>
</template>
<script setup>
import { buildCssNamespace } from '../../util'

const props = defineProps({
  disabled: Boolean,
  trigger: {
    type: String,
    default: 'hover'
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  effect: {
    type: String,
    default: 'dark'
  },
  showArrow: {
    type: Boolean,
    default: true
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
  teleported: {
    type: Boolean,
    default: true
  },
  placement: {
    type: String,
    default: 'bottom'
  },
  offset: {
    type: Number,
    default: 0
  }
})

const ns = buildCssNamespace('popover')

const emit = defineEmits(['show', 'hide', 'update:modelValue'])

const handleShow = () => {
  emit('update:modelValue', true)
  emit('show')
}

const handleHide = () => {
  emit('update:modelValue', false)
  emit('hide')
}
</script>
<script>
import { componetName } from '@package/constant'

export default {
  name: componetName('Popover')
}
</script>
