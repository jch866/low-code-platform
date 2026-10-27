<template>
  <div :class="[ns.b(), ns.is(`${shadow}-shadow`, true)]">
    <div v-if="slotHeader || !!header" :class="ns.e('header')">
      <slot name="header">{{ header }}</slot>
    </div>
    <div :class="ns.e('body')" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useSlots } from 'vue'
import { buildCssNamespace } from '@package/util'
defineProps({
  header: {
    type: String,
    default: ''
  },
  bodyStyle: {
    type: Object,
    default: undefined
  },
  shadow: {
    type: String,
    values: ['always', 'hover', 'never'],
    default: 'always'
  }
})
const ns = buildCssNamespace('card')
const slotHeader = !!useSlots().header
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Card')
}
</script>
