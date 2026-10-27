<template>
  <template v-if="modeType === 'vertical'">
    <menuCollapseTransition>
      <ul
        :key="String(props.collapse)"
        :class="[ns.b(), ns.is(modeType, true), ns.m('collapse', isCollapse)]"
        :style="ulStyle"
      >
        <slot />
      </ul>
    </menuCollapseTransition>
  </template>
  <ul
    v-else
    :class="[
      ns.b(),
      ns.is(modeType, true),
      ns.is('indicator-top', isIndicatorTop)
    ]"
    :style="ulStyle"
  >
    <slot />
  </ul>
</template>

<script setup>
import {
  computed,
  provide,
  reactive,
  ref,
  watch,
  getCurrentInstance
} from 'vue'
import { buildCssNamespace } from '@package/util'
import { rootMenuKey, calcUlStyle } from './menuLib'
import isUndefined from 'lodash/isUndefined'
import menuCollapseTransition from './menu-collapse-transition.vue'

const props = defineProps({
  mode: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'vertical'
  },
  collapse: Boolean,
  backgroundColor: {
    type: String,
    default: ''
  },
  hoverBackgroundColor: {
    type: String,
    default: ''
  },
  activeBackgroundColor: {
    type: String,
    default: ''
  },
  insideBackgroundColor: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: ''
  },
  activeTextColor: {
    type: String,
    default: ''
  },
  hoverTextColor: {
    type: String,
    default: ''
  },
  defaultActive: {
    type: String,
    default: ''
  },
  defaultOpeneds: {
    type: Array,
    default: () => []
  },
  uniqueOpened: Boolean,
  menuTrigger: {
    type: String,
    values: ['hover', 'click'],
    default: 'hover'
  },
  popperEffect: {
    type: String,
    values: ['dark', 'light'],
    default: 'dark'
  },
  indicatorTop: {
    type: Boolean,
    default: false
  },
  popperClass: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['select', 'open', 'close'])
const ns = buildCssNamespace('menu')
const instance = getCurrentInstance()
const isCollapse = computed(() => props.collapse)
const modeType = computed(() => props.mode)
const ulStyle = calcUlStyle(props, 0)
// 记录已经展开的sub-menu索引数组
const openedMenus = ref(
  props.defaultOpeneds && !props.collapse ? props.defaultOpeneds.slice(0) : []
)
const activeIndex = ref(props.defaultActive)
const isIndicatorTop = computed(
  () => props.mode === 'horizontal' && props.indicatorTop
)
const items = ref({})
const subMenus = ref({})

// 是否显示tooltip
const isMenuPopup = computed(() => {
  return (
    props.mode === 'horizontal' || (props.mode === 'vertical' && props.collapse)
  )
})

// 记录 indexPath，当水平方向时高亮subMenu用
const activeIndexPath = computed(() => {
  const activeItem = activeIndex.value && items.value[activeIndex.value]
  if (activeItem) {
    return activeItem.indexPath
  } else {
    return []
  }
})

// 初始化，展开层级到默认激活的菜单
const initMenu = () => {
  const activeItem = activeIndex.value && items.value[activeIndex.value]
  if (!activeItem || props.mode === 'horizontal' || props.collapse) {
    return
  }
  const indexPath = activeItem.indexPath
  indexPath.forEach((index) => {
    const subMenu = subMenus.value[index]
    subMenu && openMenu(index, subMenu.indexPath)
  })
}

const openMenu = (index, indexPath) => {
  if (openedMenus.value.includes(index)) {
    return
  }
  // 只保持一个子菜单展开，将其余菜单收起
  if (props.uniqueOpened) {
    openedMenus.value = openedMenus.value.filter((menuIndex) =>
      indexPath.includes(menuIndex)
    )
  }
  openedMenus.value.push(index)
  emits('open', index, indexPath)
}

const closeMenu = (index, indexPath) => {
  const idx = openedMenus.value.indexOf(index)
  if (idx >= 0) {
    openedMenus.value.splice(idx, 1)
  }
  emits('close', index, indexPath)
}

const handleSubMenuClick = ({ index, indexPath }) => {
  const isOpened = openedMenus.value.includes(index)
  if (isOpened) {
    closeMenu(index, indexPath)
  } else {
    openMenu(index, indexPath)
  }
}

const handleMenuItemClick = (menuItem) => {
  if (props.mode === 'horizontal' || props.collapse) {
    openedMenus.value = []
  }
  const { index, indexPath } = menuItem
  if (isUndefined(index) || isUndefined(indexPath)) {
    return
  }
  activeIndex.value = index
  emits('select', index, indexPath, menuItem)
}

const updateActiveIndex = (val) => {
  const activeItem =
    items.value[val] ||
    (activeIndex.value && items.value[activeIndex.value]) ||
    items.value[props.defaultActive]
  if (activeItem) {
    activeIndex.value = activeItem.index
  } else {
    activeIndex.value = val
  }
}

const addSubMenu = (item) => {
  subMenus.value[item.index] = item
}

const removeSubMenu = (item) => {
  delete subMenus.value[item.index]
}

const addMenuItem = (item) => {
  items.value[item.index] = item
}

const removeMenuItem = (item) => {
  delete items.value[item.index]
}

watch(
  () => props.defaultActive,
  (currentActive) => {
    if (!items.value[currentActive]) {
      activeIndex.value = ''
    }
    updateActiveIndex(currentActive)
  }
)

watch(
  () => props.collapse,
  (val) => {
    if (val) {
      openedMenus.value = []
    }
  }
)

watch(items.value, initMenu)

provide(
  rootMenuKey,
  reactive({
    props,
    openedMenus,
    items,
    subMenus,
    activeIndex,
    activeIndexPath,
    isMenuPopup,
    addMenuItem,
    removeMenuItem,
    addSubMenu,
    removeSubMenu,
    openMenu,
    closeMenu,
    handleMenuItemClick,
    handleSubMenuClick
  })
)

provide(`subMenu:${instance.uid}`, {
  addSubMenu,
  removeSubMenu,
  mouseInChild: ref(false),
  level: 0
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Menu')
}
</script>
