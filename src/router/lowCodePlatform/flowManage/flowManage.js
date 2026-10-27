// 流程中心 / 流程管理
const flowManageList = () =>
  import('@/views/lowCodePlatform/flowManage/flowManageList.vue')
const flowManage = [
  {
    path: 'flowManage',
    children: [
      {
        path: 'list',
        component: flowManageList,
        meta: { title: '流程中心-流程管理' }
      }
    ]
  }
]
export default flowManage
