<template>
  <ep-input
    v-model="text"
    type="text"
    format="thousands"
    @input="inputChanged"
  />
  <div style="margin-top: 10px">
    input真实值为：
    <span>{{ correctValue }}</span>
  </div>
  <div style="margin-top: 10px">
    v-model绑定值为：
    <span>{{ text }}</span>
  </div>
  <div style="margin-top: 20px">
    --------------------------------------------------------------------------------------------------------------------------------------
  </div>
  <ep-form
    ref="formRef"
    :model="formModel"
    label-position=""
    label-width="70px"
  >
    <ep-form-item
      prop="price"
      label="Price"
      :rules="[
        $r.required.trigger('blur').message('不可为空'),
        $r.number(10, 2, false)
      ]"
    >
      <ep-input
        ref="emailInputRef"
        v-model="formModel.price"
        type="text"
        :maxlength="13"
        show-word-limit
        format="thousands"
      />
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
</template>
<script setup>
import { ref, reactive } from 'vue'
const text = ref('20240522.12')
const correctValue = ref('')
const inputChanged = (val) => {
  correctValue.value = val
}

const formRef = ref(null)

const validateResult = ref(null)
const emailInputRef = ref(null)

const formModel = reactive({
  price: '20,240,579.12'
})
const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  validateResult.value = isValid
}
const onResetForm = () => {
  formRef.value.resetFields()
}
</script>
