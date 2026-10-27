<template>
  <form :class="formClass" data-type="form">
    <slot />
  </form>
</template>
<script setup>
import { computed, provide, reactive, toRefs } from 'vue'
import { formContextKey, filterFieldsWithProps } from './formLib'
import isFunction from 'lodash/isFunction'
import { buildCssNamespace } from '../../util'
const props = defineProps({
  model: {
    type: Object,
    default() {
      return
    }
  },
  rules: {
    type: Object,
    default: undefined
  },
  labelWidth: {
    type: [String, Number],
    default: undefined
  },
  labelPosition: {
    type: String,
    default: 'right'
  },
  hideRequiredAsterisk: {
    type: Boolean,
    default: false
  },
  labelColon: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['validate'])

const ns = buildCssNamespace('form')

const formClass = computed(() => [
  ns.b(),
  ns.m(
    `label-${props.labelPosition}`,
    !!props.labelPosition && props.labelPosition !== 'right'
  )
])

// props model 是否传入了对象
const modelUseable = computed(() => {
  return !!props.model
})

// 所有子formItem的集合
const fields = []

// 子formItem添加
const addField = (field) => {
  fields.push(field)
}
// 移除子formItem
const removeField = (field) => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1)
  }
}
// 表单验证
const validate = (callback) => validateField(null, callback)

// 根据指定表单域验证
const doValidateField = async (props) => {
  // 如果没有props.model, 返回false
  if (!modelUseable.value) {
    return false
  }
  //根据指定的prop获取子FormItem实例
  const filteredFields = filterFieldsWithProps(props, fields)
  // 找不到要验证的子FormItem实例，返回true
  if (filteredFields.length === 0) return true
  let validationErrors = {}
  // 遍历每一个子FormItem实例,调用它们的validate方法验证。
  for (let field of filteredFields) {
    try {
      await field.validate('')
    } catch (err) {
      validationErrors = {
        ...validationErrors,
        ...err
      }
    }
  }
  if (Object.keys(validationErrors).length === 0) return true
  return Promise.reject(validationErrors)
}
// 验证表单域
const validateField = async (props, callback) => {
  // 有没有传入回调函数
  const shouldThrow = !isFunction(callback)
  try {
    const result = await doValidateField(props)
    if (!shouldThrow) {
      //有回调就是通知回调
      callback(result)
    }
    return { isValid: result }
  } catch (err) {
    if (err instanceof Error) throw err
    if (!shouldThrow) {
      callback(false, err)
    }
    return { isValid: false, err }
  }
}
// 重置表单域
const resetFields = (props) => {
  const filteredFields = filterFieldsWithProps(props, fields)
  filteredFields.forEach((field) => {
    field.resetField()
  })
}

// 清除表单域验证状态
const clearValidate = (props) => {
  const filteredFields = filterFieldsWithProps(props, fields)
  filteredFields.forEach((field) => {
    field.clearValidate()
  })
}

provide(
  formContextKey,
  reactive({
    ...toRefs(props),
    emit,

    resetFields,
    clearValidate,
    validateField,
    addField,
    removeField
  })
)

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Form')
}
</script>
