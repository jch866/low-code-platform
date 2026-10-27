<script setup>
import basicMessage from './basicMessage.vue'
import customMessage from './customMessage.vue'
import pageTip from './pageTip.vue'
import multiLineMessage from './multiLineMessage.vue'
</script>

# Message 说明文档

## 基本用法

使用全局方法通过当前组件实例的 `vm.appContext.config.globalProperties.$message` 来直接调用。
使用单独引用 `import { EPMessage } from '../../index.js'`, 然后通过 `EPMessage(options)`调用。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <basic-message />
  <preview-code comp-name="message" demo-name="basicMessage"/>
</div>
<div style="margin-top:20px"></div>

## 自定义

消息文字可以传入 string 或者 ()=>Vnode 类型，当传入函数类型时则会被作为组件的默认插槽来使用。
icon 图标也可以传入 iconfont 图标名称或者 ()=>Vnode，当传入函数类型时会被作为组件的具名插槽 icon 来使用。
可以通过 `custom-class` 属性自定义提示框的宽度等。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <custom-message />
  <preview-code comp-name="message" demo-name="customMessage"/>
</div>
<div style="margin-top:20px"></div>

## 切换样式为 pageTip

通过 style-type 属性，切换样式为 `message` 还是 `pageTip`，pageTip 样式带背景色。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <page-tip />
  <preview-code comp-name="message" demo-name="pageTip"/>
</div>
<div style="margin-top:20px"></div>

## 多行消息,icon 是否垂直居中

当显示多行消息时，可以通过 `icon-center` 属性控制左侧图标和关闭按钮是否居中。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <multi-line-message />
  <preview-code comp-name="message" demo-name="multiLineMessage"/>
</div>
<div style="margin-top:20px"></div>

---

## Message 配置项

| 属性名       | 说明                                          | 类型                                           | 默认值        |
| ------------ | --------------------------------------------- | ---------------------------------------------- | ------------- |
| message      | 消息文字                                      | `string \| ()=>Vnode`                          | -             |
| type         | 消息类型                                      | `'info' \| 'success' \| 'warning' \| 'error' ` | info          |
| style-type   | 样式类型                                      | `'message' \| 'pagetip' `                      | message       |
| icon         | 自定义图标                                    | `string \| ()=>Vnode`                          | -             |
| custom-class | 自定义类名                                    | string                                         | -             |
| duration     | 显示时间，单位为毫秒。设置为 0 则不会自动关闭 | number                                         | 3000          |
| show-close   | 是否显示关闭按钮                              | boolean                                        | false         |
| on-close     | 关闭时的回调函数                              | function                                       | -             |
| offset       | Message 距离窗口顶部的偏移量                  | number                                         | 20            |
| appendTo     | 设置组件的根元素                              | `string \| HTMLElement`                        | document.body |
| icon-center  | 当显示多行文字时，图标是否居中显示            | boolean                                        | true          |

<div style="margin-bottom:50px"></div>

## Message 方法

调用 Message 或 this.$message 会返回当前 Message 的实例。如果需要手动关闭实例，可以调用它的 close 方法。

| 方法名 | 描述               |
| ------ | ------------------ |
| close  | 关闭当前的 Message |

<div style="margin-bottom:50px"></div>
