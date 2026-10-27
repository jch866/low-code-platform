<template>
  <div style="width: 600px">
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
            trigger: ['change']
          }
        ]"
      >
        <ep-select
          v-model="formModel.status"
          placeholder="please choose"
          clearable
          filterable
          multiple
          remote
          :loading="loading"
          :loading-text="loadingText"
          :remote-method="defered"
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
  </div>

  validation: {{ validateResult }}
</template>
<script setup>
import { ref, reactive, unref } from 'vue'

const formRef = ref(null)

const validateResult = ref(null)

const formModel = reactive({
  status: []
})

const DefaultOptions = ref(
  Array.from({ length: 9 })
    .map((val, index) => ({
      value: index,
      label: `State_${index}`
    }))
    .concat([
      { value: 'a', label: '明明' },
      { value: 'b', label: 'mingming亮亮' },
      { value: 'c', label: '琪琪' }
    ])
)

const options = ref(unref(DefaultOptions))

const filterMethod = (keyword) => {
  if (keyword) {
    options.value = DefaultOptions.value.filter((item) =>
      item.label.includes(keyword)
    )
  } else {
    options.value = []
  }
}

const loading = ref(false)
const loadingText = 'Fetching'
const defered = (keyword) => {
  loading.value = true
  setTimeout(() => {
    filterMethod(keyword)
    loading.value = false
  }, 600)
}

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
