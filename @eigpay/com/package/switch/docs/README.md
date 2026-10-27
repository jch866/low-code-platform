
<script setup>
import DemoNormally from './demoNormally.vue'
import DemoInlinePrompt from './demoInlinePrompt.vue'
import DemoDisabled from './demoDisabled.vue'
</script>
# Switch 说明文档

### 普通使用
独立使用可以表示两种状态间的切换, v-model 绑定String, Number, Boolean 类型的变量，并配合activeValue 和 inactiveValue, 获得不同状态下的值。
<div class="demo-area">
  <DemoNormally/>
</div>
<preview-code comp-name="switch" demo-name="demoNormally"/>

### 增加状态的文字说明
activeText和inactiveText 分别为两种状态的文字说明，使用inlinePrompt控制说明文字是否显示在switch中
<div class="demo-area">
  <DemoInlinePrompt/>
</div>
<preview-code comp-name="switch" demo-name="demoInlinePrompt"/>


### 设置禁用状态
单独设置disabled属性true为禁用或依赖是form组件的disabled属性
<div class="demo-area">
  <DemoDisabled/>
</div>
<preview-code comp-name="checkbox" demo-name="demoDisabled"/>



## Switch API
---
### Switch props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| modelValue | 绑定的值，可使用 v-model 双向绑定 | String, Number, Boolean, Array |  -  |
| activeValue | switch 为 on 状态时的值 | String, Number, Boolean | - |
| inactiveValue | switch 为 off 状态时的值 | String, Number, Boolean | - |
| activeText | switch 为 on 状态时的文字说明 | String | - |
| inactiveText | switch 为 off 状态时文字说明 | String | - |
| inlinePrompt | 文字是否显示在switch内 | Boolean | false |
| disabled | 是否禁用 | Boolean | false |
| validateEvent | 该Switch状态变化时，是否触发验证规则 | Boolean | true |



---
### Switch events
| 事件名 | 说明 | 回调参数 |
| ----------- | ----------- | ----------- |
| change | 该Switch状态变化时触发 | switch的value |

---
### Switch methods

| 函数名 | 说明 | 参数 | 返回值|
| ----------- | ----------- | ----------- | ----------- |
| - | - | - |


---
### Switch slots

| 插槽名 | 说明 | 子标签 |
| ----------- | ----------- | ----------- |
| sliderActiveIcon | switch 为 on 状态时, 滑块内的图标 | - |
| sliderActiveIcon | switch 为 off 状态时, 滑块内的图标 | - |


