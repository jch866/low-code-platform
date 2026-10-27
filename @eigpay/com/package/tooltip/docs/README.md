<script setup>
import demo from './demo.vue'
import lightDemo from './lightDemo.vue'
import slotDemo from './slotDemo.vue'
import customClassTooltip from './customClassTooltip.vue'
</script>

# Tooltip 说明文档

## 基础用法

Tooltip 组件内置了两个主题：dark 和 light。通过设置 effect 来修改主题，默认值为 dark.

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="tooltip" demo-name="demo"/>

## trigger 用法

trigger 属性被用来决定 tooltip 的触发方式，支持的触发方式： hover、click、focus. 如果你想手动控制它，可以设置 v-model 属性。

<div class="demo-area">
  <light-demo />
</div>

<preview-code comp-name="tooltip" demo-name="lightDemo"/>

## 更多内容的文字提示

展示多行文本或者是设置文本内容的格式

用具名 slot content，替代 tooltip 中的 content 属性。

<div class="demo-area">
  <slot-demo />
</div>

<preview-code comp-name="tooltip" demo-name="slotDemo"/>

## 自定义类名 popper-class

<div class="demo-area">
  <custom-class-tooltip />
</div>

<preview-code comp-name="tooltip" demo-name="customClassTooltip"/>

## Tooltip API

---

### Tooltip props

| 属性         | 说明                                      | 类型    | 可选值                                                                                                    | 默认值 |
| ------------ | ----------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- | ------ |
| effect       | Tooltip 主题，内置了 dark / light 两种    | string  | dark / light                                                                                              | dark   |
| content      | 显示的内容                                | string  | -                                                                                                         | -      |
| disabled     | Tooltip 组件是否禁用                      | boolean | -                                                                                                         | false  |
| trigger      | 如何触发（展示） Tooltip                  | string  | hover / click / focus                                                                                     | hover  |
| v-model      | Tooltip 是否显示                          | boolean | -                                                                                                         | false  |
| show-after   | 在触发后多久显示内容，单位毫秒            | number  | -                                                                                                         | 0      |
| hide-after   | 延迟关闭，单位毫秒                        | number  | -                                                                                                         | 200    |
| teleported   | 是否将 tooltip 的下拉列表插入至 body 元素 | boolean | true / false                                                                                              | true   |
| placement    | 出现位置                                  | string  | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
| offset       | 出现位置的偏移量                          | number  | -                                                                                                         | 0      |
| popper-class | 为 Tooltip 的 popper 添加类名             | string  | —                                                                                                         | —      |

---

### Tooltip slots

| 插槽名  | 说明                      |
| ------- | ------------------------- |
| —       | Tooltip 触发 & 引用的元素 |
| content | 自定义内容                |
