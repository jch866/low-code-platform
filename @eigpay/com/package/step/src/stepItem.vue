<template>
  <div
    :style="style"
    :class="[
      ns.b(),
      ns.is(parent.props.direction, true),
      ns.is('flex', isLast && !space && !isCenter),
      ns.is('center', isCenter && !isvertivaled),
      ns.is('straight', isStraight),
      ns.is(stepType, true)
    ]"
  >
    <!-- 图标和横线 -->
    <div :class="[ns.e('head'), ns.is(currentStatus, true)]">
      <div
        :class="[
          ns.e('icon'),
          ns.is(icon || slotIcon ? 'icon' : 'text', true),
          ns.is(currentStatus, true)
        ]"
      >
        <slot name="icon">
          <ep-icon v-if="icon" :class="ns.e('icon-inner')" :icon="icon" />
          <div v-else :class="ns.e('icon-inner')">
            {{ index + 1 }}
          </div>
        </slot>
      </div>
      <div
        v-if="isStraight"
        :class="[ns.e('title'), ns.is(currentStatus, true)]"
      >
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="ns.e('line')" :style="minWidthLine">
        <i :class="ns.e('line-inner')" :style="lineStyle" />
      </div>
    </div>
    <!-- 标题`title`和描述`description` -->
    <div :class="ns.e('main')">
      <div :class="[ns.e('title'), ns.is(currentStatus, true)]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="[ns.e('description'), ns.is(currentStatus, true)]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  useSlots,
  inject,
  getCurrentInstance,
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onUnmounted
} from 'vue'
import { stepKey } from './stepLib'
import { buildCssNamespace } from '@package/util'
import isNumber from 'lodash/isNumber'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  /**
   * 目前只定义了三种状态：
   * finish:已完成，process:进行中，wait:未开始
   */
  status: {
    type: String,
    values: ['wait', 'process', 'finish'],
    default: ''
  }
})

const ns = buildCssNamespace('step-item')
const slotIcon = !!useSlots().icon
//获取父组件的props和steps
const parent = inject(stepKey)
const currentInstance = getCurrentInstance()
//记录步骤序号
const index = computed(() => {
  return parent.getInstanceIndex(currentInstance.uid)
})
const lineStyle = ref({})

// 更新每个item的状态
const updateState = () => {
  calcProcess(currentStatus.value)
}

const currentStatus = computed(() => {
  if (props.status) {
    // step-item设置的status优先级高
    return props.status
  } else {
    // 如果step-item未设置status,则根据 active 判断当前状态
    if (index.value + 1 === parent.props.active) {
      return 'process'
    } else if (index.value + 1 > parent.props.active) {
      return 'wait'
    } else {
      return 'finish'
    }
  }
})
const isCenter = computed(() => parent.props.alignCenter)
const isStraight = computed(() => {
  return (
    parent.props.titleLineStraight &&
    parent.props.direction === 'horizontal' &&
    !isCenter.value
  )
})
const stepType = computed(() => parent.props.type)
const isvertivaled = computed(() => parent.props.direction === 'vertical')
// 获取step-item总条数
const setpsCount = computed(() => parent.steps.value.length)

// 是否是最后一个item
const isLast = computed(() => {
  return parent.steps.value[setpsCount.value - 1]?.uid === currentInstance.uid
})

// item间距
const space = computed(() => {
  return parent.props.space
})

const style = computed(() => {
  // 判断space是数字还是%字符串
  const calcSpace = isNumber(space.value)
    ? `${space.value}px`
    : space.value
    ? space.value
    : `${100 / (isCenter.value ? setpsCount.value : setpsCount.value - 1)}%` // space.value没值则按100%自适应整个宽度
  const calcstyle = {
    flexBasis: calcSpace
  }
  if (isvertivaled.value) {
    return calcstyle
  }
  if (isLast.value) {
    calcstyle.maxWidth = `${100 / setpsCount.value}%`
  }
  return calcstyle
})

// 计算line的长度
const calcProcess = (status) => {
  let step = 0
  const style = {}
  if (status === 'finish') {
    step = 100
    style.background = parent.props.background || '#0163CA'
  }
  if (status === 'process') {
    step = 100
    style.background = parent.props.processBackground || '#C9CDD4'
  }
  style.height = step ? '1px' : 0
  style[parent.props.direction === 'vertical' ? 'height' : 'width'] = `${step}%`
  lineStyle.value = style
}

const minWidthLine = computed(() => {
  const minWidth = parent.props.minWidth
  if (isStraight.value) {
    return { minWidth: minWidth }
  } else {
    return {}
  }
})

const stepItemState = reactive({
  uid: currentInstance.uid,
  instance: currentInstance
})

watch(currentStatus, () => {
  updateState(parent.props.active)
})

onMounted(() => {
  parent.addStepItem(stepItemState)
  watch(
    () => parent.props.active,
    (active) => {
      updateState(active)
    },
    { immediate: true }
  )
})

onUnmounted(() => {
  parent.removeStepItem(currentInstance.uid)
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('StepItem')
}
</script>
