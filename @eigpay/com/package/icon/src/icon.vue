<template>
  <i :class="computedClass" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script setup>
import { computed } from 'vue'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import { buildCssNamespace } from '@package/util'

const props = defineProps({
  size: {
    type: [Number, String],
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})

const ns = buildCssNamespace('icon')
const computedClass = computed(() => {
  const iconClass = props.icon ? `eigpay-icon ${props.icon}` : ''
  const normalClass = ns.b()
  return [iconClass, normalClass]
})

const style = computed(() => {
  const { size, color } = props
  if (!size && !color) return {}
  return {
    fontSize: addUnit(size),
    color
  }
})

const isStringNumber = (val) => {
  return isString(val) && isNumber(Number(val)) && !isNaN(val)
}

function addUnit(value, defaultUnit = 'px') {
  if (!value) return ''
  if (isNumber(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`
  } else if (isString(value)) {
    return value
  }
}
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Icon')
}
</script>
