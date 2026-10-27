<template>
  <div>
    <ep-card class="box-card" shadow="never">
      <div class="flex_between">
        <div class="flex_row">
          <span class="avator"></span>
          <span>userName</span>
        </div>
        <ep-icon icon="ep-i-arrow-to-right" size="12"></ep-icon>
      </div>
    </ep-card>
  </div>
</template>
<script>
export default {
  name: 'SimpleCard'
}
</script>

<style scoped>
.box-card {
  width: 380px;
}

.avator {
  width: 28px;
  height: 28px;
  background: #f2f3f5;
  margin-right: 8px;
}

.flex_row {
  display: flex;
  align-items: center;
}

.flex_between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
