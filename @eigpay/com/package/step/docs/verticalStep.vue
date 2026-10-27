<template>
  <div class="contain">
    <ep-step direction="vertical" :active="active">
      <ep-step-item title="Step 1" description="detailOne" />
      <ep-step-item title="Step 2" description="detailTwo" />
      <ep-step-item title="Step 3" description="detailThree" />
      <ep-step-item title="Step 4" description="detailFour" />
    </ep-step>
    <ep-step direction="vertical" :active="active" type="dot">
      <ep-step-item title="Step 1" description="detailOne" />
      <ep-step-item title="Step 2" description="detailTwo" />
      <ep-step-item title="Step 3" description="detailThree" />
      <ep-step-item title="Step 4" description="detailFour" />
    </ep-step>
    <ep-step direction="vertical" :active="active" type="square">
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
<style scoped>
.contain {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 20px;
  height: 300px;
}
</style>
