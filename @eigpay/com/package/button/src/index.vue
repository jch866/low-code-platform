<template>
  <button ref="buttonRef" :data-type="dataType" :data-name="dataName" :type="nativeType" :class="[
    ns.b(),
    { [ns.b(type)]: !!type },
    ns.is('plain', plain),
    ns.is('disabled', disabled),
    ns.is('dashed', dashed),
    ns.is('round', round)
  ]" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
<script setup>
// import { CSS_NS } from '@package/constant'
import { ref, computed } from 'vue'
import { buildCssNamespace } from '../../util'

const ns = buildCssNamespace('button')

defineProps({
  type: {
    type: String,
    validator(value) {
      return ['primary', ''].includes(value)
    },
    default: ''
  },
  plain: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  dashed: {
    type: Boolean,
    default: false
  },
  nativeType: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
defineEmits(['click'])
const trimMethod = (val) => {
  return val ? val.trim() : ''
}
const buttonRef = ref(null)
const dataName = computed(() => {
  const targetEle = buttonRef.value?.closest('td')
  return targetEle
    ? buttonRef.value &&
    `${targetEle.getAttribute('tmpcolumnlabel')}##${trimMethod(
      buttonRef.value.innerText
    )}`
    : buttonRef.value && trimMethod(buttonRef.value.innerText)
})

const dataType = computed(() => {
  let btnName = 'button';
  if (buttonRef.value?.closest('td'))
    btnName = 'table##' + btnName
  else if (buttonRef.value?.closest('.ep-dialog,.ep-popper'))
    btnName = 'dialog##' + btnName
  return btnName
})
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Button')
}
</script>
