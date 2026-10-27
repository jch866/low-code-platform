import uniq from 'lodash/uniq'
import { __proxy } from './index'
import { useLocale } from '../../../hooks/locale'
const { t } = useLocale()
import {
  Chinese,
  digit,
  letterLowercase,
  letterUppercase,
  letter,
  specific,
  whitespace
} from './regexpUnit.js'
const defaultOption = {
  trigger: ['blur', 'change'],
  message: () => t('validation.pattern')
}
const supports = {
  Chinese,
  digit,
  letterLowercase,
  letterUppercase,
  letter,
  specific,
  whitespace,
  not: '^'
}
// or, and, not.
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
        let indicators = uniq(
          keyStack.filter((key) => !['trigger', 'message', 'not'].includes(key))
        ).sort()

        let pattern
        let message = []
        if (
          indicators.length === 0 ||
          (indicators.length === 1 && indicators[0] === 'not')
        ) {
          pattern = '.'
        } else {
          const notIndex = keyStack.indexOf('not')
          if (notIndex !== -1) {
            indicators.unshift('not')
          }
          const last = indicators.length - 1
          const p = indicators.reduce((prev, key, index) => {
            if (index === 0) {
              prev += '['
            }
            if (key in supports) {
              prev += supports[key]
              if (key !== 'not') {
                message.push(t(`validation.${key}`))
              }
            } else {
              console.error(`[Invalid indicator]:${key}`)
            }
            if (index === last) {
              prev += ']'
            }
            return prev
          }, '')
          pattern = p
        }
        if (indicators[0] === 'not') {
          message = t(`validation.notAllow`) + message.join(',')
        } else {
          message = t(`validation.onlyAllow`) + message.join(',')
        }
        return {
          ...defaultOption,
          ...rule,
          message: rule.message || message,
          pattern: new RegExp(`^${pattern}{0,}$`)
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
      return proxy
    }
  })
  return proxy
}

export default makeProxy
