<template>
  <div class="content-view">
    <ep-card class="box-card" shadow="always">Always</ep-card>
    <ep-card class="box-card" shadow="hover">Hover</ep-card>
    <ep-card class="box-card" shadow="never">Never</ep-card>
  </div>
</template>
<script>
export default {
  name: 'ShadowCard'
}
</script>

<style scoped>
.content-view {
  display: flex;
  align-items: center;
  justify-content: flex;
}
.box-card {
  width: 240px;
  margin-right: 12px;
}
</style>
