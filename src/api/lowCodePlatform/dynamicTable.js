import { mockResponse, mockSimple } from './common'

/**
 * 动态表管理 API（对应 Vue2 源页面 DynamicTableList.vue + DynamicTableModal.vue 及其两个可编辑子表）
 * 真实接口地址（联调时替换 mock，字符串保持原样）：
 * - 列表:     /dynamic/table/list
 * - 删除:     /dynamic/table/delete            （声明但行内未直接使用，删除统一走 deleteBatch）
 * - 批量删除: /dynamic/table/deleteBatch       （deleteAction {ids, flag}：flag=true 删除模型关联数据 / false 仅删除模型）
 * - 新增:     /dynamic/table/add               （POST，DynamicTableModal）
 * - 编辑:     /dynamic/table/edit              （PUT）
 * - 导出:     /dynamic/table/exportBatchSql    （downFile，参数 {ids, sqlType:'DDL'|默认'DML'}）
 * - 表名查重: dynamic/table/data/isTableNameExist?tableName= （GET，modal 内 tableNameInput 失焦触发）
 * - 字段子表: /dynamic/table/column/listAll    （参数 tableName，data 中 Y/N→布尔转换）、/dynamic/table/column/delete
 * - 索引子表: /dynamic/table/index/define/listAll、/dynamic/table/index/delete
 */

const mockList = [
  {
    id: '1',
    tableName: 'v_trans_record',
    tableComments: '交易流水表',
    systemName: 'pay_core',
    version: 'v1.0',
    publishEnvi: 'DEV',
    createTime: '2026-09-01 10:00:00'
  },
  {
    id: '2',
    tableName: 'v_order_info',
    tableComments: '订单信息表',
    systemName: 'pay_core',
    version: 'v1.2',
    publishEnvi: 'SIT',
    createTime: '2026-09-15 14:00:00'
  },
  {
    id: '3',
    tableName: 'v_merchant_conf',
    tableComments: '商户配置表',
    systemName: 'pay_mgr',
    version: 'v2.0',
    publishEnvi: 'PROD',
    createTime: '2026-10-01 09:00:00'
  },
  {
    id: '4',
    tableName: 'v_settle_detail',
    tableComments: '清算明细表',
    systemName: 'pay_settle',
    version: 'v1.1',
    publishEnvi: 'SIT',
    createTime: '2026-10-10 16:00:00'
  }
]

/** 动态表列表 */
export const getDynamicTableList = (data) => {
  const { pageNo = 1, pageSize = 10, tableName, systemName } = data
  let filtered = [...mockList]
  if (tableName) filtered = filtered.filter((i) => i.tableName.includes(tableName))
  if (systemName) filtered = filtered.filter((i) => i.systemName === systemName)
  const start = (pageNo - 1) * pageSize
  return mockResponse(filtered.slice(start, start + pageSize), filtered.length)
}

/** 新增动态表（原 POST /dynamic/table/add，payload {virtualTable, virtualTableColumnVO, virtualTableIndexDefineVO}） */
export const getDynamicTableAdd = (data) => mockSimple({ resultMsg: '新增成功' })

/** 编辑动态表（原 PUT /dynamic/table/edit） */
export const getDynamicTableEdit = (data) => mockSimple({ resultMsg: '编辑成功' })

/** 删除（原声明 /dynamic/table/delete，页面行内未直接使用） */
export const getDynamicTableDelete = (data) => mockSimple({ resultMsg: '删除成功' })

/**
 * 批量删除（原 /dynamic/table/deleteBatch）
 * @param {Object} data {ids, flag} flag=true 确认删除（含关联数据）/ false 仅删除模型
 */
export const getDynamicTableDeleteBatch = (data) => mockSimple({ resultMsg: '删除成功' })

/** 批量导出 SQL（原 /dynamic/table/exportBatchSql，sqlType 'DDL' 导出DDL / 默认 'DML' 导出Sql） */
export const getDynamicTableExportBatchSql = (data) => mockSimple({ resultMsg: '导出成功' })

/** 表名查重（原 GET dynamic/table/data/isTableNameExist?tableName=，重复则清空并 warning） */
export const getDynamicTableIsTableNameExist = (data) => {
  const exists = mockList.some((i) => i.tableName === data.tableName)
  return mockSimple({ result: exists })
}

/** 动态表字段列表（原子表 DynamicTableColumns，GET /dynamic/table/column/listAll，参数 tableName） */
export const getDynamicTableColumnListAll = (data) => {
  const mockColumns = [
    {
      id: 'C001',
      columnName: 'trans_id',
      columnType: 'VARCHAR',
      length: '32',
      nullable: true,
      defaultValue: '',
      property: '',
      columnComments: '交易流水号',
      version: 'v1.0',
      publishEnvi: 'DEV',
      isInquiry: true,
      isListShow: true,
      isRequired: true,
      isCommitShow: false,
      isBusinessKey: true
    },
    {
      id: 'C002',
      columnName: 'trans_amount',
      columnType: 'DECIMAL',
      length: '16,2',
      nullable: false,
      defaultValue: '0',
      property: '',
      columnComments: '交易金额',
      version: 'v1.0',
      publishEnvi: 'DEV',
      isInquiry: false,
      isListShow: true,
      isRequired: true,
      isCommitShow: false,
      isBusinessKey: false
    }
  ]
  return mockResponse(mockColumns, mockColumns.length)
}

/** 动态表索引列表（原子表 DynamicTableIndex，GET /dynamic/table/index/define/listAll） */
export const getDynamicTableIndexListAll = (data) => {
  const mockIndex = [
    { id: 'I001', indexType: 'NORMAL-INDEX', indexColumns: 'trans_id' },
    { id: 'I002', indexType: 'FILE-NAME-INDEX', indexColumns: 'trans_date' }
  ]
  return mockResponse(mockIndex, mockIndex.length)
}
