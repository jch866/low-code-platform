<template>
  <div class="demo-progress">
    <ep-progress :percentage="percentage" :color="customColor" />
    <ep-progress :percentage="percentage" :color="computedColor" />
    <div>
      <ep-button @click="decrease">-</ep-button>
      <ep-button @click="increase">+</ep-button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const percentage = ref(20)
const customColor = '#409eff'
const computedColor = computed(() => {
  if (percentage.value < 30) {
    return '#909399'
  }
  if (percentage.value < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
})

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}
const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
</script>
<style scoped>
.demo-progress .ep-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>
