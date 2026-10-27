<template>
  <p>
    <ep-button @click="isDisabled = !isDisabled">Trigger Disabled</ep-button>
  </p>
  <ep-date-picker
    v-model="date"
    :disabled-date="disabledDate"
    placeholder="请选择日期"
    type="datetime"
    format="YYYY/MM/DD HH:mm:ss"
    :disabled="isDisabled"
    value-format="YYYY/MM/DD HH:mm:ss"
    date-format="YYYY-MM-DD"
    time-format="HH:mm:ss"
    @change="handleChange"
  ></ep-date-picker>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Button as EpButton } from '../../button'

const date = ref('')
const isDisabled = ref(false)

const handleChange = (val) => {
  console.log('changeValue: ', val)
}
const disabledDate = (date) => {
  return (
    date.getTime() < new Date(2020, 9, 1, 0, 0, 0) ||
    date.getTime() > new Date(2030, 9, 1, 0, 0, 0)
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
