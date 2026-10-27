<script setup>
import lineProgress from './lineProgress.vue'
import colorProgress from './colorProgress.vue'
import circleProgress from './circleProgress.vue'
import customProgress from './customProgress.vue'
</script>

# Progress 说明文档

## 基础用法

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <line-progress />
  <preview-code comp-name="progress" demo-name="lineProgress"/>
</div>
<div style="margin-top:20px"></div>

## 自定义进度条的颜色

可以通过 color 属性来设置进度条的颜色。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <color-progress />
  <preview-code comp-name="progress" demo-name="colorProgress"/>
</div>

## 环形进度条

Progress 组件可通过 type 属性来指定使用环形进度条，在环形进度条中，还可以通过 width 属性来设置其大小。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <circle-progress />
  <preview-code comp-name="progress" demo-name="circleProgress"/>
</div>

## 自定义内容

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <custom-progress />
  <preview-code comp-name="progress" demo-name="customProgress"/>
</div>

---

## Progress 属性

| 属性名         | 说明                                                              | 类型                 | 可选值                       | 默认值 |
| -------------- | ----------------------------------------------------------------- | -------------------- | ---------------------------- | ------ |
| percentage     | 百分比，必填                                                      | number               | (0-100)                      | 0      |
| type           | 进度条类型                                                        | string               | line/circle                  | line   |
| stroke-width   | 进度条的宽度                                                      | number               | —                            | 6      |
| text-inside    | 进度条显示文字内置在进度条内（仅 type 为 `line` 时可用）          | boolean              | —                            | false  |
| status         | 进度条当前状态                                                    | string               | paused/error/warning/success | —      |
| color          | 进度条背景色 （会覆盖 `status` 状态颜色）                         | string               | —                            | —      |
| width          | 环形进度条画布宽度（只在 type 为 `circle` 或 `dashboard` 时可用） | number               | —                            | 126    |
| show-text      | 是否显示进度条文字内容                                            | boolean              | —                            | true   |
| stroke-linecap | circle/dashboard 类型路径两端的形状                               | string               | butt/round/square            | round  |
| format         | 指定进度条文字内容                                                | function(percentage) | —                            | —      |

<div style="margin-bottom:50px"></div>

## Progress 插槽

| 插槽名  | 说明                            |
| ------- | ------------------------------- |
| default | 自定义内容，参数为 {percentage} |

<div style="margin-bottom:80px"></div>
