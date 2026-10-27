<template>
  <ep-tab v-model="activeName" type="border-card" @tab-click="handleClick">
    <ep-tab-pane
      v-for="item in panels"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
      {{ item.content }}
    </ep-tab-pane>
  </ep-tab>
</template>
<script setup>
import { ref } from 'vue'

const activeName = ref('0')
const panels = Array.from({ length: 16 }).map((_, index) => ({
  label: `Hear_${index}`,
  name: `${index}`,
  content: `Content form ${index}`
}))

const handleClick = (tab, event) => {
  console.log(tab, event)
}
</script>
<script>
export default {
  name: 'CardType'
}
</script>
>
