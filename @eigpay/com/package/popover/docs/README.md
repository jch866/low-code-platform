<script setup>
import demo from './demo.vue'
import slotDemo from './slotDemo.vue'
</script>

# Popover 说明文档

## 基础用法

trigger 属性被用来决定 popover 的触发方式，支持的触发方式： hover、click 或 focus。 如果你想手动控制它，可以设置 v-model 属性。

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="popover" demo-name="demo"/>

## 内容可扩展

可以在 Popover 中嵌套其它组件, 以下为嵌套表格的例子。

利用插槽取代 content 属性

<div class="demo-area">
  <slot-demo />
</div>

<preview-code comp-name="popover" demo-name="slotDemo"/>

## Popover API

---

### Popover props

| 属性        | 说明                                         | 类型           | 可选值  |  默认值 |
| ----------- | ------------------------------------------ | -------------- | ------ |-------|
| effect    | Popover 主题，内置了 dark / light 两种          | string         | dark / light | dark
| title     | 标题                                          | string
| content   | 显示的内容，也可以通过写入默认 slot 修改显示内容     | string         | -      |  -
| disabled   | Popover 组件是否禁用                           | boolean        | -      | false  |
| trigger    | 如何触发（展示） Popover                        | string         | hover / click / focus  | hover
| show-arrow | 是否显示 Popover 箭头                           | boolean        | -      | true
| v-model    | Popover 是否显示                               | boolean        | -       | false
| show-after | 在触发后多久显示内容，单位毫秒                     | number        | -       | 0
| hide-after | 延迟关闭，单位毫秒                               | number        | -       | 200
| teleported | 是否将 popover 的下拉列表插入至 body 元素         | boolean        | true / false | true
| placement | 出现位置                                       | string        | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom
| offset    | 出现位置的偏移量                                 | number        | -       | 0
---

### Popover event

| 事件名        | 说明            | 回调参数
| -----------  | ---------------| ------
| show         | 显示时触发       |  -
| hide         | 隐藏时触发       |  -

---

### Popover slots

| 插槽名        | 说明
| -----------  | ---------------
| —            | Popover 内嵌 HTML 文本
| reference    | 触发 Popover 显示的 HTML 元素
