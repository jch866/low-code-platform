<template>
  <ep-form
    ref="formRef"
    :model="formModel"
    label-position=""
    label-width="150px"
  >
    <ep-form-item
      prop="adress"
      label="营业登记地址"
      :rules="[
        {
          required: true,
          message: '请输入完整地址',
          trigger: ['change', 'blur']
        },
        { validator: validateAdress, trigger: ['blur', 'change'] }
      ]"
    >
      <ep-adress
        ref="adressItem"
        v-model="formModel.adress"
        :disabled="isDisabled"
        :cache="isCache"
        :query-level-one="queryCitys"
        :query-level-two="queryCountyById"
        :query-level-three="queryStreetById"
        @change="adressChanged"
      ></ep-adress>
    </ep-form-item>
    <div>
      <ep-button
        type="primary"
        native-type="submit"
        @click.prevent="onFromSubmit"
      >
        Submit
      </ep-button>
      <ep-button @click="onResetForm">Reset</ep-button>
      <ep-button @click="onChangeForm">Change</ep-button>
      <ep-button @click="isDisabled = !isDisabled">
        {{ isDisabled ? '点击启用' : '点击禁用' }}
      </ep-button>
      <ep-button @click="isCache = !isCache">
        {{ isCache ? '关闭缓存' : '开启缓存' }}
      </ep-button>
    </div>
  </ep-form>
  validation: {{ validateResult }}
</template>
<script setup>
import { ref, reactive } from 'vue'
import { citys, countys, streets } from './adress.json'

const validateAdress = (rule, value, callback) => {
  if (
    value &&
    value.levelOne &&
    value.levelTwo &&
    value.levelThree &&
    value.detail &&
    value.result
  ) {
    callback()
  } else {
    callback(new Error('请输入完整的地址'))
  }
}

const adressItem = ref()
const queryCitys = async () => citys
const queryCountyById = async (id) => countys[id]
const queryStreetById = async (id) => streets[id]
const adressChanged = () => {
  console.log('----changed----', formModel.adress)
}

const isDisabled = ref(false)
const isCache = ref(true)
const formRef = ref(null)
const validateResult = ref(null)
// const formModel = reactive({
//   adress: {
//     levelOne: '2', //上海市
//     levelTwo: '22', //静安区
//     levelThree: '223', //静安寺街道
//     detail: 'xxxx小区',
//     result: '上海市-静安区-静安寺街道-xxxx小区'
//   }
// })

const formModel = reactive({
  adress: {
    levelOne: '2',
    levelTwo: '22',
    levelThree: '222',
    detail: 'ww',
    result: '上海市-静安区-大宁路街道-ww'
  }
})
const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  validateResult.value = isValid
}
const onResetForm = () => {
  formRef.value.resetFields()
}

const onChangeForm = () => {
  formModel.adress = {
    levelOne: '1',
    levelTwo: '12',
    levelThree: '123',
    detail: '甲25号',
    result: '北京市-东城区-崇文门街道-甲25号'
  }
}
</script>
