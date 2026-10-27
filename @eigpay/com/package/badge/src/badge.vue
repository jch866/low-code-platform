<template>
  <div :class="ns.b()">
    <slot />
    <span
      v-show="!hidden && (content || isDot)"
      :class="[
        ns.e('content'),
        ns.em('content', type),
        ns.is('fixed', content && !!useSlots().default),
        ns.is('dot', isDot),
        ns.is(placement, isDot)
      ]"
      :style="dotStyle"
    >
      {{ content }}
    </span>
  </div>
</template>

<script setup>
import { buildCssNamespace } from '@package/util'
import { useSlots, computed } from 'vue'
import isNumber from 'lodash/isNumber'

const props = defineProps({
  isDot: Boolean,
  hidden: Boolean,
  value: {
    type: [String, Number],
    default: ''
  },
  max: {
    type: Number,
    default: 99
  },
  color: {
    type: String,
    default: ''
  },
  space: {
    type: Number,
    default: undefined
  },
  type: {
    type: String,
    values: ['success', 'error', 'warning', 'processing', 'default'],
    default: 'warning'
  },
  placement: {
    type: String,
    values: [
      'top',
      'left',
      'right',
      'bottom',
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right'
    ],
    default: 'top-right'
  }
})

const ns = buildCssNamespace('badge')
const content = computed(() => {
  if (props.isDot) {
    return ''
  }
  if (isNumber(props.value) && isNumber(props.max)) {
    return props.value > props.max ? `${props.max}+` : `${props.value}`
  }
  return props.value
})

const dotStyle = computed(() => {
  const isShowSpace = props.placement === 'left' || props.placement === 'right'
  return {
    backgroundColor: props.color,
    [props.placement]: isShowSpace
      ? props.space
        ? `-${props.space}px`
        : undefined
      : undefined
  }
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Badge')
}
</script>
