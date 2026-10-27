<script setup>
import demo from './demo.vue'
import IconList from './IconList.vue'
</script>

# Icon 说明文档

## 引入字体样式

在 main.js 中引入字体样式

```js
import '../package/styles/font/iconfont.scss'
```

<div style="margin-top:20px"></div>

## 基础用法

<demo />

<preview-code comp-name="icon" demo-name="demo"/>

<div style="margin-top:20px"></div>

## 图标集合 (`点击图标复制代码`)

<IconList />

---

## Icon 属性

| 属性    | 说明                  | 类型               | 默认值   |
| ------- | --------------------- | ------------------ | -------- |
| `color` | fill 颜色             | `string`           | 继承颜色 |
| `size`  | 图标的大小，font-size | `number \| string` | -        |
| `icon`  | icon 名称             | `string`           | 空       |

---

## Icon 插槽

| 名称      | 说明       |
| --------- | ---------- |
| `default` | 自定义内容 |

<div style="margin-bottom:80px"></div>
