import { mockResponse, mockSimple } from './common'
import { gatewayOrMock } from './gateway'

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

// mock 行数据：字段名与原后端一致（regulatorId=规则标识，regulatorName=规则名称；createTime 供 JSelectRegulator 选择器按 createTime 排序分页）
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
    createTime: '2026-09-01 10:00:00',
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
    createTime: '2026-09-15 14:30:00',
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
    createTime: '2026-10-01 08:20:00',
    createTime_dateText: '2026-10-01 08:20:00',
    updateTime_dateText: '2026-10-12 16:45:00'
  }
]

/**
 * 列表（/configuation/regulatorrule/config/listPage）
 * 供规则列表页与 JSelectRegulator 选择器弹窗共用；查询参数（原 JeecgListMixin）：
 * - regulatorId（规则标识，选择器回显按此反查，支持逗号分隔多值）/ regulatorName（规则名称，模糊）
 * - systemName / regulatorSubType（原字典过滤）+ column/order（排序）+ pageNo/pageSize（分页）
 */
const mockGetRegulatorRuleListImpl = (data = {}) => {
  const { pageNo = 1, pageSize = 10, column = 'createTime', order = 'desc', regulatorId, regulatorName, systemName, regulatorSubType } = data
  let filtered = [...mockList]
  if (regulatorId) {
    // 选择器回显按 regulatorId 反查（与源 valueKey=regulatorId 拼接值对应，逗号分隔多值逐一匹配）
    const ids = String(regulatorId).split(',')
    filtered = filtered.filter((i) => ids.includes(i.regulatorId))
  }
  if (regulatorName) filtered = filtered.filter((i) => i.regulatorName.includes(regulatorName))
  if (systemName) filtered = filtered.filter((i) => i.systemName === systemName)
  if (regulatorSubType) filtered = filtered.filter((i) => i.regulatorSubType === regulatorSubType)
  if (column === 'createTime') {
    filtered.sort((a, b) =>
      order === 'asc' ? a.createTime.localeCompare(b.createTime) : b.createTime.localeCompare(a.createTime)
    )
  }
  const start = (pageNo - 1) * pageSize
  return mockResponse(filtered.slice(start, start + pageSize), filtered.length)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorrule/config/listPage */
const META_getRegulatorRuleList = { operationType: '', url: '/configuation/regulatorrule/config/listPage', method: 'GET' }
export function getRegulatorRuleList(data = {}) {
  return gatewayOrMock(META_getRegulatorRuleList, mockGetRegulatorRuleListImpl, data)
}

/** 新增（POST /configuation/regulatorrule/config/add） */
const mockGetRegulatorRuleAddImpl = (data) => mockSimple({ success: true, message: '新增成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: POST /configuation/regulatorrule/config/add */
const META_getRegulatorRuleAdd = { operationType: '', url: '/configuation/regulatorrule/config/add', method: 'POST' }
export function getRegulatorRuleAdd(data) {
  return gatewayOrMock(META_getRegulatorRuleAdd, mockGetRegulatorRuleAddImpl, data)
}

/** 编辑（PUT /configuation/regulatorrule/config/edit） */
const mockGetRegulatorRuleEditImpl = (data) => mockSimple({ success: true, message: '修改成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: PUT /configuation/regulatorrule/config/edit */
const META_getRegulatorRuleEdit = { operationType: '', url: '/configuation/regulatorrule/config/edit', method: 'PUT' }
export function getRegulatorRuleEdit(data) {
  return gatewayOrMock(META_getRegulatorRuleEdit, mockGetRegulatorRuleEditImpl, data)
}

/** 删除（/configuation/regulatorrule/config/delete） */
const mockGetRegulatorRuleDeleteImpl = (data) => mockSimple({ success: true, message: '删除成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorrule/config/delete */
const META_getRegulatorRuleDelete = { operationType: '', url: '/configuation/regulatorrule/config/delete', method: 'GET' }
export function getRegulatorRuleDelete(data) {
  return gatewayOrMock(META_getRegulatorRuleDelete, mockGetRegulatorRuleDeleteImpl, data)
}

/** 批量删除（/configuation/regulatorrule/config/deleteBatch，参数 {ids}） */
const mockGetRegulatorRuleDeleteBatchImpl = (data) => mockSimple({ success: true, message: '批量删除成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorrule/config/deleteBatch */
const META_getRegulatorRuleDeleteBatch = { operationType: '', url: '/configuation/regulatorrule/config/deleteBatch', method: 'GET' }
export function getRegulatorRuleDeleteBatch(data) {
  return gatewayOrMock(META_getRegulatorRuleDeleteBatch, mockGetRegulatorRuleDeleteBatchImpl, data)
}

/** 导出Sql（/configuation/regulatorrule/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
const mockGetRegulatorRuleExportBatchSqlImpl = (data) => mockSimple({ success: true, message: '导出成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorrule/config/exportBatchSql（原走 downFile） */
const META_getRegulatorRuleExportBatchSql = { operationType: '', url: '/configuation/regulatorrule/config/exportBatchSql', method: 'GET' }
export function getRegulatorRuleExportBatchSql(data) {
  return gatewayOrMock(META_getRegulatorRuleExportBatchSql, mockGetRegulatorRuleExportBatchSqlImpl, data)
}

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=regulatorRule） */
const mockGetRegulatorRuleListColumnsImpl = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /dynamic/table/column/listColumns */
const META_getRegulatorRuleListColumns = { operationType: '', url: '/dynamic/table/column/listColumns', method: 'GET' }
export function getRegulatorRuleListColumns(data) {
  return gatewayOrMock(META_getRegulatorRuleListColumns, mockGetRegulatorRuleListColumnsImpl, data)
}

/**
 * 类处理器联动（/configuation/regulatorinfo/config/queryByClassName，参数 {systemName, className}）
 * 原实现：选择类处理器后调用该接口初始化源/目标数据集与扩展参数（RegulatorRuleModal.changeRuleInfo / SubListRegulatorList.changeRuleInfo）
 * mock 返回 sourceAcct/targetAcct/regulatorInfoParams 示意结构（与后端 RegulatorInfo 一致），联调后替换为真实 Axios 调用
 */
const mockGetRuleInfoByClassNameImpl = (data) =>
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
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorinfo/config/queryByClassName */
const META_getRuleInfoByClassName = { operationType: '', url: '/configuation/regulatorinfo/config/queryByClassName', method: 'GET' }
export function getRuleInfoByClassName(data) {
  return gatewayOrMock(META_getRuleInfoByClassName, mockGetRuleInfoByClassNameImpl, data)
}

/** 规则引用（/related/process/queryAssociatedRules，参数 {pkValue}；mock 返回空列表，无假数据） */
const mockGetAssociatedRulesImpl = (data) => mockSimple({ success: true, result: [] })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /related/process/queryAssociatedRules */
const META_getAssociatedRules = { operationType: '', url: '/related/process/queryAssociatedRules', method: 'GET' }
export function getAssociatedRules(data) {
  return gatewayOrMock(META_getAssociatedRules, mockGetAssociatedRulesImpl, data)
}

/** 流程引用（/related/process/queryAssociatedFlowCorrelationRules，参数 {pkValue}；mock 返回空列表） */
const mockGetAssociatedFlowRulesImpl = (data) => mockSimple({ success: true, result: [] })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /related/process/queryAssociatedFlowCorrelationRules */
const META_getAssociatedFlowRules = { operationType: '', url: '/related/process/queryAssociatedFlowCorrelationRules', method: 'GET' }
export function getAssociatedFlowRules(data) {
  return gatewayOrMock(META_getAssociatedFlowRules, mockGetAssociatedFlowRulesImpl, data)
}

/** 交互引用（/related/process/queryAssociatedSwapCorrelationRules，参数 {pkValue}；mock 返回空列表） */
const mockGetAssociatedSwapRulesImpl = (data) => mockSimple({ success: true, result: [] })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /related/process/queryAssociatedSwapCorrelationRules */
const META_getAssociatedSwapRules = { operationType: '', url: '/related/process/queryAssociatedSwapCorrelationRules', method: 'GET' }
export function getAssociatedSwapRules(data) {
  return gatewayOrMock(META_getAssociatedSwapRules, mockGetAssociatedSwapRulesImpl, data)
}

/**
 * 规则处理器关联引用（/related/process/queryAssociatedRuleProcessor，参数 {pkValue}）
 * 已迁移 ParentProcessRuleInfoList.vue「查看关联引用」用：返回 {code, name, children:[{name}]}，
 * children 为引用该规则处理器的流程/规则名称列表（弹窗内搜索 + 分页展示，每页 15 条）；
 * mock 返回 17 条示例引用，联调后替换为真实 Axios 调用
 */
const mockGetAssociatedRuleProcessorImpl = (data) =>
  mockSimple({
    success: true,
    result: {
      code: 'RULE_AMOUNT_LIMIT',
      name: '金额超限规则',
      children: [
        { name: '消费交易流程(FLOW_CONSUME)' },
        { name: '信用卡还款流程(FLOW_CREDIT_REPAY)' },
        { name: '退款流程(FLOW_REFUND)' },
        { name: '转账流程(FLOW_TRANSFER)' },
        { name: '对账流程(FLOW_RECONCILE)' },
        { name: '清分流程(FLOW_CLEARING)' },
        { name: '出款流程(FLOW_PAYOUT)' },
        { name: '入款流程(FLOW_PAYIN)' },
        { name: '充值流程(FLOW_RECHARGE)' },
        { name: '提现流程(FLOW_WITHDRAW)' },
        { name: '冲正流程(FLOW_REVERSE)' },
        { name: '分账流程(FLOW_SPLIT)' },
        { name: '代付流程(FLOW_AGENT_PAYOUT)' },
        { name: '代收流程(FLOW_AGENT_PAYIN)' },
        { name: '结算流程(FLOW_SETTLE)' },
        { name: '风控审核流程(FLOW_RISK_AUDIT)' },
        { name: '退款审核流程(FLOW_REFUND_AUDIT)' }
      ]
    }
  })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /related/process/queryAssociatedRuleProcessor */
const META_getAssociatedRuleProcessor = { operationType: '', url: '/related/process/queryAssociatedRuleProcessor', method: 'GET' }
export function getAssociatedRuleProcessor(data) {
  return gatewayOrMock(META_getAssociatedRuleProcessor, mockGetAssociatedRuleProcessorImpl, data)
}
