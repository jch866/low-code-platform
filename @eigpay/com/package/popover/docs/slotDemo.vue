<template>
  <ep-popover
    v-model="visible"
    class="popover"
    effect="light"
    title="this is title"
    content="this is content"
    trigger="click"
    @show="handleShow"
    @hide="handleHide"
  >
    <template #reference>
      <span>Click to activate</span>
    </template>
    <ep-form
      ref="formRef"
      :model="formModel"
      label-position=""
      label-width="50px"
      style="margin-top: 10px"
    >
      <ep-form-item prop="name" label="name" required>
        <ep-input v-model="formModel.name" type="text" />
      </ep-form-item>
      <ep-form-item
        prop="age"
        :rules="{
          required: true,
          message: () => 'Age is mandatory field',
          trigger: ['blur', 'change']
        }"
      >
        <template #label>
          <span>age</span>
        </template>
        <ep-input v-model="formModel.age" type="text" />
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
  </ep-popover>
</template>
<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)

const formRef = ref(null)

const validateResult = ref(null)

const formModel = reactive({
  name: 'abc',
  age: 25
})

const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  validateResult.value = isValid
}

const onResetForm = () => {
  formRef.value.resetFields()
}

const handleShow = () => {
  console.log('show')
}

const handleHide = () => {
  console.log('hide')
}
</script>

<script>
export default {
  name: 'SlotDemo'
}
</script>

<style scoped lang="scss">
.popover {
  width: 115px;
}
</style>
