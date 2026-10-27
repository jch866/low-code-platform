// 支付产品 / 应用管理
const paymentProductList = () =>
  import('@/views/lowCodePlatform/paymentProduct/paymentProductList.vue')
const paymentProduct = [
  {
    path: 'paymentProduct',
    children: [
      {
        path: 'list',
        component: paymentProductList,
        meta: { title: '支付产品-应用管理' }
      }
    ]
  }
]
export default paymentProduct
