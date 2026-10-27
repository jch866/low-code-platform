<template>
  <button
    data-type="pagination"
    data-name="<"
    type="button"
    :class="ns.e('btn-prev')"
    :disabled="internalDisabled"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <ep-icon icon="ep-i-a-to-left"></ep-icon>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { buildCssNamespace } from '@package/util'
const props = defineProps({
  disabled: Boolean,
  currentPage: {
    type: Number,
    default: 1
  }
})
defineEmits(['click'])
const ns = buildCssNamespace('pagination')

const internalDisabled = computed(
  () => props.disabled || props.currentPage <= 1
)
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('PaginationPrev')
}
</script>
