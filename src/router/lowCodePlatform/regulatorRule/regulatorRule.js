// 基础规则 / 业务规则
const regulatorRuleList = () =>
  import('@/views/lowCodePlatform/regulatorRule/regulatorRuleList.vue')
const regulatorRule = [
  {
    path: 'regulatorRule',
    children: [
      {
        path: 'list',
        component: regulatorRuleList,
        meta: { title: '基础规则-业务规则' }
      }
    ]
  }
]
export default regulatorRule
