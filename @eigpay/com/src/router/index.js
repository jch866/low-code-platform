import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/components/scrollBar',
      name: 'ScrollDemo',
      component: () => import('@package/scrollBar/docs/README.md')
    },
    {
      path: '/components/button',
      name: 'ButtonDemo',
      component: () => import('@package/button/docs/README.md')
    },
    {
      path: '/components/form',
      name: 'FormDemo',
      component: () => import('@package/form/docs/README.md')
    },
    {
      path: '/components/input',
      name: 'InputDemo',
      component: () => import('@package/input/docs/README.md')
    },
    {
      path: '/components/radio',
      name: 'RadioDemo',
      component: () => import('@package/radio/docs/README.md')
    },
    {
      path: '/components/checkbox',
      name: 'CheckboxDemo',
      component: () => import('@package/checkbox/docs/README.md')
    },
    {
      path: '/components/switch',
      name: 'SwitchDemo',
      component: () => import('@package/switch/docs/README.md')
    },
    {
      path: '/components/icon',
      name: 'IconDemo',
      component: () => import('@package/icon/docs/README.md')
    },
    {
      path: '/components/table',
      name: 'TableDemo',
      component: () => import('@package/table/docs/README.md')
    },
    {
      path: '/components/pagination',
      name: 'PaginationDemo',
      component: () => import('@package/pagination/docs/README.md')
    },
    {
      path: '/components/select',
      name: 'SelectDemo',
      component: () => import('@package/select/docs/README.md')
    },
    {
      path: '/components/breadcrumb',
      name: 'BreadcrumbDemo',
      component: () => import('@package/breadcrumb/docs/README.md')
    },
    {
      path: '/components/datePicker',
      name: 'DatePicker',
      component: () => import('@package/datePicker/docs/README.md')
    },
    {
      path: '/components/datePickerApp',
      name: 'datePickerApp',
      component: () => import('@package/datePickerApp/docs/README.md')
    },
    {
      path: '/components/dateTimePicker',
      name: 'DateTimePicker',
      component: () => import('@package/dateTimePicker/docs/README.md')
    },
    {
      path: '/components/timePicker',
      name: 'TimePicker',
      component: () => import('@package/timePicker/docs/README.md')
    },
    {
      path: '/components/touchSlider',
      name: 'touchSlider',
      component: () => import('@package/touchSlider/docs/README.md')
    },
    {
      path: '/components/card',
      name: 'CardDemo',
      component: () => import('@package/card/docs/README.md')
    },
    {
      path: '/components/upload',
      name: 'UploadDemo',
      component: () => import('@package/upload/docs/README.md')
    },
    {
      path: '/components/step',
      name: 'StepDemo',
      component: () => import('@package/step/docs/README.md')
    },
    {
      path: '/components/tooltip',
      name: 'Tooltip',
      component: () => import('@package/tooltip/docs/README.md')
    },
    {
      path: '/components/tree',
      name: 'Tree',
      component: () => import('@package/tree/docs/README.md')
    },
    {
      path: '/components/popover',
      name: 'Popover',
      component: () => import('@package/popover/docs/README.md')
    },
    {
      path: '/components/progress',
      name: 'ProgressDemo',
      component: () => import('@package/progress/docs/README.md')
    },
    {
      path: '/components/anchor',
      name: 'AnchorDemo',
      component: () => import('@package/anchor/docs/README.md')
    },
    {
      path: '/components/tab',
      name: 'Tab',
      component: () => import('@package/tab/docs/README.md')
    },
    {
      path: '/components/collapse',
      name: 'CollapseDemo',
      component: () => import('@package/collapse/docs/README.md')
    },
    {
      path: '/components/badge',
      name: 'BadgeDemo',
      component: () => import('@package/badge/docs/README.md')
    },
    {
      path: '/components/adress',
      name: 'AdressDemo',
      component: () => import('@package/adress/docs/README.md')
    },
    {
      path: '/components/dialog',
      name: 'DialogDemo',
      component: () => import('@package/dialog/docs/README.md')
    },
    {
      path: '/components/message',
      name: 'MessageDemo',
      component: () => import('@package/message/docs/README.md')
    },
    {
      path: '/components/menu',
      name: 'MenuDemo',
      component: () => import('@package/menu/docs/README.md')
    },
    {
      path: '/components/loading',
      name: 'LoadingDemo',
      component: () => import('@package/loading/docs/README.md')
    }
  ],
  scrollBehavior(to, from) {
    if (to.path !== from.path) {
      return { top: 0 }
    }
  }
})

export default router
