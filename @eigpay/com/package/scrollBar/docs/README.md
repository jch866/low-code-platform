
<script setup>
import HeightAndMaxHeight from './heightAndMaxheight.vue'
import AlwaysShow from './alwaysShow.vue'
import MethodsAndEvent from './methodsAndEvent.vue'
</script>

# ScrollBar 说明文档

### 设置内容区高度和最大高度
<div class="demo-area">
  <HeightAndMaxHeight />
</div>

<preview-code comp-name="scrollBar" demo-name="heightAndMaxheight"/>


### 是否一致显示滚动条


<div class="demo-area">
  <AlwaysShow />
</div>

***如果内容区没有超出容器的宽度是不会出现滚动条的***

<preview-code comp-name="scrollBar" demo-name="alwaysShow"/>


### 外部设置滚动位置

<div class="demo-area">
  <MethodsAndEvent />
</div>

<preview-code comp-name="scrollBar" demo-name="methodsAndEvent"/>

## Radio API
---
### ScrollBar props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| tag | 包裹内容区域元素的标签名 | String |  -  | 
| wrapStyle | 自定义包裹内容父元素的样式|String, Array, Object |  -  |
| thumbMinSize | 滚动条滑块的最小尺寸 | Number  | 20 |
| height | 包裹内容区的高度，数字类型，单位px  | Number | - |
| maxHeight | 包裹内容区的最大高度，数字类型，单位px  | Number | - |
| alwaysShow | 是否始终显示滚动条，默认为hover内容区显示滚动条 | Boolean | false |

---
### ScrollBar events
| 事件名 | 说明 | 回调参数 |
| ----------- | ----------- | ----------- |
| scroll | 内容区scroll事件 | ({scrollTop, scrollLeft}) |

---
### ScrollBar methods

| 函数名 | 说明 | 参数 | 返回值|
| ----------- | ----------- | ----------- | ----------- |
| scrollTo | 指定滚动到的位置| 支持选项对象参数，和水平/垂直, 参数同[options](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo)  | |


---
### ScrollBar slots

| 插槽名 | 说明 | 子标签 |
| ----------- | ----------- | ----------- |
| - | 缺省插槽，内容区 | - |

