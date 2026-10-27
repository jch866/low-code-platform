// 参数中心 / 动态表管理
const dynamicTableList = () =>
  import('@/views/lowCodePlatform/dynamicTable/dynamicTableList.vue')
const dynamicTable = [
  {
    path: 'dynamicTable',
    children: [
      {
        path: 'list',
        component: dynamicTableList,
        meta: { title: '参数中心-动态表管理' }
      }
    ]
  }
]
export default dynamicTable
