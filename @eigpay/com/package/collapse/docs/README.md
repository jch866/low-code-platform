<script setup>
import basicCollapse from './basicCollapse.vue'
import lineCollapse from './lineCollapse.vue'
import accordionCollapse from './accordionCollapse.vue'
</script>

# Collapse 说明文档

## 基础用法

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <basic-collapse />
  <preview-code comp-name="collapse" demo-name="basicCollapse"/>
</div>
<div style="margin-top:20px"></div>

## 切换类型

通过 type 属性可以切换类型，类型值为 default 或者 line。当为 line 类型时标题没有背景色并且整个 collapse 没有外边框。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <line-collapse/>
  <preview-code comp-name="collapse" demo-name="lineCollapse"/>
</div>
<div style="margin-top:20px"></div>

## 每次只能展开一个面板

通过 accordion 属性来设置。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <accordion-collapse />
  <preview-code comp-name="collapse" demo-name="accordionCollapse"/>
</div>
<div style="margin-top:20px"></div>

## Collapse 属性

| 属性名                | 说明                                                                    | 类型           | 默认值      |
| --------------------- | ----------------------------------------------------------------------- | -------------- | ----------- |
| model-value / v-model | 当前激活的面板(如果是手风琴模式，绑定值类型需要为 string，否则为 array) | string / array | —           |
| accordion             | 是否手风琴模式                                                          | boolean        | false       |
| type                  | collapse 的类型，值为 `'default' \| 'line' `                            | string         | `'default'` |

<div style="margin-bottom:50px"></div>

## Collapse 事件

| 事件名 | 说明                                                                                   | 回调参数                      |
| ------ | -------------------------------------------------------------------------------------- | ----------------------------- |
| change | 当前激活面板改变时触发(如果是手风琴模式，参数 activeNames 类型为 string，否则为 array) | (activeNames: array / string) |

<div style="margin-bottom:50px"></div>

## Collapse 插槽

| 插槽名 | 说明           | 子标签        |
| ------ | -------------- | ------------- |
| -      | 自定义默认内容 | Collapse Item |

<div style="margin-bottom:50px"></div>

## Collapse Item 属性

| 属性名   | 说明       | 类型          | 默认值 |
| -------- | ---------- | ------------- | ------ |
| name     | 唯一标志符 | string/number | -      |
| title    | 面板标题   | string        | -      |
| disabled | 是否禁用   | boolean       | -      |

<div style="margin-bottom:50px"></div>

## Collapse Item 插槽

| 插槽名 | 说明                           |
| ------ | ------------------------------ |
| -      | content of Collapse Item       |
| title  | content of Collapse Item title |

<div style="margin-bottom:50px"></div>
