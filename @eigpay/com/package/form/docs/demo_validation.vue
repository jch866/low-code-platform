<template>
  <ep-form ref="formRef" :model="formModel" label-width="150px">
    <ep-form-item prop="name" label="name" :rules="[r.required, r.email]">
      <ep-input v-model="formModel.name" type="text" />
    </ep-form-item>
    <ep-form-item
      prop="age"
      :rules="[
        r.required,
        r.fn.async(asyncFn),
        r.fn.sync(syncFn).message('abc')
      ]"
    >
      <template #label>
        <span>age</span>
      </template>
      <ep-input v-model="formModel.age" type="text" />
    </ep-form-item>
    <ep-form-item prop="amount" :rules="[r.number(3).max(100).min(20)]">
      <template #label>
        <span>Amount</span>
      </template>
      <ep-input v-model="formModel.amount" type="text" />
    </ep-form-item>
    <ep-form-item prop="remark" :rules="[r.char.letterUppercase.whitespace]">
      <template #label>
        <span>Remark</span>
      </template>
      <ep-input v-model="formModel.remark" type="text" />
    </ep-form-item>
    <ep-form-item prop="phone" :rules="[r.local.phone]">
      <template #label>
        <span>Phone</span>
      </template>
      <ep-input v-model="formModel.phone" type="text" />
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
import { default as r } from '../src/validation'

const formRef = ref(null)

const validateResult = ref(null)

const formModel = reactive({
  name: 'abc',
  age: 25,
  amount: null,
  remark: null,
  phone: ''
})
const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  validateResult.value = isValid
}
const onResetForm = () => {
  formRef.value.resetFields()
}
const asyncFn = async () => {
  return Promise.reject('informations')
}

// const asyncFn = async (rule, value, callback) => {
//   await Promise.resolve('bac')
//   callback(999)
// }
const syncFn = (rule, value) => {
  return value === '2'
}

// const syncFn = (rule, value, callback) => {
//   if(value === '2') {
//     callback()
//   }else {
//     callback(informations)
//   }
// }
</script>
