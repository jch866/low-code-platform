<template>
  <li
    data-type="menu"
    :data-name="dataName"
    :class="[ns.b()]"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <template v-if="rootMenu.isMenuPopup">
      <ep-tooltip
        :model-value="opened"
        :offset="10"
        :hide-after="0"
        trigger="none"
        :placement="currentPlacement"
        :disabled="isDisalbled"
        :teleported="isFirstLevel"
        :show-arrow="false"
        :click-out-side-to-hide="false"
        :popper-class="popperClassRef"
      >
        <template #content>
          <ul
            :class="[ns.m('popup')]"
            :style="ulStyle"
            @mouseenter="handleUlMouseEnter"
            @mouseleave="handleUlMouseLeave"
          >
            <slot />
          </ul>
        </template>
        <div
          ref="normalSubMenuTitleRef"
          :class="[
            ns.e('title'),
            ns.is('active', actived),
            ns.is('disabled', isDisalbled)
          ]"
          @click="handleClick"
        >
          <span :class="ns.e('title-slot')">
            <slot name="title" />
          </span>
          <ep-icon
            :class="[ns.e('icon-arrow'), ns.is('opened', opened)]"
            icon="ep-i-arrow-up"
          ></ep-icon>
        </div>
      </ep-tooltip>
    </template>
    <template v-else>
      <div
        ref="normalSubMenuTitleRef"
        :class="[
          ns.e('title'),
          ns.is('active', actived),
          ns.is('disabled', isDisalbled)
        ]"
        @click="handleClick"
      >
        <span :class="ns.e('title-slot')">
          <slot name="title" />
        </span>
        <ep-icon
          :class="[ns.e('icon-arrow'), ns.is('opened', opened)]"
          icon="ep-i-arrow-up"
        ></ep-icon>
      </div>
      <collapse-transition>
        <ul
          v-if="!!useSlots().default"
          v-show="opened"
          :style="ulStyle"
          :class="ns.e('inside-ul')"
        >
          <slot />
        </ul>
      </collapse-transition>
    </template>
  </li>
</template>

<script setup>
import { buildCssNamespace } from '@package/util'
import {
  useSlots,
  inject,
  computed,
  getCurrentInstance,
  ref,
  provide,
  reactive,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { rootMenuKey, useMenu, calcUlStyle } from './menuLib'
import collapseTransition from '../../collapse/src/collapse-transition.vue'
import { useTimeoutFn } from '@vueuse/core'

const props = defineProps({
  index: {
    type: String,
    default: ''
  },
  disabled: Boolean
})

const ns = buildCssNamespace('sub-menu')
const instance = getCurrentInstance()
const { indexPath, parentMenu } = useMenu(
  instance,
  computed(() => props.index)
)
const rootMenu = inject(rootMenuKey)
const subMenu = inject(`subMenu:${parentMenu.value.uid}`)
const popperClassRef = computed(() => rootMenu.props.popperClass)
const normalSubMenuTitleRef = ref(null)
const dataName = computed(() =>
  normalSubMenuTitleRef.value ? normalSubMenuTitleRef.value.textContent : ''
)

// SubMenu的插槽可以传`sub-menu`或者`menu-item`
// 记录当前这个subMenu中包含的`menuItem`和`subMenu`
const subMenus = ref({})
const ulStyle = calcUlStyle(rootMenu.props, subMenu.level + 1)
const mode = computed(() => rootMenu.props.mode)
const isFirstLevel = computed(() => subMenu.level === 0)

const currentPlacement = computed(() =>
  mode.value === 'horizontal' && isFirstLevel.value
    ? 'bottom-start'
    : 'right-start'
)

const isDisalbled = computed(() => props.disabled)
const opened = computed(() => rootMenu.openedMenus.includes(props.index))

const actived = computed(() => {
  if (rootMenu.activeIndexPath) {
    return rootMenu.activeIndexPath.includes(props.index)
  } else {
    return false
  }
})
const currentItem = reactive({ index: props.index, indexPath, active: actived })

// 只有点击subMenu时才走这个方法，hover和折叠状态时不走这
const handleClick = () => {
  if (
    (rootMenu.props.menuTrigger === 'hover' &&
      rootMenu.props.mode === 'horizontal') ||
    (rootMenu.props.collapse && rootMenu.props.mode === 'vertical') ||
    props.disabled
  ) {
    return
  }
  rootMenu.handleSubMenuClick({
    index: props.index,
    indexPath: indexPath.value
  })
}

let mouseEnterTimer = null
let mouseLeaveTimer = null

// subMenu:hover时走这个方法
const handleMouseenter = (event) => {
  if (event.type === 'focus') {
    return
  }
  if (
    (rootMenu.props.menuTrigger === 'click' &&
      rootMenu.props.mode === 'horizontal') ||
    (!rootMenu.props.collapse && rootMenu.props.mode === 'vertical') ||
    props.disabled
  ) {
    return
  }

  mouseLeaveTimer && mouseLeaveTimer.stop()
  mouseEnterTimer && mouseEnterTimer()
  const { stop } = useTimeoutFn(() => {
    rootMenu.openMenu(props.index, indexPath.value)
  }, 300)
  mouseEnterTimer = stop
}

const handleMouseleave = () => {
  if (
    (rootMenu.props.menuTrigger === 'click' &&
      rootMenu.props.mode === 'horizontal') ||
    (!rootMenu.props.collapse && rootMenu.props.mode === 'vertical') ||
    props.disabled
  ) {
    return
  }

  mouseLeaveTimer && mouseLeaveTimer.stop()
  const timer = useTimeoutFn(() => {
    rootMenu.closeMenu(props.index, indexPath.value)
  }, 300)
  mouseLeaveTimer = timer
}

const handleUlMouseEnter = (event) => {
  if (event.type === 'focus') {
    return
  }
  if (
    (rootMenu.props.menuTrigger === 'click' &&
      rootMenu.props.mode === 'horizontal') ||
    (!rootMenu.props.collapse && rootMenu.props.mode === 'vertical') ||
    props.disabled
  ) {
    return
  }
  // 当hover tooltipContent时，将定时器暂停，防止content消失
  mouseLeaveTimer && mouseLeaveTimer.stop()
  // select后重复弹出问题
  mouseEnterTimer && mouseEnterTimer()
}

const handleUlMouseLeave = () => {
  if (
    (rootMenu.props.menuTrigger === 'click' &&
      rootMenu.props.mode === 'horizontal') ||
    (!rootMenu.props.collapse && rootMenu.props.mode === 'vertical') ||
    props.disabled
  ) {
    return
  }
  // 当鼠标离开tooltipContent时，重新开启定时器
  mouseLeaveTimer && mouseLeaveTimer.start()
}

const addSubMenu = (item) => {
  subMenus.value[item.index] = item
}

const removeSubMenu = (item) => {
  delete subMenus.value[item.index]
}

provide(`subMenu:${instance.uid}`, {
  addSubMenu,
  removeSubMenu,
  handleMouseenter,
  handleMouseleave,
  level: subMenu.level + 1
})

onMounted(() => {
  rootMenu.addSubMenu(currentItem)
  subMenu.addSubMenu(currentItem)
})

onBeforeUnmount(() => {
  subMenu.removeSubMenu(currentItem)
  rootMenu.removeSubMenu(currentItem)
})

defineExpose({ opened })
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('SubMenu')
}
</script>
