<template>
  <span :class="ns.e('jump')" :disabled="disabled">
    {{ t('pagination.skip') }}
    <ep-input
      type="number"
      :class="ns.e('editor')"
      :disabled="disabled"
      :model-value="innerValue"
      @update:model-value="handleInput"
      @change="handleChange"
    ></ep-input>
  </span>
</template>

<script setup>
import { computed, ref, provide } from 'vue'
import { useLocale } from '../../../hooks/locale'
import { buildCssNamespace } from '@package/util'
import { paginationTypeContextkey } from '../paginationLib'

const props = defineProps({
  disabled: Boolean,
  pageCount: {
    type: Number,
    default: 20,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1,
    required: true
  }
})
const emit = defineEmits(['inputChanged'])
const ns = buildCssNamespace('pagination')

const userInput = ref()
const innerValue = computed(() => userInput.value ?? props.currentPage)

const { t } = useLocale()

function handleInput(val) {
  userInput.value = val
}

function handleChange(val) {
  val = Math.trunc(val)
  emit('inputChanged', val)
  userInput.value = undefined
}

provide(paginationTypeContextkey, { type: 'pagination' })
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('PaginationJumper')
}
</script>
