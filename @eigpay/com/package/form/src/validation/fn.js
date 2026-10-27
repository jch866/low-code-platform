import { __proxy } from './index'
const defaultOption = {
  trigger: ['blur', 'change']
}
const makeProxy = () => {
  const keyStack = []
  const target = function () {}
  const rule = {}
  let currentOperator
  const proxy = new Proxy(target, {
    get(t, key) {
      if (key === __proxy) {
        return true
      }
      currentOperator = key
      keyStack.push(key)
      return proxy
    },
    apply(target, thisArg, argsList) {
      if (argsList.length === 0) {
        return {
          ...defaultOption,
          ...rule
        }
      }
      if (currentOperator === 'sync') {
        const [fn] = argsList
        if (typeof fn === 'function') {
          rule.validator = fn
        }
        return proxy
      }
      if (currentOperator === 'async') {
        const [fn] = argsList
        if (typeof fn === 'function') {
          rule.asyncValidator = fn
        }
        return proxy
      }
      if (currentOperator === 'message') {
        rule.message = argsList[0]
        return proxy
      }
      if (currentOperator === 'trigger') {
        rule.trigger = argsList[0]
        return proxy
      }
    }
  })
  return proxy
}

export default makeProxy
