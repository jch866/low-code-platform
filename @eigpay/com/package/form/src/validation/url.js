import { __proxy } from './index'
import { useLocale } from '../../../hooks/locale'
const { t } = useLocale()
const defaultOption = {
  trigger: ['blur', 'change'],
  message: () => t('validation.url'),
  type: 'url'
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
      if (currentOperator === 'trigger') {
        rule.trigger = argsList
        return proxy
      }
      if (currentOperator === 'message') {
        rule.message = argsList[0]
        return proxy
      }
    }
  })
  return proxy
}

export default makeProxy
