<template>
  <div :class="[ns.b(), ns.m('border-card', type === 'border-card')]">
    <tab-header :options="optionArray"></tab-header>
    <div :class="ns.e('content')">
      <slot />
    </div>
  </div>
</template>
<script setup>
import { reactive, toRefs, provide, useSlots, shallowRef, Fragment } from 'vue'
import { tabContextKey } from './tab.js'
import tabHeader from './tabHeader.vue'
import { buildCssNamespace } from '../../util'

const props = defineProps({
  type: {
    type: String,
    default: undefined
  },
  modelValue: {
    type: [String, Number],
    default: undefined
  },
  // tab标签下指示器的宽度
  indicatorWidth: {
    type: Number,
    default: undefined
  },
  isKeepAlive: {
    type: Boolean,
    default: true
  },
  lazy: {
    type: Boolean,
    default: false
  },
  isSticky: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['tab-click', 'tab-change', 'update:modelValue'])

const ns = buildCssNamespace('tab')

const slots = useSlots()

// 存储标签页的属性
const states = reactive({
  options: new Map()
})
const optionArray = shallowRef([])

// 选择了某个标签页
const handleSelectOption = ($event, key, item) => {
  emit('update:modelValue', key)
  emit('tab-change', key)
  emit('tab-click', item, $event)
}

// 获取option实例用以回显
const registerPane = (vm) => {
  states.options.set(vm.name, vm)
  // 根据 slots中组件的顺序重新组织options的顺序
  const vnodes = slots.default()
  const vnodesArray = [...vnodes]
  const arr = []
  let vnode
  while ((vnode = vnodesArray.shift())) {
    if (vnode.type === Fragment) {
      vnodesArray.push(...vnode.children)
    } else if (
      // vnode type 是Tabpane，并且已经放在options map中的pane组件会被添加到顺序数组中
      vnode.type.name === componetName('TabPane') &&
      states.options.get(vnode.props.name)
    ) {
      arr.push(states.options.get(vnode.props.name))
    }
  }
  optionArray.value = arr
}

// 移除states中保存的变量
const unregisterPane = (key, vm) => {
  if (states.options.get(key) === vm) {
    const index = optionArray.value.findIndex((option) => option.name === key)
    // 移除的是当前活动pane, 优先选择下一个pane，如果下一个pane不存在，那么选择前一个pane。最后更新modelValue的值
    if (vm.isActive) {
      let key = ''
      if (optionArray.value[index + 1]) {
        optionArray.value[index + 1].isActive = true
        key = optionArray.value[index + 1].name
      } else if (optionArray.value[index - 1]) {
        optionArray.value[index - 1].isActive = true
        key = optionArray.value[index - 1].name
      }
      emit('update:modelValue', key)
      emit('tab-change', key)
    }
    states.options.delete(key)
    // 从顺序数组中移除
    optionArray.value = optionArray.value.filter((option) => option.name != key)
  }
}

provide(
  tabContextKey,
  reactive({
    ...toRefs(props),
    handleSelectOption,
    registerPane,
    unregisterPane
  })
)
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Tab')
}
</script>
