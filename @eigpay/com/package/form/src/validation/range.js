import { __proxy } from './index'
import { useLocale } from '../../../hooks/locale'
const { t } = useLocale()
const defaultOption = {
  trigger: ['blur', 'change'],
  maxMessage: 'validation.maxLength',
  minMessage: 'validation.minLength',
  exactLengthMessage: 'validation.exactLength',
  rangeLengthMessage: 'validation.rangeLength'
}

const getNumber = (numberLike) => {
  const num = Number(numberLike)
  if (!isNaN(num)) {
    return num
  }
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
        const rules = []
        const { max, min, len } = rule
        const trigger = rule.trigger || defaultOption.trigger
        if (len !== undefined) {
          rules.push({
            len: len,
            message:
              rule.message ||
              t(defaultOption.exactLengthMessage, { exactLength: len }),
            trigger
          })
          return rules
        }
        if (max !== undefined && min !== undefined && max === min) {
          rules.push({
            len: max,
            message:
              rule.message ||
              (() => t(defaultOption.exactLengthMessage, { exactLength: max })),
            trigger
          })
          return rules
        } else if (max !== undefined && min !== undefined) {
          rules.push({
            max,
            min,
            message:
              rule.message ||
              (() => t(defaultOption.rangeLengthMessage, { max, min })),
            trigger
          })
          return rules
        }
        if (rule.max !== undefined) {
          rules.push({
            max: rule.max,
            message:
              rule.maxMessage ||
              rule.message ||
              (() => t(defaultOption.maxMessage, { max: rule.max })),
            trigger
          })
        }
        if (rule.min !== undefined) {
          rules.push({
            min: rule.min,
            message:
              rule.minMessage ||
              rule.message ||
              (() => t(defaultOption.minMessage, { min: rule.min })),
            trigger
          })
        }
        return rules
      }
      if (currentOperator === 'max') {
        const max = getNumber(argsList[0])
        rule.max = max
        rule.maxMessage = argsList[1]
        return proxy
      }
      if (currentOperator === 'min') {
        const min = getNumber(argsList[0])
        rule.minMessage = argsList[1]
        rule.min = min
        return proxy
      }
      if (currentOperator === 'len') {
        const len = getNumber(argsList)
        rule.len = len
        return proxy
      }
      if (currentOperator === 'trigger') {
        rule.trigger = argsList
        return proxy
      }
      if (currentOperator === 'message') {
        const minIndex = keyStack.lastIndexOf('min')
        const maxIndex = keyStack.lastIndexOf('max')
        if (minIndex > maxIndex) {
          rule.minMessage = argsList[0]
        } else if (maxIndex > minIndex) {
          rule.maxMessage = argsList[0]
        } else {
          rule.message = argsList[0]
        }
        return proxy
      }
    }
  })
  return proxy
}

export default makeProxy
