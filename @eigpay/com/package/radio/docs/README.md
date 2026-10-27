
<script setup>
import RadioWithoutGroup from './radioWithoutGroup.vue'
import RadioWithGroup from './radioWithGroup.vue'
import RadioWithForm from './radioWithForm.vue'
</script>

# Radios 说明文档

### 单独使用Radio
<div class="demo-area">
  <RadioWithoutGroup />
</div>

<preview-code comp-name="radio" demo-name="radioWithoutGroup"/>

### 和Radio Group 配合使用
<div class="demo-area">
  <RadioWithGroup />
</div>
<preview-code comp-name="radio" demo-name="radioWithGroup"/>

### 和Form 配合使用
<div class="demo-area">
  <RadioWithForm />
</div>
<preview-code comp-name="radio" demo-name="radioWithForm"/>

## Radio API
---
### Radio props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| modelValue | 绑定的值，可使用 v-model 双向绑定 | String\|Number |  -  | 
| value | Radio 的值, 如果modelValue的值和value相等，显示为选中状态 | String\|Number |  -  |
| label | Radio的Label text | String  | - |
| disabled | 设置Radio为禁用状态  | Boolean | false |

---
### Radio events
| 事件名 | 说明 | 回调参数 |
| ----------- | ----------- | ----------- |
| change | Radio的change事件 | 当前radio的value |

---
### Radio methods

| 函数名 | 说明 | 参数 | 返回值|
| ----------- | ----------- | ----------- | ----------- |
| - | - | -  | |


---
### Radio slots

| 插槽名 | 说明 | 子标签 |
| ----------- | ----------- | ----------- |
| - | 缺省插槽，插槽中提供了内容，就不会显示props.label | - |


## RadioGroup API

---
### RadioGroup props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| modelValue | 绑定的值，可使用 v-model 双向绑定 | `String`, `Number`, `Boolean` |  -  | 
| disabled | 设置Radio为禁用状态  | Boolean | false |

---
### RadioGroup events
| 事件名 | 说明 | 回调参数 |
| ----------- | ----------- | ----------- |
| change | 选中的Radio有变化时触发 | 选中Radio的Value |

---
### RadioGroup methods

| 函数名 | 说明 | 参数 | 返回值|
| ----------- | ----------- | ----------- | ----------- |
| - | - | -  | |


---
### RadioGroup slots

| 插槽名 | 说明 | 子标签 |
| ----------- | ----------- | ----------- |
| - | 一组Radio | Radio |


