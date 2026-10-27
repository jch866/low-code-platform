<template>
  <ep-date-picker
    v-model="date"
    type="daterange"
    range-separator="To"
    :unlink-panels="true"
    :teleported="false"
    @change="handleChange"
  ></ep-date-picker>
</template>
<script setup>
import { ref } from 'vue'

const date = ref(['', '2024-01-18'])

const handleChange = (value) => {
  console.log('unlinkPanels', value)
}
</script>
<script>
export default {
  name: 'UnlinkPanels'
}
</script>
