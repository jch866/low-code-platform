import { h, render } from 'vue'
import { instances, getInstance } from './instance'
import messageComponent from './message.vue'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import isElement from 'lodash/isElement'
import { useZIndex } from '../../util'

const { nextZIndex } = useZIndex()

/**
 * EPMessage(params)
 * 参数可以是 undefined, string，()=>vnode，{message:'',type:'',...}
 * @param {*} params
 */
function normalizeOptions(params) {
  let options =
    !params || isString(params) || isFunction(params)
      ? { message: params || '' }
      : params
  if (!options.appendTo) {
    options.appendTo = document.body
  } else if (isString(options.appendTo)) {
    const appendToElement = document.querySelector(options.appendTo)
    if (!isElement(appendToElement)) {
      options.appendTo = document.body
    }
    options.appendTo = appendToElement
  }
  return options
}

function closeMessage(uid) {
  const { current } = getInstance(uid)
  const idx = instances.indexOf(current)
  if (idx <= -1) {
    return
  }
  instances.splice(idx, 1)
  current.close()
}

function createMessage(options = {}) {
  const userOnClose = options.onClose
  const props = {
    ...options,
    zIndex: nextZIndex(),
    onClose: (uid) => {
      // 先调用用户传入的close回调
      userOnClose && userOnClose()
      closeMessage(uid)
    },
    onDestory: () => {
      render(null, container)
    }
  }

  // 判断默认插槽和具名插槽，创建vnode，并将其渲染到container容器中
  const container = document.createElement('div')
  let children
  if (isFunction(props.message) && isFunction(props.icon)) {
    children = { default: props.message, icon: props.icon }
  } else if (isFunction(props.message)) {
    children = { default: props.message }
  } else if (isFunction(props.icon)) {
    children = { icon: props.icon }
  } else {
    children = null
  }

  const vnode = h(messageComponent, props, children)
  render(vnode, container)
  options.appendTo.appendChild(container.firstElementChild)
  const vm = vnode.component
  const close = () => {
    vm.exposed.visible.value = false
  }

  return {
    uid: vm.uid,
    vm,
    close
  }
}

function Message(options = {}) {
  const normalized = normalizeOptions(options)
  const instance = createMessage(normalized)
  instances.push(instance)
  return { close: instance.close }
}

// 添加 Message.success，Message.error等方法
const methods = ['info', 'success', 'warning', 'error']
methods.forEach((type) => {
  Message[type] = (options = {}) => {
    const normalized = normalizeOptions(options)
    return Message({ ...normalized, type })
  }
})
Message.closeAll = closeAll

function closeAll(type) {
  for (const instance of instances) {
    if (!type || type === instance.props.type) {
      instance.close()
    }
  }
}

export default Message
