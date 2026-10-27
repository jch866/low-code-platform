// 支付业务
const paymentBizList = () =>
  import('@/views/lowCodePlatform/paymentBiz/paymentBizList.vue')
const paymentBiz = [
  {
    path: 'paymentBiz',
    children: [
      {
        path: 'list',
        component: paymentBizList,
        meta: { title: '支付产品-支付业务' }
      }
    ]
  }
]
export default paymentBiz
