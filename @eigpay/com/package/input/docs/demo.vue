<template>
  <ep-form ref="formRef" :model="formModel" label-position="" label-width="150px">
    <ep-form-item prop="email" label="Email" :rules="[
      { required: true, message: '必填', trigger: ['blur', 'change'] },
      { type: 'email', message: '请输入正确邮箱', trigger: 'blur' }
    ]">
      <ep-input ref="emailInputRef" v-model="formModel.email" type="text" :maxlength="10" />
    </ep-form-item>
    <ep-form-item prop="age" :rules="{
      required: true,
      message: () => 'Age is mandatory field',
      trigger: ['blur', 'change']
    }">
      <template #label>
        <span>Age</span>
      </template>
      <ep-input ref="ageInputRef" v-model="formModel.age" type="text" />
    </ep-form-item>
    <ep-form-item prop="fancy" :rules="{
      required: true,
      message: () => 'Fancy is mandatory field',
      trigger: ['blur', 'change']
    }">
      <template #label>
        <span>Fancy</span>
      </template>
      <ep-input ref="fancyInputRef" preventDefault=false v-model="formModel.fancy" type="textarea"
        placeholder="Do you fancy ?" clearable />
    </ep-form-item>
    <div>
      <ep-button type="primary" native-type="submit" @click.prevent="onFromSubmit">
        submit
      </ep-button>
      <ep-button @click="onResetForm">reset</ep-button>
    </div>
  </ep-form>

  validation: {{ validateResult }}
</template>
<script setup>
import { ref, reactive } from 'vue'
const formRef = ref(null)

const validateResult = ref(null)
const emailInputRef = ref(null)
const ageInputRef = ref(null)
const fancyInputRef = ref(null)

const formModel = reactive({
  email: 'abc@b.com',
  age: 25,
  fancy: ''
})
const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  validateResult.value = isValid
}
const onResetForm = () => {
  formRef.value.resetFields()
}
</script>
<script>
export default {
  name: 'FormDemo'
}
</script>
