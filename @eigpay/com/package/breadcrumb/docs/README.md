<script setup>
import basicUsage from './basicUsage.vue'
import separaIcon from './separaIcon.vue'
import sepcialBreadcrumb from './sepcialBreadcrumb.vue'
</script>

# Breadcrumb 说明文档

## 基础用法

在 `ep-breadcrumb` 中使用 `ep-breadcrumb-item` 标签表示从首页开始的每一级。 该组件接受一个 `String` 类型的参数 `separator` 来作为分隔符。 默认值为 "/"。

<div class="demo-area">
  <basic-usage />
  <preview-code comp-name="breadcrumb" demo-name="basicUsage"/>
</div>
<div style="margin-bottom:20px"></div>

## 图标分隔符

通过设置 `separator-icon` 可使相应的 `iconfont` 作为分隔符，注意这将使 `separator` 失效
。

<div class="demo-area">
<separa-icon />
<preview-code comp-name="breadcrumb" demo-name="separaIcon"/>
</div>
<div style="margin-bottom:20px"></div>

## 特殊用法

通过 `highlight` 属性，来设置当前 item 是否高亮。

<div class="demo-area">
<sepcial-breadcrumb />
<preview-code comp-name="breadcrumb" demo-name="sepcialBreadcrumb"/>
</div>

---

## Breadcrumb 属性

| 属性名         | 说明                | 类型   | 默认值 |
| -------------- | ------------------- | ------ | ------ |
| separator      | 分隔符              | string | /      |
| separator-icon | iconfont 的图标名称 | string | -      |

<div style="margin-bottom:50px"></div>

## Breadcrumb 插槽

| 插槽名 | 说明           | 子标签          |
| ------ | -------------- | --------------- |
| -      | 自定义默认内容 | Breadcrumb Item |

<div style="margin-bottom:50px"></div>

## Breadcrumb Item 属性

| 属性名    | 说明                                            | 类型          | 默认值 |
| --------- | ----------------------------------------------- | ------------- | ------ |
| to        | 路由跳转目标，同 `vue-router` 的 `to` 属性      | string/object | -      |
| replace   | 如果设置该属性为 `true`, 导航将不会留下历史记录 | boolean       | false  |
| highlight | 是否是高亮状态                                  | boolean       | false  |

<div style="margin-bottom:50px"></div>

## Breadcrumb Item 插槽

| 插槽名 | 说明           |
| ------ | -------------- |
| -      | 自定义默认内容 |

<div style="margin-bottom:80px"></div>
