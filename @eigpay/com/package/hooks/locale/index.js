import { unref, computed } from 'vue'
import { useGlobalConfig } from '../globalConfig'
import get from 'lodash/get'
import merge from 'lodash/merge'
import en from './defaults/en.js'
import zh_CN from './defaults/zh_CN.js'

const defaultMessages = {
  en,
  zh_CN
}

/**
 * 使用多语言特性
 * @param {*} localeName 要使用那种语言，不提供整个参数是，使用的语言依赖全局变量中的locale.name, 全局变量如果也没有设置，默认en
 * @returns {
 *  t
 * }
 * t(path, options), options 是选填
 */
export const useLocale = (localeName) => {
  return {
    t: buildTranslator(localeName)
  }
}

const buildTranslator = (localeName) => {
  return (path, options) => {
    const globalLocal = unref(useGlobalConfig('locale'))
    const name = computed(() => {
      return localeName || get(globalLocal, 'name') || 'en'
    })
    const defaultMessage = get(defaultMessages, name.value)
    const message = merge(
      {},
      defaultMessage,
      get(globalLocal, `messages.${name.value}`)
    )
    return get(message, path, path).replace(/\{(\w+)\}/g, (m, key) =>
      get(options, key, key)
    )
  }
}
