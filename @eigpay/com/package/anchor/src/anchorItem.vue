<template>
  <div ref="anchorItem">
    <slot />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  inject,
  getCurrentInstance,
  onMounted,
  onUnmounted
} from 'vue'
import { anchorKey } from './anchorLib'
const props = defineProps({
  label: {
    type: String,
    default: ''
  }
})

const anchorItem = ref()
const parentRoot = inject(anchorKey)
const currentInstance = getCurrentInstance()

onMounted(() => {
  const item = reactive({
    uid: currentInstance.uid,
    label: props.label,
    el: anchorItem.value
  })
  parentRoot.addAnchorItem(item)
})

onUnmounted(() => {
  parentRoot.removeAnchorItem(currentInstance.uid)
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('AnchorItem')
}
</script>
