import { mockResponse, mockSimple } from './common'

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
export const getRegulatorInfoList = (data) => {
  const { pageNo = 1, pageSize = 10 } = data
  const start = (pageNo - 1) * pageSize
  return mockResponse(mockList.slice(start, start + pageSize), mockList.length)
}

/** 新增（POST /configuation/regulatorinfo/config/add） */
export const getRegulatorInfoAdd = (data) => mockSimple({ success: true, message: '新增成功' })

/** 编辑（PUT /configuation/regulatorinfo/config/edit） */
export const getRegulatorInfoEdit = (data) => mockSimple({ success: true, message: '修改成功' })

/** 删除（/configuation/regulatorinfo/config/delete） */
export const getRegulatorInfoDelete = (data) => mockSimple({ success: true, message: '删除成功' })

/** 批量删除（/configuation/regulatorinfo/config/deleteBatch，参数 {ids}） */
export const getRegulatorInfoDeleteBatch = (data) => mockSimple({ success: true, message: '批量删除成功' })

/** 导出Sql（/configuation/regulatorinfo/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
export const getRegulatorInfoExportBatchSql = (data) => mockSimple({ success: true, message: '导出成功' })

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=regulatorInfo；mock 返回空列，联调后取 allColumnsItems） */
export const getRegulatorInfoListColumns = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })
