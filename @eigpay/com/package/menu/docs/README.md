<script setup>
import basicMenu from './basicMenu.vue'
import customMenu from './customMenu.vue'
import horizontalMenu from './horizontalMenu.vue'
</script>

# Menu 说明文档

## 基本使用

导航菜单默认为垂直模式，通过将 mode 属性设置为 `horizontal` 来使导航菜单变更为水平模式。

<div class="demo-area">
  <basic-menu />
  <preview-code comp-name="menu" demo-name="basicMenu"/>
</div>
<div style="margin-top:20px"></div>

## 自定义颜色

通过 `background-color`、`hover-background-color` 、`text-color` 等属性用来设置菜单的背景色、悬停状态时菜单的背景色、菜单的文字颜色和当前激活菜单的文字颜色。

<div class="demo-area">
  <custom-menu />
  <preview-code comp-name="menu" demo-name="customMenu"/>
</div>
<div style="margin-top:20px"></div>

## 水平菜单

通过将 mode 属性设置为 `horizontal` 。

<div class="demo-area">
  <horizontal-menu />
  <preview-code comp-name="menu" demo-name="horizontalMenu"/>
</div>
<div style="margin-top:20px"></div>

---

## Menu 属性

| 属性名                  | 说明                                                                         | 类型    | 可选值                | 默认值   |
| ----------------------- | ---------------------------------------------------------------------------- | ------- | --------------------- | -------- |
| mode                    | 菜单展示模式                                                                 | string  | horizontal / vertical | vertical |
| collapse                | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）                         | boolean | -                     | false    |
| background-color        | 菜单的背景颜色                                                               | string  | -                     | -        |
| hover-background-color  | 悬停状态下 item 的背景颜色                                                   | string  | -                     | -        |
| active-background-color | 激活状态下 item 的背景颜色                                                   | string  | -                     | -        |
| inside-background-color | 子集菜单的背景色                                                             | string  | -                     | -        |
| text-color              | 文字颜色                                                                     | string  | -                     | -        |
| hover-text-color        | 悬停状态下文字颜色                                                           | string  | -                     | -        |
| active-text-color       | 激活状态下文本颜色                                                           | string  | -                     | -        |
| default-active          | 页面加载时默认激活菜单的 index                                               | string  | -                     | -        |
| default-openeds         | 默认打开的 sub-menu 的 index 的数组                                          | Array   | -                     | -        |
| unique-opened           | 是否只保持一个子菜单的展开                                                   | boolean | -                     | false    |
| menu-trigger            | 子菜单打开的触发方式，只在 mode 为 horizontal 时有效。                       | string  | hover / click         | hover    |
| popper-effect           | Tooltip 主题，内置了 dark / light 两种主题                                   | string  | dark / light          | dark     |
| indicatorTop            | 水平方向时，indicator 的位置在顶部还是底部                                   | boolean | -                     | false    |
| popper-class            | 设置的是 subItem 中的 tooltip，为 popper 添加类名。 (不能写在 css scoped 中) | string  | —                     | —        |

<div style="margin-bottom:50px"></div>

## Menu 事件

| 事件名 | 说明                | 回调参数                                                                        |
| ------ | ------------------- | ------------------------------------------------------------------------------- |
| select | 菜单激活回调        | index: 选中菜单项的 index, indexPath: 选中菜单项的 index path, item: 选中菜单项 |
| open   | sub-menu 展开的回调 | index: 打开的 sub-menu 的 index, indexPath: 打开的 sub-menu 的 index path       |
| close  | sub-menu 收起的回调 | index: 收起的 sub-menu 的 index, indexPath: 收起的 sub-menu 的 index path       |

<div style="margin-bottom:50px"></div>

## Menu 插槽

| 插槽名 | 说明           | 子标签                     |
| ------ | -------------- | -------------------------- |
| -      | 自定义默认内容 | el-sub-menu / el-menu-item |

<div style="margin-bottom:50px"></div>

## SubMenu 属性

| 属性名   | 说明     | 类型    | 可选值 | 默认值 |
| -------- | -------- | ------- | ------ | ------ |
| index    | 唯一标识 | string  | -      | -      |
| disabled | 是否禁用 | boolean | -      | false  |

<div style="margin-bottom:50px"></div>

## SubMenu 插槽

| 插槽名 | 说明           | 子标签                     |
| ------ | -------------- | -------------------------- |
| -      | 自定义默认内容 | el-sub-menu / el-menu-item |
| title  | 自定义标题内容 | -                          |

<div style="margin-bottom:50px"></div>

## MenuItem 属性

| 属性名   | 说明     | 类型        | 可选值 | 默认值 |
| -------- | -------- | ----------- | ------ | ------ |
| index    | 唯一标志 | string/null | -      | null   |
| disabled | 是否禁用 | boolean     | -      | false  |

<div style="margin-bottom:50px"></div>

## MenuItem 事件

| 事件名 | 说明                 | 回调参数          |
| ------ | -------------------- | ----------------- |
| click  | 菜单点击时的回调函数 | el-menu-item 实例 |

<div style="margin-bottom:50px"></div>

## MenuItem 插槽

| 插槽名 | 说明           |
| ------ | -------------- |
| -      | 自定义默认内容 |
| title  | 自定义标题内容 |

<div style="margin-bottom:50px"></div>
