<script setup>
import dialogBasic from './dialogBasic.vue'
import dialogNest from './dialogNest.vue'
</script>

# Dialog 说明文档

## 基本用法

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <dialog-basic />
  <preview-code comp-name="dialog" demo-name="dialogBasic"/>
</div>
<div style="margin-top:20px"></div>

## 嵌套的对话框

如果需要在一个 Dialog 内部嵌套另一个 Dialog，需要使用 append-to-body 属性，并且设置为 true。

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <dialog-nest />
  <preview-code comp-name="dialog" demo-name="dialogNest"/>
</div>
<div style="margin-top:20px"></div>

---

## Dialog 属性

| 属性名                | 说明                                                                                           | 类型                                 | 默认值 |
| --------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------ | ------ |
| model-value/v-model   | 是否显示 Dialog                                                                                | boolean                              | false  |
| title                 | Dialog 对话框的标题，也可以通过具名插槽 header 传入                                            | string                               | -      |
| width                 | Dialog 的宽度                                                                                  | string/number                        | 50%    |
| fullscreen            | 是否为全屏 Dialog                                                                              | boolean                              | false  |
| top                   | Dialog 内部内容距离顶部的距离 margin-top                                                       | string                               | 15vh   |
| modal                 | 是否需要遮罩层                                                                                 | boolean                              | true   |
| append-to-body        | Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true                   | boolean                              | true   |
| lock-scroll           | 是否在 Dialog 出现时将 body 滚动锁定                                                           | boolean                              | true   |
| close-on-click-modal  | 是否可以通过点击 modal 关闭 Dialog                                                             | boolean                              | true   |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Dialog                                                               | boolean                              | true   |
| show-close            | 是否显示关闭按钮                                                                               | boolean                              | true   |
| before-close          | 关闭前的回调，会暂停 Dialog 的关闭. 回调函数内执行 done 参数方法的时候才是真正关闭对话框的时候 | Functino(done){done 用来关闭 Dialog} | -      |
| center                | 是否让 Dialog 的 header 和 footer 部分居中排列                                                 | boolean                              | false  |
| align-center          | 是否水平垂直对齐对话框                                                                         | boolean                              | false  |

<div style="margin-bottom:50px"></div>

## Dialog 插槽

| 插槽名 | 说明                                                  |
| ------ | ----------------------------------------------------- |
| -      | Dialog 的内容                                         |
| header | 对话框标题的内容，会替换标题部分,但是不会移除关闭按钮 |
| footer | Dialog 按钮操作区的内容                               |

<div style="margin-bottom:50px"></div>

## Dialog 事件

| 事件名 | 说明              |
| ------ | ----------------- |
| open   | Dialog 打开的回调 |
| close  | Dialog 关闭的回调 |

<div style="margin-bottom:50px"></div>
