<template scope="val">
  <div
    v-if="!isShowCurrentOptions"
    v-show="visible"
    ref="optionRef"
    :class="[
      ns.b(),
      ns.is('disabled', isDisabled),
      ns.is('selected', itemSelected),
      ns.is('hover', hover)
    ]"
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
  >
    <slot v-if="$slots.default"></slot>
    <template v-else>
      {{ currentLabel }}
    </template>
  </div>
</template>

<script setup>
import { reactive, toRefs, onBeforeUnmount, ref } from 'vue'
import { buildCssNamespace } from '../../util'
import { useOption } from './useOption'

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined
  },
  label: {
    type: [String, Number],
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const optionRef = ref(null)
const ns = buildCssNamespace('select__dropdown-item')

const states = reactive({
  index: -1,
  groupDisabled: false,
  visible: true,
  hitState: false,
  hover: false,
  optionRef
})

const {
  currentLabel,
  itemSelected,
  isDisabled,
  select,
  hoverItem,
  optionVm,
  isShowCurrentOptions
} = useOption(props, states)

const { visible, hover } = toRefs(states)

onBeforeUnmount(() => {
  select.onOptionDestroy(optionVm.value, optionVm)
})

const selectOptionClick = (event) => {
  if (!isDisabled.value) {
    select.handleOptionSelect(optionVm)
  } else {
    event.preventDefault()
  }
}

defineExpose({
  ns,
  currentLabel,
  itemSelected,
  isDisabled,
  select,
  hoverItem,
  visible,
  hover,
  selectOptionClick,
  states
})
select.onOptionCreate(optionVm)
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Option')
}
</script>
