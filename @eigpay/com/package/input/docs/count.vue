<template>
  <ep-input v-model="text" type="text" show-word-limit :maxlength="30"/>
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
