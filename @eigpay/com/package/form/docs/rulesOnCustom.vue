<template>
  <ep-form ref="formRef" :model="formModel" label-width="150px">
    <ep-form-item
      prop="name"
      label="Name"
      :rules="[$r.required, $r.fn.async(validateName)]"
    >
      <ep-input v-model="formModel.name" type="text" />
    </ep-form-item>
    <ep-form-item prop="email" label="Email" :rules="[$r.email]">
      <ep-input v-model="formModel.email" type="text" />
    </ep-form-item>
    <ep-form-item
      prop="address"
      label="Address"
      :rules="[
        $r.range.min(5).message('最少5个字符').max(15).message('最多15个字符')
      ]"
    >
      <ep-input v-model="formModel.address" type="text" />
    </ep-form-item>
    <ep-form-item
      prop="pin"
      label="Pin"
      :rules="[
        $r.pattern.pattern(/^[A-Z]/).message(() => '请以大写字母开头'),
        $r.range.len(6)
      ]"
    >
      <ep-input v-model="formModel.pin" type="text" />
    </ep-form-item>
    <ep-form-item
      prop="fun"
      label="Fun"
      :rules="[
        $r.fn
          .sync(syncFun)
          .message('请保持和Name字段值相同')
          .trigger('blur', 'change')
      ]"
    >
      <ep-input v-model="formModel.fun" type="text" />
    </ep-form-item>
    <ep-form-item
      prop="state"
      label="State"
      :rules="[$r.required.trigger('change')]"
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

const formRef = ref(null)

const validateResult = ref(null)

const formModel = reactive({
  name: '',
  email: '',
  address: '',
  pin: '',
  fun: '',
  state: ''
})

const mockAsync = async (value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.length % 2 === 0) {
        resolve()
      } else {
        reject('Name validate failure')
      }
    }, 20)
  })
}

const validateName = async (rule, value, callback) => {
  try {
    await mockAsync(value)
  } catch (e) {
    callback(e)
  }
}

const syncFun = (rule, value) => {
  return value === formModel.name
}

const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  validateResult.value = isValid
}
const onResetForm = () => {
  formRef.value.resetFields()
}
</script>
