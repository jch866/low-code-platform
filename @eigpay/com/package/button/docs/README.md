
<script setup>
import demo from './demo.vue'
</script>
# Button 按钮文档

<demo />

<preview-code comp-name="button" demo-name="demo"/>



## Button API
---
### Button props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| type | 按钮分类, 可选值有 `primary`  | String |  -  |
| plain | 是否是普通按钮 | Boolean  | false |
| round | 是否是圆角按钮 | Boolean  | false |
| native-type | button原生type属性, 可选值 `button`, `submit`, `reset`  | String | button |
| disabled | 按钮是否禁用 | Boolean  | false |