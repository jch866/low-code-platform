<template>
  <ep-time-picker
    v-model="time"
    :clearable="true"
    :disabled="false"
    placeholder="请选择时间"
    format="HH:mm:ss"
    value-format="HH:mm:ss"
    @change="handleChange"
  ></ep-time-picker>
</template>
<script setup>
import { ref, watch } from 'vue'

const time = ref('23:04:05')

const handleChange = (val) => {
  console.log('changeValue: ', val)
}

watch(
  () => time.value,
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
