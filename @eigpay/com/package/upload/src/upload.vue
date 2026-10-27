<template>
  <div :class="ns.b()">
    <upload-basic :dataName="dataName">
      <slot v-if="slots.trigger" name="trigger" />
      <slot v-if="!slots.trigger && slots.default" />
    </upload-basic>
    <slot name="tip" />
    <upload-list v-if="showFileList" @remove="handleRemove"></upload-list>
  </div>
</template>
<script setup>
import { reactive, toRefs, computed, provide, useSlots, inject } from 'vue'
import { uploadContextKey } from './upload.js'
import { ajaxUpload } from './ajax'
import uploadBasic from './uploadBasic.vue'
import uploadList from './uploadList.vue'
import { useHandlers } from './upload'
import { buildCssNamespace } from '../../util'
import { formItemContextKey } from '../../form/src/formLib'

const props = defineProps({
  action: {
    type: String,
    default: '#'
  },
  headers: {
    type: Object,
    default: () => { }
  },
  method: {
    type: String,
    default: 'post'
  },
  data: {
    type: Object,
    default: () => { }
  },
  withCredentials: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'file'
  },
  showFileList: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'select'
  },
  fileList: {
    type: Array,
    default: () => []
  },
  autoUpload: {
    type: Boolean,
    default: true
  },
  listType: {
    type: String,
    default: 'text'
  },
  httpRequest: {
    type: Function,
    default: ajaxUpload
  },
  disabled: Boolean,
  limit: {
    type: Number,
    default: undefined
  },
  beforeUpload: {
    type: Function,
    default: NOOP
  },
  beforeRemove: {
    type: Function,
    default: NOOP
  },
  onSuccess: {
    type: Function,
    default: NOOP
  },
  onRemove: {
    type: Function,
    default: NOOP
  },
  onStart: {
    type: Function,
    default: NOOP
  },
  onProgress: {
    type: Function,
    default: NOOP
  },
  onError: {
    type: Function,
    default: NOOP
  },
  onExceed: {
    type: Function,
    default: NOOP
  },
  onChange: {
    type: Function,
    default: NOOP
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  progressType: {
    type: String,
    default: 'circle'
  }
})

const ns = buildCssNamespace('upload')

const slots = useSlots()

const {
  uploadFiles,
  handleStart,
  handleError,
  handleRemove,
  handleSuccess,
  handleProgress
} = useHandlers(props)

const uploadContentProps = computed(() => ({
  ...props,
  fileList: uploadFiles,
  onStart: handleStart,
  onProgress: handleProgress,
  onSuccess: handleSuccess,
  onError: handleError,
  onRemove: handleRemove
}))

provide(
  uploadContextKey,
  reactive({
    ...toRefs(uploadContentProps.value)
  })
)

const formItemContext = inject(formItemContextKey, undefined)
const dataName = computed(
  () => formItemContext && formItemContext.formItemLabel
)
</script>
<script>
import { componetName } from '@package/constant'

const NOOP = () => { }

export default {
  name: componetName('Upload')
}
</script>
