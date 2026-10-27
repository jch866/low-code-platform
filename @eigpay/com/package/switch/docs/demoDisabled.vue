<template>
  <div>
    <ep-form-item label="控制开关" label-width="120px">
      <ep-switch
        ref="normalSwitchRef"
        v-model="disabled"
        :active-value="true"
        :inactive-value="false"
        active-text="On"
        inactive-text="Off"
        inline-prompt
      />
    </ep-form-item>
  </div>
  <p>
    <ep-switch
      v-model="model"
      :active-value="true"
      :inactive-value="false"
      active-text="Allow"
      inactive-text="Disallow"
      :disabled="!disabled"
    />
  </p>

  <div style="border: 1px solid gray; padding: 10px">
    Form
    <ep-form
      ref="formRef"
      :model="params"
      :label-width="120"
      :disabled="!disabled"
    >
      <ep-form-item
        :label="'Set Something'"
        prop="setting"
        :rules="[
          { required: true, message: 'Mandatory Field', trigger: 'change' }
        ]"
      >
        <ep-switch
          v-model="params.setting"
          :active-value="'Allow'"
          :inactive-value="'Deny'"
        />
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
const normalSwitchRef = ref(null)
const disabled = ref(true)
const model = ref(true)

const validateResult = ref()

const params = reactive({
  setting: ''
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
  name: 'DemoSwitchNormally'
}
</script>
