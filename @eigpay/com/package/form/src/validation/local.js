import { __proxy } from './index'
import { useLocale } from '../../../hooks/locale'
import { useGlobalConfig } from '../../../hooks/globalConfig'
import regexp from './regexp/index'
const { t } = useLocale()
const defaultOption = {
  trigger: ['blur', 'change'],
  message: ''
}
const makeProxy = () => {
  const keyStack = []
  const target = function () {}
  const rule = {}
  let currentOperator
  const dialect = useGlobalConfig('dialect')
  const proxy = new Proxy(target, {
    get(target, key) {
      if (key === __proxy) {
        return true
      }
      if (['trigger', 'message'].includes(key)) {
        currentOperator = key
        keyStack.push(key)
      } else {
        const spec = regexp[dialect.value] || regexp.common
        rule.pattern = spec[key]
        rule.message = t(`validation.local.${dialect.value}.${key}`)
      }
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
