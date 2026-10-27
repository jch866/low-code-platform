<template>
  <div>
    <ep-radio-group v-model="model">
      <ep-radio value="Stream">Stream</ep-radio>
      <ep-radio value="River">River</ep-radio>
      <ep-radio value="Lake">Lake</ep-radio>
      <ep-radio value="Ocean" disabled>Ocean</ep-radio>
    </ep-radio-group>
  </div>
  <p>Selected:{{ model }}</p>
</template>
<script setup>
import { ref } from 'vue'
const model = ref('Ocean')
</script>
<script>
export default {
  name: 'RadioWithGroup'
}
</script>
