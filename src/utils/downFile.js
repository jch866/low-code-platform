import axios from 'axios'

/**
 * 文件下载封装（迁移自 Vue2 工程 frog-payadmin-vue的副本/src/api/manage.js 的 downFile
 * 与 JeecgListMixin.js 的 dataStreamToFile/formatDate，axios 拦截器风格参照本项目 src/api/frogApi.js）
 *
 * 真实可用：axios 以 blob 方式 GET 后端 → 校验响应类型 → a 标签触发浏览器保存
 * 真实接口地址（联调时仅需确认后端可用，页面调用处 URL 已按源工程原样保留，无需改动本文件）：
 * - 动态表导出:    GET /dynamic/table/exportBatchSql                      （参数 {ids, sqlType:'DDL'|'DML'}）
 * - 规则处理器导出: GET /configuation/regulatorinfo/config/exportBatchSql   （参数 {ids, sqlType}）
 * - 业务规则导出:  GET /configuation/regulatorrule/config/exportBatchSql    （参数 {ids, sqlType}）
 * - 流程节点导出:  GET /flownode/manage/config/exportBatchSql               （参数 {ids, sqlType}）
 * - 流程导出:     GET /flow/manage/config/exportBatchSql                    （参数 {ids}）
 *
 * 当前后端接口暂不通：页面接入处统一在请求失败时提示「导出功能已迁移，接口待联调」，
 * 联调时后端通了即可真实下载，页面无需再改（仅文件名按需调整）。
 */

// 与 src/api/frogApi.js 保持一致的 baseURL
const BASE_URL = '/pay-admin-boot'

const service = axios.create({
  baseURL: BASE_URL,
  // 与源 downFile 一致：下载超时 300 秒
  timeout: 300000
})

// 请求拦截：附带 token（与 frogApi.js 一致）
service.interceptors.request.use((config) => {
  const token = localStorage.getItem('X-Access-Token')
  if (token) {
    config.headers['X-Access-Token'] = token
  }
  return config
})

/**
 * 下载文件（用于 sql/excel/zip 等导出，迁移自源 downFile + dataStreamToFile）
 * @param {String} url 接口地址（不含 baseURL，如 /dynamic/table/exportBatchSql）
 * @param {Object} [params] 查询参数
 * @param {String} [fileName] 自定义文件名；缺省时优先从 Content-Disposition 解析，
 *                            再退化为 yyyyMMddHHmmss.sql（与源 mixin exportBatchSql 的默认文件名一致）
 * @returns {Promise<boolean>} 下载成功 resolve true；失败 reject（页面 catch 中统一提示）
 */
export function downFile(url, params, fileName) {
  return service
    .get(url, { params, responseType: 'blob' })
    .then((response) => {
      const blob = response.data
      const contentType = (response.headers && response.headers['content-type']) || ''
      // 后端异常/未通时通常返回 json/html 文本而非文件流，按失败处理（避免把错误报文存成 .sql 文件）
      if (!blob || blob.size === 0 || /application\/json|text\/html|text\/plain/.test(contentType)) {
        throw new Error('导出接口响应异常（接口待联调）')
      }
      saveBlobToFile(blob, fileName || parseFileName(response.headers) || formatDate(new Date()) + '.sql')
      return true
    })
}

/** 触发浏览器保存（迁移自源 JeecgListMixin.dataStreamToFile） */
function saveBlobToFile(blob, fileName) {
  const url = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // 下载完成移除元素
  window.URL.revokeObjectURL(url) // 释放掉 blob 对象
}

/** 从 Content-Disposition 解析文件名（支持 filename*=UTF-8'' 与 filename="xxx" 两种格式） */
function parseFileName(headers) {
  const disposition = (headers && (headers['content-disposition'] || headers['Content-Disposition'])) || ''
  if (!disposition) return ''
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1].replace(/["']/g, ''))
    } catch (e) {
      return utf8Match[1].replace(/["']/g, '')
    }
  }
  const match = disposition.match(/filename="?([^";]+)"?/i)
  return (match && match[1]) || ''
}

/** 日期格式化（迁移自源 JeecgListMixin.formatDate：yyyyMMddHHmmss） */
export function formatDate(date) {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = date.getDate()
  day = day < 10 ? '0' + day : day
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return '' + year + month + day + hour + minute + second
}

export default downFile
