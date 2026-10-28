<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/assgin/DataAssign.vue（数据赋值配置） -->
  <div class="j-data-assign">
    <div class="section-title">数据交换赋值规则列表</div>

    <!-- 空态（原 a-empty + 新增链接） -->
    <div v-if="regulatorChilds.length === 0" class="empty-row">
      <span>没有配置数据赋值条件</span>
      <span class="empty-divider">|</span>
      <ep-button v-if="!disabled" plain type="primary" class="text-button" @click="handleDataAssignAdd">新增</ep-button>
    </div>

    <template v-else>
      <ep-card
        v-for="(item, index) in regulatorChilds"
        :key="'item' + index"
        class="assign-card"
      >
        <div class="card-layout">
          <!-- 左列：分组 + 序号 + 操作（与源差异：仅 !disabled 时展示，原 a-col :sm=6） -->
          <div v-if="!disabled" class="col-left">
            <ep-select v-model="item.groups" multiple placeholder="请选择分组" class="group-select">
              <ep-option
                v-for="(subGroup, idx) in groupSets"
                :key="'group' + idx"
                :label="subGroup.groupName"
                :value="subGroup.groupId"
              />
            </ep-select>
            <div class="left-actions">
              <span class="index-tag">{{ index }}</span>
              <ep-button plain type="primary" class="button-text" @click="handleDataAssignUp(index)">上移</ep-button>
              <ep-button plain type="primary" class="button-text" @click="handleDataAssignDown(index)">下移</ep-button>
              <ep-button plain type="primary" class="button-text" @click="handleDataAssignAdd">新增</ep-button>
              <ep-button plain type="danger" class="button-text" @click="handleDataAssignDel(index)">删除</ep-button>
            </div>
          </div>

          <!-- 中列：左值（赋值源） -->
          <div class="col-data">
            <!-- 原 j-dict-select-tag dictCode=regulator_field_type -->
            <ep-select
              v-model="regulatorChilds[index].leftData.fieldType"
              placeholder="请选择源数据类型"
              :disabled="disabled"
              @change="ensureParams(item.leftData)"
            >
              <ep-option
                v-for="opt in REGULATOR_FIELD_TYPE_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </ep-select>
            <!-- 与源差异：原 ItemBtn（j-select-regulator 校验 validatorRegulator/格式化 formatorRegulator 选择器）以只读输入框占位 -->
            <ep-input
              :model-value="(item.leftData.validatorRegulator || '') + (item.leftData.formatorRegulator || '')"
              readonly
              :disabled="disabled"
              placeholder="选择器待迁移：ItemBtn（validatorRegulator/formatorRegulator）"
              type="text"
            />
            <!-- FIXED：原 FixedData 内联（绑定 params.value） -->
            <ep-input
              v-if="regulatorChilds[index].leftData.fieldType === 'FIXED'"
              v-model="item.leftData.params.value"
              :disabled="disabled"
              placeholder="请输入文本内容信息"
              type="text"
            />
            <ep-input
              v-else
              :model-value="paramBrief(item.leftData.params)"
              readonly
              :disabled="disabled"
              :placeholder="selectorPlaceholder(regulatorChilds[index].leftData.fieldType)"
              type="text"
            />
          </div>

          <!-- 右列：右值（赋值目标） -->
          <div class="col-data">
            <ep-select
              v-model="regulatorChilds[index].rightData.fieldType"
              placeholder="请选择目标数据类型"
              :disabled="disabled"
              @change="ensureParams(item.rightData)"
            >
              <ep-option
                v-for="opt in REGULATOR_FIELD_TYPE_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </ep-select>
            <!-- 与源差异：原 ItemBtn 同左值，以只读输入框占位 -->
            <ep-input
              :model-value="(item.rightData.validatorRegulator || '') + (item.rightData.formatorRegulator || '')"
              readonly
              :disabled="disabled"
              placeholder="选择器待迁移：ItemBtn（validatorRegulator/formatorRegulator）"
              type="text"
            />
            <!-- FIXED：原 FixedData 内联 -->
            <ep-input
              v-if="regulatorChilds[index].rightData.fieldType === 'FIXED'"
              v-model="item.rightData.params.value"
              :disabled="disabled"
              placeholder="请输入文本内容信息"
              type="text"
            />
            <ep-input
              v-else
              :model-value="paramBrief(item.rightData.params)"
              readonly
              :disabled="disabled"
              :placeholder="selectorPlaceholder(regulatorChilds[index].rightData.fieldType)"
              type="text"
            />
          </div>
        </div>
      </ep-card>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  REGULATOR_FIELD_TYPE_OPTIONS,
  selectorPlaceholder,
  ensureParams,
  sortByKey
} from './ruleConstants'

const props = defineProps({
  // 分组行数据（源 groupSetsParam，与 GroupSet 共享）
  groupSetsParam: { type: Array, required: true, default: () => [] },
  // 赋值行数据（源 regulatorChildsParam，modal regulatorChilds）
  regulatorChildsParam: { type: Array, required: true, default: () => [] },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:regulatorChildsParam'])

const groupSets = ref([])
const regulatorChilds = ref([])

// 本地副本 + 双向 watch（与源一致）；与源差异：回显行补齐 groups/leftData/rightData.params，适配 ep-select multiple 与 FIXED 内联输入
watch(() => props.groupSetsParam, (v) => { groupSets.value = v }, { immediate: true })
watch(
  () => props.regulatorChildsParam,
  (v) => {
    ;(v || []).forEach((item) => {
      if (!item.groups) item.groups = []
      ensureParams(item.leftData)
      ensureParams(item.rightData)
    })
    regulatorChilds.value = v
  },
  { immediate: true }
)
watch(regulatorChilds, (v) => emit('update:regulatorChildsParam', v), { deep: true })

/** 新增赋值行（源 handleDataAssignAdd；groups 初始化为空数组以适配 ep-select multiple，与源差异） */
const handleDataAssignAdd = () => {
  regulatorChilds.value.push({
    childType: 'DATA_ASSIGN',
    groups: [],
    assignSeq: regulatorChilds.value.length,
    leftData: { fieldType: 'MSG' },
    rightData: { fieldType: 'MSG' }
  })
}

/** 删除（源 handleDataAssignDel） */
const handleDataAssignDel = (index) => {
  regulatorChilds.value.splice(index, 1)
}

/** 上移（源 handleDataAssignUp：交换 assignSeq 后按 assignSeq 重排） */
const handleDataAssignUp = (index) => {
  const currentObj = regulatorChilds.value.find((p) => p.assignSeq === index)
  if (currentObj == null) return
  const changeObj = regulatorChilds.value[index - 1]
  if (changeObj == null) return
  const currentSeq = currentObj.assignSeq
  const changeSeq = changeObj.assignSeq
  currentObj.assignSeq = changeSeq
  changeObj.assignSeq = currentSeq
  sortByKey(regulatorChilds.value, 'assignSeq')
}

/** 下移（源 handleDataAssignDown） */
const handleDataAssignDown = (index) => {
  const currentObj = regulatorChilds.value.find((p) => p.assignSeq === index)
  if (currentObj == null) return
  const changeObj = regulatorChilds.value[index + 1]
  if (changeObj == null) return
  const currentSeq = currentObj.assignSeq
  const changeSeq = changeObj.assignSeq
  currentObj.assignSeq = changeSeq
  changeObj.assignSeq = currentSeq
  sortByKey(regulatorChilds.value, 'assignSeq')
}

/** 只读占位框展示已配置参数摘要（与源差异：原为各 Data 组件表单，此处展示键值摘要便于联调核对） */
const paramBrief = (params) => {
  if (!params) return ''
  return Object.keys(params)
    .filter((k) => params[k] !== '' && params[k] != null)
    .map((k) => `${k}=${params[k]}`)
    .join(' ')
}
</script>

<style scoped>
.j-data-assign {
  width: 100%;
  min-height: 50px;
}
.section-title {
  width: 100%;
  background-color: #ebebeb;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-size: 14px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}
.empty-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #909399;
  padding: 12px 0;
}
.empty-divider {
  color: #dcdfe6;
}
.assign-card {
  margin-bottom: 10px;
}
.card-layout {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.col-left {
  width: 220px;
  flex-shrink: 0;
}
.group-select {
  width: 100%;
}
.left-actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.col-data {
  flex: 1;
  min-width: 0;
}
.col-data .ep-select,
.col-data .ep-input {
  width: 100%;
  margin-bottom: 6px;
}
.index-tag {
  flex-shrink: 0;
  min-width: 28px;
  text-align: center;
  padding: 5px 6px;
  background: #f0f2f5;
  border-radius: 2px;
  font-size: 12px;
  color: #606266;
}
</style>
