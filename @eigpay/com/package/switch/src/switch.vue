<template>
  <div ref="normalSwitchRef" :class="[ns.b(), ns.m('checked', isOn), ns.is('disabled', isDisabled)]" @click="toggle">
    <input type="checkbox" :data-name="dataName" :data-type="dataType" :class="ns.e('input')" :checked="isOn"
      :disabled="isDisabled" />
    <span v-if="!inlinePrompt" :class="[
      ns.e('label'),
      ns.em('label', 'active', !isOn),
      ns.em('label', 'left')
    ]">
      <component :is="inactiveIcon" v-if="inactiveIcon" />
      <template v-else>
        {{ inactiveText }}
      </template>
    </span>
    <span :class="[ns.e('center')]">
      <span :class="[ns.e('inner')]">
        <template v-if="inlinePrompt">
          <template v-if="!isOn">
            <component :is="inactiveIcon" v-if="inactiveIcon" />
            <template v-else>
              {{ inactiveText }}
            </template>
          </template>
          <template v-else>
            <component :is="activeIcon" v-if="activeIcon" />
            <template v-else>
              {{ activeText }}
            </template>
          </template>
        </template>
      </span>
      <span :class="[ns.e('slider')]">
        <slot v-if="isOn" name="sliderActiveIcon" />
        <slot v-else name="sliderInactiveIcon" />
      </span>
    </span>
    <span v-if="!inlinePrompt" :class="[
      ns.e('label'),
      ns.em('label', 'active', isOn),
      ns.em('label', 'right')
    ]">
      <component :is="activeIcon" v-if="activeIcon" />
      <template v-else>
        {{ activeText }}
      </template>
    </span>
  </div>
</template>
<script setup>
import { formContextKey, formItemContextKey } from '../../form/src/formLib'
import { watch, computed, inject, ref } from 'vue'
import { buildCssNamespace } from '../../util'
import get from 'lodash/get'
import noop from 'lodash/noop'

const ns = buildCssNamespace('switch')

const props = defineProps({
  // v-model 绑定的值
  modelValue: {
    type: [String, Number, Boolean],
    required: true
  },
  // switch 为 on 状态时的值
  activeValue: {
    type: [String, Number, Boolean],
    required: true
  },
  // switch 为 off 状态时的值
  inactiveValue: {
    type: [String, Number, Boolean],
    required: true
  },
  // switch 为 on 状态时文字说明
  activeText: {
    type: String,
    default: undefined
  },
  // switch 为 off 状态时文字说明
  inactiveText: {
    type: String,
    default: undefined
  },
  // switch 为 on 状态时显示的图标
  activeIcon: {
    type: [String, Function],
    default: undefined
  },
  // switch 为 off 状态时显示的图标
  inactiveIcon: {
    type: [String, Function],
    default: undefined
  },
  // 无论文字或图标，是否显示在switch内
  inlinePrompt: {
    type: Boolean,
    default: false
  },
  // 禁用switch
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否触发验证规则
  validateEvent: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:modelValue', 'change'])
// formContext
const formContext = inject(formContextKey, undefined)
//formItemContext
const formItemContext = inject(formItemContextKey, undefined)
// switch 是否是禁用态
const isDisabled = computed(
  () => props.disabled || get(formContext, 'disabled', false)
)
// switch 是否是on的状态
const isOn = computed(
  () =>
    [props.activeValue, props.inactiveValue].includes(props.modelValue) &&
    props.modelValue === props.activeValue
)
// 处理switch切换操作
const toggle = () => {
  if (isDisabled.value) {
    return
  }
  const nextState = !isOn.value
  const nextValue = nextState ? props.activeValue : props.inactiveValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

watch(
  () => props.modelValue,
  () => {
    if (props.validateEvent) {
      const validate = get(formItemContext, 'validate')
      validate && validate('change').catch(noop)
    }
  }
)

const dataName = computed(() => {
  const targetEle = normalSwitchRef.value?.closest('td')
  if (targetEle) {
    return targetEle.getAttribute('tmpcolumnlabel')
  } else {
    return formItemContext && formItemContext.formItemLabel
  }
})

const normalSwitchRef = ref(null)
const dataType = computed(() => {
  let prefix = ""
  if (normalSwitchRef.value?.closest(".ep-dialog")) {
    prefix = "dialog##"
  }
  else if (normalSwitchRef.value?.closest('td')) {
    prefix = "table##"
  }
  return prefix + 'switch'
})
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Switch')
}
</script>
