<template>
  <p>
    <ep-button @click="isDisabled = !isDisabled">Trigger Disabled</ep-button>
  </p>
  <ep-date-picker
    v-model="date"
    type="yearrange"
    :disabled-date="outOfRange"
    :disabled="isDisabled"
    @change="handleChange"
  ></ep-date-picker>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Button as EpButton } from '../../button'

const date = ref()
const isDisabled = ref(false)

const handleChange = (val) => {
  console.log('changeValue: ', val)
}
const outOfRange = (date) => {
  const time = date.getTime()
  return (
    time < new Date(1990, 0, 1).getTime() ||
    time > new Date(2100, 0, 1).getTime()
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
  name: 'TimePeriod'
}
</script>
