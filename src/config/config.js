import { uuidGenerator } from '@/utils/utils.js'
export const SUCCESS_STATUS = '0000'
export const PAGE_SIZE = 10
export const PAGE_NO = 1
export const PAGE_SIZES = [10, 20, 30]
export const LABEL_SUFFIX = ' :'
export const INVALID_SESSION_STATUS = 2000

export const API_PARAMETER = {
  operationType: '1234124',
  appId: '900009',
  merchId: '',
  version: '1.0.0',
  language: localStorage.getItem('language') || 'zh_cn',
  nonceStr: uuidGenerator()
}
// /mock/28/oprationType || /optg/gateway/oprationType
// export const BASE_URL = '/mock/'
export const BASE_URL = '/optg/'

// 外挂文件配置
export const GLOB = 'abc'|| JSON.parse(localStorage.getItem('GLOB_URL')).BASE_URL

// API统一URL
export const BASE_URL_DATA = '/gateway'
// 上传下载接口统一管理
export const COMMON_API_LIST = [
  'eigpay.sp.optm.service.common.simpleFileUpload'
]

// 公共状态颜色值
export const GREEN_COLOR = '#00B42A'
export const GREY_COLOR = '#D3D3D3'
export const BLUE_COLOR = '#262AFF'
export const ORANGE_COLOR = '#FF7D00'
export const RED_COLOR = '#F53F3F'
export default {
  SUCCESS_STATUS,
  PAGE_SIZE,
  PAGE_SIZES,
  LABEL_SUFFIX,
  API_PARAMETER,
  BASE_URL,
  GLOB
}
