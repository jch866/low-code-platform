<template>
  <div :class="ns.e('wraper')">
    <div ref="contentContainer" :class="ns.e('slot')">
      <slot />
    </div>
    <aside :class="ns.b()">
      <nav :class="ns.e('content')">
        <ul :class="ns.e('item-wraper')">
          <li
            v-for="({ label, el }, index) in anchorItems"
            :key="label"
            :class="ns.e('item')"
          >
            <span
              data-type="anchor"
              :data-name="label"
              :class="[
                ns.e('link'),
                ns.is('active', activeAnchorIndex === index)
              ]"
              :title="label"
              @click="scrollVisible(el)"
            >
              {{ label }}
            </span>
          </li>
        </ul>
        <div ref="marker" :class="ns.e('marker')" :style="markerStyle" />
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, provide, watch, computed, getCurrentInstance } from 'vue'
import { buildCssNamespace } from '@package/util'
import { anchorKey } from './anchorLib'
import { useWindowScroll } from '@vueuse/core'
import { useOrderedChildren } from '../../hooks/useOrderedChildren'

const props = defineProps({
  offsetY: {
    type: Number,
    default: 0
  }
})

const { y } = useWindowScroll()
const ns = buildCssNamespace('anchor')
const marker = ref()
const contentContainer = ref()
const activeAnchorIndex = ref(0)
const vm = getCurrentInstance()
const {
  children: anchorItems,
  addChild: addAnchorItem,
  removeChild: removeAnchorItem
} = useOrderedChildren(vm, componetName('AnchorItem'))
provide(anchorKey, { addAnchorItem, removeAnchorItem })

watch(y, () => {
  const scrollTop = y.value - props.offsetY
  const elOffSetArray = anchorItems.value.map((item) => {
    return item.el.offsetTop
  })

  if (scrollTop >= elOffSetArray[elOffSetArray.length - 1]) {
    // scrollTop大于最大偏移，则取最大索引
    activeAnchorIndex.value = elOffSetArray.length - 1
  } else if (scrollTop <= elOffSetArray[0]) {
    // scrollTop大于最小偏移，则取最小索引
    activeAnchorIndex.value = 0
  } else {
    // 找到第一个大于scrollTop的索引 - 1，就是当前高亮的
    activeAnchorIndex.value =
      elOffSetArray.findIndex((item) => item > scrollTop) - 1
  }
})

const scrollVisible = (el) => {
  el && el.scrollIntoView()
}

const markerStyle = computed(() => {
  return {
    top: `${activeAnchorIndex.value * 30}px`
  }
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Anchor')
}
</script>
