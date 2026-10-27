
<script setup>
import DemoNormally from './demoNormally.vue'
import DemoDisabled from './demoDisabled.vue'
import DemoWithForm from './demoWithForm.vue'
import DemoIndeterminate from './demoIndeterminate.vue'
</script>
# Checkbox 说明文档

### 普通使用
独立使用可以表示两种状态间的切换, v-model 绑定String, Number, Boolean 类型的变量，并配合falseValue 和 trueValue, 获得不同状态。支持label属性或是slot显示checkbox的说明
<div class="demo-area">
  <DemoNormally/>
</div>
<preview-code comp-name="checkbox" demo-name="demoNormally"/>

### 禁用状态

单独设置禁用或是form组件的disabled属性
<div class="demo-area">
  <DemoDisabled/>
</div>
<preview-code comp-name="checkbox" demo-name="demoDisabled"/>

### 设置Checkbox为indeterminate态

设置checkbox的indeterminate属性为true, 不管当前按钮的状态时选中或时未选中，都会显示为indeterminate态
<div class="demo-area">
  <DemoIndeterminate/>
</div>
<preview-code comp-name="checkbox" demo-name="demoIndeterminate"/>


单独设置禁用或是form组件的disabled属性
<div class="demo-area">
  <DemoDisabled/>
</div>
<preview-code comp-name="checkbox" demo-name="demoDisabled"/>


### 多选和在form中使用
多选需要modelValue为`Array`类型, 同时设置value属性。
<div class="demo-area">
  <DemoWithForm/>
</div>
<preview-code comp-name="checkbox" demo-name="demoWithForm"/>


## Checkbox API
---
### Checkbox props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| modelValue | 绑定的值，可使用 v-model 双向绑定 | String, Number, Boolean, Array |  -  |
| value | 当modelValue类型为`Array`时, 该Checkbox选中状态的值 | String, Number | - |
| falseValue | 当modelValue类型不为Array时，该Checkbox未选中状态的值 | String, Number | - |
| trueValue | 当modelValue类型不为Array时，该Checkbox选中状态的值 | String, Number | - |
| label | label文字 | String | - |
| disabled | 是否禁用 | Boolean | false |
| indeterminate | 设置该Checkbox为indeterminate 状态 | Boolean | - |
| validateEvent | 该Checkbox状态变化时，是否触发验证规则 | Boolean | true |



---
### Checkbox events
| 事件名 | 说明 | 回调参数 |
| ----------- | ----------- | ----------- |
| change | 该Checkbox状态变化时触发 | checkbox原生changeEvent |

---
### Checkbox methods

| 函数名 | 说明 | 参数 | 返回值|
| ----------- | ----------- | ----------- | ----------- |
| - | - | - |


---
### Checkbox slots

| 插槽名 | 说明 | 子标签 |
| ----------- | ----------- | ----------- |
|-| 默认为label的内容| - |


