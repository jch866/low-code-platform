<script setup>
import demo from './demo.vue'

</script>

# TimePicker 说明文档

## 表单用法

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="timePicker" demo-name="demo"/>


## TimePicker API

---

### TimePicker props

| 属性        | 说明                                         | 类型           | 可选值   | 默认值 |
| ----------- | ------------------------------------------ | -------------- | ------- | ------ |
| v-model     | 绑定的值                                     | string         | -       | -      |
| placeholder | 非范围选择时的占位内容                         | string         | -       | -      |
| clearable   | 是否显示清空按钮                              | boolean        | -       | false  |
| disabled    | 设置输入框为禁用状态                           | boolean        | -       | false  |
| format      | 显示在输入框中的格式                           | string         | -       | HH:mm:ss |
| value-format| 可选，绑定值的格式。                           | string         | -       | HH:mm:ss |
| teleported    | 是否将 time-picker 的下拉列表插入至 body 元素 | boolean        | true / false | true |
---

### TimePicker events

| 事件名         | 说明                       | 回调参数                           |
| -------------- | -------------------------- | ---------------------------------- |
| change         | 用户确认选定的值时触发 |         (val: typeof v-model)              |
| visible-change |当 time-picker 的下拉列表出现/消失时触发 |(visibility: boolean)

---