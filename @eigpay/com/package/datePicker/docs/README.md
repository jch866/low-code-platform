<script setup>
import formDemo from './formDemo.vue'
import demo from './demo.vue'
import dateFormat from './dateFormat.vue'
import datePeriod from './datePeriod.vue'
import datePeriodMonth from './datePeriodMonth.vue'
import datePeriodYear from './datePeriodYear.vue'
import unlinkPanels from './unlinkPanels.vue'
import multipleType from './multipleType.vue'

</script>

# DatePicker 说明文档

## 表单用法

<div class="demo-area">
  <form-demo />
</div>

<preview-code comp-name="datePicker" demo-name="formDemo"/>

## 选择某一天

以”日“为基本单位，基础的日期选择控件

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="datePicker" demo-name="demo"/>

## 选择一段时间

可在一个选择器中便捷地选择一个时间范围

<div class="demo-area">
  <date-period />
</div>

<preview-code comp-name="datePicker" demo-name="datePeriod"/>

`type="monthrange"` 按月选择区间

<div class="demo-area">
  <date-period-month />
</div>

<preview-code comp-name="datePicker" demo-name="datePeriodMonth"/>

`type="yearrange"` 按年选择区间

<div class="demo-area">
  <date-period-year />
</div>

<preview-code comp-name="datePicker" demo-name="datePeriodYear"/>

## 各面板独立切换月份

在选择日期范围时，默认情况下左右面板会联动。 如果希望两个面板各自独立切换当前月份，可以使用 unlink-panels 属性解除联动。

<div class="demo-area">
  <unlink-panels/>
</div>

<preview-code comp-name="datePicker" demo-name="unlinkPanels"/>

## 日期格式

使用format指定输入框的格式。 使用 value-format 指定绑定值的格式。

在 [这里](https://day.js.org/docs/en/display/format#list-of-all-available-formats) 查看 Day.js 支持的 format 参数。
<div class="demo-warning">
  <p class="custom-block-title">WARNING</p>
  请一定要注意传入参数的大小写是否正确
</div>

<div class="demo-area">
  <date-format />
</div>

<preview-code comp-name="datePicker" demo-name="dateFormat"/>

## 其他日期单位

在日期单位在`日`的基础上增加了`月`和`年`

<div class="demo-area">
  <multiple-type />
</div>

<preview-code comp-name="datePicker" demo-name="multipleType"/>


## DatePicker API

---

### DatePicker props

| 属性        | 说明                                         | 类型           | 可选值   | 默认值 |
| ----------- | ------------------------------------------ | -------------- | ------- | ------ |
| v-model     | 绑定的值，如果它是数组，长度应该是 2            | string / Array  | -       | -      |
| placeholder | 非范围选择时的占位内容                         | string         | -       | -      |
| start-placeholder | 范围选择时开始日期的占位内容              | string         | -       | -      |
| end-placeholder | 范围选择时结束日期的占位内容                 | string        | -       | -      |
| clearable   | 是否显示清空按钮                              | boolean        | -       | false  |
| disabled    | 设置输入框为禁用状态                           | boolean        | -       | false  |
| format      | 显示在输入框中的格式                           | string         | -       | YYYY-MM-DD |
| value-format| 可选，绑定值的格式。                           | string         | -       | YYYY-MM-DD |
| type        | 显示类型                                     | string         |  date/month/year/daterange/monthrange/yearrange  |date |
| unlink-panels | 在范围选择器里取消两个日期面板之间的联动        | boolean        | -       | false |
| range-separator | 选择范围时的分隔符                        |  string        | -       | '-' |
| teleported    | 是否将 date-picker 的下拉列表插入至 body 元素 | boolean        | true / false | true |
| disabledDate    | 可选日期范围的校验函数，该函数接收一个参数为Date类型对象，返回值要求为Boolean类型，为true表示禁用，为false表示可以用 | Function        | - | - |
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
|        |      |  |
