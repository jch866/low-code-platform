import Axios from '@/utils/axios'
import { BASE_URL_DATA } from '@/config/config'

/**
 * 低代码平台公共 API
 * 注意：当前接口暂不通，所有函数返回 mock 数据结构
 * 后续联调时将 mock 替换为真实 Axios 调用即可
 */

// Mock 数据生成器
const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

const mockResponse = (list, total = list.length) => ({
  returnCode: '0000',
  returnMsg: 'success',
  result: list,
  totalCount: total
})

const mockSimple = (data = {}) => ({
  returnCode: '0000',
  returnMsg: 'success',
  ...data
})

export { Axios, BASE_URL_DATA, mockDelay, mockResponse, mockSimple }
