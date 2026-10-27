<template>
  <div class="demo-progress">
    <ep-progress :percentage="50">
      <span style="color: red">Content</span>
    </ep-progress>
    <ep-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="50"
      status="error"
    >
      <span>Content</span>
    </ep-progress>
    <ep-progress type="circle" :percentage="100" status="success">
      <ep-icon icon="ep-isolid-cycle-smile" size="30" color="#00B42A"></ep-icon>
    </ep-progress>
    <ep-progress type="circle" :percentage="80">
      <template #default="{ percentage }">
        <span class="percentage-value">{{ percentage }}%</span>
        <span class="percentage-labep">Progressing</span>
      </template>
    </ep-progress>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-labep {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
.demo-progress .ep-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.demo-progress .ep-progress--circle {
  margin-right: 15px;
}
</style>
