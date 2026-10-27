<template>
  <div
    :class="[
      ns.b(),
      ns.is('disabled', itemDisabled),
      ns.is('focus', focused),
      $attrs.class
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <div :class="[ns.e('wrapper')]">
        <span v-if="$slots.prefix" :class="ns.e('prefix')">
          <span :class="ns.e('prefix-inner')">
            <slot name="prefix" />
          </span>
        </span>
        <input
          :preventDefault="preventDefault"
          ref="inputRef"
          :data-name="dataName"
          :data-type="dataType"
          :class="[ns.e('inner')]"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :placeholder="placeholder"
          :disabled="itemDisabled"
          :readonly="readonly"
          :maxlength="computedMaxLength"
          v-bind="attrs"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
          @keyup="handleKeyup"
          @keypress="$emit('keypress', $event)"
        />

        <span v-if="isSuffixVisible" :class="ns.e('suffix')">
          <span :class="ns.e('suffix-inner')">
            <template
              v-if="!(showClear || isShowPasswordVisible || isWordLimitVisible)"
            >
              <slot name="suffix" />
            </template>
            <ep-icon
              v-if="showClear"
              icon="ep-i-delete"
              size="16"
              @mousedown.prevent="noop"
              @click="clear"
            ></ep-icon>
            <ep-icon
              v-if="isShowPasswordVisible"
              :icon="passwordVisible ? 'ep-i-view' : 'ep-i-hide'"
              size="16"
              @click="handlePasswordVisible"
            ></ep-icon>
            <span v-if="isWordLimitVisible" :class="ns.e('count')">
              <span :class="ns.e('count-inner')">
                {{ textLength }} / {{ maxlength }}
              </span>
            </span>
          </span>
        </span>
      </div>
    </template>
    <!-- textarea -->
    <template v-else>
      <div :class="[ns.e('wrapper')]">
        <textarea
          :preventDefault="preventDefault"
          ref="textareaRef"
          :data-name="dataName"
          :data-type="dataType"
          :class="[ns.e('inner')]"
          :placeholder="placeholder"
          :disabled="itemDisabled"
          :readonly="readonly"
          :maxlength="maxlength"
          v-bind="attrs"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
          @keyup="handleKeyup"
          @keypress="$emit('keypress', $event)"
        ></textarea>

        <span v-if="showClear" :class="ns.e('suffix')">
          <span :class="ns.e('suffix-inner')" @click="clear">
            <ep-icon icon="ep-i-delete" size="16"></ep-icon>
          </span>
        </span>
      </div>
      <span v-if="isWordLimitVisible" :class="ns.e('count')">
        <span :class="ns.e('count-inner')">
          {{ textLength }} / {{ maxlength }}
        </span>
      </span>
    </template>
  </div>
</template>
<script setup>
import { formContextKey, formItemContextKey } from '../../form/src/formLib'
import {
  ref,
  watch,
  computed,
  onMounted,
  inject,
  useSlots,
  nextTick,
  useAttrs
} from 'vue'
import isNil from 'lodash/isNil'
import get from 'lodash/get'
import noop from 'lodash/noop'
import omit from 'lodash/omit'
import { buildCssNamespace } from '../../util'
import { useCursor } from './useCursor'
import { selectContextKey } from '../../select/src/selectLib.js'
import { datePickerContextKey } from '../../datePicker/src/useDatepiker.js'
import { paginationTypeContextkey } from '../../pagination/src/paginationLib'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator(value) {
      return ['text', 'textarea', 'password', 'number'].includes(value)
    }
  },
  placeholder: {
    type: String,
    default: undefined
  },
  preventDefault: {
    type: String,
    default: undefined
  },
  modelValue: {
    type: [String, Number],
    default: undefined
  },
  clearable: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: undefined
  },
  showPassword: {
    type: Boolean,
    default: undefined
  },
  showWordLimit: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  format: {
    type: String,
    default: undefined,
    validator(value) {
      return ['thousands'].includes(value)
    }
  }
})

const emit = defineEmits([
  'update:modelValue',
  'input',
  'blur',
  'change',
  'keyup',
  'keydown',
  'keypress',
  'compositionstart',
  'compositionupdate',
  'compositionend',
  'focus',
  'mouseenter',
  'mouseleave'
])
const ns = buildCssNamespace(props.type === 'textarea' ? 'textarea' : 'input')
const slots = useSlots()
// input框的引用
const inputRef = ref(null)
// textarea框的引用
const textareaRef = ref(null)
//密码是否可见
const passwordVisible = ref(false)
//是否正在进行输入法输入
const isComposing = ref(false)

// 是否获得了焦点
const focused = ref(false)
// 是否获鼠标是否进入
const hovering = ref(false)

const restoreValue = (priceText) => {
  return priceText.toString().replace(/,/g, '')
}

const formatPrice = (priceText) => {
  const parts = restoreValue(priceText).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const isAsThousandsInput = props.type === 'text' && props.format === 'thousands'

// 实际最大长度，当format为`thousands`类型时，要抛去逗号的长度
const computedMaxLength = computed(() => {
  if (isAsThousandsInput) {
    const valueLength = nativeInputVal.value.length
    const formatValueLength = formatPrice(nativeInputVal.value).length
    return props.maxlength + (formatValueLength - valueLength)
  } else {
    return props.maxlength
  }
})

// 当前输入框的Dom引用
const _nativeRef = computed(() =>
  props.type === 'textarea' ? textareaRef.value : inputRef.value
)
//根据props中v-model计算出输入框中的值
const nativeInputVal = computed(() => {
  if (isNil(props.modelValue)) {
    return ''
  } else if (isAsThousandsInput) {
    const correctValue = restoreValue(props.modelValue)
    emit('update:modelValue', correctValue)
    return correctValue
  } else {
    return String(props.modelValue)
  }
})

// 根据计算值，设置到dom元素的value
const setValToNativeEle = () => {
  const val = _nativeRef.value
  if (!val || (!isAsThousandsInput && val.value === nativeInputVal.value)) {
    return
  }
  val.value = isAsThousandsInput
    ? formatPrice(nativeInputVal.value)
    : nativeInputVal.value
}
//formContext
const formContext = inject(formContextKey, undefined)
//formItemContext
const formItemContext = inject(formItemContextKey, undefined)
// selectContext
const selectContext = inject(selectContextKey, undefined)
// datePickerContext
const datePickerContext = inject(datePickerContextKey, undefined)
// paginationTypeContext
const paginationTypeContext = inject(paginationTypeContextkey, undefined)

// 当前元素是否禁用
const itemDisabled = computed(
  () => props.disabled || !!get(formContext, 'disabled')
)
// 是否显示Clear图标
const showClear = computed(
  () =>
    props.clearable &&
    !itemDisabled.value &&
    !props.readonly &&
    !!nativeInputVal.value &&
    (focused.value || hovering.value)
)
// 要不要显示已输入字符
const isWordLimitVisible = computed(
  () =>
    props.showWordLimit &&
    !!props.maxlength &&
    ['text', 'textarea'].includes(props.type) &&
    !itemDisabled.value &&
    !props.readonly &&
    !props.showPassword
)
const isShowPasswordVisible = computed(
  () =>
    props.showPassword &&
    props.type === 'password' &&
    !itemDisabled.value &&
    !props.readonly &&
    !!nativeInputVal.value
)
// 输入框后面的内容要不要显示
const isSuffixVisible = computed(
  () =>
    !!slots.suffix ||
    showClear.value ||
    isShowPasswordVisible.value ||
    isWordLimitVisible.value
)

// 当前输入框内容的字符长度
const textLength = computed(() => nativeInputVal.value.length)

const $attrs = useAttrs()

const attrs = computed(() => {
  return omit($attrs, 'class')
})

// 清除按钮的点击事件
const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('input', '')
}

// 显示密码按钮点击事件
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}

const handleCompositionStart = (event) => {
  emit('compositionstart', event)
  isComposing.value = true
}

const handleCompositionUpdate = (event) => {
  emit('compositionupdate', event)
  const text = event.target.value
  const lastCharacter = text[text.length - 1] || ''
  isComposing.value = !/([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi.test(
    lastCharacter
  )
}

const handleCompositionEnd = (event) => {
  emit('compositionend', event)
  if (isComposing.value) {
    isComposing.value = false
    handleInput(event)
  }
}
const [recordCursor, setCursor] = useCursor(inputRef)

// 输入事件处理
const handleInput = async (event) => {
  if (isComposing.value) {
    return
  }
  recordCursor()
  const value = get(event, 'target.value')
  const correctValue = isAsThousandsInput ? restoreValue(value) : value
  emit('update:modelValue', correctValue)
  emit('input', correctValue)
  await nextTick()
  setValToNativeEle()
  setCursor()
}
// 获得焦点事件处理
const handleFocus = (event) => {
  focused.value = true
  emit('focus', get(event, 'target.value'))
}

//失焦事件处理
const handleBlur = (event) => {
  emit('blur', get(event, 'target.value'))
  if (props.validateEvent) {
    const validate = get(formItemContext, 'validate')
    validate?.('blur').catch(noop)
  }
  focused.value = false
}
//
const handleChange = (evt) => {
  emit('change', get(evt, 'target.value'))
}

const handleMouseEnter = (evt) => {
  hovering.value = true
  emit('mouseenter', evt)
}
const handleMouseLeave = (evt) => {
  hovering.value = false
  emit('mouseleave', evt)
}

const handleKeyup = (evt) => {
  if (
    evt.code == 'Enter' &&
    evt.currentTarget.getAttribute('preventDefault') != 'false'
  )
    evt.preventDefault()
  emit('keyup', evt)
}

const handleKeydown = (evt) => {
  if (
    evt.code == 'Enter' &&
    evt.currentTarget.getAttribute('preventDefault') != 'false'
  )
    evt.preventDefault()
  emit('keydown', evt)
}

watch(
  () => props.modelValue,
  () => {
    // nextTick(() => resizeTextarea())
    if (props.validateEvent) {
      const validate = get(formItemContext, 'validate')
      validate && validate('change').catch(noop)
      // get(formItemContext, 'validate', noop)('change').catch(noop)
    }
  }
)

// 监听计算输入框值的变化，设置到实际的dom中
watch(nativeInputVal, setValToNativeEle)

const refInput = computed(() => inputRef.value || textareaRef.value)
const focus = async () => {
  await nextTick()
  refInput.value?.focus()
}

const dataName = computed(() => {
  const targetEle = refInput.value?.closest('td')
  if (targetEle) {
    return targetEle.getAttribute('tmpcolumnlabel')
  } else if (formItemContext) {
    return formItemContext.formItemLabel
  } else {
    return undefined
  }
})

const dataType = computed(() => {
  //前缀
  let prefix = '',
    elName = 'input'
  //在dialog中优先
  if (refInput.value?.closest('.ep-dialog')) {
    prefix = 'dialog##'
  }
  //在表格中
  if (refInput.value?.closest('td')) {
    if (!prefix) prefix = 'table##'
    if (selectContext) {
      return prefix + selectContext.dataType
    } else if (datePickerContext) {
      return prefix + datePickerContext.dataType
    }
    return prefix + elName
  } else if (paginationTypeContext) {
    //分页中,可能后面要特殊处理
    if (!prefix) prefix = 'pagination##'
    if (selectContext) {
      return prefix + selectContext.dataType
    }
    return prefix + elName
  } else {
    if (selectContext) {
      return prefix + selectContext.dataType
    } else if (datePickerContext) {
      return prefix + datePickerContext.dataType
    }
    return prefix + elName
  }
})

onMounted(() => {
  setValToNativeEle()
})

defineExpose({
  focus
})
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Input')
}
</script>
