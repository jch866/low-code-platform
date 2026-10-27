<template>
  <div>
    <div class="top">{{ tip }}</div>
    <div class="bottom">{{ describe }}</div>
  </div>
</template>

<script setup>
defineProps({
  tip: {
    type: String,
    default: ''
  },
  describe: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.top {
  color: #000;
  font-size: 14px;
  font-weight: bold;
}

.bottom {
  color: #999;
  font-size: 13px;
  margin-top: 4px;
}
</style>
