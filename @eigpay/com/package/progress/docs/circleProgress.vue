<template>
  <div class="demo-progress">
    <ep-progress type="circle" :percentage="0" />
    <ep-progress type="circle" :percentage="25" />
    <ep-progress type="circle" :percentage="100" status="success" />
    <ep-progress type="circle" :percentage="70" status="error" />
    <ep-progress type="circle" :percentage="50" status="paused" />
  </div>
</template>
<style scoped>
.demo-progress .ep-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.demo-progress .ep-progress--circle {
  margin-right: 15px;
}
</style>
