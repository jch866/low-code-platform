import { mockResponse, mockSimple } from './common'
import { gatewayOrMock } from './gateway'

/**
 * 流程节点管理 API（原页面 FlowNodeList.vue + FlowNodeModal.vue）
 * 真实接口地址（联调时将 mock 替换为 Axios 调用）：
 * - 列表:      /flownode/manage/config/listPage
 * - 新增:      POST /flownode/manage/config/add
 * - 编辑:      PUT  /flownode/manage/config/edit
 * - 删除:      /flownode/manage/config/delete
 * - 导出SQL:   /flownode/manage/config/exportBatchSql（原走 downFile，参数 {ids, sqlType}）
 * - 动态列:    /dynamic/table/column/listColumns（参数 {tableName: 'epfFlowNode'}）
 * - 唯一性校验: /sys/duplicate/check（参数 {tableName, fieldName, fieldVal}）
 * - 节点引用:  /related/process/queryAssociatedProcessNodes（参数 {pkValue}）
 */

// mock 行数据：字段名与原后端一致；rowKey=primaryKey（非 id，删除/选中仍用 id）
const mockList = [
  {
    id: '1',
    primaryKey: 'pk_node_1',
    tableName: 'epf_flow_node',
    epfSystemId: 'pay_core',
    systemNameText: '支付核心',
    epfFlowNodeName: '开始节点',
    epfFlowNodeCode: 'NODE_START',
    epfFlowNodeProcessor: 'StartProcessor',
    epfFlowNodeDealType: 'SYNC',
    epfFlowNodeDealType_dictText: '同步处理',
    epfFlowNodeType: '0',
    epfFlowNodeType_dictText: '业务节点',
    epfFlowSubNodeType: '0',
    epfFlowSubNodeType_dictText: '普通节点',
    epfFlowNodeStatus: '0',
    epfFlowNodeStatus_dictText: '启用',
    epfFlowNodeIcon: '',
    epfFlowNodeRemark: '',
    createTime: '2026-09-01 10:00:00'
  },
  {
    id: '2',
    primaryKey: 'pk_node_2',
    tableName: 'epf_flow_node',
    epfSystemId: 'pay_core',
    systemNameText: '支付核心',
    epfFlowNodeName: '金额校验',
    epfFlowNodeCode: 'NODE_VALID',
    epfFlowNodeProcessor: 'AmountValidator',
    epfFlowNodeDealType: 'SYNC',
    epfFlowNodeDealType_dictText: '同步处理',
    epfFlowNodeType: '1',
    epfFlowNodeType_dictText: '处理节点',
    epfFlowSubNodeType: '0',
    epfFlowSubNodeType_dictText: '普通节点',
    epfFlowNodeStatus: '0',
    epfFlowNodeStatus_dictText: '启用',
    epfFlowNodeIcon: '',
    epfFlowNodeRemark: '',
    createTime: '2026-09-15 14:30:00'
  },
  {
    id: '3',
    primaryKey: 'pk_node_3',
    tableName: 'epf_flow_node',
    epfSystemId: 'pay_mgr',
    systemNameText: '支付管理',
    epfFlowNodeName: '路由选择',
    epfFlowNodeCode: 'NODE_ROUTE',
    epfFlowNodeProcessor: 'RouteSelector',
    epfFlowNodeDealType: 'ASYNC',
    epfFlowNodeDealType_dictText: '异步处理',
    epfFlowNodeType: '1',
    epfFlowNodeType_dictText: '处理节点',
    epfFlowSubNodeType: '0',
    epfFlowSubNodeType_dictText: '普通节点',
    epfFlowNodeStatus: '1',
    epfFlowNodeStatus_dictText: '停用',
    epfFlowNodeIcon: '',
    epfFlowNodeRemark: '',
    createTime: '2026-10-01 08:20:00'
  }
]

/** 列表（/flownode/manage/config/listPage；原 getQueryParams 额外传 systemName=epfSystemId） */
const mockGetFlowNodeListImpl = (data) => {
  const { pageNo = 1, pageSize = 10 } = data
  const start = (pageNo - 1) * pageSize
  return mockResponse(mockList.slice(start, start + pageSize), mockList.length)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flownode/manage/config/listPage */
const META_getFlowNodeList = { operationType: '', url: '/flownode/manage/config/listPage', method: 'GET' }
export function getFlowNodeList(data) {
  return gatewayOrMock(META_getFlowNodeList, mockGetFlowNodeListImpl, data)
}

/** 新增（POST /flownode/manage/config/add） */
const mockGetFlowNodeAddImpl = (data) => mockSimple({ success: true, message: '新增成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: POST /flownode/manage/config/add */
const META_getFlowNodeAdd = { operationType: '', url: '/flownode/manage/config/add', method: 'POST' }
export function getFlowNodeAdd(data) {
  return gatewayOrMock(META_getFlowNodeAdd, mockGetFlowNodeAddImpl, data)
}

/** 编辑（PUT /flownode/manage/config/edit） */
const mockGetFlowNodeEditImpl = (data) => mockSimple({ success: true, message: '修改成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: PUT /flownode/manage/config/edit */
const META_getFlowNodeEdit = { operationType: '', url: '/flownode/manage/config/edit', method: 'PUT' }
export function getFlowNodeEdit(data) {
  return gatewayOrMock(META_getFlowNodeEdit, mockGetFlowNodeEditImpl, data)
}

/** 删除（/flownode/manage/config/delete，参数 {id}） */
const mockGetFlowNodeDeleteImpl = (data) => mockSimple({ success: true, message: '删除成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flownode/manage/config/delete */
const META_getFlowNodeDelete = { operationType: '', url: '/flownode/manage/config/delete', method: 'GET' }
export function getFlowNodeDelete(data) {
  return gatewayOrMock(META_getFlowNodeDelete, mockGetFlowNodeDeleteImpl, data)
}

/** 导出SQL（/flownode/manage/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
const mockGetFlowNodeExportBatchSqlImpl = (data) => mockSimple({ success: true, message: '导出成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flownode/manage/config/exportBatchSql（原走 downFile） */
const META_getFlowNodeExportBatchSql = { operationType: '', url: '/flownode/manage/config/exportBatchSql', method: 'GET' }
export function getFlowNodeExportBatchSql(data) {
  return gatewayOrMock(META_getFlowNodeExportBatchSql, mockGetFlowNodeExportBatchSqlImpl, data)
}

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=epfFlowNode） */
const mockGetFlowNodeListColumnsImpl = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /dynamic/table/column/listColumns */
const META_getFlowNodeListColumns = { operationType: '', url: '/dynamic/table/column/listColumns', method: 'GET' }
export function getFlowNodeListColumns(data) {
  return gatewayOrMock(META_getFlowNodeListColumns, mockGetFlowNodeListColumnsImpl, data)
}

/**
 * 唯一性校验（/sys/duplicate/check，参数 {tableName, fieldName, fieldVal}）
 * TODO: 联调后接真实校验，重复时提示 "{字段名}已存在!"
 */
const mockGetFlowNodeDuplicateCheckImpl = (data) =>
  mockSimple({ success: true, result: true })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/duplicate/check */
const META_getFlowNodeDuplicateCheck = { operationType: '', url: '/sys/duplicate/check', method: 'GET' }
export function getFlowNodeDuplicateCheck(data) {
  return gatewayOrMock(META_getFlowNodeDuplicateCheck, mockGetFlowNodeDuplicateCheckImpl, data)
}

/** 节点引用（/related/process/queryAssociatedProcessNodes，参数 {pkValue}；mock 返回空列表，无假数据） */
const mockGetAssociatedProcessNodesImpl = (data) => mockSimple({ success: true, result: [] })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /related/process/queryAssociatedProcessNodes */
const META_getAssociatedProcessNodes = { operationType: '', url: '/related/process/queryAssociatedProcessNodes', method: 'GET' }
export function getAssociatedProcessNodes(data) {
  return gatewayOrMock(META_getAssociatedProcessNodes, mockGetAssociatedProcessNodesImpl, data)
}
