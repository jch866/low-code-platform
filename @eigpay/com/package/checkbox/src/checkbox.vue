<template>
  <component :is="'label'" :class="[
    ns.b(),
    ns.is('disabled', isDisabled),
    ns.is('focus', focus),
    ns.is('checked', checkedState),
    ns.is('indeterminate', indeterminate)
  ]">
    <span :class="ns.e('shape')">
      <span :class="ns.e('faker')">
        <span :class="ns.e('faker-inner')">
          <!-- <ep-icon v-if="checkedState" icon="ep-i-tick" /> -->
          <span v-if="indeterminate" :class="ns.e('faker-inner—indeterminate')" />
          <ep-icon v-else-if="checkedState" icon="ep-i-tick" />
        </span>
      </span>
      <input ref="checkboxRef" type="checkbox" :data-name="dataName" :data-type="dataType" :disabled="isDisabled"
        :checked="checkedState" :class="ns.e('original')" :indeterminate="indeterminate" @change="handleChange"
        @focus="focus = true" @blur="focus = false" />
    </span>
    <span v-if="isShowLabel" ref="checkboxLabelRef" :class="ns.e('label')">
      <slot>
        {{ label }}
      </slot>
    </span>
  </component>
</template>
<script setup>
import { formContextKey, formItemContextKey } from '../../form/src/formLib'
import { ref, watch, computed, inject, nextTick, useSlots } from 'vue'
import { buildCssNamespace } from '../../util'
import isBoolean from 'lodash/isBoolean'
import get from 'lodash/get'
import noop from 'lodash/noop'
import isArray from 'lodash/isArray'
import isUndefined from 'lodash/isUndefined'

const ns = buildCssNamespace('checkbox')

const props = defineProps({
  modelValue: {
    type: [Number, String, Boolean, Array],
    default: undefined
  },
  // 当modelValue类型为Array时, 该Checkbox选中状态的值
  value: {
    type: [Number, String],
    default: undefined
  },
  // 当modelValue类型不为Array时，该Checkbox未选中状态的值
  falseValue: {
    type: [Number, String],
    default: undefined
  },
  // 当modelValue类型不为Array时，该Checkbox选中状态的值
  trueValue: {
    type: [Number, String],
    default: undefined
  },
  // 显示的文字
  label: {
    type: String,
    default: undefined
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 设置该Checkbox为indeterminate 状态
  indeterminate: {
    type: Boolean,
    default: false
  },
  // 是否触发验证规则
  validateEvent: {
    type: Boolean,
    default: true
  }
})
const slots = useSlots()
const checkboxRef = ref(null)
const checkboxLabelRef = ref(null)

const emit = defineEmits(['update:modelValue', 'change'])
// formContext
const formContext = inject(formContextKey, undefined)
//formItemContext
const formItemContext = inject(formItemContextKey, undefined)

const isDisabled = computed(
  () => props.disabled || get(formContext, 'disabled', false)
)
const focus = ref(false)
const isShowLabel = computed(() => !isUndefined(props.label) || !!slots.default)

// checkbox应该是什么值
const checkboxValue = () => {
  const checkbox = get(checkboxRef, 'value', { checked: false })
  let value
  if (isArray(props.modelValue)) {
    // modelValue 是一个Array, 选择props.value
    value = props.value
  } else {
    // modelValue 不是一个Array
    value = checkbox.checked // 选中状态时
      ? isUndefined(props.trueValue) // trueValue 未定义返回 true
        ? true
        : props.trueValue
      : isUndefined(props.falseValue) // 非选中状态时, falseValue 未定义返回 false
        ? false
        : props.falseValue
  }
  return value
}

// 处理input [type=checkbox] 的变更事件
const handleChange = (event) => {
  const value = checkboxValue()
  const checked = get(event, 'target.checked')
  let model = value // 使model先等于计算的value
  if (isArray(props.modelValue)) {
    // modelValue 是一个Array
    model = props.modelValue
    if (checked) {
      // 选中状态，判断array中是否包含了value，不包含就push进去
      if (!props.modelValue.includes(value)) {
        model = [...props.modelValue, value]
      }
    } else if (props.modelValue.includes(value)) {
      // 取消选中状态，判断array中是否包含了value，包含就去除当前value
      model = props.modelValue.filter((item) => item !== value)
    }
  }
  if (model !== props.modelValue) {
    // model 有更新就触发 update:modelValue
    emit('update:modelValue', model)
  }
  nextTick(() => {
    emit('change', event)
  })
}
// checkbox 是否选中
const checkedState = computed(() => {
  if (isArray(props.modelValue)) {
    // modelValue 是一个Array, 判断array中包含了props.value就是选中状态
    return props.modelValue.includes(props.value)
  } else {
    // modelValue 不是一个Array
    return !isUndefined(props.modelValue) // props.modelValue 不是未定义
      ? isBoolean(props.modelValue) && isUndefined(props.trueValue) // props.modelValue 是布尔型 并且 trueValue是未定义时,直接返回 props.modelValue
        ? props.modelValue
        : props.modelValue === props.trueValue // props.modelValue 部是是布尔型或 trueValue不是未定义时, 判断props.modelValue和trueValue是否相等
      : false
  }
})
watch(
  () => props.modelValue,
  () => {
    if (props.validateEvent) {
      const validate = get(formItemContext, 'validate')
      validate && validate('change').catch(noop)
    }
    // setChecked()
  }
)

const dataName = computed(() => {
  //之前是td的，后面忘了是什么bug改的tr
  const targetEle = checkboxRef.value?.closest('tr,td,.ep-div-table')
  return targetEle
    ? (checkboxLabelRef.value &&
      `${targetEle.getAttribute('tmpcolumnlabel')}##${checkboxLabelRef.value.innerText}` || (checkboxRef.value?.closest("th") ? '全选' : '选择记录'))
    : checkboxLabelRef.value && checkboxLabelRef.value.innerText
})

const dataType = computed(() => {
  let cbxName = 'checkbox';
  if (checkboxRef.value?.closest('tr,.ep-div-table'))
    cbxName = 'table##' + cbxName
  else if (checkboxRef.value?.closest('.ep-dialog,.ep-popper'))
    cbxName = 'dialog##' + cbxName
  return cbxName;
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Checkbox')
}
</script>
