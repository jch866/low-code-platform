<template>
  <ep-input v-model="text" type="password" show-password />
</template>
<script setup>
import { ref } from 'vue'
const text = ref('abc')

</script>
<script>
export default {
  name: 'InputPassordDemo'
}
</script>
