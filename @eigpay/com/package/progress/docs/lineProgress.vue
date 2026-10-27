<template>
  <div class="demo-progress">
    <ep-progress :percentage="50" />
    <ep-progress :percentage="100" :format="format" />
    <ep-progress :percentage="100" status="warning" />
    <ep-progress :percentage="100" status="success" />
    <ep-progress :percentage="100" status="error" />
    <ep-progress :percentage="50" status="paused" />
  </div>
</template>
<script setup>
const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`)
</script>
<style scoped>
.demo-progress .ep-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>
