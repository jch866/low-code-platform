<template>
  <ep-input v-model="text" type="text" clearable />
</template>
<script setup>
import { ref } from 'vue'
const text = ref('abc')
</script>
<script>
export default {
  name: 'InputClearDemo'
}
</script>
