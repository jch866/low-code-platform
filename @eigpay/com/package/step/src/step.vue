<template>
  <div :class="[ns.b(), ns.m(direction)]">
    <slot />
  </div>
</template>

<script setup>
import { provide, getCurrentInstance } from 'vue'
import { stepKey } from './stepLib'
import { buildCssNamespace } from '@package/util'
import { useOrderedChildren } from '../../hooks/useOrderedChildren'

const props = defineProps({
  space: {
    type: [Number, String],
    default: ''
  },
  active: {
    type: Number,
    default: 0
  },
  direction: {
    type: String,
    default: 'horizontal',
    values: ['horizontal', 'vertical']
  },
  background: {
    type: String,
    default: ''
  },
  processBackground: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    values: ['digital', 'dot', 'square'],
    default: 'digital'
  },
  minWidth: {
    type: String,
    default: ''
  },
  alignCenter: Boolean,
  titleLineStraight: Boolean
})

const ns = buildCssNamespace('step')
const vm = getCurrentInstance()
const {
  children: steps,
  addChild: addStepItem,
  removeChild: removeStepItem,
  getInstanceIndex
} = useOrderedChildren(vm, componetName('StepItem'))

provide(stepKey, {
  props,
  steps,
  addStepItem,
  removeStepItem,
  getInstanceIndex
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Step')
}
</script>
