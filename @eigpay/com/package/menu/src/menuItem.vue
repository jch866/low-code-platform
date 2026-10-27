<template>
  <li
    ref="normalMenuItemRef"
    data-type="menu"
    :data-name="dataName"
    :class="[ns.b(), ns.is('active', active), ns.is('disabled', isDisalbled)]"
    @click="handleClick"
  >
    <ep-tooltip
      v-if="
        parentMenu.type.name === componetName('Menu') &&
        rootMenu.props.collapse &&
        !!useSlots().title
      "
      :effect="rootMenu.props.popperEffect"
      :offset="10"
      :hide-after="0"
      placement="right"
    >
      <template #content>
        <div ref="normalMenuItemContentRef" :class="ns.e('content-wrap')">
          <slot name="title" />
        </div>
      </template>
      <div :class="ns.e('icon-wrap')">
        <slot />
      </div>
    </ep-tooltip>
    <template v-else>
      <slot />
      <slot name="title" />
    </template>
  </li>
</template>

<script setup>
import {
  computed,
  useSlots,
  inject,
  getCurrentInstance,
  toRef,
  reactive,
  onMounted,
  onBeforeUnmount,
  ref
} from 'vue'
import { buildCssNamespace } from '@package/util'
import { rootMenuKey, useMenu } from './menuLib'

const props = defineProps({
  disabled: Boolean,
  index: {
    type: [String, null],
    default: null
  }
})

const emits = defineEmits(['click'])
const ns = buildCssNamespace('menu-item')
const instance = getCurrentInstance()
const normalMenuItemRef = ref(null)
const normalMenuItemContentRef = ref(null)

const rootMenu = inject(rootMenuKey)
const { parentMenu, indexPath } = useMenu(instance, toRef(props, 'index'))
const subMenu = inject(`subMenu:${parentMenu.value.uid}`)
const active = computed(() => props.index === rootMenu.activeIndex)
const isDisalbled = computed(() => props.disabled)
const currentItem = reactive({ index: props.index, indexPath, active })

const handleClick = () => {
  if (props.disabled) {
    return
  }
  rootMenu.handleMenuItemClick({
    index: props.index,
    indexPath: indexPath.value
  })
  emits('click', currentItem)
}

onMounted(() => {
  subMenu.addSubMenu(currentItem)
  rootMenu.addMenuItem(currentItem)
})

const dataName = computed(() => {
  const isCollose =
    parentMenu.value.type.name === componetName('Menu') &&
    rootMenu.props.collapse &&
    !!useSlots().title
  if (isCollose) {
    return normalMenuItemContentRef.value
      ? normalMenuItemContentRef.value.innerText
      : ''
  } else {
    return normalMenuItemRef.value ? normalMenuItemRef.value.innerText : ''
  }
})

onBeforeUnmount(() => {
  subMenu.removeSubMenu(currentItem)
  rootMenu.removeMenuItem(currentItem)
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('MenuItem')
}
</script>
