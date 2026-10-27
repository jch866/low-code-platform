<template>
  <div v-for="(initItem, i) in state.formList" :key="i">
    <ep-form ref="formModelRef" :model="initItem.form" label-width="150px">
      <div class="grid grid-cols-1">
        <!-- 识别维度一 -->
        <ep-form-item
          prop="chargeCode"
          :label="$t('itConfiguration.IT0224') + state.lengthList[i]"
          :rules="[$r.required]"
        >
          <ep-select
            v-model="initItem.form.chargeCode"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            filterable
          >
            <ep-option
              v-for="item in state.identifyList"
              :key="item.lemmaItem"
              :label="item.itemName"
              :value="item.lemmaItem"
              :disabled="
                _.map(state.formList, (item) => item.form.chargeCode).includes(
                  item.lemmaItem
                )
              "
            />
          </ep-select>
          <div
            v-if="i < 2"
            style="margin-left: 5px; cursor: pointer"
            @click="handleAddTransFee"
          >
            +
          </div>
          <div
            v-if="i < 3 && i > 0"
            style="margin-left: 5px; cursor: pointer"
            @click="handleDeleteTransFee(i)"
          >
            -
          </div>
        </ep-form-item>
        <ep-form-item
          prop="content"
          class="identClass"
          :label="$t('itConfiguration.IT0225') + state.lengthList[i]"
          :rules="[
            $r.required.trigger('blur').message($t('itConfiguration.IT0200')),
            initItem.form.chargeCode === '001'
              ? $r.char.digit
              : $r.char.digit.letter
          ]"
        >
          <ep-input
            v-model="initItem.form.content"
            :placeholder="$t('common.oprationField.pleaseEnter')"
            type="text"
            :maxlength="handleMax(initItem.form.chargeCode)"
          />
        </ep-form-item>
      </div>
    </ep-form>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { reactive, onMounted, ref, watch } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { getMultiDictsMore } from '@/api/common/common.js'
const formModelRef = ref()
const emits = defineEmits(['paramsList'])

const props = defineProps({
  tableData: {
    type: Array,
    default() {
      return
    }
  }
})

const state = reactive({
  formList: [
    {
      form: {
        chargeCode: '',
        content: ''
      }
    }
  ],
  identifyList: [
    { itemName: '卡号', lemmaItem: '001' },
    { itemName: '渠道商店MID', lemmaItem: '002' },
    { itemName: '终端TID', lemmaItem: '003' }
  ],
  lengthList: ['一', '二', '三']
})
const handleDeleteTransFee = async (rowIndex) => {
  state.formList.splice(rowIndex, 1)
  formModelRef.value[rowIndex].resetFields()
}
const handleAddTransFee = () => {
  if (state.formList.length < 3) {
    state.formList.push({
      form: {
        chargeCode: '',
        content: ''
      }
    })
  }
}
const handleValidate = async () => {
  const formRef = []
  for (let index = 0; index < formModelRef.value.length; index++) {
    formRef[index] = await formModelRef.value[index].validate()
  }
  return await formRef.every((item) => item.isValid)
}
watch(
  () => state.formList,
  (newV) => {
    const paramsList = _.map(newV, (item) => {
      return { ...item.form }
    })
    emits('paramsList', paramsList)
  },
  { deep: true, immediate: true }
)
watch(
  () => props.tableData,
  (newV) => {
    if (!_.isEmpty(newV)) {
      const tableList = _.map(_.cloneDeep(newV), (item) => {
        return {
          form: {
            chargeCode: item.chargeCode,
            content: item.content
          }
        }
      })
      state.formList = _.cloneDeep(tableList)
    }
  },
  { deep: true, immediate: true }
)
/** 数据字典 */
const initDict = async () => {
  const param = 'IDENTIFY_DIMENSIONS'
  const res = await getMultiDictsMore(param)
  if (res.returnCode === SUCCESS_STATUS) {
    // 交易场景
    state.identifyList = res.result.IDENTIFY_DIMENSIONS
  }
}
const handleMax = (val) => {
  if (val === '001') {
    return 19
  } else if (val === '002') {
    return 15
  } else if (val === '003') {
    return 8
  }
}
onMounted(() => {
  // initDict()
})
defineExpose({
  handleValidate
})
</script>

<style lang="scss" scoped>
.identClass {
  :deep(.ep-input) {
    width: 95%;
  }
}
</style>
