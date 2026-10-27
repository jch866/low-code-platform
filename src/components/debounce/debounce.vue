<template>
  <ep-button
    :type="
      props.dataValue.type !== undefined ? props.dataValue.type : 'primary'
    "
    :plain="props.dataValue.plain"
    :disabled="props.dataValue.disabled"
    :round="props.dataValue.round"
    @click="handleOnClick"
  >
    {{ $t(`${props.dataValue.buttonName}`) }}
  </ep-button>
</template>

<script setup>
import { onMounted } from 'vue'
import { debounce } from '@/utils/utils'

const props = defineProps({
  /**
   * 组件传参
   * dataValue: {
   *  buttonName: 按钮名称,
   *  type: 按钮分类，默认不传（如果传递，传空值就行）
   *  plain: 是否边框，默认false
   *  disabled: 是否禁用，默认false
   *  round: 是否圆角，默认false
   * }
   * onClick: 回调事件
   */
  dataValue: {
    type: Object,
    default: () => {
      return {
        buttonName: '',
        type: 'primary',
        plain: false,
        disabled: false,
        round: false
      }
    }
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})

const handleOnClick = debounce(async () => {
  // 可以实现功能，自己多试试
  // （回调函数，直接传递一个方法进来）
  props.onClick()
})
// 页面加载时
onMounted(() => {})
</script>
