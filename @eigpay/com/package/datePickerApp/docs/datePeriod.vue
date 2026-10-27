<template>
  <ep-date-picker
    v-model="date"
    type="monthrange"
    range-separator="To"
    start-placeholder="Start date"
    end-placeholder="End date"
    value-format="YYYY-MM"
    format="YYYY/MM"
    :unlink-panels="false"
    @change="handleChange"
  ></ep-date-picker>
</template>
<script setup>
import { ref, watch } from 'vue'

const date = ref()

const handleChange = (val) => {
  console.log('changeValue: ', val)
}

watch(
  () => date.value,
  (val) => {
    console.log('modelValue: ', val)
  },
  { immediate: true }
)
</script>
<script>
export default {
  name: 'TimePeriod'
}
</script>
