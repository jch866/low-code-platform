<template>
  <div v-if="props.waterMarkType === 'text'" ref="textRef">
    <slot></slot>
  </div>
  <div v-else ref="pngRef">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import useWatermark from './useWatermark'
const props = defineProps({
  //水印的样式 目前只支持两种text和png
  waterMarkType: {
    type: String,
    required: true,
    default: 'png'
  },
  text: {
    // 传入水印的文本
    type: String,
    default: 'watermark'
  },
  fontSize: {
    // 字体的大小
    type: Number,
    default: 40
  },
  gap: {
    //水印重复的间隔
    type: Number,
    default: 10
  },
  //图片地址
  imageUrl: {
    type: String,
    default: ''
  },
  //图片旋转角度
  rotate: {
    type: String,
    default: '0'
  }
})
const textCanvas = useWatermark(props)
const textRef = ref(null)
const pngRef = ref(null)
const flag = ref(0) // 声明一个依赖
let waterMark
watchEffect(() => {
  flag.value // 将依赖放在 watchEffect 里
  const whichRef = props.waterMarkType === 'text' ? textRef.value : pngRef.value
  if (!whichRef) {
    return
  }
  if (waterMark) {
    waterMark.remove()
  }
  waterMark = document.createElement('div')
  if (props.waterMarkType === 'text') {
    waterMark = document.createElement('div')
    const { base64, styleSize } = textCanvas.value
    waterMark.style.backgroundImage = `url(${base64})`
    waterMark.style.backgroundSize = `${styleSize}px ${styleSize}px`
    waterMark.style.backgroundRepeat = 'repeat'
    waterMark.style.position = 'absolute'
    waterMark.style.inset = 0
    waterMark.style.zIndex = 9999
    waterMark.style.pointerEvents = 'none'
    textRef.value.appendChild(waterMark)
  } else {
    waterMark.style.backgroundImage = `url(${props.imageUrl})`
    waterMark.style.width = '350%'
    waterMark.style.height = '350%'
    waterMark.style.top = '-100%'
    waterMark.style.left = '-100%'
    waterMark.style.zIndex = 9999
    waterMark.style.pointerEvents = 'none'
    waterMark.style.position = 'absolute'
    waterMark.style.transform = `rotate(${props.rotate})`
    waterMark.style.opacity = '0.2'
    pngRef.value.appendChild(waterMark)
  }
})
let ob
onMounted(() => {
  const whichRef = props.waterMarkType === 'text' ? textRef.value : pngRef.value
  ob = new MutationObserver((records) => {
    for (const record of records) {
      for (const dom of record.removedNodes) {
        if (dom === waterMark) {
          flag.value++ // 删除节点的时候更新依赖
          return
        }
      }
      if (record.target === waterMark) {
        flag.value++ // 修改属性的时候更新依赖
        return
      }
    }
  })
  ob.observe(whichRef, {
    childList: true,
    attributes: true,
    subtree: true
  })
})
onUnmounted(() => {
  ob && ob.disconnect()
  waterMark = null
})
</script>
