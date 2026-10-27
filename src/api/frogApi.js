import axios from 'axios'

// frog-payadmin 后端 API 封装（代理到 /pay-admin-boot）
// 参考 frog-payadmin-vue的副本/src/api/manage.js

const BASE_URL = '/pay-admin-boot'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截
service.interceptors.request.use((config) => {
  const token = localStorage.getItem('X-Access-Token')
  if (token) {
    config.headers['X-Access-Token'] = token
  }
  return config
})

// 响应拦截
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[frogApi] 请求失败:', error?.message || error)
    return Promise.reject(error)
  }
)

/** GET 请求 */
export function getAction(url, params) {
  return service.get(url, { params })
}

/** POST 请求（用于新增） */
export function postAction(url, params) {
  return service.post(url, params)
}

/** PUT 请求（用于修改） */
export function putAction(url, params) {
  return service.put(url, params)
}

/** DELETE 请求 */
export function deleteAction(url, params) {
  return service.delete(url, { params })
}

/** 通用 HTTP 请求（method 可选：get/post/put/delete） */
export function httpAction(url, params, method = 'post') {
  return service.request({ url, method, data: params })
}

/** 文件下载（返回 blob） */
export function downFile(url, params) {
  return service
    .get(url, { params, responseType: 'blob' })
    .then((res) => (res && typeof res.size !== 'undefined' ? res : null))
}

export default {
  getAction,
  postAction,
  putAction,
  deleteAction,
  httpAction,
  downFile
}
