<template>
  <p>
    <ep-input v-model="text" type="textarea" clearable></ep-input>
  </p>
  <p>
    <ep-input
      v-model="textMax"
      type="textarea"
      clearable
      maxlength="500"
      show-word-limit
    ></ep-input>
  </p>
  <p>
    <ep-input
      v-model="textPlace"
      type="textarea"
      rows="3"
      placeholder="Please input paragraphs"
    ></ep-input>
  </p>
  <p>
    <ep-input
      v-model="textPlace"
      type="textarea"
      rows="3"
      placeholder="Please input paragraphs"
      disabled
    ></ep-input>
  </p>
</template>
<script setup>
import { ref } from 'vue'
const text = ref('Something in textarea')
const textMax = ref('Something in textarea')
const textPlace = ref('')
</script>
<script>
export default {
  name: 'TextareaDemo'
}
</script>
