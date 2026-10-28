import { mockResponse, mockSimple } from './common'
import { gatewayOrMock } from './gateway'

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
const mockGetApplicationSystemListImpl = (data) => {
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
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET dynamic/table/data/listObject（原注释无前导斜杠） */
const META_getApplicationSystemList = { operationType: '', url: 'dynamic/table/data/listObject', method: 'GET' }
export function getApplicationSystemList(data) {
  return gatewayOrMock(META_getApplicationSystemList, mockGetApplicationSystemListImpl, data)
}

/** 新增应用（原接口 POST /application/config/add，body: {systemName, dataValueObject}） */
const mockGetApplicationSystemAddImpl = (data) =>
  mockSimple({ resultMsg: '新增成功', result: { id: String(Date.now()), ...data } })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: POST /application/config/add */
const META_getApplicationSystemAdd = { operationType: '', url: '/application/config/add', method: 'POST' }
export function getApplicationSystemAdd(data) {
  return gatewayOrMock(META_getApplicationSystemAdd, mockGetApplicationSystemAddImpl, data)
}

/** 编辑应用（原接口 PUT /application/config/edit，body 同新增） */
const mockGetApplicationSystemEditImpl = (data) => mockSimple({ resultMsg: '编辑成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: PUT /application/config/edit */
const META_getApplicationSystemEdit = { operationType: '', url: '/application/config/edit', method: 'PUT' }
export function getApplicationSystemEdit(data) {
  return gatewayOrMock(META_getApplicationSystemEdit, mockGetApplicationSystemEditImpl, data)
}

/** 删除应用（原接口 dynamic/table/data/delete，参数 {id}） */
const mockGetApplicationSystemDeleteImpl = (data) => mockSimple({ resultMsg: '删除成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET dynamic/table/data/delete（原注释无前导斜杠） */
const META_getApplicationSystemDelete = { operationType: '', url: 'dynamic/table/data/delete', method: 'GET' }
export function getApplicationSystemDelete(data) {
  return gatewayOrMock(META_getApplicationSystemDelete, mockGetApplicationSystemDeleteImpl, data)
}

/** 场景列表（原接口 GET /application/config/detail?ids={sceneIds}，编辑回显用） */
const mockGetApplicationSystemDetailImpl = (data) => {
  const sceneList = mockSceneList[data.ids] || []
  return mockSimple({ result: sceneList })
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /application/config/detail */
const META_getApplicationSystemDetail = { operationType: '', url: '/application/config/detail', method: 'GET' }
export function getApplicationSystemDetail(data) {
  return gatewayOrMock(META_getApplicationSystemDetail, mockGetApplicationSystemDetailImpl, data)
}

/* ==================== 业务节点流程设计（原 applicationAdd.vue 三接口） ==================== */

// 业务节点列表（原 GET /business/node/listFroType → res.result 作为左侧「业务节点」面板数据）
const mockBusinessNodes = [
  { code: 'BN001', name: '实名认证节点', nodeType: 'service' },
  { code: 'BN002', name: '风控检查节点', nodeType: 'service' },
  { code: 'BN003', name: '账务处理节点', nodeType: 'service' }
]
const mockGetBusinessNodeListFroTypeImpl = () =>
  mockResponse(mockBusinessNodes, mockBusinessNodes.length)
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /business/node/listFroType */
const META_getBusinessNodeListFroType = { operationType: '', url: '/business/node/listFroType', method: 'GET' }
export function getBusinessNodeListFroType() {
  return gatewayOrMock(META_getBusinessNodeListFroType, mockGetBusinessNodeListFroTypeImpl)
}

// 流程数据（原 ajaxGetFlowData：GET /flow/manage/config/getFlowData/{flowId} → res.result 即 flowDataInfo）
const mockGetApplicationFlowDataImpl = (data) => {
  const flowId = data?.flowId || ''
  return mockSimple({
    result: {
      flowInfo: { id: flowId, name: '业务节点流程', code: flowId, status: 'DRAFT' },
      nodeList: [
        { id: 'start_1', type: 'start', name: '开始', top: 80, left: 200, width: 80, height: 60 },
        { id: 'task_1', type: 'auto', name: '业务处理', top: 220, left: 200, width: 120, height: 60 },
        { id: 'end_1', type: 'end', name: '结束', top: 360, left: 200, width: 80, height: 60 }
      ],
      linkList: [
        { id: 'link_1', sourceId: 'start_1', targetId: 'task_1', text: '' },
        { id: 'link_2', sourceId: 'task_1', targetId: 'end_1', text: '' }
      ]
    }
  })
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /flow/manage/config/getFlowData/{flowId} */
const META_getApplicationFlowData = { operationType: '', url: '/flow/manage/config/getFlowData/{flowId}', method: 'GET' }
export function getApplicationFlowData(data) {
  return gatewayOrMock(META_getApplicationFlowData, mockGetApplicationFlowDataImpl, data)
}

// 流程保存（原 POST /flow/design/config/save，payload = 设计器 JSON + epfFlowId）
const mockSaveFlowDesignImpl = (data) => mockSimple({ resultMsg: '保存成功' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: POST /flow/design/config/save */
const META_saveFlowDesign = { operationType: '', url: '/flow/design/config/save', method: 'POST' }
export function saveFlowDesign(data) {
  return gatewayOrMock(META_saveFlowDesign, mockSaveFlowDesignImpl, data)
}
