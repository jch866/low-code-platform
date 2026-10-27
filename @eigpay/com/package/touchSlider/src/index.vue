<template>
  <div
    ref="sliderRef"
    :class="['touch-slider', classname]"
    @touchstart="touchstart"
    @touchend="touchend"
    @touchmove="touchmove"
  >
    <slot />
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  /*
  //是否竖向（默认横向滑动）
  isVertical: {
    type: Boolean,
    default: false
  },
  */
  classname: {
    type: String,
    default: ''
  },
  //内容中有表格时，在表格上滑动时默认本组件的优先
  enableTableSlider: {
    type: Boolean,
    default: true
  },
  //默认显示第几页
  defaultIndex: {
    type: Number,
    default: 0
  },
  //滑块个数
  sliderLength: {
    type: Number,
    default: 1
  },
  defaultTop: {
    type: Number,
    default: null
  }
})

const sliderRef = ref(null)
const emit = defineEmits(['change'])
let beforLeft = 0,
  fromX = 0,
  currX,
  fromY = 0,
  currY,
  sliderIndex = 0
let target, nodes, sliderWidth, currEl, dir

onMounted(() => {
  target = sliderRef.value.children[0]
  nodes = target.children
  sliderWidth = nodes[0].offsetWidth
  dir = null
  if (props.defaultIndex) {
    sliderIndex = props.defaultIndex
    sliderRef.value.scrollTo(sliderIndex * sliderWidth, 0)
  }
  if (props.defaultTop) {
    sliderRef.value.scrollTo(0, props.defaultTop)
  }
  nextTick(() => {
    const firstChild = sliderRef.value.children[0].children[0]
    firstChild.style.visibility = 'visible'
    sliderRef.value.children[0].childNodes.forEach((node, i) => {
      if (i && node.nodeType == 1) node.style.height = '1px'
    })
  })
})
const touchstart = (evt) => {
  currEl = evt.target
  //echarts不滑动页面
  if (evt.target.closest('[_echarts_instance_]')) {
    currEl = null
  }
  //表格默认滑动页面
  if (!props.enableTableSlider && evt.target.closest('[_echarts_instance_]')) {
    currEl = null
  }
  fromX = getX(evt)
  fromY = getY(evt)
  beforLeft = target.scrollLeft
}
const touchmove = (evt) => {
  if (!currEl) return true
  currX = getX(evt)
  currY = getY(evt)
  //首次方向决定最终方向
  if ((!dir && Math.abs(currY - fromY) < Math.abs(currX - fromX)) || dir == 1) {
    //横向
    dir = 1
  } else {
    //竖向
    dir = 2
    return true
  }
  //next
  if (currX < fromX) {
    if (sliderIndex + 1 < props.sliderLength) {
      sliderRef.value.scrollTo(
        beforLeft + fromX - currX + sliderIndex * sliderWidth,
        0
      )
    }
  } else {
    if (sliderIndex > 0) {
      sliderRef.value.scrollTo(
        beforLeft + fromX - currX + sliderIndex * sliderWidth,
        0
      )
    }
  }
}

const getX = (evt) => {
    return (
      evt.pageX ||
      (evt.targetTouches[0]
        ? evt.targetTouches[0].pageX
        : evt.changedTouches[0].pageX)
    )
  },
  getY = (evt) => {
    return (
      evt.pageY ||
      (evt.targetTouches[0]
        ? evt.targetTouches[0].pageY
        : evt.changedTouches[0].pageY)
    )
  }

const touchend = (evt) => {
  if (!currEl || dir != 1) {
    dir = null
    currEl = null
    return true
  }

  dir = null
  currEl = null

  currX = getX(evt)
  currY = getY(evt)
  if (Math.abs(currY - fromY) < Math.abs(currX - fromX)) {
    const parentEl = sliderRef.value.children[0]
    if (currX < fromX) {
      //next
      if (sliderIndex + 1 < props.sliderLength) {
        sliderIndex++
        sliderRef.value.scrollTo(sliderWidth * sliderIndex, 0)

        //滚动到顶部
        sliderRef.value.scrollTop = 0
        //隐藏前一个页面内容
        parentEl.children[sliderIndex - 1].style.visibility = ''
        parentEl.children[sliderIndex - 1].style.height = '1px'

        parentEl.children[sliderIndex].style.visibility = 'visible'
        parentEl.children[sliderIndex].style.height = ''
        emit('change', sliderIndex)
      }
    } else {
      //prev
      if (sliderIndex > 0) {
        sliderIndex--
        sliderRef.value.scrollLeft = sliderWidth * sliderIndex

        //滚动到顶部
        sliderRef.value.scrollTop = 0
        //隐藏后一个页面内容
        parentEl.children[sliderIndex + 1].style.visibility = ''
        parentEl.children[sliderIndex + 1].style.height = '1px'

        parentEl.children[sliderIndex].style.visibility = 'visible'
        parentEl.children[sliderIndex].style.height = ''
        emit('change', sliderIndex)
      }
    }
  }
}
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('TouchSlider')
}
</script>
<style>
.touch-slider > div > * {
  visibility: hidden;
}
</style>
