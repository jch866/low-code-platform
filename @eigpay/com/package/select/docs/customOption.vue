<template>
  <ep-select v-model="value" placeholder="please choose">
    <ep-option
      v-for="item in cities"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span style="float: left">{{ item.label }}</span>
      <span style="float: right; color: lightgray; font-size: 13px">
        {{ item.value }}
      </span>
    </ep-option>
  </ep-select>
</template>
<script setup>
import { ref } from 'vue'

const value = ref()

const cities = [
  {
    value: 'Beijing',
    label: 'Beijing'
  },
  {
    value: 'Shanghai',
    label: 'Shanghai'
  },
  {
    value: 'Nanjing',
    label: 'Nanjing'
  },
  {
    value: 'Chengdu',
    label: 'Chengdu'
  },
  {
    value: 'Shenzhen',
    label: 'Shenzhen'
  },
  {
    value: 'Guangzhou',
    label: 'Guangzhou'
  }
]
</script>
<script>
export default {
  name: 'DisabledOption'
}
</script>
