<template>
  <ep-form ref="formRef" :model="formModel" label-width="150px">
    <ep-form-item
      prop="name"
      label="name"
      :rules="[
        { required: true, message: 'Required', trigger: 'blur' },
        {
          min: 5,
          message: 'Length must be greater than 5',
          trigger: ['blur', 'change']
        }
      ]"
    >
      <ep-input v-model="formModel.name" type="text" />
    </ep-form-item>
    <ep-form-item
      prop="state"
      label="State"
      :rules="{ required: true, message: 'Required', trigger: 'change' }"
    >
      <ep-select v-model="formModel.state" placeholder="Select">
        <ep-option label="A" value="A" />
        <ep-option label="B" value="B" />
      </ep-select>
    </ep-form-item>
    <div>
      <ep-button
        type="primary"
        native-type="submit"
        @click.prevent="onFromSubmit"
      >
        submit
      </ep-button>
      <ep-button @click="onResetForm">reset</ep-button>
    </div>
  </ep-form>

  validation: {{ validateResult }}
</template>
<script setup>
import { ref, reactive } from 'vue'
// import { default as r } from '../src/validation'

const formRef = ref(null)

const validateResult = ref(null)

const formModel = reactive({
  name: 'abc',
  state: ''
})
const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  validateResult.value = isValid
}
const onResetForm = () => {
  formRef.value.resetFields()
}
</script>
