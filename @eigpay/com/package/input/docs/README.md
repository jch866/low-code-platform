<script setup>
import demo from './demo.vue'
import clearableDemo from './clearable.vue'
import passwordDemo from './password.vue'
import countDemo from './count.vue'
import TextareaDemo from './textareaDemo.vue'
import formatDemo from './formatDemo.vue'
</script>

# Input 说明文档

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="input" demo-name="demo"/>

## 可清除

<div class="demo-area">
  <clearable-demo />
</div>
<preview-code comp-name="input" demo-name="clearable"/>

## 密码可查看

<div class="demo-area">
  <password-demo />
</div>
<preview-code comp-name="input" demo-name="password"/>

## 字数统计

<div class="demo-area">
  <count-demo />
</div>
<preview-code comp-name="input" demo-name="count"/>

## 格式化

<div class="demo-area">
  <format-demo />
</div>
<preview-code comp-name="input" demo-name="formatDemo"/>

## Textarea

<div class="demo-area">
  <TextareaDemo />
</div>

<preview-code comp-name="input" demo-name="textareaDemo"/>

## Input API

---

### Input props

| 属性        | 说明                                                             | 类型           | 默认值 |
| ----------- | ---------------------------------------------------------------- | -------------- | ------ |
| type        | input 的类型, 可选值为 text, textarea, password, number          | String         | text   |
| modelValue  | 绑定的值，可使用 v-model 双向绑定                                | String\|Number | -      |
| placeholder | placeholder                                                      | String         | -      |
| clearable   | 是否显示清空按钮                                                 | Boolean        | false  |
| disabled    | 设置输入框为禁用状态                                             | Boolean        | false  |
| readonly    | 设置输入框为只读                                                 | Boolean        | false  |
| maxlength   | 最大输入长度                                                     | Number         | -      |
| format      | 显示在输入框中的格式, 可选值为 thousands (只有 type=text 时生效) | String         | -      |

---

### Input events

| 事件名   | 说明                       | 回调参数 |
| -------- | -------------------------- | -------- |
| input    | 有输入的时触发             |          |
| blur     | 输入框失去焦点时触发       |          |
| focus    | 输入框获得焦点时触发       |          |
| change   | moduleValue 数据改变时触发 |          |
| keyup    | 原生的 keyup 事件          |          |
| keydown  | 原生的 keydown 事件        |          |
| keypress | 原生的 keypress 事件       |          |

---

### Input methods

| 函数名 | 说明              | 参数 | 返回值  |
| ------ | ----------------- | ---- | ------- |
| blur   | 使 input 失去焦点 | -    |         |
| clear  | 清除 input 值     | -    | Promise |
| focus  | 使 input 获取焦点 | -    |

---

### Input slots

| 插槽名 | 说明 | 子标签 |
| ------ | ---- | ------ |
