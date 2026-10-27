<template>
  <div style="width: 600px">
    <ep-form
      ref="formRef"
      :model="formModel"
      label-position=""
      label-width="150px"
    >
      <ep-form-item
        prop="status1st"
        label="status first"
        :rules="[
          {
            required: true,
            message: 'please choose status',
            trigger: ['change']
          }
        ]"
      >
        <ep-select
          ref="fitstSelectRef"
          v-model="formModel.status1st"
          placeholder="please choose"
          clearable
          filterable
        >
          <ep-option
            v-for="item in DefaultOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </ep-select>
      </ep-form-item>
      <ep-form-item
        prop="status2nd"
        label="status second"
        :rules="[
          {
            required: true,
            message: 'please choose status',
            trigger: ['change']
          }
        ]"
      >
        <ep-select
          ref="secondSelectRef"
          v-model="formModel.status"
          placeholder="please choose"
          clearable
          filterable
          :filter-method="filterMethod"
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
const fitstSelectRef = ref(null)
const secondSelectRef = ref(null)

const formModel = reactive({
  status1st: '',
  status2nd: 4
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
    options.value = DefaultOptions.value.filter(
      (item, i) => item.label.includes(keyword) || i > 6
    )
  } else {
    options.value = [...DefaultOptions.value]
  }
}

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
