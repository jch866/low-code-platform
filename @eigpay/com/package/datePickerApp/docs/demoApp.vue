<template>
  <ep-form
    ref="formRef"
    :model="formModel"
    label-position=""
    label-width="150px"
  >
    <ep-form-item
      prop="date"
      label="日期"
      :rules="[
        { required: true, message: '请选择', trigger: ['blur', 'change'] }
      ]"
    >
      <ep-date-picker-app
        ref="normalDatePickerRef"
        v-model="formModel.date"
        placeholder="请选择日期"
        format="yyyy-MM-dd"
        @change="handleChange"
        @visible-change="handleVisibleChange"
      ></ep-date-picker-app>
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
const normalDatePickerRef = ref(null)

const formModel = reactive({
  date: '2012-12-12'
})

const handleChange = (data) => {
  console.log(data)
}

const handleVisibleChange = () => {}

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
