<script setup>
import basicAnchor from './basicAnchor.vue'
</script>

# Anchor 说明文档

## 基础用法

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <basic-anchor />
  <preview-code comp-name="anchor" demo-name="basicAnchor"/>
</div>
<div style="margin-top:20px"></div>

---

## Anchor 属性

| 属性名  | 说明         | 类型   | 默认值 |
| ------- | ------------ | ------ | ------ |
| offsetY | 距离顶部距离 | number | 0      |

<div style="margin-bottom:50px"></div>

## Anchor 插槽

| 插槽名 | 说明           | 子标签      |
| ------ | -------------- | ----------- |
| -      | 自定义默认内容 | Anchor Item |

<div style="margin-bottom:50px"></div>

## Anchor Item 属性

| 属性名 | 说明     | 类型   | 默认值 |
| ------ | -------- | ------ | ------ |
| label  | 标题名称 | string | -      |

<div style="margin-bottom:50px"></div>

## Anchor Item 插槽

| 插槽名 | 说明           |
| ------ | -------------- |
| -      | 自定义默认内容 |

<div style="margin-bottom:50px"></div>
