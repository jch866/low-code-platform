<template>
  <div>
    <ep-form ref="formRef" :model="params">
      <ep-form-item
        :rules="[
          { required: true, message: 'please tick on', trigger: 'change' },
          {
            type: 'array',
            min: 2,
            message: '2 fruits at least',
            trigger: 'change'
          }
        ]"
        label="Fruits"
        prop="fruits"
      >
        <template v-for="item in fruits" :key="item">
          <ep-checkbox v-model="params.fruits" :value="item" :label="item" />
        </template>
      </ep-form-item>
      <div>
        <ep-button type="primary" @click.prevent="onFromSubmit">
          Submit
        </ep-button>
        <ep-button @click="onResetForm">Reset</ep-button>
      </div>
    </ep-form>
    <div v-if="validateResult">
      <p>Pass validation</p>
      <p>Form data: {{ params }}</p>
    </div>
    <div v-else>validation fail</div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const formRef = ref(null)
const fruits = ['Peach', 'Pear', 'Cherry', 'Mango', 'Pineapple', 'Grape']
const validateResult = ref()
const params = reactive({
  fruits: ['Cherry']
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
  name: 'RadioWithoutGroup'
}
</script>
