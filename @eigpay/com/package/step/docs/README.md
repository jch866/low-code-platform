<script setup>
import basicStep from './basicStep.vue'
import centerStep from './centerStep.vue'
import verticalStep from './verticalStep.vue'
import iconStep from './iconStep.vue'
import lineStep from './lineStep.vue'
</script>

# Step 说明文档

## 基础用法

设置 active 属性，接受一个 Number，表明步骤的 index，从 0 开始。 需要定宽的步骤条时，设置 space 属性即可，它接受 Number， 单位为 px， 如果不设置，则为自适应。

<div class="demo-area">
  <basic-step />
  <preview-code comp-name="step" demo-name="basicStep"/>
</div>
<div style="margin-bottom:20px"></div>

## 设置 step 样式

通过 `type` 属性设置样式，默认为 digital，也可以设置为 dot 或 square。通过 `title-line-straight` 属性设置标题和进度线是否在一条直线上，只在水平方向并且 align-center=false 时起作用。`background` 属性可以设置细线高亮时的颜色，可以设置为纯色或者渐变色。

<div class="demo-area">
  <line-step />
  <preview-code comp-name="step" demo-name="lineStep"/>
</div>
<div style="margin-bottom:20px"></div>

## 步骤条居中

<div class="demo-area">
  <center-step />
  <preview-code comp-name="step" demo-name="centerStep"/>
</div>
<div style="margin-bottom:20px"></div>

## 垂直的步骤条

只需要在 ep-step 元素中设置 direction 属性为 vertical 即可。

<div class="demo-area">
  <vertical-step />
  <preview-code comp-name="step" demo-name="verticalStep"/>
</div>
<div style="margin-bottom:20px"></div>

## 带图标的步骤条

通过 icon 属性来设置图标， 图标的类型可以是 EpIcon 组件中的图标名， 还能通过具名 slot 来使用自定义的图标。

<div class="demo-area">
  <icon-step />
  <preview-code comp-name="step" demo-name="iconStep"/>
</div>

---

## Step 属性

| 属性名              | 说明                                                                    | 类型          | 可选值              | 默认值     |
| ------------------- | ----------------------------------------------------------------------- | ------------- | ------------------- | ---------- |
| type                | step 的类型（数字或者小圆点或者方形）                                   | string        | digital/dot/square  | digital    |
| space               | 每个 step 的间距，不填写将自适应间距。 支持百分比。                     | number/string | —                   | —          |
| direction           | 显示方向                                                                | string        | vertical/horizontal | horizontal |
| active              | 设置当前激活步骤 (`process状态`)                                        | number        | -                   | 0          |
| align-center        | 进行居中对齐                                                            | boolean       | -                   | false      |
| title-line-straight | 标题和进度线是否在一条直线上（只有在 direction 为 `horizontal` 时有效） | boolean       | -                   | false      |
| background          | 设置细线高亮时的颜色                                                    | string        | -                   | -          |
| process-background  | 设置当前活跃状态到未活跃状态的细线颜色                                  | string        | -                   | -          |
| min-width           | 设置细线的最小宽度（只有在 `title-line-straight` 属性为 true 时有效）   | string        | -                   | -          |

<div style="margin-bottom:50px"></div>

## Step 插槽

| 插槽名 | 说明     | 子标签   |
| ------ | -------- | -------- |
| -      | 默认插槽 | stepItem |

<div style="margin-bottom:50px"></div>

## StepItem 属性

| 属性名      | 说明                                       | 类型   | 可选值                                     | 默认值 |
| ----------- | ------------------------------------------ | ------ | ------------------------------------------ | ------ |
| title       | 标题                                       | string | —                                          | —      |
| description | 描述方案                                   | string | —                                          | —      |
| icon        | StepItem 组件的自定义图标, iconfont 图标名 | string | —                                          | —      |
| status      | 设置当前步骤的状态                         | string | finish:已完成，process:进行中，wait:未开始 | —      |

<div style="margin-bottom:50px"></div>

## StepItem 插槽

| 插槽名      | 说明           |
| ----------- | -------------- |
| icon        | 自定义图标     |
| title       | 自定义标题     |
| description | 自定义描述内容 |

<div style="margin-bottom:80px"></div>
