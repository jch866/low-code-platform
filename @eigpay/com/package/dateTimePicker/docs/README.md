<script setup>
import demo from './demo.vue'

</script>

# DateTimePicker 说明文档

## 基础用法

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="dateTimePicker" demo-name="demo"/>


## DatePicker API

---

### DatePicker props

| 属性        | 说明                                         | 类型           | 可选值   | 默认值 |
| ----------- | ------------------------------------------ | -------------- | ------- | ------ |
| v-model     | 绑定的值，如果它是数组，长度应该是 2            | string / Array  | -       | -      |
| placeholder | 非范围选择时的占位内容                         | string         | -       | -      |
| clearable   | 是否显示清空按钮                              | boolean        | -       | false  |
| disabled    | 设置输入框为禁用状态                           | boolean        | -       | false  |
| format      | 显示在输入框中的格式                           | string         | -       | YYYY-MM-DD HH:mm:ss |
| value-format| 可选，绑定值的格式。                           | string         | -       | YYYY-MM-DD HH:mm:ss |
| date-format | 可选，时间选择器下拉列表中显示的日期格式。         | string         | -       | YYYY-MM-DD |
| time-format | 可选，时间选择器下拉列表中显示的时间格式。         | string         | -       | HH:mm:ss |
| type        | 显示类型                                     | string         |  date/datetime/month/year/daterange/monthrange/yearrange  |date |
| teleported    | 是否将 date-picker 的下拉列表插入至 body 元素 | boolean        | true / false | true |
---

### DatePicker events

| 事件名         | 说明                       | 回调参数                           |
| -------------- | -------------------------- | ---------------------------------- |
| change         | 用户确认选定的值时触发 |         (val: typeof v-model)              |
| visible-change |当 DatePicker 的下拉列表出现/消失时触发 |(visibility: boolean)

---

### DatePicker slots

| 插槽名 | 说明 | 子标签 |
| ------ | ---- | ------ |
| default|自定义单元格内容|  |
