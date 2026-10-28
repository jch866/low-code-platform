import { mockResponse, mockSimple } from './common'
import { gatewayOrMock } from './gateway'

/**
 * 历史数据查看 API（对应 Vue2 源页面 DynamicTableDataHistoryList.vue）
 * 真实接口地址（联调时替换 mock，字符串保持源页 url 块原文）：
 * - 历史列表:   /dynamic/table/data/history/listObject  （GET，参数 tableName/systemName/pkValue + 分页）
 * - 列表动态列: /dynamic/table/column/listColumns       （GET，参数 tableName；
 *               返回体 result.allColumnsItems / result.tableColumns / result.columnsItems 三处分别消费）
 * 说明：明细详情弹窗（原 DynamicTableDataDetail）无独立请求，直接渲染跳转传入的行数据，无需 mock 详情接口
 */

/** 历史记录 mock 行（扁平键与源接口一致：gmtModified_dateText / operateType_dictText / modifiedUser_userNameText / developRequire + 动态字段） */
const mockHistoryList = [
  {
    rowKey: '1',
    id: 'H001',
    pkValue: '1',
    tableName: 'regulator_rule',
    systemName: 'pay_core',
    developRequire: 'REQ-2026-001',
    gmtModified_dateText: '2026-10-12 10:30:00',
    modifiedUser_userNameText: '张三',
    operateType_dictText: '新增',
    trans_id: 'TR202610120001',
    trans_amount: '1000.00',
    trans_status: '成功',
    remark: '初始版本'
  },
  {
    rowKey: '2',
    id: 'H002',
    pkValue: '1',
    tableName: 'regulator_rule',
    systemName: 'pay_core',
    developRequire: 'REQ-2026-015',
    gmtModified_dateText: '2026-10-18 15:20:00',
    modifiedUser_userNameText: '李四',
    operateType_dictText: '修改',
    trans_id: 'TR202610120001',
    trans_amount: '1500.00',
    trans_status: '成功',
    remark: '调整金额上限'
  },
  {
    rowKey: '3',
    id: 'H003',
    pkValue: '1',
    tableName: 'regulator_rule',
    systemName: 'pay_core',
    developRequire: 'REQ-2026-021',
    gmtModified_dateText: '2026-10-25 09:05:00',
    modifiedUser_userNameText: '王五',
    operateType_dictText: '修改',
    trans_id: 'TR202610120001',
    trans_amount: '2000.00',
    trans_status: '处理中',
    remark: '状态字段扩展'
  },
  {
    rowKey: '4',
    id: 'H004',
    pkValue: '2',
    tableName: 'regulator_rule',
    systemName: 'pay_mgr',
    developRequire: 'REQ-2026-030',
    gmtModified_dateText: '2026-10-26 18:40:00',
    modifiedUser_userNameText: '赵六',
    operateType_dictText: '删除',
    trans_id: 'TR202610260002',
    trans_amount: '300.00',
    trans_status: '失败',
    remark: '逻辑删除标记'
  }
]

/** 顶部详情字段（原 result.allColumnsItems：columnName/columnComments，供顶部「数据详情」卡片逐字段渲染） */
const mockAllColumnsItems = [
  { columnName: 'trans_id', columnComments: '交易流水号' },
  { columnName: 'trans_amount', columnComments: '交易金额' },
  { columnName: 'trans_status', columnComments: '交易状态' },
  { columnName: 'remark', columnComments: '备注' }
]

/** 动态列（原 result.tableColumns：后端返回 ant 风格列定义 title/dataIndex/width，页面内转换为 ep 风格） */
const mockTableColumns = [
  { title: '交易流水号', dataIndex: 'trans_id', width: 150 },
  { title: '交易金额', dataIndex: 'trans_amount', width: 120 },
  { title: '交易状态', dataIndex: 'trans_status', width: 110 },
  { title: '备注', dataIndex: 'remark', width: 140 }
]

/** 查询字段（原 result.columnsItems：源页仅存储未渲染查询区，保真返回） */
const mockColumnsItems = [{ columnName: 'trans_id', columnComments: '交易流水号' }]

/** 历史数据列表（原 GET /dynamic/table/data/history/listObject，参数 tableName/systemName/pkValue + 分页） */
const mockGetDynamicHistoryListImpl = (data) => {
  const { pageNo = 1, pageSize = 10, tableName, systemName, pkValue } = data
  let filtered = [...mockHistoryList]
  // mock 过滤：pkValue（原跳转传入 id）为主键过滤；systemName 非空时按行内 systemName 过滤；
  // tableName 为动态模型表名，mock 行不区分模型，仅作参数保真不参与过滤
  if (pkValue) filtered = filtered.filter((i) => i.pkValue === pkValue)
  if (systemName) filtered = filtered.filter((i) => i.systemName === systemName)
  const start = (pageNo - 1) * pageSize
  return mockResponse(filtered.slice(start, start + pageSize), filtered.length)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /dynamic/table/data/history/listObject */
const META_getDynamicHistoryList = { operationType: '', url: '/dynamic/table/data/history/listObject', method: 'GET' }
export function getDynamicHistoryList(data) {
  return gatewayOrMock(META_getDynamicHistoryList, mockGetDynamicHistoryListImpl, data)
}

/** 历史列表动态列（原 GET /dynamic/table/column/listColumns，返回体含 allColumnsItems/tableColumns/columnsItems 三个键） */
const mockGetDynamicHistoryListColumnsImpl = (data) =>
  mockSimple({
    result: {
      allColumnsItems: mockAllColumnsItems,
      tableColumns: mockTableColumns,
      columnsItems: mockColumnsItems
    }
  })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /dynamic/table/column/listColumns */
const META_getDynamicHistoryListColumns = { operationType: '', url: '/dynamic/table/column/listColumns', method: 'GET' }
export function getDynamicHistoryListColumns(data) {
  return gatewayOrMock(META_getDynamicHistoryListColumns, mockGetDynamicHistoryListColumnsImpl, data)
}
