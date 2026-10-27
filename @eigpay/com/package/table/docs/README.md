<script setup>
import SimpleTable from './simpleTable.vue'
import CustomTable from './customTable.vue'
import FixedTable from './fixedTable.vue'
import NodataTable from './nodataTable.vue'
import ExpandTable from './expandTable.vue'
import SpanTable from './spanTable.vue'
// import DemoDisabled from './demoDisabled.vue'
// import DemoWithForm from './demoWithForm.vue'
// import DemoIndeterminate from './demoIndeterminate.vue'
</script>

# Table 说明文档

### 带表头合并简单样例

<div class="demo-area">
  <simple-table></simple-table>
</div>
<preview-code comp-name="table" demo-name="simpleTable"/>

### 表头自定义和单元格自定义

使用 TableColumn 的 header 插槽定义表头，使用 formatter 函数处理数据

<div class="demo-area">
  <custom-table></custom-table>
</div>
<preview-code comp-name="table" demo-name="customTable"/>

### 表格固定

设置列表的 fixed 属性，达到不同固定方式

<div class="demo-area">
  <fixed-table></fixed-table>
</div>
<preview-code comp-name="table" demo-name="fixedTable"/>

### 无数据时的提示文字

利用 emptyText 属性，控制没有数据时的显示文字

<div class="demo-area">
  <nodata-table></nodata-table>
</div>
<preview-code comp-name="table" demo-name="nodataTable"/>

### 行可展开的表格

TableColumn 组件的 type 属性设置为 expand, 并在 expand 插槽中编写展开时要展示的内容。TableColumn 的缺省插槽的 slotProps 包含了 expanded 属性，用来标示当前行是否时展开状态。

<div class="demo-area">
  <ExpandTable/>
</div>
<preview-code comp-name="table" demo-name="expandTable"/>

### 合并行或列

通过自定义的`span-method`属性，进行合并行或列的操作。函数的参数(row, column, rowIndex, columnIndex), `row`表示当前行数据， `column`表示当前列的配置, `rowIndex`表示当前行的索引, `columnIndex`表示当前列的索引。 返回值可以是数组形式也可以是对象形式，设`rowspan`为合并的行数，`colspan`为合并的列数，返回值形式可以为`[rowspan, colspan]`, 也可以为`{rowpspan, colspan}`, 如果返回值不是对象或数组默认`rowspan`和`colspan`分别为 1，如果不想渲染某个单元格，可使 rowspan 和 colspan 为 0。
注意代码中有个给某列 td 加自定义样式用法

<div class="demo-area">
  <SpanTable/>
</div>
<preview-code comp-name="table" demo-name="spanTable"/>

---

### Table props

| 属性        | 说明                                                                                                                                                        | 类型             | 默认值  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------- |
| data        | 由于填充行信息的数据                                                                                                                                        | Array            | -       |
| height      | 表格固定高度。设置该值后高度是固定的，填充后数据行后，如果高度大于此值，表格会出现滚动条，但表头是固定的。 高度单位 px                                      | String, Number   | -       |
| maxHeight   | 表格表格的最大高度。填充后数据行后，如果高度大于此值，表格会出现滚动条，但表头是固定的; 填充后数据行后, 表格的高度小于此值，表格按实际高度显示。高度单位 px | String, Number   | -       |
| fit         | 列的宽度是否自撑开到父元素的 100%。 fit 为 true，表格所有列的宽度总和小于父元素的宽度时，会自动计算以填满父元素宽度                                         | Boolean          | true    |
| tableLayout | 用于布局表格单元格，行和列的算法，可选值 fixed, auto                                                                                                        | String           | fixed   |
| showHeader  | 是否显示表头                                                                                                                                                | Boolean          | true    |
| emptyText   | 无数据时显示的文字                                                                                                                                          | String           | No Data |
| rowKey      | 可以唯一标识一行数据的字段, 如果传入的是 function, function 的返回值就是唯一标识。                                                                          | String, Function | -       |
| spanMethod  | 自定义合并行或列的函数, 函数的参数(row, column, rowIndex, columnIndex), 返回值可以是数组形式也可以是对象形式                                                | Function         | -       |

---

### Table events

| 事件名   | 说明                                                       | 回调参数      |
| -------- | ---------------------------------------------------------- | ------------- |
| rowClick | 某一数据行的点击事件, 回调参数有两个包含了 row 和 rowIndex | row，rowIndex |

---

### Table methods

| 函数名 | 说明 | 参数 | 返回值 |
| ------ | ---- | ---- | ------ |
| -      | -    | -    |

---

### Table slots

| 插槽名 | 说明                 | 子标签      |
| ------ | -------------------- | ----------- |
| -      | 表格列配置信息       | TableColumn |
| empty  | 没有数据时显示的内容 | -           |

### TableColumn props

| 属性                | 说明                                                                                                                                                               | 类型           | 默认值 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ------ |
| label               | 列标题                                                                                                                                                             | String         | -      |
| prop                | 该列要展示数据的属性名                                                                                                                                             | String         | -      |
| width               | 列固定宽度。当 Table 的 fit 为 true，并且总列宽小于父容器宽度的情况下，没有设置 width 的列会被优先调整列宽，所有列都设置了 width，所有列按比例调整列宽。 单位为 px | String, Number | -      |
| minWidth            | 列最小宽度。                                                                                                                                                       | String, Number | -      |
| fixed               | 该列是否要固定，接受布尔值或 String。 String 类型可选值`left`, `right`, 布尔值为 true, 表示也是左固定                                                              | String         | -      |
| align               | 表格内容文字对齐方式，可选值`left`, `center`, `right`                                                                                                              | String         | left   |
| headerAlign         | 表头标题文字对齐方式，可选值`left`, `center`, `right`                                                                                                              | String         | left   |
| formatter           | 自定义数据格式化回调函数, 回调函数的参数为`{row, column, rowIndex, colIndex, value}`                                                                               | Function       | -      |
| type                | 显示类型， 可选值`expand`, expand 表示可出现展开行的效果，需要配合 expand slot 同时使用                                                                            | String         | -      |
| showOverflowTooltip | 是否启用 tooltip, 当显示内容超出单元格宽度时自动裁剪, 鼠标 hover 单元格后，tooltip 展示全部内容                                                                    | Boolean        | false  |
| showEye             | 是否显示眼睛 (表头文字右侧是否显示眼睛)                                                                                                                            | Boolean        | false  |

---

### TableColumn events

| 事件名 | 说明 | 回调参数 |
| ------ | ---- | -------- |
| -      | -    | -        |

---

### TableColumn methods

| 函数名 | 说明 | 参数 | 返回值 |
| ------ | ---- | ---- | ------ |
| -      | -    | -    |

---

### TableColumn slots

| 插槽名  | 说明                                                                                                | 子标签 |
| ------- | --------------------------------------------------------------------------------------------------- | ------ |
| default | 单元格渲染插槽, slot 的 slotProps 对象, 包含如下属性`{ row, column, rowIndex, colIndex, expanded }` | -      |
| header  | 表头自定义插槽, slot 的 slotProps 对象, 包含如下属性`{ column, index }`                             | -      |
| expand  | 展开行的插槽, slot 的 slotProps 对象, 包含如下属性`{ row, rowIndex, expanded }`                     | -      |
