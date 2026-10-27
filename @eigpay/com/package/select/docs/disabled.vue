<template>
  <ep-select
    v-model="status"
    placeholder="please choose"
    :disabled="true"
    @change="handleChange"
    @visible-change="handleVisibleChange"
  >
    <ep-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </ep-select>
</template>
<script setup>
import { ref } from 'vue'

const status = ref()

const options = ref([
  {
    value: 0,
    label: 'unfinished'
  },
  {
    value: 1,
    label: 'underway'
  },
  {
    value: 2,
    label: 'finished'
  }
])

const handleChange = () => {}

const handleVisibleChange = () => {}
</script>
<script>
export default {
  name: 'DisabledOption'
}
</script>
