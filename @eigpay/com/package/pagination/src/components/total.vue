<template>
  <span :class="ns.e('total')" :disabled="disabled">
    {{ totalLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { buildCssNamespace } from '@package/util'
import { useLocale } from '../../../hooks/locale'
const props = defineProps({
  disabled: Boolean,
  total: {
    type: Number,
    required: true
  },
  totalDescribe: {
    type: String,
    default: undefined
  }
})
const ns = buildCssNamespace('pagination')
const { t } = useLocale()
const totalLabel = computed(() => {
  return (
    props.totalDescribe || t('pagination.totalRecord', { total: props.total })
  )
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('PaginationTotal')
}
</script>
