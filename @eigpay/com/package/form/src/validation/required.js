import { __proxy } from './index'
import { useLocale } from '../../../hooks/locale'
const { t } = useLocale()
const defaultOption = {
  required: true,
  trigger: ['blur', 'change'],
  message: () => t('validation.required')
}
const makeProxy = () => {
  const target = function () {}
  const rule = {}
  let currentOperator
  const proxy = new Proxy(target, {
    get(t, key) {
      if (key === __proxy) {
        return true
      }
      currentOperator = key
      return proxy
    },
    apply(target, thisArg, argsList) {
      if (argsList.length === 0) {
        return {
          ...defaultOption,
          ...rule
        }
      }
      if (currentOperator === 'is') {
        rule.required = !!argsList[0]
        return proxy
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
