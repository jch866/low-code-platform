import merge from 'lodash/merge.js'
import common from './common.js'
import zh_TW from './zh_TW.js'

export default {
  common,
  zh_TW: merge({}, common, zh_TW)
}
