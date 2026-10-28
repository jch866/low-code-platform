import { mockResponse, mockSimple } from './common'
import { gatewayOrMock } from './gateway'

/**
 * 开发组件 API mock（对应 Vue2 源组件 JSelectProjectByDep / JSelectProjectByDepModal，按部门选项目）
 * 真实接口地址（联调时替换 mock，字符串与 Vue2 工程 src/api/api.js、src/views/develop/api/developApi.js 完全一致）：
 * - 部门树:       GET /sys/sysDepart/queryTreeList       （queryDepartTreeList，全量组织机构树）
 * - 子部门树:     GET /sys/sysDepart/queryChildTreeList  （queryChildDepartTreeList，userOwn=true 时仅查当前用户有权限的部门）
 * - 部门关键字:   GET /sys/sysDepart/searchBy            （searchByKeywords，参数 {keyWord}，命中后整棵替换左侧树）
 * - 项目列表:     GET /develop/project/list              （getProjectList，参数 pageNo/pageSize/column/order/projectName(*xx* 模糊)/departId）
 * - 按部门查项目: GET /develop/project/list              （queryProjectByDepId，与 getProjectList 同地址，仅额外传 {departId}）
 */

/** 组织机构树 mock（2-3 级共 5 个节点，字段与原接口一致：id/departName/children） */
const mockDepartTree = [
  {
    id: 'D001',
    departName: '总部',
    children: [
      {
        id: 'D00101',
        departName: '研发中心',
        children: [
          { id: 'D0010101', departName: '前端组', children: [] },
          { id: 'D0010102', departName: '后端组', children: [] }
        ]
      },
      { id: 'D00102', departName: '业务中心', children: [] }
    ]
  }
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

/** 项目列表 mock（字段与原接口一致：id/projectCode/projectName/projectStatus_dictText，另附 departId/createTime 供过滤与排序） */
const mockProjectList = [
  { id: '1', projectCode: 'PJ001', projectName: '支付平台项目', projectStatus_dictText: '启用', departId: 'D001', createTime: '2026-10-01 10:00:00' },
  { id: '2', projectCode: 'PJ002', projectName: '清算平台项目', projectStatus_dictText: '启用', departId: 'D001', createTime: '2026-10-02 10:00:00' },
  { id: '3', projectCode: 'PJ003', projectName: '对账平台项目', projectStatus_dictText: '停用', departId: 'D00101', createTime: '2026-10-03 10:00:00' },
  { id: '4', projectCode: 'PJ004', projectName: '渠道接入项目', projectStatus_dictText: '启用', departId: 'D00101', createTime: '2026-10-04 10:00:00' },
  { id: '5', projectCode: 'PJ005', projectName: '商户门户项目', projectStatus_dictText: '启用', departId: 'D0010101', createTime: '2026-10-05 10:00:00' },
  { id: '6', projectCode: 'PJ006', projectName: '运营后台项目', projectStatus_dictText: '停用', departId: 'D0010101', createTime: '2026-10-06 10:00:00' },
  { id: '7', projectCode: 'PJ007', projectName: '账务核心项目', projectStatus_dictText: '启用', departId: 'D0010102', createTime: '2026-10-07 10:00:00' },
  { id: '8', projectCode: 'PJ008', projectName: '风控引擎项目', projectStatus_dictText: '启用', departId: 'D0010102', createTime: '2026-10-08 10:00:00' },
  { id: '9', projectCode: 'PJ009', projectName: '报表中心项目', projectStatus_dictText: '启用', departId: 'D00102', createTime: '2026-10-09 10:00:00' },
  { id: '10', projectCode: 'PJ010', projectName: '营销活动项目', projectStatus_dictText: '停用', departId: 'D00102', createTime: '2026-10-10 10:00:00' },
  { id: '11', projectCode: 'PJ011', projectName: '开放平台项目', projectStatus_dictText: '启用', departId: 'D001', createTime: '2026-10-11 10:00:00' },
  { id: '12', projectCode: 'PJ012', projectName: '数据中台项目', projectStatus_dictText: '启用', departId: 'D001', createTime: '2026-10-12 10:00:00' }
]

/** 部门树关键字递归过滤：保留命中节点及其祖先链（与原 searchBy 行为一致） */
const filterTreeByKeyword = (tree, keyword) =>
  tree.reduce((acc, node) => {
    const children = filterTreeByKeyword(node.children || [], keyword)
    if (node.departName.includes(keyword) || children.length) {
      acc.push({ ...node, children })
    }
    return acc
  }, [])

/** 项目列表查询（支持 departId 过滤 + projectName *xx* 模糊 + column/order 排序 + pageNo/pageSize 分页） */
const queryProjectPage = (data) => {
  const {
    pageNo = 1,
    pageSize = 10,
    departId,
    projectName,
    column = 'createTime',
    order = 'desc'
  } = data
  let filtered = [...mockProjectList]
  if (departId) filtered = filtered.filter((i) => i.departId === departId)
  if (projectName) {
    // 原 loadData 会把 projectName 包装成 *xx* 再传后端，此处剥离星号后做 includes 模糊匹配
    const keyword = String(projectName).replace(/^\*|\*$/g, '')
    filtered = filtered.filter((i) => i.projectName.includes(keyword))
  }
  if (column === 'createTime') {
    filtered.sort((a, b) =>
      order === 'asc'
        ? a.createTime.localeCompare(b.createTime)
        : b.createTime.localeCompare(a.createTime)
    )
  }
  const start = (pageNo - 1) * pageSize
  return mockResponse(filtered.slice(start, start + pageSize), filtered.length)
}

/** 全量组织机构树（原 GET /sys/sysDepart/queryTreeList） */
const mockQueryDepartTreeListImpl = () => mockSimple({ result: mockDepartTree })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/sysDepart/queryTreeList */
const META_queryDepartTreeList = { operationType: '', url: '/sys/sysDepart/queryTreeList', method: 'GET' }
export function queryDepartTreeList() {
  return gatewayOrMock(META_queryDepartTreeList, mockQueryDepartTreeListImpl)
}

/** 当前用户有权限的部门树（原 GET /sys/sysDepart/queryChildTreeList，userOwn=true 时调用） */
const mockQueryChildDepartTreeListImpl = () => mockSimple({ result: mockChildDepartTree })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/sysDepart/queryChildTreeList */
const META_queryChildDepartTreeList = { operationType: '', url: '/sys/sysDepart/queryChildTreeList', method: 'GET' }
export function queryChildDepartTreeList() {
  return gatewayOrMock(META_queryChildDepartTreeList, mockQueryChildDepartTreeListImpl)
}

/** 部门关键字搜索（原 GET /sys/sysDepart/searchBy，参数 {keyWord}，命中后整棵替换左侧树） */
const mockSearchByKeywordsImpl = (data) => {
  const { keyWord = '' } = data
  const tree = filterTreeByKeyword(mockDepartTree, keyWord)
  return mockSimple({ result: tree })
}
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /sys/sysDepart/searchBy */
const META_searchByKeywords = { operationType: '', url: '/sys/sysDepart/searchBy', method: 'GET' }
export function searchByKeywords(data) {
  return gatewayOrMock(META_searchByKeywords, mockSearchByKeywordsImpl, data)
}

/** 项目列表（原 GET /develop/project/list，getProjectList） */
const mockGetProjectListImpl = (data) => queryProjectPage(data)
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /develop/project/list */
const META_getProjectList = { operationType: '', url: '/develop/project/list', method: 'GET' }
export function getProjectList(data) {
  return gatewayOrMock(META_getProjectList, mockGetProjectListImpl, data)
}

/** 按部门主键查询项目（原 GET /develop/project/list，queryProjectByDepId，仅额外传 departId） */
const mockQueryProjectByDepIdImpl = (data) =>
  queryProjectPage({ ...data, pageNo: 1, pageSize: 10, column: 'createTime', order: 'desc' })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /develop/project/list（与 getProjectList 同地址） */
const META_queryProjectByDepId = { operationType: '', url: '/develop/project/list', method: 'GET' }
export function queryProjectByDepId(data) {
  return gatewayOrMock(META_queryProjectByDepId, mockQueryProjectByDepIdImpl, data)
}

/**
 * 比对数据环境选择（迁移自 Vue2 工程 views/develop/modules/DevelopProjectEnviSelectModal）
 * 查询全部比对环境（原 GET /develop/environment/getAllEnvis，返回 [{enviCode, enviName}]）
 */
const mockEnvis = [
  { enviCode: 'DEV', enviName: '开发环境' },
  { enviCode: 'SIT', enviName: '测试环境' },
  { enviCode: 'PROD', enviName: '生产环境' }
]
const mockGetDevelopAllEnvisImpl = () => mockResponse(mockEnvis)
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /develop/environment/getAllEnvis */
const META_getDevelopAllEnvis = { operationType: '', url: '/develop/environment/getAllEnvis', method: 'GET' }
export function getDevelopAllEnvis() {
  return gatewayOrMock(META_getDevelopAllEnvis, mockGetDevelopAllEnvisImpl)
}

/**
 * 按目标环境取记录详情（原 GET /dynamic/table/data/fetchByIdWithEnvi，参数 {id, envi}，
 * 返回目标环境记录（含 dataValueObject）或 null，供跨环境数据比对）
 */
const mockGetDynamicTableFetchByIdWithEnviImpl = () => mockSimple({ result: null })
/** 网关元信息：operationType=''（待后端提供服务码）| 直连: GET /dynamic/table/data/fetchByIdWithEnvi */
const META_getDynamicTableFetchByIdWithEnvi = { operationType: '', url: '/dynamic/table/data/fetchByIdWithEnvi', method: 'GET' }
export function getDynamicTableFetchByIdWithEnvi() {
  return gatewayOrMock(META_getDynamicTableFetchByIdWithEnvi, mockGetDynamicTableFetchByIdWithEnviImpl)
}
