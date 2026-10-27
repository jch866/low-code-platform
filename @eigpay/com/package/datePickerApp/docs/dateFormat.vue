<template>
  <ep-date-picker
    v-model="date"
    placeholder="请选择日期"
    format="YYYY/MM/DD"
    value-format="M/D/YYYY"
    @change="handleChange"
  ></ep-date-picker>
</template>
<script setup>
import { ref } from 'vue'

const date = ref('2022-02-10')

const handleChange = (val) => {
  console.log('val: ', val)
}
</script>
<script>
export default {
  name: 'DateFormat'
}
</script>
