import { getCurrentInstance, ref, computed, unref, provide, inject } from 'vue'
import merge from 'lodash/merge'
import get from 'lodash/get'

export const GLOBAL_CONFIG_KEY = Symbol('globalConfig')

const globalConfig = ref({
  zIndex: 1000,
  dialect: ''
})

// 注册全局配置信息
export const registryGlobalConfig = (options, app, global) => {
  const isInSetup = !!getCurrentInstance()
  const oldConfig = isInSetup ? useGlobalConfig() : undefined

  const provideFn =
    app && app.provide ? app.provide : isInSetup ? provide : undefined

  if (!provideFn) {
    // 'registry() can only be used inside setup().'
    return
  }

  const context = computed(() => {
    const cfg = unref(options)
    if (!oldConfig?.value) return options
    return merge({}, oldConfig.value, cfg)
  })
  provideFn(GLOBAL_CONFIG_KEY, context)
  if (global || !globalConfig.value) {
    globalConfig.value = context.value
  }
  return context
}

/**
 * 获取全局配置的信息
 * @param {*} key , 要获取的属性，如果不提供key，得到的是整个全局配置信息对象
 * @param {*} defaults, 属性值不存时的默认值
 * @returns 配置信息
 */
export const useGlobalConfig = (key, defaults) => {
  const config = getCurrentInstance()
    ? inject(GLOBAL_CONFIG_KEY, globalConfig)
    : globalConfig
  if (key) {
    return computed(() => {
      const cfg = unref(config)
      return get(cfg, `${key}`, defaults)
    })
  } else {
    return config
  }
}
