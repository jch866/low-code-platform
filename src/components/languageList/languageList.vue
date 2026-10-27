<template>
  <div class="language-list">
    <ep-form ref="formRef" :model="state" :label-width="0" class="formSheet">
      <div
        v-for="(row, rowIndex) in state.tableData"
        :key="rowIndex"
        :class="['itemDiv', { 'table-dev': rowIndex !== 0 }]"
      >
        <ep-form-item
          :prop="`tableData[${rowIndex}].languageFlag`"
          :rules="[$r.required.trigger('change')]"
        >
          <ep-select
            v-model="row.languageFlag"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            clearable
          >
            <ep-option
              v-for="(item, index) in state.languageList"
              :key="index"
              :label="item.itemName"
              :value="item.lemmaItem"
              :disabled="isDisabled(item)"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item :prop="`tableData[${rowIndex}].languageName`" :rules="[$r.required.trigger('blur')]">
          <ep-input
            v-model="row.languageName"
            :placeholder="$t('common.oprationField.pleaseEnter')"
            type="text"
          />
        </ep-form-item>
        <div class="operate">
          <div
            v-if="
              state.tableData.length - 1 === rowIndex &&
              state.tableData.length !== state.languageList.length
            "
            class="addList"
            @click="handleAdd"
          >
            {{ $t('common.oprationField.increase') }}
          </div>
          <div
            v-if="state.tableData.length > 1"
            class="deleList"
            @click="handleDelete(rowIndex, row)"
          >
            {{ $t('common.oprationField.delete') }}
          </div>
        </div>
      </div>
    </ep-form>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch, reactive, onMounted } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { getMultiDictsMore } from '@/api/common/common.js'

const formRef = ref(null)
const emit = defineEmits(['changeTableData'])
const props = defineProps({
  // 分页配置
  dataValue: {
    type: Object,
    default() {
      return {
        tableList: [],
        keyName: 'languageName',
        keyFlag: 'languageFlag',
        type: 'text'
      }
    }
  }
})
const state = reactive({
  tableData: [{ languageFlag: '', languageName: '' }],
  languageList: [],
  init: {}
})
// 调用数据字典
const handleQueryDict = async () => {
  const param = 'DATA_DICTIONARY_LANGUAGE'
  const res = await getMultiDictsMore(param)
  if (res.returnCode === SUCCESS_STATUS) {
    // 渠道类型
    state.languageList = res.result.DATA_DICTIONARY_LANGUAGE
    if (_.isEmpty(state.init.tableList)) return
    state.tableData = _.map(state.languageList, (item) => {
      const obj =
        state.init?.tableList.find(
          (el) => el[state.init.keyFlag] === item.lemmaItem
        ) || ''
      return {
        languageFlag: obj ? obj[state.init.keyFlag] : '',
        languageName: obj ? obj[state.init.keyName] : ''
      }
    })
  }
}
// 新增条数
const handleAdd = () => {
  state.tableData.push({})
}
// 删除条数
const handleDelete = (i) => {
  state.tableData.splice(i, 1)
}
// 判断下拉选项禁用
const isDisabled = (v) => {
  return _.map(state.tableData, (it) => it.languageFlag).includes(v.lemmaItem)
}
watch(
  () => props.dataValue,
  (newV) => {
    if (newV.tableList) {
      state.init = _.cloneDeep(newV)
      handleQueryDict()
    } else {
      handleQueryDict()
    }
  },
  { deep: true, immediate: true }
)
watch(
  () => state.tableData,
  (newV) => {
    emit('changeTableData', newV)
  },
  { deep: true }
)
onMounted(() => {
  // handleQueryDict()
})
const handleValidate = async () => {
  const { isValid } = await formRef.value.validate()
  return isValid
}
const resetFields = () => {
  formRef.value.resetFields()
  state.tableData.length = 1
}
defineExpose({
  handleValidate,
  resetFields
})
</script>

<script>
export default {
  name: 'TableBlock'
}
</script>

<style lang="scss" scoped>
.language-list {
  width: 100%;
}
.itemDiv {
  display: flex;
  width: 100%;
}
.addList {
  margin-left: 10px;
  cursor: pointer;
  color: #262AFF;
}
.deleList {
  margin-left: 10px;
  cursor: pointer;
  color: #f53f3f;
}
:deep(.ep-form-item__label) {
  width: 0px !important;
  @apply pr-[0px];
}
:deep(.ep-form-item__label::before) {
  content: ' ' !important;
}
:deep(.ep-form-item) {
  width: 43.5% !important;
}
.formSheet .itemDiv:last-child .ep-form-item {
  @apply mb-[0px];
}
.formSheet .itemDiv .ep-form-item:nth-child(even) {
  @apply ml-[0.5rem];
}
</style>
