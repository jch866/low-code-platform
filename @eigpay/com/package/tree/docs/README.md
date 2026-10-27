<script setup>
import Basic from './basic.vue'
import Selectable from './selectable.vue'
import CheckingTree from './checking-tree.vue'
import disabledTree from './disabled-tree.vue'
 
</script>

# Tree 说明文档

## 基础用法

基础的树形结构展示。

<div class="demo-area">
  <Basic />
  <preview-code comp-name="tree" demo-name="basic"/>
</div>
<div style="margin-bottom:20px"></div>

## 可选择

适用于需要选择多层级时使用。打开控制台 console.log 查看输出日志

<div class="demo-area">
<checking-tree />
<preview-code comp-name="tree" demo-name="checking-tree"/>
</div>

<div style="margin-bottom:20px"></div>

## 禁用复选框

节点的复选框可以设置为禁用。

在示例中，通过 `disabled` 设置禁用状态。 相应的复选框已禁用，不能点击。

<div class="demo-area">
<disabled-tree />
<preview-code comp-name="tree" demo-name="disabled-tree"/>
</div>

<div style="margin-bottom:20px"></div>
 
---

## 属性

| 属性名             | 说明                                                 | 类型     | 默认值             |
| ------------------ | ---------------------------------------------------- | -------- | ------------------ |
| data               | 展示数据                                             | array    | -                  |
| node-key           | 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 | string   | -                  |
| props              | 配置选项，具体看下表                                 | object   | -                  |
| default-expand-all | 是否默认展开子项                                     | boolean  | false              |
| show-checkbox      | 节点是否可被选择                                     | boolean  | false              |
| icon               | 默认图标                                             | string   | 'ep-i-unfold-down' |
| render-content     | 自定义渲染函数                                       | Function | -                  |
| checkStrictly      | 父子勾选时互不干扰                                   | boolean  | - false            |

<div style="margin-bottom:20px"></div>

## Props

| 属性名   | 说明                                         | 类型                         | 默认值 |
| -------- | -------------------------------------------- | ---------------------------- | ------ |
| label    | 指定节点标签为节点对象的某个属性值           | string, function(data, node) | -      |
| children | 指定子树为节点对象的某个属性值               | string                       | -      |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | string, function(data, node) | -      |

<div style="margin-bottom:20px"></div>

## 方法

| 方法名          | 描述                                                                        | 参数                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getCheckedNodes | 如果节点可以被选中，(show-checkbox 为 true), 本方法将返回当前选中节点的数组 | (leafOnly, includeHalfChecked) 接收两个布尔类型参数: 1. 默认值为 false. 若参数为 true, 它将返回当前选中节点的子节点 2. 默认值为 false. 如果参数为 true, 返回值包含半选中节点数据 |
| getCheckedKeys  | 若节点可用被选中 (show-checkbox 为 true), 它将返回当前选中节点 key 的数组   | 若节点可用被选中 (show-checkbox 为 true), 它将返回当前选中节点 key 的数组                                                                                                        |
| setCheckedNodes | 设置目前勾选的节点，使用此方法必须提前设置 node-key 属性                    | 设置目前勾选的节点，使用此方法必须提前设置 node-key 属性                                                                                                                         |
| setCheckedKeys  | 设置目前选中的节点，使用此方法必须设置 node-key 属性                        | (keys, leafOnly) 接收两个参数: 1. 一个需要被选中的多节点 key 的数组 2. 布尔类型的值 如果设置为 true，将只设置选中的叶子节点状态。 默认值是 false                                 |

<div style="margin-bottom:20px"></div>

## Tree 事件

| 事件名     | 说明               | 回调参数                                                                                        |
| ---------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| node-click | 节点被点击时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 |
| check-change | 当复选框被点击的时候触发 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 |
| current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象 |

<div style="margin-bottom:50px"></div>
