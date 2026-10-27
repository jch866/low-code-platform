<template>
  <div v-if="shouldRander" v-show="isActive" :class="ns.b()">
    <slot />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  toRefs,
  inject,
  onUnmounted,
  watch,
  useSlots,
  computed,
  nextTick
} from 'vue'
import { tabContextKey } from './tab'
import { buildCssNamespace } from '../../util'

const props = defineProps({
  name: {
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
  },
  lazy: {
    type: Boolean,
    default: false
  }
})

const ns = buildCssNamespace('tab-content')

const tabContext = inject(tabContextKey, undefined)

let isActive = ref(props.name === tabContext.modelValue)

// 是否加载过
const hasLoaded = ref(false)

const isKeepAlive = computed(() => {
  return tabContext.isKeepAlive
})

const isLazy = computed(() => {
  return props.lazy || tabContext.lazy
})

const shouldRander = computed(() => {
  return (
    (!isLazy.value && isKeepAlive.value) ||
    (isLazy.value && hasLoaded.value) ||
    isActive.value
  )
})

const slots = useSlots()

const vm = reactive({
  ...toRefs(props),
  isActive,
  slots
})

tabContext.registerPane(vm)

watch(
  () => tabContext.modelValue,
  () => {
    isActive.value = props.name === tabContext.modelValue
  }
)

const stopWatch = watch(
  () => isActive.value,
  async (val) => {
    if (val && !hasLoaded.value) {
      hasLoaded.value = true
      await nextTick()
      stopWatch()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  tabContext.unregisterPane(vm.name, vm)
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('TabPane')
}
</script>
