<template>
  <div style="margin-top: 20px">
    <ep-step :active="active">
      <ep-step-item title="Step 1">
        <template #icon>√</template>
        <template #titel>Step 1</template>
        <template #description>descriptionOne</template>
      </ep-step-item>
      <ep-step-item title="Step 2" icon="ep-i-home" />
      <ep-step-item title="Step 3" />
      <ep-step-item title="Step 4" />
    </ep-step>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const active = ref(2)
</script>
<style scoped></style>
