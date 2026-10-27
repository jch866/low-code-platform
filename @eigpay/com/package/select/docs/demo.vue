<template>
  <ep-form
    ref="formRef"
    :model="formModel"
    label-position=""
    label-width="150px"
  >
    <ep-form-item
      prop="status"
      label="status"
      :rules="[
        {
          required: true,
          message: 'please choose status',
          trigger: ['blur', 'change']
        }
      ]"
    >
      <ep-select
        v-model="formModel.status"
        placeholder="please choose"
        @change="handleChange"
        @visible-change="handleVisibleChange"
      >
        <ep-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
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
  status: ''
})

const options = ref([
  {
    value: 0,
    label: 'unfinished'
  },
  {
    value: 1,
    label: 'underway'
  },
  {
    value: 2,
    label: 'finished'
  }
])

const handleChange = () => {}

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
  name: 'SelectDemo'
}
</script>
