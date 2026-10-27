<template>
  <div :class="[ns.b(), ns.is(typeStyle, true)]">
    <slot />
  </div>
</template>

<script setup>
import { buildCssNamespace } from '@package/util'
import { provide, ref, watch, computed } from 'vue'
import {
  CHANGE_EVENT,
  UPDATE_MODEL_EVENT,
  collapseKey,
  ensureArray
} from './collapseLib'

const props = defineProps({
  accordion: Boolean,
  modelValue: {
    type: [String, Array],
    default: () => []
  },
  type: {
    type: String,
    values: ['default', 'line'],
    default: 'default'
  }
})
const emit = defineEmits([CHANGE_EVENT, UPDATE_MODEL_EVENT])
const ns = buildCssNamespace('collapse')
const typeStyle = computed(() => props.type)

// 如果是字符串，将字符串转化为数组 `[string]`
const activeNames = ref(ensureArray(props.modelValue))

const setActiveNames = (_activeNames) => {
  activeNames.value = _activeNames
  const value = props.accordion ? activeNames.value[0] : activeNames.value
  emit(UPDATE_MODEL_EVENT, value)
  emit(CHANGE_EVENT, value)
}

const handleItemClick = (name) => {
  if (props.accordion) {
    setActiveNames([activeNames.value[0] === name ? '' : name])
  } else {
    const _activeNames = [...activeNames.value]
    const index = _activeNames.indexOf(name)
    // 如果点击的header是活跃状态，则变为不活跃
    if (index > -1) {
      _activeNames.splice(index, 1)
    } else {
      _activeNames.push(name)
    }
    setActiveNames(_activeNames)
  }
}

watch(
  () => props.modelValue,
  () => (activeNames.value = ensureArray(props.modelValue)),
  { deep: true }
)

provide(collapseKey, {
  activeNames,
  handleItemClick
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Collapse')
}
</script>
