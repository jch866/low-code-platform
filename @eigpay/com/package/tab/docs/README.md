<script setup>
import demo from './demo.vue'
import cardType from './cardType.vue'
import customHead from './customHead.vue'
import keepAliveTab from './keepAliveTab.vue'
import customSlotHeader from './customSlotHeader.vue'
import BorderCard from './borderCard.vue'
</script>

# Tab 说明文档

## 基础用法

基础的、简洁的标签页。

Tab 组件提供了选项卡功能， 通过 value 属性来指定当前选中的标签页。

<div class="demo-area" >
  <demo />
</div>

<preview-code comp-name="tab" demo-name="demo"/>

## 卡片风格的标签

你可以设置具有卡片风格的标签。

只需要设置 type 属性为 card 就可以使选项卡改变为标签风格。

<div class="demo-area">
  <card-type />
</div>

<preview-code comp-name="tab" demo-name="cardType"/>

## 卡片边框风格的标签

你可以设置具有卡片边框风格的标签。

只需要设置 type 属性为 `border-card` 就可以使选项卡改变为标签风格。

<div class="demo-area" style="max-width: 1000px">
  <BorderCard />
</div>
<preview-code comp-name="tab" demo-name="borderCard"/>

## 自定义标签页的内容

可以通过具名插槽来实现自定义标签页的内容

<div class="demo-area">
  <custom-head />
</div>

<preview-code comp-name="tab" demo-name="customHead"/>

## 保存状态的 Tab

通过 isKeepAlive 属性控制 tab 是否保存状态，默认值为 true

<div class="demo-area">
  <keep-alive-tab />
</div>

<preview-code comp-name="tab" demo-name="keepAliveTab"/>

## 自定义 Header Slot

<div class="demo-area">
  <custom-slot-header />
</div>

<preview-code comp-name="tab" demo-name="customSlotHeader"/>

## Tab API

---

### Tab props

| 属性           | 说明                                                          | 类型            | 可选值             | 默认值              |
| -------------- | ------------------------------------------------------------- | --------------- | ------------------ | ------------------- |
| v-model        | 绑定值，选中选项卡的 name                                     | String / Number | -                  | 第一个选项卡的 name |
| type           | 风格类型                                                      | String          | card , border-card | —                   |
| indicatorWidth | 简单风格时，tab 标签下指示器的宽度，默认为整个 tab 标签的宽度 | Number          | -                  | —                   |
| isKeepAlive    | 是否保存每个 tabItem 的状态                                   | Boolean         | -                  | true                |
| lazy           | 是否懒加载 tab pane                                           | Boolean         | -                  | false               |
| isSticky       | tab-header 是否为吸顶效果                                     | Boolean         | -                  | false               |

---

### Tab events

| 事件名     | 说明                  | 回调参数                            |
| ---------- | --------------------- | ----------------------------------- |
| tab-click  | tab 被选中时触发      | (被选中的标签 tab 实例, click 事件) |
| tab-change | activeName 改变时触发 | (被选中的标签的 name)               |

---

### Tab slots

| 插槽名 | 说明     | 子标签   |
| ------ | -------- | -------- |
| -      | 默认插槽 | Tab-pane |

---

### Tab-pane props

| 属性     | 说明                                              | 类型            | 默认值 |
| -------- | ------------------------------------------------- | --------------- | ------ |
| label    | 选项卡标题                                        | string          | -      |
| disabled | 是否禁用                                          | boolean         | false  |
| name     | 与选项卡绑定值 value 对应的标识符，表示选项卡别名 | string / number | -      |
| lazy     | 是否懒加载本 pane                                 | Boolean         | false  |

---

### Tab-pane slots

| 插槽名 | 说明                                    |
| ------ | --------------------------------------- |
| -      | Tab-pane 的内容                         |
| label  | Tab-pane 的标题内容                     |
| header | Tab-pane 标题区域，会覆盖整个 item 区域 |
