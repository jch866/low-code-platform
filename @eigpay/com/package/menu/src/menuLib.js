import { computed } from 'vue'
import { componetName } from '@package/constant'
import { buildCssNamespace } from '@package/util'

export const rootMenuKey = Symbol('rootMenu')

export function useMenu(instance, currentIndex) {
  const indexPath = computed(() => {
    let parent = instance.parent
    const path = [currentIndex.value]
    while (parent.type.name !== componetName('Menu')) {
      if (parent.props.index) {
        path.unshift(parent.props.index)
      }
      parent = parent.parent
    }
    return path
  })

  const parentMenu = computed(() => {
    let parent = instance.parent
    const nameArray = [componetName('Menu'), componetName('SubMenu')]
    while (parent && !nameArray.includes(parent.type.name)) {
      parent = parent.parent
    }
    return parent
  })

  return { parentMenu, indexPath }
}

// 重新在 style 上定义样式，来覆盖在 menu.scss 中原来的颜色
// 根据 menu-level 计算文本的 padding-left
export function calcUlStyle(props, level) {
  const ns = buildCssNamespace('menu').b()
  return computed(() => {
    return {
      [`--${ns}-text-color`]: props.textColor || '',
      [`--${ns}-hover-text-color`]: props.hoverTextColor || '',
      [`--${ns}-active-text-color`]: props.activeTextColor || '',
      [`--${ns}-bg-color`]: props.backgroundColor || '',
      [`--${ns}-hover-bg-color`]: props.hoverBackgroundColor || '',
      [`--${ns}-active-bg-color`]: props.activeBackgroundColor || '',
      [`--${ns}-inside-bg-color`]: props.insideBackgroundColor || '',
      [`--${ns}-level`]: `${level}`
    }
  })
}
