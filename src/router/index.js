import { createRouter, createWebHashHistory } from 'vue-router'
import { dispatchEvent, forceDispatch } from '@/lib/appCommunicate'

// Low Code Platform 业务模块
import PAYMENT_PRODUCT from './lowCodePlatform/paymentProduct/paymentProduct'
import PAYMENT_BIZ from './lowCodePlatform/paymentBiz/paymentBiz'
import DYNAMIC_TABLE from './lowCodePlatform/dynamicTable/dynamicTable'
import REGULATOR_INFO from './lowCodePlatform/regulatorInfo/regulatorInfo'
import REGULATOR_RULE from './lowCodePlatform/regulatorRule/regulatorRule'
import FLOW_MANAGE from './lowCodePlatform/flowManage/flowManage'
import FLOW_NODE from './lowCodePlatform/flowNode/flowNode'
import DYNAMIC_HISTORY from './lowCodePlatform/dynamicHistory/dynamicHistory'

const homePage = () =>
  import('@/views/lowCodePlatform/homePage.vue')

const useRouterCreate = () => {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: homePage
      },
      {
        lang: '低代码平台',
        permissions: [],
        path: '/lowCodePlatform',
        id: 'LowCodePlatformApp',
        children: [
          ...PAYMENT_PRODUCT,
          ...PAYMENT_BIZ,
          ...DYNAMIC_TABLE,
          ...REGULATOR_INFO,
          ...REGULATOR_RULE,
          ...FLOW_MANAGE,
          ...FLOW_NODE,
          ...DYNAMIC_HISTORY
        ]
      }
    ]
  })

  router.beforeEach((to) => {
    let isAuthorization
    const authorizationObj = JSON.parse(localStorage.getItem('authorization') || '{}')
    const isEmpty = Object.values(authorizationObj)
    isAuthorization = isEmpty.length === 0 || isEmpty.every((item) => item === '')
    if (isAuthorization) {
      forceDispatch({ type: 'returnLogin' })
    } else {
      dispatchEvent({
        type: 'low-code-platform',
        url: `/baseApp/low-code-platform/#${to.fullPath}`,
        id: to.meta.id
      })
    }
  })
  return router
}

export default useRouterCreate
