import { mockResponse, mockSimple } from './common'

/**
 * 业务规则 API（原页面 RegulatorRuleList.vue + RegulatorRuleModal.vue）
 * 真实接口地址（联调时将 mock 替换为 Axios 调用，拼写原样保留 configuation）：
 * - 列表:      /configuation/regulatorrule/config/listPage
 * - 新增:      POST /configuation/regulatorrule/config/add
 * - 编辑:      PUT  /configuation/regulatorrule/config/edit
 * - 删除:      /configuation/regulatorrule/config/delete
 * - 批量删除:  /configuation/regulatorrule/config/deleteBatch
 * - 导出Sql:   /configuation/regulatorrule/config/exportBatchSql（原走 downFile，参数 {ids, sqlType}）
 * - 动态列:    /dynamic/table/column/listColumns（参数 {tableName: 'regulatorRule'}）
 * - 类处理器联动: /configuation/regulatorinfo/config/queryByClassName（参数 {systemName, className}）
 * - 规则引用:  /related/process/queryAssociatedRules（参数 {pkValue}）
 * - 流程引用:  /related/process/queryAssociatedFlowCorrelationRules（参数 {pkValue}）
 * - 交互引用:  /related/process/queryAssociatedSwapCorrelationRules（参数 {pkValue}）
 */

// mock 行数据：字段名与原后端一致（regulatorId=规则标识，regulatorName=规则名称）
const mockList = [
  {
    id: '1',
    systemName: 'pay_core',
    systemNameText: '支付核心',
    regulatorId: 'RULE_AMOUNT_LIMIT',
    regulatorName: '金额超限规则',
    regulatorSubType: 'SINGLE_DECISION',
    regulatorSubType_dictText: '单决策',
    asCommon: false,
    transCode: '',
    className: 'AmountValidator',
    createTime_dateText: '2026-09-01 10:00:00',
    updateTime_dateText: '2026-09-15 10:00:00'
  },
  {
    id: '2',
    systemName: 'pay_core',
    systemNameText: '支付核心',
    regulatorId: 'RULE_BLACK_LIST',
    regulatorName: '黑名单检查规则',
    regulatorSubType: 'MUTIL_DECISION',
    regulatorSubType_dictText: '多决策',
    asCommon: true,
    transCode: '',
    className: '',
    createTime_dateText: '2026-09-15 14:30:00',
    updateTime_dateText: '2026-09-20 09:00:00'
  },
  {
    id: '3',
    systemName: 'pay_mgr',
    systemNameText: '支付管理',
    regulatorId: 'RULE_MERGE',
    regulatorName: '合并校验规则',
    regulatorSubType: 'JOIN',
    regulatorSubType_dictText: '合并',
    asCommon: false,
    transCode: '',
    className: '',
    createTime_dateText: '2026-10-01 08:20:00',
    updateTime_dateText: '2026-10-12 16:45:00'
  }
]

/** 列表（/configuation/regulatorrule/config/listPage） */
export const getRegulatorRuleList = (data) => {
  const { pageNo = 1, pageSize = 10 } = data
  const start = (pageNo - 1) * pageSize
  return mockResponse(mockList.slice(start, start + pageSize), mockList.length)
}

/** 新增（POST /configuation/regulatorrule/config/add） */
export const getRegulatorRuleAdd = (data) => mockSimple({ success: true, message: '新增成功' })

/** 编辑（PUT /configuation/regulatorrule/config/edit） */
export const getRegulatorRuleEdit = (data) => mockSimple({ success: true, message: '修改成功' })

/** 删除（/configuation/regulatorrule/config/delete） */
export const getRegulatorRuleDelete = (data) => mockSimple({ success: true, message: '删除成功' })

/** 批量删除（/configuation/regulatorrule/config/deleteBatch，参数 {ids}） */
export const getRegulatorRuleDeleteBatch = (data) => mockSimple({ success: true, message: '批量删除成功' })

/** 导出Sql（/configuation/regulatorrule/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
export const getRegulatorRuleExportBatchSql = (data) => mockSimple({ success: true, message: '导出成功' })

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=regulatorRule） */
export const getRegulatorRuleListColumns = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })

/**
 * 类处理器联动（/configuation/regulatorinfo/config/queryByClassName，参数 {systemName, className}）
 * 原实现：选择类处理器后调用该接口初始化源/目标数据集与扩展参数（RegulatorRuleModal.changeRuleInfo / SubListRegulatorList.changeRuleInfo）
 * mock 返回 sourceAcct/targetAcct/regulatorInfoParams 示意结构（与后端 RegulatorInfo 一致），联调后替换为真实 Axios 调用
 */
export const getRuleInfoByClassName = (data) =>
  mockSimple({
    success: true,
    result: {
      className: data.className,
      classPath: 'com.eigpay.regulator.' + (data.className || ''),
      sourceAcct: 2,
      targetAcct: 1,
      regulatorInfoParams: [
        { paramName: 'param1', dataType: 'FIXED', paramDefaultValue: { value: '' } },
        { paramName: 'param2', dataType: 'DICT', paramDefaultValue: { value: '' } }
      ]
    }
  })

/** 规则引用（/related/process/queryAssociatedRules，参数 {pkValue}；mock 返回空列表，无假数据） */
export const getAssociatedRules = (data) => mockSimple({ success: true, result: [] })

/** 流程引用（/related/process/queryAssociatedFlowCorrelationRules，参数 {pkValue}；mock 返回空列表） */
export const getAssociatedFlowRules = (data) => mockSimple({ success: true, result: [] })

/** 交互引用（/related/process/queryAssociatedSwapCorrelationRules，参数 {pkValue}；mock 返回空列表） */
export const getAssociatedSwapRules = (data) => mockSimple({ success: true, result: [] })
