<template>
  <span :class="ns.e('sizes')">
    <ep-select
      v-model="innerPageSize"
      :disabled="disabled"
      @change="handelChange"
    >
      <ep-option
        v-for="item in innerPageSizes"
        :key="item"
        :label="t('pagination.pageSize', { size: item })"
        :value="item"
      />
    </ep-select>
  </span>
</template>

<script setup>
import { watch, ref, computed, provide } from 'vue'
import { buildCssNamespace } from '@package/util'
import isEqual from 'lodash/isEqual'
import { useLocale } from '../../../hooks/locale'
import { paginationTypeContextkey } from '../paginationLib'
const props = defineProps({
  disabled: Boolean,
  pageSize: {
    type: Number,
    required: true
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40, 50, 100]
  }
})

const ns = buildCssNamespace('pagination')
const emits = defineEmits(['page-size-change'])
const innerPageSize = ref(props.pageSize)
const { t } = useLocale()

watch(
  () => props.pageSizes,
  (newVal, oldVal) => {
    if (isEqual(newVal, oldVal)) {
      return
    }
    if (Array.isArray(newVal)) {
      const pageSize = newVal.includes(props.pageSize)
        ? props.pageSize
        : props.pageSizes[0]
      emits('page-size-change', pageSize)
    }
  }
)

watch(
  () => props.pageSize,
  (newVal) => {
    innerPageSize.value = newVal
  }
)

const innerPageSizes = computed(() => props.pageSizes)
function handelChange() {
  emits('page-size-change', innerPageSize.value)
}

provide(paginationTypeContextkey, { type: 'pagination' })
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('PaginationSizes')
}
</script>
