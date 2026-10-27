// 流程中心 / 流程节点管理
const flowNodeList = () =>
  import('@/views/lowCodePlatform/flowNode/flowNodeList.vue')
const flowNode = [
  {
    path: 'flowNode',
    children: [
      {
        path: 'list',
        component: flowNodeList,
        meta: { title: '流程中心-流程节点管理' }
      }
    ]
  }
]
export default flowNode
