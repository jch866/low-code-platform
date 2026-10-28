import { mockResponse } from './common'
import { gatewayOrMock } from './gateway'

/**
 * 选择器组件 API mock（对应 Vue2 源组件 JSelectService / JSelectRegulatorInfo / JSelectFlow）
 * 真实接口地址（联调时替换 mock，字符串与 Vue2 工程 src/api/api.js 完全一致）：
 * - 业务模块树: GET /product/payment/queryTransList                （queryTransTreeList，JSelectService 弹窗树；与 paymentBiz.js 交易树同源接口）
 * - 子部门树:   GET /sys/sysDepart/queryChildTreeList              （queryChildDepartTreeList，JSelectService userOwn=true 时调用）
 * - 规则处理器: GET /configuation/regulatorinfo/dynamic/listPage   （JSelectRegulatorInfo 列表，走 JeecgListMixin 分页）
 * - 流程列表:   GET /flow/manage/config/listPage                   （JSelectFlow 列表，走 JeecgListMixin 分页）
 * 说明（与源差异）：真实接口为 res.success + res.result.records / res.result.total（JeecgListMixin 解析），
 * 此处统一用 mockResponse（returnCode/result/totalCount）与本项目既有 mock 约定保持一致。
 */

/** 业务模块树 mock（字段与原 queryTransList 一致：key/title/transName/transCode/children；key 即节点主键，JSelectService v-model = 逗号拼接的 key） */
const mockServiceTree = [
  {
    key: 'T001',
    title: '转账交易',
    transName: '转账交易',
    transCode: 'TRANS001',
    children: [
      { key: 'T001-01', title: '行内转账', transName: '行内转账', transCode: 'TRANS00101', children: [] },
      { key: 'T001-02', title: '跨行转账', transName: '跨行转账', transCode: 'TRANS00102', children: [] }
    ]
  },
  {
    key: 'T002',
    title: '缴费交易',
    transName: '缴费交易',
    transCode: 'TRANS002',
    children: [
      { key: 'T002-01', title: '水电煤缴费', transName: '水电煤缴费', transCode: 'TRANS00201', children: [] }
    ]
  },
  { key: 'T003', title: '查询交易', transName: '查询交易', transCode: 'TRANS003', children: [] },
  { key: 'T004', title: '代收付交易', transName: '代收付交易', transCode: 'TRANS004', children: [] },
  { key: 'T005', title: '账户管理', transName: '账户管理', transCode: 'TRANS005', children: [] }
]

/** userOwn=true 时 queryChildDepartTreeList 返回的子树 mock（仅当前用户有权限的部门） */
const mockChildDepartTree = [
  {
    id: 'D00101',
    departName: '研发中心',
    children: [
      { id: 'D0010101', departName: '前端组', children: [] },
      { id: 'D0010102', departName: '后端组', children: [] }
    ]
  }
]

/** 规则处理器列表 mock（字段与原 listPage 一致：id/className/classPath/scriptType/systemName；另附 createTime 供排序） */
const mockRegulatorInfoList = [
  { id: 'R001', className: 'CheckAccountProcessor', classPath: 'com/eigpay/rule/CheckAccountProcessor.groovy', scriptType: 'GROOVY', systemName: 'CORE', createTime: '2026-10-01 10:00:00' },
  { id: 'R002', className: 'BalanceValidateProcessor', classPath: 'com/eigpay/rule/BalanceValidateProcessor.groovy', scriptType: 'GROOVY', systemName: 'CORE', createTime: '2026-10-02 10:00:00' },
  { id: 'R003', className: 'ComplianceProcessor', classPath: 'com/eigpay/rule/ComplianceProcessor.java', scriptType: 'JAVA', systemName: 'PAY', createTime: '2026-10-03 10:00:00' },
  { id: 'R004', className: 'LimitCheckProcessor', classPath: 'com/eigpay/rule/LimitCheckProcessor.groovy', scriptType: 'GROOVY', systemName: 'PAY', createTime: '2026-10-04 10:00:00' },
  { id: 'R005', className: 'BlackListProcessor', classPath: 'com/eigpay/rule/BlackListProcessor.java', scriptType: 'JAVA', systemName: 'SETL', createTime: '2026-10-05 10:00:00' },
  { id: 'R006', className: 'RouteDecisionProcessor', classPath: 'com/eigpay/rule/RouteDecisionProcessor.groovy', scriptType: 'GROOVY', systemName: 'PAY', createTime: '2026-10-06 10:00:00' },
  { id: 'R007', className: 'FeeCalcProcessor', classPath: 'com/eigpay/rule/FeeCalcProcessor.java', scriptType: 'JAVA', systemName: 'CORE', createTime: '2026-10-07 10:00:00' },
  { id: 'R008', className: 'ReportPushProcessor', classPath: 'com/eigpay/rule/ReportPushProcessor.groovy', scriptType: 'GROOVY', systemName: 'SETL', createTime: '2026-10-08 10:00:00' }
]

/** 流程列表 mock（字段与原 listPage 一致：id/epfFlowCode/epfFlowName/epfSystemId/epfSystemId_dictText；另附 createTime 供排序） */
const mockFlowList = [
  { id: 'F001', epfFlowCode: 'FLOW001', epfFlowName: '行内转账流程', epfSystemId: 'CORE', epfSystemId_dictText: '核心系统', createTime: '2026-10-01 10:00:00' },
  { id: 'F002', epfFlowCode: 'FLOW002', epfFlowName: '跨行转账流程', epfSystemId: 'CORE', epfSystemId_dictText: '核心系统', createTime: '2026-10-02 10:00:00' },
  { id: 'F003', epfFlowCode: 'FLOW003', epfFlowName: '水电缴费流程', epfSystemId: 'PAY', epfSystemId_dictText: '支付平台', createTime: '2026-10-03 10:00:00' },
  { id: 'F004', epfFlowCode: 'FLOW004', epfFlowName: '对账处理流程', epfSystemId: 'SETL', epfSystemId_dictText: '清算系统', createTime: '2026-10-04 10:00:00' },
  { id: 'F005', epfFlowCode: 'FLOW005', epfFlowName: '代收付流程', epfSystemId: 'PAY', epfSystemId_dictText: '支付平台', createTime: '2026-10-05 10:00:00' },
  { id: 'F006', epfFlowCode: 'FLOW006', epfFlowName: '账户开户流程', epfSystemId: 'CORE', epfSystemId_dictText: '核心系统', createTime: '2026-10-06 10:00:00' },
  { id: 'F007', epfFlowCode: 'FLOW007', epfFlowName: '报表推送流程', epfSystemId: 'SETL', epfSystemId_dictText: '清算系统', createTime: '2026-10-07 10:00:00' },
  { id: 'F008', epfFlowCode: 'FLOW008', epfFlowName: '限额校验流程', epfSystemId: 'PAY', epfSystemId_dictText: '支付平台', createTime: '2026-10-08 10:00:00' }
]

/** 树节点平铺（JSelectService 回显遍历用，与源 reWriterWithSlot 收集 dataList 等价） */
const flattenTreeNodes = (nodes, acc = []) => {
  nodes.forEach((node) => {
    acc.push(node)
    if (node.children && node.children.length) flattenTreeNodes(node.children, acc)
  })
  return acc
}

/** 通用分页查询（column/order 排序 + pageNo/pageSize 分页，与 JeecgListMixin 请求参数对齐） */
const pageQuery = (list, data) => {
  const { pageNo = 1, pageSize = 10, column = 'createTime', order = 'desc' } = data
  const sorted = [...list]
  if (column === 'createTime') {
    sorted.sort((a, b) =>
      order === 'asc'
        ? a.createTime.localeCompare(b.createTime)
        : b.createTime.localeCompare(a.createTime)
    )
  }
  const start = (pageNo - 1) * pageSize
  return mockResponse(sorted.slice(start, start + pageSize), sorted.length)
}

/** 业务模块树（原 GET /product/payment/queryTransList，JSelectService 弹窗树数据源） */
const mockQueryTransTreeListImpl = () => mockResponse(JSON.parse(JSON.stringify(mockServiceTree)))
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /product/payment/queryTransList */
const META_queryTransTreeList = { operationType: '', url: '/product/payment/queryTransList', method: 'GET' }
export function queryTransTreeList() {
  return gatewayOrMock(META_queryTransTreeList, mockQueryTransTreeListImpl)
}

/** 当前用户有权限的部门树（原 GET /sys/sysDepart/queryChildTreeList，JSelectService userOwn=true 时调用） */
const mockQueryChildDepartTreeListImpl = () => mockResponse(JSON.parse(JSON.stringify(mockChildDepartTree)))
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/sysDepart/queryChildTreeList */
const META_queryChildDepartTreeList = { operationType: '', url: '/sys/sysDepart/queryChildTreeList', method: 'GET' }
export function queryChildDepartTreeList() {
  return gatewayOrMock(META_queryChildDepartTreeList, mockQueryChildDepartTreeListImpl)
}

/**
 * 规则处理器分页列表（原 GET /configuation/regulatorinfo/dynamic/listPage）
 * 查询参数：className（处理器类名，模糊）/ systemName（所属应用，字典 develop_system）/ scriptType（处理器类型，字典 regulator_script_type）
 */
const mockQueryRegulatorInfoPageImpl = (data = {}) => {
  const { className, systemName, scriptType } = data
  let filtered = [...mockRegulatorInfoList]
  if (className) filtered = filtered.filter((i) => i.className.includes(className))
  if (systemName) filtered = filtered.filter((i) => i.systemName === systemName)
  if (scriptType) filtered = filtered.filter((i) => i.scriptType === scriptType)
  return pageQuery(filtered, data)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /configuation/regulatorinfo/dynamic/listPage */
const META_queryRegulatorInfoPage = { operationType: '', url: '/configuation/regulatorinfo/dynamic/listPage', method: 'GET' }
export function queryRegulatorInfoPage(data = {}) {
  return gatewayOrMock(META_queryRegulatorInfoPage, mockQueryRegulatorInfoPageImpl, data)
}

/**
 * 流程分页列表（原 GET /flow/manage/config/listPage）
 * 查询参数：epfFlowCode（流程编码，模糊）/ epfFlowName（流程名称，模糊）/ systemName（所属系统，字典 develop_system）
 */
const mockQueryFlowPageImpl = (data = {}) => {
  const { epfFlowCode, epfFlowName, systemName } = data
  let filtered = [...mockFlowList]
  if (epfFlowCode) filtered = filtered.filter((i) => i.epfFlowCode.includes(epfFlowCode))
  if (epfFlowName) filtered = filtered.filter((i) => i.epfFlowName.includes(epfFlowName))
  if (systemName) filtered = filtered.filter((i) => i.epfSystemId === systemName)
  return pageQuery(filtered, data)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flow/manage/config/listPage */
const META_queryFlowPage = { operationType: '', url: '/flow/manage/config/listPage', method: 'GET' }
export function queryFlowPage(data = {}) {
  return gatewayOrMock(META_queryFlowPage, mockQueryFlowPageImpl, data)
}

/** 树节点平铺导出（JSelectServiceModal 回显 dataList，纯数据工具非接口调用，页面同步消费，保持原样） */
export const flattenServiceTree = flattenTreeNodes

/**
 * 字典选择器 API（DictData 数据字典数据源，对应 Vue2 源组件 JSelectDict / JDictSelectTag）
 * 真实接口地址（联调时替换 mock，字符串与 Vue2 工程 src/api/api.js 一致）：
 * - 字典列表:  GET /sys/dict/config/list                    （JSelectDict listUrl，JeecgListMixin 分页）
 * - 字典项:    GET /sys/dict/getDictItems/{dictCode}        （JDictSelectTag ajaxGetDictItems，返回 [{value,text}]）
 * 说明（与源差异）：真实接口为 res.success + res.result.records / res.result.total，
 * 此处统一用 mockResponse（returnCode/result/totalCount）与本项目既有 mock 约定保持一致。
 */

/** 字典配置列表 mock（字段与原 /sys/dict/config/list 一致：id/dictCode/dictName/description） */
const mockDictConfigList = [
  { id: 'DC001', dictCode: 'error_code', dictName: '错误码', description: '业务处理错误码' },
  { id: 'DC002', dictCode: 'regulator_field_type', dictName: '数据集字段类型', description: '规则数据集类型' },
  { id: 'DC003', dictCode: 'rule_conditions', dictName: '规则运算符', description: '合并规则条件' },
  { id: 'DC004', dictCode: 'dict_fetch_type', dictName: '字典取值方式', description: '字典数据取值方式' },
  { id: 'DC005', dictCode: 'yes_no', dictName: '是否', description: '通用是否字典' },
  { id: 'DC006', dictCode: 'currency_type', dictName: '币种类型', description: '支付币种' }
]

/** 字典项 mock（key=dictCode，value 为 [{value,text}]，与 ajaxGetDictItems 返回结构一致） */
const mockDictItemsMap = {
  error_code: [
    { value: 'E0001', text: '账户不存在' },
    { value: 'E0002', text: '余额不足' },
    { value: 'E0003', text: '交易超限' }
  ],
  regulator_field_type: [
    { value: 'FIXED', text: '固定数据' },
    { value: 'MSG', text: '报文数据' },
    { value: 'DICT', text: '数据字典' }
  ],
  rule_conditions: [
    { value: '==', text: '等于' },
    { value: '!=', text: '不等于' },
    { value: '>', text: '大于' },
    { value: '<', text: '小于' }
  ],
  yes_no: [
    { value: 'Y', text: '是' },
    { value: 'N', text: '否' }
  ],
  currency_type: [
    { value: 'CNY', text: '人民币' },
    { value: 'USD', text: '美元' },
    { value: 'HKD', text: '港币' }
  ]
}

/**
 * 字典配置分页列表（原 GET /sys/dict/config/list，JSelectDict 选择字典数据源）
 * 查询参数：dictCode（字典编码，模糊）/ dictName（字典名称，模糊）+ pageNo/pageSize 分页
 */
const mockQueryDictConfigPageImpl = (data = {}) => {
  const { pageNo = 1, pageSize = 10, dictCode, dictName } = data
  let filtered = [...mockDictConfigList]
  if (dictCode) filtered = filtered.filter((i) => i.dictCode.includes(dictCode))
  if (dictName) filtered = filtered.filter((i) => i.dictName.includes(dictName))
  const start = (pageNo - 1) * pageSize
  return mockResponse(filtered.slice(start, start + pageSize), filtered.length)
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/dict/config/list */
const META_queryDictConfigPage = { operationType: '', url: '/sys/dict/config/list', method: 'GET' }
export function queryDictConfigPage(data = {}) {
  return gatewayOrMock(META_queryDictConfigPage, mockQueryDictConfigPageImpl, data)
}

/** 字典项列表（原 GET /sys/dict/getDictItems/{dictCode}，JDictSelectTag 按 dictType 加载数据字典值下拉） */
const mockGetDictItemsImpl = (dictCode) => mockResponse(mockDictItemsMap[dictCode] || [])
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/dict/getDictItems/{dictCode} */
const META_getDictItems = { operationType: '', url: '/sys/dict/getDictItems/{dictCode}', method: 'GET' }
export function getDictItems(dictCode) {
  return gatewayOrMock(META_getDictItems, mockGetDictItemsImpl, dictCode)
}
