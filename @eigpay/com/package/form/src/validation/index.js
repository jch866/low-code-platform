export const __proxy = Symbol('validateProxy')

import required from './required'
import range from './range'
import email from './email'
import pattern from './pattern'
import number from './number'
import char from './char'
import url from './url'
import twId from './twId'
import fn from './fn'
import local from './local'

const validation = {
  required,
  range,
  email,
  pattern,
  number,
  char,
  url,
  twId,
  local,
  fn
}

export const isProxyRule = (obj) => {
  return !!obj[__proxy]
}

export default new Proxy(validation, {
  get(target, key) {
    const value = Reflect.get(target, key)
    return value?.()
  }
})
