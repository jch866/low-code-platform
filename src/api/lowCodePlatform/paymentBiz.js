import { mockResponse, mockSimple } from './common'

/**
 * 支付业务 API（对应 Vue2 源页面 PayList.vue / PayListDisplay.vue 左树 + 右侧内容布局）
 * 真实接口地址（联调时替换 mock，字符串保持原样）：
 * - 交易树:   queryTransTreeList()                    （原 @api/api 聚合树接口）
 * - 树回显:   queryIdTree()                            （PayInfoModal 内上级交易树）
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
    children: [
      {
        key: 'T001-01',
        title: '行内转账',
        transCode: 'TRANS00101',
        transCategory: '2',
        msgType: 'MSG00101',
        description: '行内人民币转账',
        children: []
      },
      {
        key: 'T001-02',
        title: '跨行转账',
        transCode: 'TRANS00102',
        transCategory: '2',
        msgType: 'MSG00102',
        description: '跨行大额/小额转账',
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
    children: [
      {
        key: 'T002-01',
        title: '水电煤缴费',
        transCode: 'TRANS00201',
        transCategory: '2',
        msgType: 'MSG00201',
        description: '公共事业缴费',
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
