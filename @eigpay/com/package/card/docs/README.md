<script setup>
import basicCard from './basicCard.vue'
import simpleCard from './simpleCard.vue'
import shadowCard from './shadowCard.vue'
</script>

# Card 说明文档

## 基础用法

卡片包含标题，内容以及操作区域。

Card 组件由 header 和 body 组成。 header 是可选的，其内容取决于一个具名的 slot。

<div class="demo-area">
  <basic-card />
  <preview-code comp-name="card" demo-name="basicCard"/>
</div>

## 简单卡片

<div class="demo-area">
  <simple-card />
  <preview-code comp-name="card" demo-name="simpleCard"/>
</div>

## 带有阴影效果的卡片

通过 shadow 属性设置卡片阴影出现的时机。 该属性的值可以是：always、hover 或 never。

<div class="demo-area">
  <shadow-card />
  <preview-code comp-name="card" demo-name="shadowCard"/>
</div>

---

## 属性

| 属性名     | 说明                                                                              | 类型   | 可选值             | 默认值                |
| ---------- | --------------------------------------------------------------------------------- | ------ | ------------------ | --------------------- |
| header     | 卡片的标题 既可以通过设置 header 来修改标题，也可以通过 slot#header 传入 DOM 节点 | string | —                  | —                     |
| body-style | body 的样式                                                                       | object | —                  | `{ padding: '16px' }` |
| shadow     | 设置阴影显示时机                                                                  | string | always/hover/never | always                |

<div style="margin-bottom:50px"></div>

## 插槽

| 插槽名 | 说明           |
| ------ | -------------- |
| -      | 自定义默认内容 |
| header | 卡片标题内容   |

<div style="margin-bottom:80px"></div>
