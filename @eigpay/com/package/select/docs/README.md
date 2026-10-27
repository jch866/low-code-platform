<script setup>
import demo from './demo.vue'
import disabledOption from './disabledOption.vue'
import disabled from './disabled.vue'
import clearable from './clearable.vue'
import customOption from './customOption.vue'
import MultipleSelect from './multipleSelect.vue'
import FilterableSelect from './FilterableSelect.vue'
import SelectRemoteFilter from './SelectRemoteFilter.vue'
</script>

# Select 说明文档

## 基础用法

适用广泛的基础单选 v-model 的值为当前被选中的 el-option 的 value 属性值

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="select" demo-name="demo"/>

## 有禁用选项

在 ep-option 中，设定 disabled 值为 true，即可禁用该选项

<div class="demo-area">
  <disabled-option/>
</div>

<preview-code comp-name="select" demo-name="disabledOption"/>

## 禁用状态

禁用整个选择器组件

为 el-select 设置 disabled 属性，则整个选择器不可用。

<div class="demo-area">
  <disabled/>
</div>

<preview-code comp-name="select" demo-name="disabled"/>

## 可清空单选

包含清空按钮，可将选择器清空为初始状态

为 ep-select 设置 clearable 属性，则可将选择器清空。

<div class="demo-area">
  <clearable/>
</div>

<preview-code comp-name="select" demo-name="clearable"/>

## 自定义模板

你可以自定义单个选项怎么被渲染

将自定义的 HTML 模板插入 ep-option 的 slot 中即可。

<div class="demo-area">
  <custom-option/>
</div>

<preview-code comp-name="select" demo-name="customOption"/>

## 多选

通过设置 multiple 属性为 true, 指示该组件支持多选

<div class="demo-area">
  <MultipleSelect/>
</div>

<preview-code comp-name="select" demo-name="multipleSelect"/>

## 筛选选项

可以利用筛选功能快速查找选项。 `filterable`属性即可启用搜索功能。 默认情况下，Select 会找出所有 label 属性包含输入值的选项。 如果希望使用其他的搜索逻辑，可以通过传入一个 filter-method 来实现。 filter-method 为一个 Function，它会在输入值发生变化时调用，参数为当前输入值。

<div class="demo-area">
  <FilterableSelect/>
</div>

<preview-code comp-name="select" demo-name="FilterableSelect"/>

## 远程(异步)搜索

根据输入的关键字异步地查找数据

为了启用异步搜索，需要将 filterable 和 remote 设置为 true，同时传入一个 remote-method。 remote-method 为一个 Function，它会在输入值发生变化时调用，参数为当前输入值。

<div class="demo-area">
  <SelectRemoteFilter/>
</div>

<preview-code comp-name="select" demo-name="SelectRemoteFilter"/>

## Select API

---

### Select props

| 属性           | 说明                                                                                                                             | 类型                  | 默认值 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------ |
| modelValue     | 绑定的值，可使用 v-model 双向绑定                                                                                                | String\|Number\|Array | -      |
| placeholder    | placeholder                                                                                                                      | String                | -      |
| clearable      | 是否显示清空按钮                                                                                                                 | Boolean               | false  |
| disabled       | 设置输入框为禁用状态                                                                                                             | Boolean               | false  |
| multiple       | 是要支持多选， 多选的情况下，modelValue 的值为 Array 类型                                                                        | Boolean               | false  |
| multipleLimit  | 当进行多选时, 最多可选择多少项, 默认值为-1，表示不进行限制                                                                       | Number                | -1     |
| filterable     | 是否开启下拉选项筛选功能，filter 开启后默认是从现有的下拉选项中进行关键字过滤，通过 filterMethod 属性可以进行自定义的选项过滤    | Boolean               | false  |
| filterMethod   | 自定义选项筛选方法, 这个方法被调用时参数只有一个,为当前输入的关键字，同时在 dropdown 隐藏时也会调用这个方法，参数为空串          | Function              | -      |
| remote         | 其中的 dropdown 选项是否从服务器远程加载                                                                                         | Boolean               | false  |
| remoteMethod   | 自定义远程的选项筛选方法, 这个方法被调用时参数只有一个为, 当前输入的关键字，同时在 dropdown 隐藏时也会调用这个方法，参数为空串。 | Function              | -      |
| loading        | 是否正在执行 remoteMethod                                                                                                        | Boolean               | false  |
| loading-text   | 正在执行 remoteMethod 时，dropdown 显示的提示文字                                                                                | String                | -      |
| teleported     | 该下拉菜单是否使用 teleport 插入 body 元素                                                                                       | boolean               | true   |
| disabledIsShow | 禁用的选项是否显示                                                                                                               | boolean               | true   |

---

### Select events

| 事件名         | 说明                  | 回调参数                           |
| -------------- | --------------------- | ---------------------------------- |
| change         | 选中值发生变化时触发  | val，目前的选中值                  |
| visible-change | 下拉框出现/隐藏时触发 | val，出现则为 true，隐藏则为 false |

---

### Select slots

| 插槽名 | 说明            | 子标签    |
| ------ | --------------- | --------- |
| -      | Option 组件列表 | ep-option |

### Option props

| 属性     | 说明           | 类型                  | 默认值 |
| -------- | -------------- | --------------------- | ------ |
| value    | 选项的值       | string/number/boolean |
| label    | 选项的标签     | string/number         |
| disabled | 是否禁用该选项 | boolean               | false  |

### Option slots

| 插槽名 | 说明                         | 子标签 |
| ------ | ---------------------------- | ------ |
| -      | 默认插槽                     |        |
| empty  | 无 dropdown 选项时显示的内容 | -      |
