import { mockResponse, mockSimple } from './common'
import { gatewayOrMock } from './gateway'

/**
 * 规则处理器 API（原页面 RegulatorInfoList.vue + RegulatorInfoModal.vue）
 * 真实接口地址（联调时将 mock 替换为 Axios 调用，拼写原样保留 configuation）：
 * - 列表:      /configuation/regulatorinfo/config/list
 * - 新增:      POST /configuation/regulatorinfo/config/add
 * - 编辑:      PUT  /configuation/regulatorinfo/config/edit
 * - 删除:      /configuation/regulatorinfo/config/delete
 * - 批量删除:  /configuation/regulatorinfo/config/deleteBatch
 * - 导出Sql:   /configuation/regulatorinfo/config/exportBatchSql（原走 downFile，参数 {ids, sqlType}，无 DDL 入参时 sqlType='DML'）
 * - 动态列:    /dynamic/table/column/listColumns（参数 {tableName: 'regulatorInfo'}，取 res.result.allColumnsItems）
 */

// mock 行数据：字段名与原后端一致（含 _dictText/_dateText 后缀列，由后端直接返回）
const mockList = [
  {
    id: '1',
    systemName: 'pay_core',
    systemNameText: '支付核心',
    processorName: '金额校验处理器',
    className: 'AmountValidator',
    classPath: 'com.eigpay.pay.validator.AmountValidator',
    scriptType: 'GROOVY',
    scriptType_dictText: 'Groovy脚本',
    scriptContent: 'def validate(amount) { return amount != null }',
    sourceAcct: '1',
    targetAcct: '1',
    regulatorInfoParams: [],
    createTime_dateText: '2026-09-01 10:00:00',
    updateTime_dateText: '2026-09-15 10:00:00'
  },
  {
    id: '2',
    systemName: 'pay_core',
    systemNameText: '支付核心',
    processorName: '签名验签处理器',
    className: 'SignatureHandler',
    classPath: 'com.eigpay.pay.sign.SignatureHandler',
    scriptType: 'JAVA',
    scriptType_dictText: 'Java类',
    scriptContent: '',
    sourceAcct: '1',
    targetAcct: '1',
    regulatorInfoParams: [],
    createTime_dateText: '2026-09-15 14:30:00',
    updateTime_dateText: '2026-09-20 09:00:00'
  },
  {
    id: '3',
    systemName: 'pay_mgr',
    systemNameText: '支付管理',
    processorName: '路由选择处理器',
    className: 'RouteSelector',
    classPath: '',
    scriptType: 'GROOVY',
    scriptType_dictText: 'Groovy脚本',
    scriptContent: 'def route(ctx) { return ctx.channel }',
    sourceAcct: '2',
    targetAcct: '1',
    regulatorInfoParams: [],
    createTime_dateText: '2026-10-01 08:20:00',
    updateTime_dateText: '2026-10-12 16:45:00'
  }
]

/** 列表（POST /configuation/regulatorinfo/config/list） */
const mockGetRegulatorInfoListImpl = (data) => {
  const { pageNo = 1, pageSize = 10 } = data
  const start = (pageNo - 1) * pageSize
  return mockResponse(mockList.slice(start, start + pageSize), mockList.length)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: POST /configuation/regulatorinfo/config/list */
const META_getRegulatorInfoList = { operationType: '', url: '/configuation/regulatorinfo/config/list', method: 'POST' }
export function getRegulatorInfoList(data) {
  return gatewayOrMock(META_getRegulatorInfoList, mockGetRegulatorInfoListImpl, data)
}

/** 新增（POST /configuation/regulatorinfo/config/add） */
const mockGetRegulatorInfoAddImpl = (data) => mockSimple({ success: true, message: '新增成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: POST /configuation/regulatorinfo/config/add */
const META_getRegulatorInfoAdd = { operationType: '', url: '/configuation/regulatorinfo/config/add', method: 'POST' }
export function getRegulatorInfoAdd(data) {
  return gatewayOrMock(META_getRegulatorInfoAdd, mockGetRegulatorInfoAddImpl, data)
}

/** 编辑（PUT /configuation/regulatorinfo/config/edit） */
const mockGetRegulatorInfoEditImpl = (data) => mockSimple({ success: true, message: '修改成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: PUT /configuation/regulatorinfo/config/edit */
const META_getRegulatorInfoEdit = { operationType: '', url: '/configuation/regulatorinfo/config/edit', method: 'PUT' }
export function getRegulatorInfoEdit(data) {
  return gatewayOrMock(META_getRegulatorInfoEdit, mockGetRegulatorInfoEditImpl, data)
}

/** 删除（/configuation/regulatorinfo/config/delete） */
const mockGetRegulatorInfoDeleteImpl = (data) => mockSimple({ success: true, message: '删除成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorinfo/config/delete */
const META_getRegulatorInfoDelete = { operationType: '', url: '/configuation/regulatorinfo/config/delete', method: 'GET' }
export function getRegulatorInfoDelete(data) {
  return gatewayOrMock(META_getRegulatorInfoDelete, mockGetRegulatorInfoDeleteImpl, data)
}

/** 批量删除（/configuation/regulatorinfo/config/deleteBatch，参数 {ids}） */
const mockGetRegulatorInfoDeleteBatchImpl = (data) => mockSimple({ success: true, message: '批量删除成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorinfo/config/deleteBatch */
const META_getRegulatorInfoDeleteBatch = { operationType: '', url: '/configuation/regulatorinfo/config/deleteBatch', method: 'GET' }
export function getRegulatorInfoDeleteBatch(data) {
  return gatewayOrMock(META_getRegulatorInfoDeleteBatch, mockGetRegulatorInfoDeleteBatchImpl, data)
}

/** 导出Sql（/configuation/regulatorinfo/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
const mockGetRegulatorInfoExportBatchSqlImpl = (data) => mockSimple({ success: true, message: '导出成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorinfo/config/exportBatchSql（原走 downFile） */
const META_getRegulatorInfoExportBatchSql = { operationType: '', url: '/configuation/regulatorinfo/config/exportBatchSql', method: 'GET' }
export function getRegulatorInfoExportBatchSql(data) {
  return gatewayOrMock(META_getRegulatorInfoExportBatchSql, mockGetRegulatorInfoExportBatchSqlImpl, data)
}

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=regulatorInfo；mock 返回空列，联调后取 allColumnsItems） */
const mockGetRegulatorInfoListColumnsImpl = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /dynamic/table/column/listColumns */
const META_getRegulatorInfoListColumns = { operationType: '', url: '/dynamic/table/column/listColumns', method: 'GET' }
export function getRegulatorInfoListColumns(data) {
  return gatewayOrMock(META_getRegulatorInfoListColumns, mockGetRegulatorInfoListColumnsImpl, data)
}
