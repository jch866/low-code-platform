// 基础规则 / 规则处理器
const regulatorInfoList = () =>
  import('@/views/lowCodePlatform/regulatorInfo/regulatorInfoList.vue')
const regulatorInfo = [
  {
    path: 'regulatorInfo',
    children: [
      {
        path: 'list',
        component: regulatorInfoList,
        meta: { title: '基础规则-规则处理器' }
      }
    ]
  }
]
export default regulatorInfo
