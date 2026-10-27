# sub-app-example

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

为配合微应用开发，`vite.config.js` 中做了如下配置:

plugins 中自定义了对bundle文件中from|import加载依赖文件路径的修改。

```js
  plugins: [
    vue(),
    (function () {
      let basePath = ''
      return {
        name: 'vite:micro-app',
        apply: 'build',
        configResolved(config) {
          basePath = `${config.base}${config.build.assetsDir}/`
        },
        // writeBundle 钩子可以拿到完整处理后的文件，但已经无法修改
        writeBundle(options, bundle) {
          for (const chunkName in bundle) {
            if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
              const chunk = bundle[chunkName]
              if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                chunk.code = chunk.code.replace(
                  /(from|import\()(\s*['"])(\.\.?\/)/g,
                  (all, $1, $2, $3) => {
                    return all.replace($3, new URL($3, basePath))
                  }
                )
                const fullPath = join(options.dir, chunk.fileName)
                writeFileSync(fullPath, chunk.code)
              }
            }
          }
        },
      }
    })(),
  ],
```
定义`src`目录别名为`@`, 方便引用文件。

```js
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
```
文件中使用

```js
import HomeView from '@/views/HomeView.vue'
```

配置基础路径，方便在开发模式下与基座应用集成, 使用vite作为dev server，使用的是浏览器的es模式，基座应用为了区分不同的子应用正确加载文件，会根据base配置的path进行文件路径替换。

```js
  base: `${
    process.env.NODE_ENV === 'production' ? 'http://www.xxxx.com' : ''
  }/xxx-xxxxx/`
```

dev server 配置, 每一项的配置详解见 [vite 服务器选项](https://vitejs.cn/vite3-cn/config/server-options.html)

```js
  server: {
    port: 8080, // listen port 8080
    open: true, // auto open while server started
    host: true,
    proxy: {}
  }
```


关于公共基础路径说明见 https://vitejs.cn/vite3-cn/guide/build.html#public-base-path




## Project Setup


**如果没有安装`pnpm`管理器，先安装`pnpm`**

```sh
npm install -g pnpm
```

**已安装`pnpm`管理器**

```sh
pnpm install
```

### 启动开发模式
```sh
pnpm run dev
```

### 生产模式编译

```sh
pnpm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm run lint
```
执行`npm run lint`后，代码中被规则检查为可以被自动修复的会自动修复，不能自动修复的会在Terminal中输出信息。

### 查看功能组件库demo

```sh
cd @eigpay/com
```

```sh
npm install
```

```sh
npm run dev
```



#### Code format with [Prettier](https://prettier.io/docs/en/options.html)

Prettier是ESLint用到的一个插件，帮助格式化JS代码和HTML标签。

## 已安装的插件

### Router
vue-router, version 4.1.5, [教程](https://router.vuejs.org/zh/guide/)

本项目route的代码目录在`src/router`下, 为配合微应用开发，路由history模式用的是hash, 请不要修改。

### 状态管理 Pinia

Pinia, version 2.0.21 [教程](https://pinia.vuejs.org/zh/introduction.html)

本项目store的代码目录在`src/stores`下。
创建一个store
```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0) // state
  const doubleCount = computed(() => count.value * 2) // getter
  function increment() { //action
    count.value++
  }

  return { count, doubleCount, increment }
})
```

在组件中引用状态管理

```html
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'
const userCounter = useCounterStore()
const { count, increment } = userCounter // 直接解构出来的state属性，会失去响应性，但是action不受影响
const { count: dscrtCount } = storeToRefs(userCounter) // 使用storeToRefs 处理store后，解构出来的state属性依然具有响应性。
</script>
```




### 样式预处理 Less

SASS version 1.56 [教程](https://sass-lang.com/documentation/)
本项目样式代码目录在`src/assets`下, 定义在Less中的变量在`variable.scss`文件， 本项目的基本样式定义在`base.scss`文件，本项目样式的主文件`main.scss`

variable.scss

```css
$ns: xxx-app; // 样式的命名空间前缀
$pns: '--#{$ns}-'; // var 定义变量时， 变量名前缀。
$appId: '.#{$ns}-id'; // 挂在app元素的样式名
```
为了便于微应用的样式隔离, 定义了`$ns`变量，便于实现类名的拼接, 或是属性值的拼接。

定义全局样式时，为了做到样式隔离不相互污染，使用命名空间前缀的方式。 例如：在html下定义全局变量，为了防止变量污染， 定义方式如下：

```css
@use "./variables.scss" as *;


:root {
  #{$pns}c-white: #fff;
  #{$pns}c-white-soft: #f8f8f8;
  #{$pns}c-black: #000;
  #{$pns}c-black-soft: #222;
  #{$pns}c-black-mute: #282828;
  #{$pns}c-indigo: #2c3e50;

  #{$pns}c-divider-light-1: rgba(60, 60, 60, 0.29);
  #{$pns}c-divider-light-2: rgba(60, 60, 60, 0.12);
  #{$pns}c-divider-dark-1: rgba(84, 84, 84, 0.65);
  #{$pns}c-divider-dark-2: rgba(84, 84, 84, 0.48);

  #{$pns}c-text-light-1: var(#{$pns}c-indigo);
  #{$pns}c-text-light-2: rgba(60, 60, 60, 0.66);
  #{$pns}c-text-dark-1: var(#{$pns}c-white);
  #{$pns}c-text-dark-2: rgba(235, 235, 235, 0.64);

  #{$pns}font-size-normal: 12px;
  #{$pns}font-size-middel: 14px;
  #{$pns}font-size-bigger: 16px;
  #{$pns}font-size-large: 18px;
}

.#{$ns} {
  --color-background: var(#{$pns}c-white);
  --color-background-soft: var(#{$pns}c-white-soft);
  --color-background-mute: var(#{$pns}c-white-mute);

  --color-border: var(#{$pns}c-divider-light-2);
  --color-border-hover: var(#{$pns}c-divider-light-1);

  --color-heading: var(#{$pns}c-text-light-1);
  --color-text: var(#{$pns}c-text-light-1);

  --section-gap: 160px;
  @media (prefers-color-scheme: dark) {
    --color-background: var(#{$pns}c-black);
    --color-background-soft: var(#{$pns}c-black-soft);
    --color-background-mute: var(#{$pns}c-black-mute);

    --color-border: var(#{$pns}c-divider-dark-2);
    --color-border-hover: var(#{$pns}c-divider-dark-1);

    --color-heading: var(#{$pns}c-text-dark-1);
    --color-text: var(#{$pns}c-text-dark-2);
  }
}

```


实际输出的css如下：
```css
:root {
  --xxx-app-c-white: #fff;
  --xxx-app-c-white-soft: #f8f8f8;
  --xxx-app-c-black: #000;
  --xxx-app-c-black-soft: #222;
  --xxx-app-c-black-mute: #282828;
  --xxx-app-c-indigo: #2c3e50;
  --xxx-app-c-divider-light-1: rgba(60, 60, 60, 0.29);
  --xxx-app-c-divider-light-2: rgba(60, 60, 60, 0.12);
  --xxx-app-c-divider-dark-1: rgba(84, 84, 84, 0.65);
  --xxx-app-c-divider-dark-2: rgba(84, 84, 84, 0.48);
  --xxx-app-c-text-light-1: var(--xxx-app-c-indigo);
  --xxx-app-c-text-light-2: rgba(60, 60, 60, 0.66);
  --xxx-app-c-text-dark-1: var(--xxx-app-c-white);
  --xxx-app-c-text-dark-2: rgba(235, 235, 235, 0.64);
  --xxx-app-font-size-normal: 12px;
  --xxx-app-font-size-middel: 14px;
  --xxx-app-font-size-bigger: 16px;
  --xxx-app-font-size-large: 18px;
}
.xxx-app {
  --color-background: var(--xxx-app-c-white);
  --color-background-soft: var(--xxx-app-c-white-soft);
  --color-background-mute: var(--xxx-app-c-white-mute);
  --color-border: var(--xxx-app-c-divider-light-2);
  --color-border-hover: var(--xxx-app-c-divider-light-1);
  --color-heading: var(--xxx-app-c-text-light-1);
  --color-text: var(--xxx-app-c-text-light-1);
  --section-gap: 160px;
}
@media (prefers-color-scheme: dark) {
  .xxx-app {
    --color-background: var(--xxx-app-c-black);
    --color-background-soft: var(--xxx-app-c-black-soft);
    --color-background-mute: var(--xxx-app-c-black-mute);
    --color-border: var(--xxx-app-c-divider-dark-2);
    --color-border-hover: var(--xxx-app-c-divider-dark-1);
    --color-heading: var(--xxx-app-c-text-dark-1);
    --color-text: var(--xxx-app-c-text-dark-2);
  }
}
```

这样结合我们在html中class使用可以较好的做到样式隔离。

```html
<!DOCTYPE html>
<html lang="en" >
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body class="xxx-app">
    <div id="vite-app-1" class="xxx-app-id"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```
*请注意`body` 和 `#vite-app-1`上使用的样式。*


**样式定义中请谨慎使用ID选择器，它的优先级较高，不容易覆盖**

### 样式原子库 Tailwind

[参考文档](https://tailwindcss.com/docs/editor-setup), 方便编写样式，支持在元素中直接使用tailwind中定义好的class，把tailwind的class组合成自己的class。

### 多语言支持 vue-i18n

vue-i18n version 9.2.2 [教程](https://vue-i18n.intlify.dev/guide/)

I18N 配置在`src/lang`目录下。`src/lang/locales`根据需求添加多语种配置文件。

`src/lang/locales/en`配置英文词条, `src/lang/locales/zh`配置中文词条。

`src/lang/locales/en/common.json`

```JSON
{
  "en": "English",
  "zh": "中文",
  "confirm": "Confirm",
  "cancel": "Cancel",
  "placeholder": "Placeholder {0} interpolation",
  "hello_x": "Hello, {name}"
}
```

`src/lang/locales/en/index.js`

```js
import common from './common.json'
export default {
  common
}

```

`src/lang/index.js`
```js
import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zh from './locales/zh'

const i18n = createI18n({
  locale: 'zh', // 默认使用的语言
  fallbackLocale: 'en', //词条匹配不到时的回退语言
  messages: {
    en,
    zh
  }
})

export default i18n
```

页面中使用

```html
<template>
  <div>
    <template v-for="locale in $i18n.availableLocales" :key="locale">
      <span class="radio">
        <input
          :id="locale"
          v-model="lang"
          type="radio"
          name="locale"
          :value="locale"
        />
        <label :for="locale">{{ $t(`common.${locale}`) }}</label>
      </span>
    </template>
    <div>confirm: {{ $t('common.confirm') }}</div>
    <div>Placeholder: {{ $t('common.placeholder', ['xxxxx']) }}</div>
    <div>Hello: {{ $t('common.hello_x', { name: 'Bob' }) }}</div>
    (use i18n-t tag )Placeholder:
    <i18n-t keypath="common.hello_x">
      <template #name>
        <a href="https://cn.vuejs.org/">VUE3</a>
      </template>
    </i18n-t>
    <div>
      (use i18n-t tag )Placeholder:
      <i18n-t keypath="common.placeholder"> iiiiiiiii </i18n-t>
    </div>
    <div>
      <span>(use directive v-t)撤销:</span>
      <span v-t="'common.cancel'"></span>
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect } from 'vue'
import i18n from '@/language'
const lang = ref('zh')
watchEffect(() => {
  // 全局改变i18n使用的语言
  i18n.global.locale = lang.value
})
</script>
<style lang="less" scoped>
.radio {
  & + & {
    margin-left: 20px;
  }
}
</style>

```
输出词条支持`$t()`, 组件`<i18n-t keypath=""> `, 指令`v-t`

### Ajax 请求库 Axios

[参考文档](https://github.com/axios/axios#features)


### 与基座应用通信

代码示例见`main.js`

####引入库文件

```js
import {
  initCommunicate,
  addDataListener,
  clearAllListener
} from '@/lib/appCommunicate'
```
#### 初始化通信

```js
initCommunicate('eventCenterForApp1')
```
#### 添加数据监听

```js
addDataListener((data) => {
  console.log('page one vite getData:', data)
}, true)
```

#### 清空所有监听器

```js
// 监听卸载操作
window.addEventListener('unmount', function () {
  app.unmount()
  // 卸载所有数据监听函数
  clearAllListener()
  console.log('micro app child-vite unounted')
})
```




