<template>
  <p>
    <ep-button @click="isDisabled = !isDisabled">Trigger Disabled</ep-button>
  </p>
  <ep-date-picker
    v-model="date"
    :disabled-date="disabledDate"
    placeholder="请选择日期"
    type="date"
    format="YYYY/MM/DD"
    :disabled="isDisabled"
    value-format="MM/DD/YYYY"
    @change="handleChange"
  ></ep-date-picker>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Button as EpButton } from '../../button'

const date = ref('2022-01-02')
const isDisabled = ref(false)

const handleChange = (val) => {
  console.log('changeValue: ', val)
}
const disabledDate = (date) => {
  return (
    date.getTime() < new Date(2020, 9, 1) ||
    date.getTime() > new Date(2030, 9, 1)
  )
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
  name: 'BasicDemo'
}
</script>
