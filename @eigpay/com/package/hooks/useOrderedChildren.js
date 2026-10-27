import { shallowRef, isVNode } from 'vue'
import isArray from 'lodash/isArray'

// 将VNode扁平化
const flattedChildren = (children) => {
  const vNodes = isArray(children) ? children : [children]
  const result = []
  vNodes.forEach((child) => {
    if (isArray(child)) {
      result.push(...flattedChildren(child))
    } else if (isVNode(child) && isArray(child.children)) {
      result.push(...flattedChildren(child.children))
    } else {
      result.push(child)
      // child.component --> 对应的是组件实例
      if (isVNode(child) && child.component?.subTree) {
        result.push(...flattedChildren(child.component.subTree))
      }
    }
  })
  return result
}

// vnode是按照源代码中书写顺序排列的，可以根据vnode的顺序来对slot子组件进行排序
const getOrderedChildren = (vm, childComponentName, children) => {
  const nodes = flattedChildren(vm.subTree).filter(
    (n) => isVNode(n) && n.type.name === childComponentName && !!n.component
  )
  const uids = nodes.map((n) => n.component.uid)
  const childs = uids.map((uid) => children[uid])
  const filterResult = childs.filter((p) => !!p)
  // 记录slot组件的索引
  filterResult.forEach((item, index) => {
    item.index = index
  })
  return filterResult
}

export const useOrderedChildren = (vm, childComponentName) => {
  const children = {}
  const orderedChildren = shallowRef([])

  const addChild = (child) => {
    children[child.uid] = child
    orderedChildren.value = getOrderedChildren(vm, childComponentName, children)
  }
  const removeChild = (uid) => {
    delete children[uid]
    orderedChildren.value = orderedChildren.value.filter(
      (childrenItem) => childrenItem.uid !== uid
    )
    orderedChildren.value.forEach((item, index) => {
      item.index = index
    })
  }
  // 获取当前slot实例的索引
  const getInstanceIndex = (uid) => {
    return orderedChildren.value.findIndex((item) => item.uid === uid)
  }

  return {
    children: orderedChildren,
    addChild,
    removeChild,
    getInstanceIndex
  }
}
