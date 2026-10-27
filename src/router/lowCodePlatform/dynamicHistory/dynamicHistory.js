// 参数中心 / 历史数据查看
const dynamicHistoryList = () =>
  import('@/views/lowCodePlatform/dynamicHistory/dynamicHistoryList.vue')
const dynamicHistory = [
  {
    path: 'dynamicHistory',
    children: [
      {
        path: 'list',
        component: dynamicHistoryList,
        meta: { title: '参数中心-历史数据查看' }
      }
    ]
  }
]
export default dynamicHistory
