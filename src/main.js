import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import useRouterCreate from './router'
import i18n from './language'
import defaultTW from './language/locales/defaults/zh_tw'
import ui from '@eigpay/components'
import './assets/main.scss'
import '../@eigpay/com/package/styles/font/iconfont.scss'
import '@eigpay/components/styles/index.scss'
import './assets/ep-variables.scss'
// import './assets/iconfont/iconfont.css'
import {
  initCommunicate,
  addDataListener,
  clearAllListener,
  getAppName
} from '@/lib/appCommunicate'

let app = null
let router = null
let languageData = 'zh_CN'
const appElId = '#subApp-low-code-platform'

const mount = () => {
  app = createApp(App)

  app.use(createPinia())
  // app.use(ui, { locale: { name: 'zh_CN' }, dialect: 'zh_TW' })
  router = useRouterCreate()
  app.use(router)

  app.use(i18n)
  app.mount(appElId)

  initCommunicate(appElId)

  addDataListener((data) => {
    i18n.global.locale = data.language
    i18n.global.mergeLocaleMessage(data.language, data.common)
  }, true)
  // 覆盖公共组件国际化
  if (i18n.global.locale === 'zh_tw') {
    languageData = 'zh_TW'
  } else if (i18n.global.locale === 'en_us') {
    languageData = 'en'
  } else {
    languageData = 'zh_CN'
  }
  app.use(ui, {
    locale: {
      name: languageData,
      messages: {
        zh_TW: {
          ...defaultTW
        }
      }
    },
    dialect: 'zh_TW'
  })
  // 路由处理
  addDataListener((data) => {
    // 通过基座应用通知子应用进行路由跳转
    if (data.path && typeof data.path === 'string') {
      data.path = data.path.replace(/^#/, '')
      // 当基座下发path时进行跳转
      if (data.path && data.path !== router.currentRoute.value.path) {
        router.push(data.path)
      }
    }
  })
}

const unmount = () => {
  app.unmount()
  clearAllListener()
  app = null
  router.options.history = null
  router = null
}

if (window.__MICRO_APP_BASE_APPLICATION__) {
  const appName = getAppName(appElId)
  window[`micro-app-${appName}`] = { mount, unmount }
} else {
  mount()
}
