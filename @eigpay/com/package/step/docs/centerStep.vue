<template>
  <div style="margin-top: 20px">
    <ep-step align-center :active="active">
      <ep-step-item title="Step 1" description="detailOne" />
      <ep-step-item title="Step 2" description="detailTwo" />
      <ep-step-item title="Step 3" description="detailThree" />
      <ep-step-item title="Step 4" description="detailFour" />
    </ep-step>
  </div>
  <div style="margin-top: 50px">
    <ep-step align-center :active="active" type="dot">
      <ep-step-item title="Step 1" description="detailOne" />
      <ep-step-item title="Step 2" description="detailTwo" />
      <ep-step-item title="Step 3" description="detailThree" />
      <ep-step-item title="Step 4" description="detailFour" />
    </ep-step>
  </div>
  <div style="margin-top: 50px">
    <ep-step align-center :active="active" type="square">
      <ep-step-item title="Step 1" description="detailOne" />
      <ep-step-item title="Step 2" description="detailTwo" />
      <ep-step-item title="Step 3" description="detailThree" />
      <ep-step-item title="Step 4" description="detailFour" />
    </ep-step>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const active = ref(2)
</script>
<style scoped></style>
