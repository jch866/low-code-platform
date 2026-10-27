import { COM_NS, CSS_NS } from './constant'
import { ref, computed } from 'vue'
import { useGlobalConfig } from './hooks/globalConfig'
let idCounter = 0
export const generateId = (prefix = '') => {
  return `${COM_NS}-${prefix}-${idCounter++}`
}

export function buildCssNamespace(block) {
  const bem = (namespace, block, blockSuffix, element, modifier) => {
    const parts = [namespace, '-', block]
    if (blockSuffix) {
      parts.push('-', blockSuffix)
    }
    if (element) {
      parts.push('__', element)
    }
    if (modifier) {
      parts.push('--', modifier)
    }
    return parts.join('')
  }
  const b = (blockSuffix) => bem(CSS_NS, block, blockSuffix)
  const e = (element) => bem(CSS_NS, block, '', element)
  const m = (modifier, predicate = true) =>
    predicate ? bem(CSS_NS, block, '', '', modifier) : ''
  const em = (element, modifier, predicate = true) =>
    predicate ? bem(CSS_NS, block, '', element, modifier) : ''
  const is = (name, predicate) => (predicate ? `is-${name}` : '')
  return {
    b,
    e,
    m,
    em,
    is,
    namespace: CSS_NS
  }
}

const zIndex = ref(0)
export const useZIndex = () => {
  const initialZIndex = useGlobalConfig('zIndex', 1000) // TODO: move to @element-plus/constants
  const currentZIndex = computed(() => initialZIndex.value + zIndex.value)

  const nextZIndex = () => {
    zIndex.value++
    return currentZIndex.value
  }

  return {
    initialZIndex,
    currentZIndex,
    nextZIndex
  }
}

export const hasOwn = (val, key) => hasOwnProperty.call(val, key)
export const isObject = (val) => val !== null && typeof val === 'object'
export const formatDate = (date, fmt) => {
  if (typeof date == 'string') {
    date = new Date(date)
  }
  const re = /(y+)/
  if (re.test(fmt)) {
    const t = re.exec(fmt)[1]
    fmt = fmt.replace(t, (date.getFullYear() + '').substring(4 - t.length))
  }

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  for (let k in o) {
    const regx = new RegExp('(' + k + ')')
    if (regx.test(fmt)) {
      const t = regx.exec(fmt)[1]
      fmt = fmt.replace(
        t,
        t.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
