import { createApp, defineAsyncComponent } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.scss'
import '../package/styles/index.scss'
import '../package/styles/font/iconfont.scss'
import ui from '../package/index'

const app = createApp(App)
app.use(ui, {
  locale: {
    name: 'zh_CN'
  },
  dialect: 'zh_TW' // 当前校验规则使用的地区方言
})
app.use(createPinia())
app.use(router)
app.component(
  'PreviewCode',
  defineAsyncComponent(() => import('./components/PreviewCode.vue'))
)
app.mount('#app-lib')

// initCommunicate('eventCenterForApp1')

// addDataListener((data) => {
//   console.log('page one vite getData:', data)
// }, true)
// 路由处理
// addDataListener((data) => {
//   // 通过基座应用通知子应用进行路由跳转
//   if (data.path && typeof data.path === 'string') {
//     data.path = data.path.replace(/^#/, '')
//     // 当基座下发path时进行跳转
//     if (data.path && data.path !== router.currentRoute.value.path) {
//       router.push(data.path)
//     }
//   }
// })

// 监听卸载操作
