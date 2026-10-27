<template>
  <label :class="[
    ns.b(),
    ns.is('disabled', isDisabled),
    ns.is('focus', focus),
    ns.is('checked', model === value)
  ]">
    <span :class="ns.e('shape')">
      <span :class="ns.e('faker')"></span>
      <input ref="inputRef" v-model="model" :data-name="dataName" :data-type="dataType" :disabled="isDisabled"
        :value="value" :class="ns.e('original')" :name="radioName" type="radio" @change="handleChange"
        @focus="focus = true" @blur="focus = false" />
    </span>
    <span ref="radioLabelRef" :class="ns.e('label')">
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>
<script setup>
import { ref, computed, nextTick, inject } from 'vue'
import { buildCssNamespace } from '../../util'
import get from 'lodash/get'
import noop from 'lodash/noop'
import { radioGroupKey } from './radio'
import { formContextKey, formItemContextKey } from '../../form/src/formLib'
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: undefined
  },
  value: {
    type: [String, Number, Boolean],
    default: undefined
  },
  label: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  }
})
const ns = buildCssNamespace('radio')
const emit = defineEmits(['update:modelValue', 'change'])
const radioGroup = inject(radioGroupKey, undefined)
const formContext = inject(formContextKey, undefined)
//formItemContext
const formItemContext = inject(formItemContextKey, undefined)

const inputRef = ref(null)
const radioLabelRef = ref(null)
const isInGroup = computed(() => !!radioGroup)
const radioName = computed(() => props.name || get(radioGroup, 'name'))
const model = computed({
  get() {
    return isInGroup.value ? get(radioGroup, 'modelValue') : props.modelValue
  },
  set(val) {
    if (isInGroup.value) {
      get(radioGroup, 'changeEvent', noop)(val)
    } else {
      emit('update:modelValue', val)
    }

    get(inputRef, 'value', {}).checked = props.modelValue === props.value
  }
})

const isDisabled = computed(
  () =>
    props.disabled ||
    get(radioGroup, 'disabled', false) ||
    get(formContext, 'disabled', false)
)
const focus = ref(false)

const handleChange = () => {
  nextTick(() => {
    emit('change', model.value)
  })
}

const dataName = computed(() => {
  const targetEle = radioLabelRef.value?.closest('td')
  if (targetEle) {
    return (
      `${targetEle.getAttribute('tmpcolumnlabel') || '选择记录'}${radioLabelRef.value ? "##" + radioLabelRef.value.innerText : ''}`
    )
  } else if (formItemContext) {
    return `${formItemContext.formItemLabel}##${radioLabelRef.value && radioLabelRef.value.innerText
      }`
  } else {
    return radioLabelRef.value && radioLabelRef.value.innerText
  }
})

const dataType = computed(() => {
  let rdName = 'radio';
  if (inputRef.value?.closest('tr,.ep-div-table'))
    rdName = 'table##' + rdName
  else if (inputRef.value?.closest('.ep-dialog,.ep-popper'))
    rdName = 'dialog##' + rdName
  return rdName;
})
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Radio')
}
</script>
