<template>
  <div ref="normalRadioGroupRef" :class="ns.b()">
    <slot />
  </div>
</template>
<script setup>
import {
  computed,
  watch,
  reactive,
  toRefs,
  provide,
  inject,
  nextTick
} from 'vue'
import { radioGroupKey } from './radio'
import { generateId } from '@package/util'
import { buildCssNamespace } from '../../util'
import { formItemContextKey } from '@package/form/src/formLib'
import get from 'lodash/get'
import noop from 'lodash/noop'
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  validateEvent: {
    type: Boolean,
    default: true
  }
})
const ns = buildCssNamespace('radio-group')
const emit = defineEmits(['update:modelValue', 'change'])
const radioId = generateId('radio')
const name = computed(() => {
  return props.name || radioId
})

//formItemContext
const formItemContext = inject(formItemContextKey, undefined)

const changeEvent = (value) => {
  emit('update:modelValue', value)
  nextTick(() => emit('change', value))
}

provide(
  radioGroupKey,
  reactive({
    ...toRefs(props),
    changeEvent,
    name
  })
)

watch(
  () => props.modelValue,
  () => {
    if (props.validateEvent) {
      const validate = get(formItemContext, 'validate')
      validate && validate('change').catch(noop)
    }
  }
)
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('RadioGroup')
}
</script>
