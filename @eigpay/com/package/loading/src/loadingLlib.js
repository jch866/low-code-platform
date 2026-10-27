import { h, render } from 'vue'
import loadingComponent from './loading.vue'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import isElement from 'lodash/isElement'

const loadingMap = new WeakMap()

function createLoading(options = {}) {
  const targetElement = document.querySelector(options.target)
  const mapKey = targetElement
  const InstanceResult = loadingMap.get(mapKey)

  if (options.target === 'body' && InstanceResult) {
    InstanceResult.vm.exposed.show()
    return InstanceResult
  }

  // 判断具名插槽，并将其渲染到container容器中
  const container = document.createElement('div')
  let children
  if (isFunction(options.icon)) {
    children = { icon: options.icon }
  } else {
    children = null
  }

  const vnode = h(loadingComponent, options, children)
  render(vnode, container)
  targetElement.appendChild(container.firstElementChild)
  const vm = vnode.component
  vm.exposed.show()
  const close = () => {
    vm.exposed.close()
  }

  const InstanceResultAnother = { vm, close }
  if (options.target === 'body') {
    loadingMap.set(mapKey, InstanceResultAnother)
  }
  return InstanceResultAnother
}

function normalizeOptions(params) {
  let options = params || {}
  if (!options.target) {
    options.target = 'body'
  } else if (isString(options.target)) {
    const targetElement = document.querySelector(options.target)
    if (!isElement(targetElement)) {
      options.target = 'body'
    }
  }
  return options
}

function Loading(options = {}) {
  const normalizedOptions = normalizeOptions(options)
  const instance = createLoading(normalizedOptions)
  return { close: instance.close }
}

export default Loading
