import { mockResponse, mockSimple } from './common'

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
export const getFlowList = (data) => {
  const { pageNo = 1, pageSize = 10 } = data
  const start = (pageNo - 1) * pageSize
  return mockResponse(mockList.slice(start, start + pageSize), mockList.length)
}

/** 新增（POST /flow/manage/config/add） */
export const getFlowAdd = (data) => mockSimple({ success: true, message: '新增成功' })

/** 编辑（PUT /flow/manage/config/edit） */
export const getFlowEdit = (data) => mockSimple({ success: true, message: '修改成功' })

/**
 * 流程删除（/flow/manage/config/deleteFlow，参数 {flowId}）
 * 原实现无二次确认，直接调用
 */
export const getFlowDeleteFlow = (data) => mockSimple({ success: true, message: '流程删除成功' })

/** 导出SQL（/flow/manage/config/exportBatchSql，原走 downFile 下载文件，此处仅 mock 占位） */
export const getFlowExportBatchSql = (data) => mockSimple({ success: true, message: '导出成功' })

/** 动态列表单字段（/dynamic/table/column/listColumns，tableName=epfFlow） */
export const getFlowListColumns = (data) =>
  mockSimple({ success: true, result: { allColumnsItems: [] } })

/**
 * 唯一性校验（/sys/duplicate/check，参数 {tableName, fieldName, fieldVal}）
 * TODO: 联调后接真实校验，重复时提示 "{字段名}已存在!"
 */
export const getFlowDuplicateCheck = (data) =>
  mockSimple({ success: true, result: true })

/**
 * 关联流程树（/related/process/queryAssociatedProcess，参数 {pkValue}）
 * 已迁移 ParentProcess.vue「查看关联流程」用：返回树形对象 {name, children:[...]}（原 echarts 树图数据源），
 * mock 返回三层示例树（节点名称与列表页 mock 流程对应），联调后替换为真实 Axios 调用
 */
export const getAssociatedProcess = (data) =>
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
