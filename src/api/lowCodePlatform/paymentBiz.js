import { mockResponse, mockSimple } from './common'

/**
 * 支付业务 API（对应 Vue2 源页面 PayList.vue / PayListDisplay.vue 左树 + 右侧内容布局）
 * 真实接口地址（联调时替换 mock，字符串保持原样）：
 * - 交易树:   queryTransTreeList()                    （原 GET /product/payment/queryTransList，@api/api queryTransTreeList）
 * - 树回显:   queryIdTree()                            （PayInfoModal 内上级交易树；源实际 import @/api/api queryIdTree → GET /sys/sysDepart/queryIdTree，
 *                                                      另有 queryTransIdTree → GET /product/payment/queryIdTree 并存，mock 按交易树同源返回）
 * - 树搜索:   searchTransByKeywords({keyWord})         （左侧搜索框，placeholder=请输入交易名称）
 * - 新增:     /product/payment/add                     （PayInfoModal，恒为 POST 新增）
 * - 编辑:     /product/payment/edit                    （PUT，submitCurrForm 修改并保存）
 * - 行删除:   /product/payment/delete                  （声明值；行删除实际走 deleteByTransId({id})）
 * - 批量删除: /product/payment/deleteBatch             （deleteAction {ids: 树勾选 checkedKeys 拼接}）
 * - 导出:     product/payment/exportXls                （导出文件名=交易信息）
 * - 导入:     product/payment/importExcel
 * - 模块管理（原 PayModel.vue 独立页）：/product/module/add|edit|delete|deleteBatch、
 *             queryProductModuleTreeList()、queryProductModuleIdTree()、
 *             searchProductModuleByKeywords({keyWord})、deleteByProductModuleId({id})
 */

const mockTreeList = [
  {
    key: 'T001',
    title: '转账交易',
    transCode: 'TRANS001',
    transCategory: '1',
    msgType: 'MSG001',
    description: '转账汇款类交易',
    parentId: '',
    children: [
      {
        key: 'T001-01',
        title: '行内转账',
        transCode: 'TRANS00101',
        transCategory: '2',
        msgType: 'MSG00101',
        description: '行内人民币转账',
        parentId: 'T001',
        children: []
      },
      {
        key: 'T001-02',
        title: '跨行转账',
        transCode: 'TRANS00102',
        transCategory: '2',
        msgType: 'MSG00102',
        description: '跨行大额/小额转账',
        parentId: 'T001',
        children: []
      }
    ]
  },
  {
    key: 'T002',
    title: '缴费交易',
    transCode: 'TRANS002',
    transCategory: '1',
    msgType: 'MSG002',
    description: '生活缴费类交易',
    parentId: '',
    children: [
      {
        key: 'T002-01',
        title: '水电煤缴费',
        transCode: 'TRANS00201',
        transCategory: '2',
        msgType: 'MSG00201',
        description: '公共事业缴费',
        parentId: 'T002',
        children: []
      }
    ]
  },
  {
    key: 'T003',
    title: '查询交易',
    transCode: 'TRANS003',
    transCategory: '1',
    msgType: 'MSG003',
    description: '账户查询类交易',
    parentId: '',
    children: []
  }
]

/** 平铺交易列表（右侧交易节点列表数据源，取自树数据） */
const flattenTree = (nodes, parentId = '') => {
  const list = []
  nodes.forEach((node) => {
    const { children, title, ...rest } = node
    list.push({ ...rest, transName: title, parentId, children: undefined })
    if (children && children.length) list.push(...flattenTree(children, node.key))
  })
  return list
}

/** 交易树（原 queryTransTreeList） */
export const queryTransTreeList = () => mockResponse(JSON.parse(JSON.stringify(mockTreeList)))

/** 上级交易树（原 PayInfoModal 内 queryIdTree，数据源同交易树） */
export const queryIdTree = () => mockResponse(JSON.parse(JSON.stringify(mockTreeList)))

/** 树关键字搜索（原 searchTransByKeywords({keyWord})，mock 按交易名称过滤后平铺返回） */
export const searchTransByKeywords = (data) => {
  const keyWord = data.keyWord || ''
  const matched = flattenTree(mockTreeList).filter((i) => i.transName.includes(keyWord))
  return mockResponse(matched, matched.length)
}

/** 交易节点列表（右侧列表，平铺交易树） */
export const getPaymentTransList = (data) => {
  const keyWord = (data && data.keyWord) || ''
  const list = flattenTree(mockTreeList).filter((i) => i.transName.includes(keyWord))
  return mockResponse(list, list.length)
}

/** 新增交易（原 PayInfoModal 恒 POST /product/payment/add） */
export const getPaymentAdd = (data) => mockSimple({ resultMsg: '新增成功' })

/** 修改并保存（原 tab1 表单 submitCurrForm，PUT /product/payment/edit） */
export const getPaymentEdit = (data) => mockSimple({ resultMsg: '修改成功' })

/** 行删除（原 deleteByTransId({id})，URL /product/payment/delete） */
export const deleteByTransId = (data) => mockSimple({ resultMsg: '删除成功!' })

/** 批量删除（原 deleteAction /product/payment/deleteBatch，{ids: checkedKeys 拼接}） */
export const getPaymentDeleteBatch = (data) => mockSimple({ resultMsg: '批量删除成功' })

/** 导出交易信息（原 handleExportXls('交易信息')，URL product/payment/exportXls） */
export const getPaymentExportXls = (data) => mockSimple({ resultMsg: '导出成功' })

/** 导入交易信息（原 a-upload，URL product/payment/importExcel） */
export const getPaymentImportExcel = (data) => mockSimple({ resultMsg: '导入成功' })

/** 模块管理（原 PayModel.vue / ModuleInfoModal.vue，POST /product/module/add，仅新增） */
export const getPaymentModuleAdd = (data) => mockSimple({ resultMsg: '新增成功' })

/** 模块树 mock（原 queryProductModuleTreeList 返回结构：{key,title,children} + 模块实体字段） */
const mockModuleTree = [
  {
    key: 'M001',
    title: '系统管理模块',
    moduleName: '系统管理模块',
    moduleCode: 'MOD001',
    moduleCategory: '1',
    virtualTableName: 'sys_module',
    type: '1',
    description: '系统管理类模块',
    parentId: '',
    children: [
      {
        key: 'M001-01',
        title: '用户管理模块',
        moduleName: '用户管理模块',
        moduleCode: 'MOD00101',
        moduleCategory: '1',
        virtualTableName: 'sys_user',
        type: '1',
        description: '用户信息维护模块',
        parentId: 'M001',
        children: []
      }
    ]
  },
  {
    key: 'M002',
    title: '支付业务模块',
    moduleName: '支付业务模块',
    moduleCode: 'MOD002',
    moduleCategory: '2',
    virtualTableName: 'pay_module',
    type: '2',
    description: '支付业务模型模块',
    parentId: '',
    children: [
      {
        key: 'M002-01',
        title: '账务处理模块',
        moduleName: '账务处理模块',
        moduleCode: 'MOD00201',
        moduleCategory: '2',
        virtualTableName: 'pay_account',
        type: '2',
        description: '账务处理业务模型',
        parentId: 'M002',
        children: []
      }
    ]
  }
]

/** 平铺模块树（搜索 mock 用） */
const flattenModuleTree = (nodes) => {
  const list = []
  nodes.forEach((node) => {
    list.push({ ...node, children: undefined })
    if (node.children && node.children.length) list.push(...flattenModuleTree(node.children))
  })
  return list
}

/** 模块树（原 queryProductModuleTreeList，GET /product/module/queryModuleList） */
export const getPaymentModuleTreeList = () => mockResponse(JSON.parse(JSON.stringify(mockModuleTree)))

/** 上级模块树（原 queryProductModuleIdTree，GET /product/module/queryIdTree） */
export const getPaymentModuleIdTree = () => mockResponse(JSON.parse(JSON.stringify(mockModuleTree)))

/** 模块关键字搜索（原 searchProductModuleByKeywords({keyWord})，GET /product/module/searchBy，mock 按模块名称过滤后平铺返回） */
export const searchProductModuleByKeywords = (data) => {
  const keyWord = (data && data.keyWord) || ''
  const matched = flattenModuleTree(JSON.parse(JSON.stringify(mockModuleTree))).filter((i) => (i.moduleName || '').includes(keyWord))
  return mockResponse(matched, matched.length)
}

/** 修改模块（原 PayModel.vue submitCurrForm，PUT /product/module/edit，payload=节点原始字段+表单值） */
export const getPaymentModuleEdit = (data) => mockSimple({ resultMsg: '操作成功' })

/** 删除模块（原 deleteByProductModuleId({id})，GET /product/module/delete） */
export const deleteByProductModuleId = (data) => mockSimple({ resultMsg: '删除成功!' })

/** 批量删除模块（原 deleteAction /product/module/deleteBatch，{ids: 树勾选 checkedKeys 拼接}） */
export const getPaymentModuleDeleteBatch = (data) => mockSimple({ resultMsg: '删除成功' })

/** 模块类目字典（原 j-dict-select-tag dictCode=module_category，真实字典项走
 *  GET /sys/dict/config/getDictItems/module_category，mock 暂以占位项代替，联调时替换） */
export const getModuleCategoryDict = () =>
  mockResponse([
    { value: '1', label: '模块类目一' },
    { value: '2', label: '模块类目二' }
  ])
