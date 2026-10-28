/**
 * 低代码平台网关调用层（Option B：operationType 占位，参考 IT-configuration-center 网关模式）
 *
 * 联调切换方式：后端提供服务码（operationType）后，只需把对应 api 文件里 META 常量的
 * operationType 字段填上服务码，该接口即自动从本地 mock 切换为网关直连，页面零改动。
 *
 * 响应解包说明：复用 frogApi 的 axios 实例（携带 X-Access-Token 请求头拦截器），
 * 其响应拦截器已解包返回 response.data（完整响应体 {returnCode, returnMsg, result, ...}），
 * 与本层 mockResponse/mockSimple 约定的 {returnCode, result} 形状一致；
 * 注意与 IT-configuration-center 模式的差异：后者拦截器会再解包一层，返回 data.resultData 子对象。
 */

import { BASE_URL_DATA } from '@/config/config'
import { service } from '@/api/frogApi'

/**
 * 网关统一调用（服务码 operationType 由后端提供后填入各 META 常量）
 * @param {string} operationType 网关服务码，如 'eigpay.scp.xxx.yyy'
 * @param {Object|string} requestData 业务入参（自动 JSON.stringify，与 IT 网关报文格式一致）
 * @returns {Promise<Object>} 响应体 {returnCode, returnMsg, result, ...}
 */
export function callGateway(operationType, requestData) {
  return service.post(BASE_URL_DATA, {
    operationType,
    requestData: JSON.stringify(requestData || {})
  })
}

/**
 * 网关/mock 双轨分发
 * @param {Object} meta 各 api 文件中的 META 常量 {operationType, url, method}
 * @param {Function} mockFn 本地 mock 实现（联调完成后可整段删除）
 * @param {*} requestData 业务入参（原样透传：网关分支 JSON 序列化，mock 分支按原签名接收）
 * @returns {Promise<*>} 统一 Promise 语义（mock 实现同步返回值也会被包装为 Promise）
 */
export async function gatewayOrMock(meta, mockFn, requestData) {
  // operationType 为非空字符串 → 走网关直连；否则走本地 mock 实现
  if (typeof meta.operationType === 'string' && meta.operationType !== '') {
    return callGateway(meta.operationType, requestData)
  }
  return mockFn(requestData)
}
