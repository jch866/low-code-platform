<template>
  <div :class="formItemClass">
    <div
      v-if="hasLabel"
      ref="formLabelRef"
      :class="ns.e('label')"
      :style="labelStyle"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div :class="ns.e('content')">
      <slot />
      <transition :name="ns.b('error')">
        <slot
          v-if="showMessage && validateState === 'error'"
          name="error"
          :error="validateMessage"
        >
          <div :class="ns.e('content__error-msg')">
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>

<script setup>
import AsyncValidator from 'async-validator'
import {
  computed,
  inject,
  ref,
  watch,
  provide,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue'
import { buildCssNamespace } from '../../util'
import { formContextKey, formItemContextKey } from './formLib'
import { isProxyRule, default as customerRules } from './validation'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import getProp from 'lodash/get'
import setProp from 'lodash/set'
import omit from 'lodash/omit'
import castArray from 'lodash/castArray'
import cloneDeep from 'lodash/cloneDeep'
const ns = buildCssNamespace('form-item')

let initFiledValue
let isResettingField = false
const props = defineProps({
  prop: {
    type: String,
    default: undefined
  },
  label: {
    type: String,
    default: undefined
  },
  labelWidth: {
    type: [String, Number],
    default: undefined
  },
  hasLabel: {
    type: Boolean,
    default: true
  },
  required: {
    type: Boolean,
    default: undefined
  },
  rules: {
    type: [Object, Array],
    default: undefined
  },
  error: {
    type: String,
    default: undefined
  },
  showMessage: {
    type: Boolean,
    default: true
  }
})
const formContext = inject(formContextKey, undefined)

const validateState = ref('') // '', 'validating', 'success', 'error'
const validateMessage = ref('')
const formLabelRef = ref(null)

const setValidationState = (state) => {
  window.ValidityStatus = state != 'error'
  validateState.value = state
}

const combinedRules = computed(() => {
  const required = props.required
  const propRules = [...castArray(getProp(props, 'rules', []))]
  const rulesBelongFormContext = [
    ...castArray(getProp(formContext, `rules.${props.prop}`, []))
  ]
  const allRules = [...rulesBelongFormContext, ...propRules].reduce(
    (prev, current) => {
      if (isProxyRule(current)) {
        const rules = castArray(current())
        prev.push(...rules)
      } else {
        prev.push(current)
      }
      return prev
    },
    []
  )
  if (required !== undefined) {
    // 要处理当前定义的required 和 rules中配置的required不一致的问题。
    const requiredRules = allRules
      .map((rule, i) => [rule, i])
      .filter(([rule]) => Object.keys(rule).includes('required'))

    if (isEmpty(requiredRules)) {
      allRules.unshift(customerRules.required.trigger('')())
    } else {
      requiredRules.forEach(([rule]) => {
        rule.required = required
      })
    }
  }

  return allRules
})

//根据触发类型过滤需要的验证规则，如果没有给触发类型，将会返回所有的验证规则
const filterRulesByTrigger = (trigger) => {
  return combinedRules.value
    .filter(
      (rule) =>
        !trigger ||
        (isArray(rule.trigger)
          ? rule.trigger.includes(trigger)
          : rule.trigger === trigger)
    )
    .map((rule) => omit(rule, 'trigger'))
}
// 当前FormItem是不是必填
const isRequired = computed(() => {
  return combinedRules.value.some((rule) => rule.required)
})

// 当前FormItem应用的样式
const formItemClass = computed(() => [
  ns.b(),
  ns.is('success', validateState.value === 'success'),
  ns.is('error', validateState.value === 'error'),
  ns.is('validating', validateState.value === 'validating'),
  ns.is('required', isRequired.value && !formContext.hideRequiredAsterisk)
])

// 计算label的宽度
const labelStyle = computed(() => {
  if (formContext && formContext.labelPosition === 'top') {
    return {}
  }

  const labelWidth = props.labelWidth || getProp(formContext, 'labelWidth', '')
  if (labelWidth)
    return { width: isString(labelWidth) ? labelWidth : `${labelWidth}px` }
  return {}
})

// 该formItem的域值
const filedValue = computed(() => {
  const model = formContext && formContext.model
  if (!model || !props.prop) {
    return
  }
  return getProp(model, props.prop)
})
// 验证成功回调
const onValidationSucceeded = () => {
  setValidationState('success')
  formContext & formContext.emit('validate', props.prop, true)
}
//验证失败回调
const onValidationFailed = (err) => {
  const { errors, fields } = err
  if (!errors || !fields) {
    // console.error(error)
  }
  setValidationState('error')
  validateMessage.value = getProp(errors, '[0].message', '')
  formContext & formContext.emit('validate', props.prop, false, err)
}
//执行验证
const doValidate = async (rules) => {
  const modelName = props.prop
  const schema = new AsyncValidator({
    [modelName]: rules
  })
  try {
    await schema.validate(
      { [modelName]: filedValue.value },
      { firstFields: true }
    )
    onValidationSucceeded()
    return true
  } catch (err) {
    onValidationFailed(err)
    return Promise.reject(err)
  }
}
//验证
const validate = async (trigger, callback) => {
  // 正在重置或是没有绑定prop不做验证
  if (isResettingField || !props.prop) {
    return false
  }
  // 该item没有设定规则
  if (combinedRules.value.length === 0) {
    callback && callback(false)
    return false
  }
  const rules = filterRulesByTrigger(trigger)
  if (rules.length === 0) {
    callback && callback(true)
    return true
  }
  // 设定验证状态
  setValidationState('validating')
  try {
    await doValidate(rules)
    callback && callback(true)
    return true
  } catch (err) {
    const { fields } = err
    callback && callback(false, fields)
    return isFunction(callback) ? false : Promise.reject(fields)
  }
}

//清除验证状态和信息
const clearValidate = () => {
  setValidationState('')
  validateMessage.value = ''
}

//重置当前field
const resetField = async () => {
  const model = formContext.model
  if (!model || !props.prop) {
    return false
  }
  isResettingField = true
  setProp(model, props.prop, cloneDeep(initFiledValue))
  // model[props.prop] = initFiledValue
  await nextTick()
  clearValidate()
  isResettingField = false
}

const formItemLabelComputed = computed(() =>
  formLabelRef.value ? formLabelRef.value.innerText : ''
)

const context = reactive({
  ...toRefs(props),
  validateState,
  resetField,
  clearValidate,
  validate,
  formItemLabel: formItemLabelComputed
})

watch(
  () => props.error,
  (val) => {
    validateMessage.value = val || ''
    setValidationState(val ? 'error' : '')
  },
  { immediate: true }
)

onMounted(() => {
  if (props.prop) {
    formContext && formContext.addField(context)
    initFiledValue = cloneDeep(filedValue.value)
  }
})
onUnmounted(() => {
  if (props.prop) {
    formContext && formContext.removeField(context)
  }
})

provide(formItemContextKey, context)

defineExpose({
  /** @description validation message */
  validateMessage,
  /** @description validation state */
  validateState,
  /** @description validate form item */
  validate,
  /** @description clear validation status */
  clearValidate,
  /** @description reset field value */
  resetField
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('FormItem')
}
</script>
