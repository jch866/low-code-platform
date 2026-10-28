import { mockResponse, mockSimple } from './common'
import { gatewayOrMock } from './gateway'

/**
 * 流程管理 API（原页面 FlowList.vue + FlowModal.vue）
 * 真实接口地址（联调时将 mock 替换为 Axios 调用）：
 * - 列表:      /flow/manage/config/listPage
 * - 新增:      POST /flow/manage/config/add
 * - 编辑:      PUT  /flow/manage/config/edit
 * - 流程删除:  /flow/manage/config/deleteFlow（参数 {flowId}，原实现无二次确认）
 * - 导出SQL:   /flow/manage/config/exportBatchSql（原走 downFile，单条参数 {ids: record.id}，文件名含全角括号）
 * - 动态列:    /dynamic/table/column/listColumns（参数 {tableName: 'epfFlow'}）
 * - 唯一性校验: /sys/duplicate/check（参数 {tableName, fieldName, fieldVal}）
 * - 发布:      /flow/design/config/publish（原仅存在于 data 中，发布按钮已注释，暂不提供）
 */

// mock 行数据：字段名与原后端一致（epfFlowName/epfFlowCode/epfFlowState/epfFlowType/epfSystemId）
const mockList = [
  {
    id: '1',
    epfSystemId: 'pay_core',
    systemNameText: '支付核心',
    epfFlowName: '信用卡还款流程',
    epfFlowCode: 'FLOW_CREDIT_REPAY',
    epfFlowState: '1',
    epfFlowState_dictText: '已发布',
    epfFlowType: 'normal-flow',
    epfFlowType_dictText: '普通流程',
    transCode: '',
    commonFlow: false,
    parentFlowId: '',
    epfFlowVersion: '1',
    epfFlowRemarks: '',
    createTime_dateText: '2026-09-01 10:00:00'
  },
  {
    id: '2',
    epfSystemId: 'pay_core',
    systemNameText: '支付核心',
    epfFlowName: '消费交易流程',
    epfFlowCode: 'FLOW_CONSUME',
    epfFlowState: '0',
    epfFlowState_dictText: '草稿',
    epfFlowType: 'normal-flow',
    epfFlowType_dictText: '普通流程',
    transCode: '',
    commonFlow: false,
    parentFlowId: '',
    epfFlowVersion: '1',
    epfFlowRemarks: '',
    createTime_dateText: '2026-09-15 14:30:00'
  },
  {
    id: '3',
    epfSystemId: 'pay_mgr',
    systemNameText: '支付管理',
    epfFlowName: '退款流程',
    epfFlowCode: 'FLOW_REFUND',
    epfFlowState: '1',
    epfFlowState_dictText: '已发布',
    epfFlowType: 'sub-flow',
    epfFlowType_dictText: '子流程',
    transCode: '',
    commonFlow: true,
    parentFlowId: '1',
    epfFlowVersion: '2',
    epfFlowRemarks: '',
    createTime_dateText: '2026-10-01 08:20:00'
  }
]

/** 列表（/flow/manage/config/listPage；原 getQueryParams 额外传 systemName=epfSystemId） */
const mockGetFlowListImpl = (data) => {
  const { pageNo = 1, pageSize = 10 } = data
  const start = (pageNo - 1) * pageSize
  return mockResponse(mockList.slice(start, start + pageSize), mockList.length)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flow/manage/config/listPage */
const META_getFlowList = { operationType: '', url: '/flow/manage/config/listPage', method: 'GET' }
export function getFlowList(data) {
  return gatewayOrMock(META_getFlowList, mockGetFlowListImpl, data)
}

/** 新增（POST /flow/manage/config/add） */
const mockGetFlowAddImpl = (data) => mockSimple({ success: true, message: '新增成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: POST /flow/manage/config/add */
const META_getFlowAdd = { operationType: '', url: '/flow/manage/config/add', method: 'POST' }
export function getFlowAdd(data) {
  return gatewayOrMock(META_getFlowAdd, mockGetFlowAddImpl, data)
}

/** 编辑（PUT /flow/manage/config/edit） */
const mockGetFlowEditImpl = (data) => mockSimple({ success: true, message: '修改成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: PUT /flow/manage/config/edit */
const META_getFlowEdit = { operationType: '', url: '/flow/manage/config/edit', method: 'PUT' }
export function getFlowEdit(data) {
  return gatewayOrMock(META_getFlowEdit, mockGetFlowEditImpl, data)
}

/**
 * 流程删除（/flow/manage/config/deleteFlow，参数 {flowId}）
 * 原实现无二次确认，直接调用
 */
const mockGetFlowDeleteFlowImpl = (data) => mockSimple({ success: true, message: '流程删除成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flow/manage/config/deleteFlow */
const META_getFlowDeleteFlow = { operationType: '', url: '/flow/manage/config/deleteFlow', method: 'GET' }
export function getFlowDeleteFlow(data) {
  return gatewayOrMock(META_getFlowDeleteFlow, mockGetFlowDeleteFlowImpl, data)
}

/** 导出SQL（/flow/manage/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
const mockGetFlowExportBatchSqlImpl = (data) => mockSimple({ success: true, message: '导出成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flow/manage/config/exportBatchSql（原走 downFile） */
const META_getFlowExportBatchSql = { operationType: '', url: '/flow/manage/config/exportBatchSql', method: 'GET' }
export function getFlowExportBatchSql(data) {
  return gatewayOrMock(META_getFlowExportBatchSql, mockGetFlowExportBatchSqlImpl, data)
}

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=epfFlow） */
const mockGetFlowListColumnsImpl = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /dynamic/table/column/listColumns */
const META_getFlowListColumns = { operationType: '', url: '/dynamic/table/column/listColumns', method: 'GET' }
export function getFlowListColumns(data) {
  return gatewayOrMock(META_getFlowListColumns, mockGetFlowListColumnsImpl, data)
}

/**
 * 唯一性校验（/sys/duplicate/check，参数 {tableName, fieldName, fieldVal}）
 * TODO: 联调后接真实校验，重复时提示 "{字段名}已存在!"
 */
const mockGetFlowDuplicateCheckImpl = (data) =>
  mockSimple({ success: true, result: true })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/duplicate/check */
const META_getFlowDuplicateCheck = { operationType: '', url: '/sys/duplicate/check', method: 'GET' }
export function getFlowDuplicateCheck(data) {
  return gatewayOrMock(META_getFlowDuplicateCheck, mockGetFlowDuplicateCheckImpl, data)
}

/**
 * 关联流程树（/related/process/queryAssociatedProcess，参数 {pkValue}）
 * 已迁移 ParentProcess.vue「查看关联流程」用：返回树形对象 {name, children:[...]}（原 echarts 树图数据源），
 * mock 返回三层示例树（节点名称与列表页 mock 流程对应），联调后替换为真实 Axios 调用
 */
const mockGetAssociatedProcessImpl = (data) =>
  mockSimple({
    success: true,
    result: {
      name: '消费交易流程(FLOW_CONSUME)',
      children: [
        {
          name: '开始节点',
          children: [
            { name: '风险校验(黑名单检查规则)', children: [] },
            { name: '金额校验(金额超限规则)', children: [] }
          ]
        },
        { name: '扣款节点', children: [{ name: '退款子流程(FLOW_REFUND)', children: [] }] },
        { name: '结束节点', children: [] }
      ]
    }
  })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /related/process/queryAssociatedProcess */
const META_getAssociatedProcess = { operationType: '', url: '/related/process/queryAssociatedProcess', method: 'GET' }
export function getAssociatedProcess(data) {
  return gatewayOrMock(META_getAssociatedProcess, mockGetAssociatedProcessImpl, data)
}
