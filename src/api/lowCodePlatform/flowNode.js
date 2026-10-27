import { mockResponse, mockSimple } from './common'

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
export const getFlowNodeList = (data) => {
  const { pageNo = 1, pageSize = 10 } = data
  const start = (pageNo - 1) * pageSize
  return mockResponse(mockList.slice(start, start + pageSize), mockList.length)
}

/** 新增（POST /flownode/manage/config/add） */
export const getFlowNodeAdd = (data) => mockSimple({ success: true, message: '新增成功' })

/** 编辑（PUT /flownode/manage/config/edit） */
export const getFlowNodeEdit = (data) => mockSimple({ success: true, message: '修改成功' })

/** 删除（/flownode/manage/config/delete，参数 {id}） */
export const getFlowNodeDelete = (data) => mockSimple({ success: true, message: '删除成功' })

/** 导出SQL（/flownode/manage/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
export const getFlowNodeExportBatchSql = (data) => mockSimple({ success: true, message: '导出成功' })

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=epfFlowNode） */
export const getFlowNodeListColumns = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })

/**
 * 唯一性校验（/sys/duplicate/check，参数 {tableName, fieldName, fieldVal}）
 * TODO: 联调后接真实校验，重复时提示 "{字段名}已存在!"
 */
export const getFlowNodeDuplicateCheck = (data) =>
  mockSimple({ success: true, result: true })

/** 节点引用（/related/process/queryAssociatedProcessNodes，参数 {pkValue}；mock 返回空列表，无假数据） */
export const getAssociatedProcessNodes = (data) => mockSimple({ success: true, result: [] })
