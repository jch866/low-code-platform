<template>
  <div>
    <ep-form ref="formRef" label-width="200px" :model="model">
      <ep-form-item prop="enable" label="Switch">
        <ep-radio-group ref="switchRadioGroupRef" v-model="model.enable">
          <ep-radio ref="enableRadioRef" :value="true">Enable</ep-radio>
          <ep-radio ref="disableRadioRef" :value="false">Disable</ep-radio>
        </ep-radio-group>
      </ep-form-item>
      <ep-form-item
        prop="waterSource"
        label="Water Resource"
        :rules="{
          required: true,
          message: 'Please set Water Resource',
          trigger: 'change'
        }"
      >
        <ep-radio-group
          ref="waterRadioGroupRef"
          v-model="model.waterSource"
          :disabled="!model.enable"
        >
          <ep-radio value="Stream">Stream</ep-radio>
          <ep-radio value="River">River</ep-radio>
          <ep-radio value="Lake">Lake</ep-radio>
          <ep-radio value="Ocean">Ocean</ep-radio>
        </ep-radio-group>
      </ep-form-item>
      <div>
        <ep-button type="primary" @click.prevent="onFromSubmit">
          submit
        </ep-button>
        <ep-button @click="onResetForm">reset</ep-button>
      </div>
    </ep-form>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const formRef = ref(null)
const switchRadioGroupRef = ref(null)
const waterRadioGroupRef = ref(null)
const enableRadioRef = ref(null)
const disableRadioRef = ref(null)
const model = reactive({
  waterSource: '',
  enable: true
})

const onFromSubmit = async () => {
  await formRef.value.validate()
}
const onResetForm = () => {
  formRef.value.resetFields()
}
</script>
<script>
export default {
  name: 'RadioWithForm'
}
</script>
