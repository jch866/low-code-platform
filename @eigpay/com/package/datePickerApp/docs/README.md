<script setup>
import demoApp from './demoApp.vue'

</script>

# DatePicker 说明文档

## 选择某一天(APP)

<div class="demo-area">
  <demo-app />
</div>

## DatePicker API

---

### DatePicker props

| 属性              | 说明                                                                                                                         | 类型           | 可选值                                         | 默认值     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------- | ---------- |
| v-model           | 绑定的值，如果它是数组，长度应该是 2                                                                                         | string / Array | -                                              | -          |
| placeholder       | 非范围选择时的占位内容                                                                                                       | string         | -                                              | -          |
| start-placeholder | 范围选择时开始日期的占位内容                                                                                                 | string         | -                                              | -          |
| end-placeholder   | 范围选择时结束日期的占位内容                                                                                                 | string         | -                                              | -          |
| clearable         | 是否显示清空按钮                                                                                                             | boolean        | -                                              | false      |
| disabled          | 设置输入框为禁用状态                                                                                                         | boolean        | -                                              | false      |
| format            | 显示在输入框中的格式                                                                                                         | string         | -                                              | YYYY-MM-DD |
| value-format      | 可选，绑定值的格式。                                                                                                         | string         | -                                              | YYYY-MM-DD |
| type              | 显示类型                                                                                                                     | string         | date/month/year/daterange/monthrange/yearrange | date       |
| unlink-panels     | 在范围选择器里取消两个日期面板之间的联动                                                                                     | boolean        | -                                              | false      |
| range-separator   | 选择范围时的分隔符                                                                                                           | string         | -                                              | '-'        |
| teleported        | 是否将 date-picker 的下拉列表插入至 body 元素                                                                                | boolean        | true / false                                   | true       |
| disabledDate      | 可选日期范围的校验函数，该函数接收一个参数为 Date 类型对象，返回值要求为 Boolean 类型，为 true 表示禁用，为 false 表示可以用 | Function       | -                                              | -          |

---

### DatePicker events

| 事件名         | 说明                                    | 回调参数              |
| -------------- | --------------------------------------- | --------------------- |
| change         | 用户确认选定的值时触发                  | (val: typeof v-model) |
| visible-change | 当 DatePicker 的下拉列表出现/消失时触发 | (visibility: boolean) |

---

### DatePicker slots

| 插槽名 | 说明 | 子标签 |
| ------ | ---- | ------ |
|        |      |        |
