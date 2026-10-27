<template>
  <div style="margin-top: 20px">
    <ep-step
      :active="active"
      :title-line-straight="isSingleLine"
      background="linear-gradient(to right, yellow, red)"
      min-width="100px"
    >
      <ep-step-item
        title="商户进件信息填写商户进件信息填写"
        description="detailOne"
      />
      <ep-step-item title="复核流程" description="detailTwo" />
      <ep-step-item title="审核流程" description="detailThree" />
      <ep-step-item title="完成" description="detailFour" />
    </ep-step>
  </div>
  <div style="margin-top: 50px">
    <ep-step
      :active="active"
      :title-line-straight="isSingleLine"
      background="linear-gradient(to right, yellow, red)"
      type="dot"
    >
      <ep-step-item title="商户进件信息填写" description="detailOne" />
      <ep-step-item title="复核流程" description="detailTwo" />
      <ep-step-item title="审核流程" description="detailThree" />
      <ep-step-item title="完成" description="detailFour" />
    </ep-step>
  </div>
  <div style="margin-top: 50px">
    <ep-step
      :active="active"
      :title-line-straight="isSingleLine"
      background="linear-gradient(to right, yellow, red)"
      type="square"
    >
      <ep-step-item title="商户进件信息填写" description="detailOne" />
      <ep-step-item title="复核流程" description="detailTwo" />
      <ep-step-item title="审核流程" description="detailThree" />
      <ep-step-item title="完成" description="detailFour" />
    </ep-step>
    <ep-button style="margin-top: 20px" @click="nextStep">下一步</ep-button>
    <ep-button style="margin-top: 20px" @click="isSingleLine = !isSingleLine">
      是否在一条直线 : {{ isSingleLine }}
    </ep-button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const active = ref(2)
const isSingleLine = ref(true)
const nextStep = () => {
  if (active.value++ > 3) active.value = 0
}
</script>
<style scoped></style>
