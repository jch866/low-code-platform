import { __proxy } from './index'
import { useLocale } from '../../../hooks/locale'
import { digit } from './regexpUnit.js'
import isNil from 'lodash/isNil'
const { t } = useLocale()
const defaultOption = {
  trigger: ['blur', 'change']
}
const createFn = (params) => {
  const config = {}
  let pattern = ''
  pattern = `[${digit}]{0,${params.integer ?? ''}}`
  if (params.decimal) {
    pattern += `(\\.[${digit}]{0,${params.decimal}})?`
  }
  if (params.allowNegative) {
    pattern = `-?${pattern}`
  }

  pattern = new RegExp(`^${pattern}$`)
  const min = params.min ?? Number.NEGATIVE_INFINITY
  const max = params.max ?? Number.POSITIVE_INFINITY
  config.validator = (rule, value, callback) => {
    if (!value && (value !== 0 || value !== false)) {
      return callback()
    }
    if (!pattern.test(value)) {
      const messsage = params.decimal
        ? t('validation.numberFormat', params)
        : t('validation.integerFormat', params)
      return callback(messsage)
    }
    const val = Number(value)
    if (val < min) {
      return callback(t('validation.cannotLessThan', params))
    }
    if (val > max) {
      return callback(t('validation.cannotGreaterThan', params))
    }
    callback()
  }

  return { ...config }
}
const makeProxy = () => {
  const params = {
    integer: undefined,
    decimal: undefined,
    allowNegative: false,
    max: undefined,
    min: undefined
  }
  const target = function () {}
  const rule = {}
  let currentOperator
  const keyStack = []
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
          ...rule,
          ...createFn(params)
        }
      }
      if (isNil(currentOperator)) {
        params.integer = argsList[0]
        params.decimal = argsList[1]
        params.allowNegative = argsList[2] ?? false
        return proxy
      }
      if (currentOperator === 'max') {
        params.max = argsList[0]
        return proxy
      }
      if (currentOperator === 'min') {
        params.min = argsList[0]
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
