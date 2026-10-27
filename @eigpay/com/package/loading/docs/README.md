<script setup>
  import normalLoading from './normalLoading.vue'
import customLoading from './customLoading.vue'
 
</script>

# loading 说明文档

## 基本用法

`EPLoading(options)` 会返回一个 Loading 实例，可通过调用该实例的 `close` 方法来关闭它。
app.config.globalProperties 上会有一个全局方法$loading， 它的调用方式为：this.$loading(options)，同样会返回一个 Loading 实例

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <normal-loading />
  <preview-code comp-name="loading" demo-name="normalLoading"/>
</div>
<div style="margin-top:20px"></div>

---

## 自定义

icon 图标也可以传入 iconfont 图标名称或者 ()=>Vnode，当传入函数类型时会被作为组件的具名插槽 icon 来使用。
可以通过 `animationClass` 自定义 loading 图片的动画效果

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <custom-loading />
  <preview-code comp-name="loading" demo-name="customLoading"/>
</div>
<div style="margin-top:20px"></div>

---

## loading 属性

| 属性名         | 说明                                                                           | 类型               | 默认值               |
| -------------- | ------------------------------------------------------------------------------ | ------------------ | -------------------- |
| target         | loading 需要覆盖的 DOM 节点，通过 document.querySelector 以获取到对应 DOM 节点 | string             | body                 |
| modal          | 是否需要遮罩层                                                                 | boolean            | true                 |
| text           | 显示在加载图标下方的加载文案                                                   | string             | 加载中...            |
| textColor      | 加载文案的文本颜色                                                             | string             | `#fff`               |
| background     | 遮罩背景色                                                                     | string             | `rgba(0, 0, 0, 0.2)` |
| icon           | 自定义图标 (icon 图标名称，或者 vnode)                                         | string / ()=>Vnode | —                    |
| lockScroll     | 当添加到 body 上时，是否需要锁定屏幕的滚动                                     | boolean            | true                 |
| zIndex         | loading 层级                                                                   | number             | 2000                 |
| animationClass | loading 的自定义动画效果                                                       | string             | —                    |

<div style="margin-bottom:50px"></div>

## loading 事件

| 事件名 | 说明         | 回调参数 |
| ------ | ------------ | -------- |
| close  | 隐藏 loading | -        |

<div style="margin-bottom:50px"></div>
