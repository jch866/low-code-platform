<template>
  <ep-button plain @click="isShowTwo = !isShowTwo">
    showStep2: {{ isShowTwo }}
  </ep-button>
  <ep-button plain @click="isShowThree = !isShowThree">
    showStep3: {{ isShowThree }}
  </ep-button>
  <div style="margin-top: 20px">
    <ep-step :active="active">
      <ep-step-item title="Step 1" description="detailOne" />
      <ep-step-item v-if="isShowTwo" title="Step 2" description="detailTwo" />
      <ep-step-item
        v-if="isShowThree"
        title="Step 3"
        description="detailThree"
      />
      <ep-step-item title="Step 4" description="detailFour" />
      <ep-step-item title="Step 5" description="detailFive" />
    </ep-step>
  </div>
  <div style="margin-top: 20px">
    <ep-step
      :active="active"
      background="#0163CA"
      process-background="linear-gradient(90deg, #0163CA 0%, #C9CDD4 100%)"
    >
      <ep-step-item title="Step 1" description="detailOne" />
      <ep-step-item v-if="isShowTwo" title="Step 2" description="detailTwo" />
      <ep-step-item
        v-if="isShowThree"
        title="Step 3"
        description="detailThree"
      />
      <ep-step-item title="Step 4" description="detailFour" />
      <ep-step-item title="Step 5" description="detailFive" />
    </ep-step>
    <ep-button style="margin-top: 20px" @click="nextStep">下一步</ep-button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const active = ref(2)
const isShowTwo = ref(true)
const isShowThree = ref(false)
const nextStep = () => {
  if (active.value++ > 4) active.value = 0
}
</script>
<style scoped></style>
