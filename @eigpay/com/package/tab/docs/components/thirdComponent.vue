<template>
  <div>
    <ep-radio v-model="model" value="Apple" label="Apple" />
    <ep-radio v-model="model" value="Banana" label="Banana" />
    <ep-radio v-model="model" value="Banana" disabled>Banana Banana</ep-radio>
  </div>
  <p>Selected:{{ model }}</p>
</template>
<script setup>
import { ref } from 'vue'
const model = ref('Apple')
</script>
<script>
export default {
  name: 'RadioWithoutGroup'
}
</script>
