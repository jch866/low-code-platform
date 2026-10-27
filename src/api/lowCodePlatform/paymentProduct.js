import { mockResponse, mockSimple } from './common'

/**
 * 应用管理 API（对应 Vue2 源页面 src/views/modules/product/applicationMng/index.vue + add.vue）
 * 真实接口地址（联调时替换 mock，字符串保持原样，含无前导斜杠的 list）：
 * - 列表:   dynamic/table/data/listObject          （queryParam.tableName 固定追加为 'applicationSystem'）
 * - 删除:   dynamic/table/data/delete              （参数 {id}）
 * - 新增:   /application/config/add                （POST，body {systemName, dataValueObject:{...formData}}）
 * - 编辑:   /application/config/edit               （PUT，body 同新增）
 * - 场景列表: /application/config/detail?ids={sceneIds} （GET，编辑时拉取场景列表）
 * - 流程保存: /flow/design/config/save              （POST，applicationAdd.vue 全屏流程设计保存，body 为 flowInfo+epfFlowId）
 * - 节点列表: /business/node/listFroType             （GET，applicationAdd 加载 commonFlows）
 */

const mockList = [
  {
    id: '1',
    systemCode: 'APP001',
    applicationSystemName: '支付核心应用',
    systemType: 'core',
    systemType_dictText: '核心系统',
    systemCategory: 'platform',
    systemCategory_dictText: '平台应用',
    projectCode: 'PJ001',
    projectCode_dictText: '支付平台项目',
    systemStatus: '1',
    systemOwner: 'U001',
    systemOwner_dictText: '张三',
    // 原页面编辑时 handleEdit 传 record.dataValueObject，add.vue 内部再 JSON.parse(dataValue) 回显
    dataValueObject: {
      dataValue: '{"applicationName":"支付核心应用","systemName":"APP001","applicationIcon":"","applicationType":"technology"}'
    },
    createTime: '2026-10-01 10:00:00'
  },
  {
    id: '2',
    systemCode: 'APP002',
    applicationSystemName: '清算管理应用',
    systemType: 'settle',
    systemType_dictText: '清算系统',
    systemCategory: 'project',
    systemCategory_dictText: '项目应用',
    projectCode: 'PJ002',
    projectCode_dictText: '清算平台项目',
    systemStatus: '0',
    systemOwner: 'U002',
    systemOwner_dictText: '李四',
    dataValueObject: {
      dataValue: '{"applicationName":"清算管理应用","systemName":"APP002","applicationIcon":"","applicationType":"business"}'
    },
    createTime: '2026-10-02 11:00:00'
  },
  {
    id: '3',
    systemCode: 'APP003',
    applicationSystemName: '对账关联应用',
    systemType: 'check',
    systemType_dictText: '对账系统',
    systemCategory: 'refer',
    systemCategory_dictText: '关联应用',
    projectCode: 'PJ003',
    projectCode_dictText: '对账平台项目',
    systemStatus: '2',
    systemOwner: 'U003',
    systemOwner_dictText: '王五',
    dataValueObject: {
      dataValue: '{"applicationName":"对账关联应用","systemName":"APP003","applicationIcon":"","applicationType":"public"}'
    },
    createTime: '2026-10-03 12:00:00'
  },
  {
    id: '4',
    systemCode: 'APP004',
    applicationSystemName: '外部渠道应用',
    systemType: 'channel',
    systemType_dictText: '渠道系统',
    systemCategory: 'outter',
    systemCategory_dictText: '外部应用',
    projectCode: 'PJ004',
    projectCode_dictText: '渠道接入项目',
    systemStatus: '1',
    systemOwner: 'U004',
    systemOwner_dictText: '赵六',
    dataValueObject: {
      dataValue: '{"applicationName":"外部渠道应用","systemName":"APP004","applicationIcon":"","applicationType":"technology"}'
    },
    createTime: '2026-10-04 13:00:00'
  }
]

/** 场景列表 mock（原 add.vue 内嵌「场景列表」，编辑时经 /application/config/detail 拉取） */
const mockSceneList = {
  1: [
    { sceneId: 'S001', sceneName: '付款场景', sceneType: 'pay' },
    { sceneId: 'S002', sceneName: '退款场景', sceneType: 'refund' }
  ],
  2: [{ sceneId: 'S003', sceneName: '清算场景', sceneType: 'settle' }]
}

/** 获取应用列表（原列表接口无前导斜杠，tableName 固定 applicationSystem，由页面强制追加） */
export const getApplicationSystemList = (data) => {
  const {
    pageNo = 1,
    pageSize = 10,
    tableName,
    systemCode,
    applicationSystemName,
    systemCategory,
    projectCode
  } = data
  let filtered = [...mockList]
  // 原页面 initData()/searchReset() 均强制 queryParam.tableName = 'applicationSystem'
  if (tableName && tableName !== 'applicationSystem') filtered = []
  if (systemCode) filtered = filtered.filter((i) => i.systemCode.includes(systemCode))
  if (applicationSystemName)
    filtered = filtered.filter((i) => i.applicationSystemName.includes(applicationSystemName))
  if (systemCategory) filtered = filtered.filter((i) => i.systemCategory === systemCategory)
  if (projectCode) filtered = filtered.filter((i) => i.projectCode.includes(projectCode))
  const start = (pageNo - 1) * pageSize
  return mockResponse(filtered.slice(start, start + pageSize), filtered.length)
}

/** 新增应用（原接口 POST /application/config/add，body: {systemName, dataValueObject}） */
export const getApplicationSystemAdd = (data) =>
  mockSimple({ resultMsg: '新增成功', result: { id: String(Date.now()), ...data } })

/** 编辑应用（原接口 PUT /application/config/edit，body 同新增） */
export const getApplicationSystemEdit = (data) => mockSimple({ resultMsg: '编辑成功' })

/** 删除应用（原接口 dynamic/table/data/delete，参数 {id}） */
export const getApplicationSystemDelete = (data) => mockSimple({ resultMsg: '删除成功' })

/** 场景列表（原接口 GET /application/config/detail?ids={sceneIds}，编辑回显用） */
export const getApplicationSystemDetail = (data) => {
  const sceneList = mockSceneList[data.ids] || []
  return mockSimple({ result: sceneList })
}
