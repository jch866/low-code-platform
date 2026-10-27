<script setup>
import basicBadge from './basicBadge.vue'
import placementBadge from './placementBadge.vue'
import colorBadge from './colorBadge.vue'
import spaceBadge from './spaceBadge.vue'
</script>

# Badge 说明文档

## 基础用法

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <basic-badge />
  <preview-code comp-name="badge" demo-name="basicBadge"/>
</div>
<div style="margin-top:20px"></div>

## 小红点显示位置

通过设置 placement 属性改变小红点显示的位置。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <placement-badge />
  <preview-code comp-name="badge" demo-name="placementBadge"/>
</div>
<div style="margin-top:20px"></div>

## 自定义背景颜色

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <color-badge />
  <preview-code comp-name="badge" demo-name="colorBadge"/>
</div>
<div style="margin-top:20px"></div>

## 自定义间距

当 placement 类型是 left 或者是 right 时，可以通过 space 属性定义圆点距元素的间距。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <space-badge />
  <preview-code comp-name="badge" demo-name="spaceBadge"/>
</div>
<div style="margin-top:20px"></div>

## Badge 属性

| 属性名    | 说明                                                             | 类型                                                                                     | 默认值    |
| --------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------- |
| value     | 显示值                                                           | string / number                                                                          | ""        |
| max       | 最大值,超过最大值会显示`{max}+`。只有当 value 是数字类型时起作用 | number                                                                                   | 99        |
| is-dot    | 是否显示小圆点                                                   | boolean                                                                                  | false     |
| color     | 背景色                                                           | string                                                                                   | -         |
| space     | 距离元素的距离，只有 placement 设置为 left 或 right 时有效       | number                                                                                   | -         |
| hidden    | 是否隐藏 Badge                                                   | boolean                                                                                  | false     |
| type      | 类型                                                             | `success \| error \| warning \| processing \| default`                                   | warning   |
| placement | 小红点出现位置                                                   | `top \| left \| right \| bottom \| top-left \| top-right \| bottom-left \| bottom-right` | top-right |

<div style="margin-bottom:50px"></div>

## Badge 插槽

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |

<div style="margin-bottom:50px"></div>
