<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/rule/DecisionRule.vue（合并/JOIN 数据规则条件） -->
  <div class="j-decision-rule">
    <div class="section-title">数据规则条件</div>

    <!-- 空态（原 a-empty + 新增链接） -->
    <div v-if="regulatorChilds.length === 0" class="empty-row">
      <span>没有配置数据规则条件</span>
      <span class="empty-divider">|</span>
      <ep-button v-if="!disabled" plain type="primary" class="text-button" @click="handleDecisionRuleAdd">新增</ep-button>
    </div>

    <template v-else>
      <ep-card
        v-for="(item, index) in regulatorChilds"
        :key="index"
        class="rule-card"
      >
        <div class="card-layout">
          <!-- 逻辑连接符（源 mergeMode：首行固定不可选 NA/AND/OR/NOT） -->
          <div class="col-mode">
            <ep-select
              v-model="regulatorChilds[index].mergeMode"
              :disabled="index === 0 || disabled"
              class="mode-select"
            >
              <ep-option label="NA" value="-" />
              <ep-option label="AND" value="AND" />
              <ep-option label="OR" value="OR" />
              <ep-option label="NOT" value="NOT" />
            </ep-select>
            <!-- 左括号（源 leftBrackets：NA/( ） -->
            <ep-select v-model="item.leftBrackets" :disabled="disabled" class="bracket-select">
              <ep-option label="NA" value="-" />
              <ep-option label="(" value="(" />
            </ep-select>
          </div>

          <!-- 操作列（与源差异：原绝对定位按钮组+tooltip，改为文本按钮，LC0823 上移/LC0824 下移） -->
          <div class="col-actions">
            <span class="index-tag">{{ index }}</span>
            <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleChildUp(index)">上移</ep-button>
            <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleChildDown(index)">下移</ep-button>
            <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleDecisionRuleAdd">新增</ep-button>
            <ep-button plain type="danger" class="button-text" :disabled="disabled" @click="handleDecisionRuleDel(index)">删除</ep-button>
          </div>

          <!-- 左值条件 -->
          <div class="col-data">
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
            <!-- 已迁移 ItemBtn（源 a-popover 内嵌，改为内联两行选择器）：校验 validatorRegulator / 格式化 formatorRegulator -->
            <ItemBtn
              v-if="regulatorChilds[index].leftData.fieldType !== 'TABLE'"
              v-model:regulatorValidateProps="item.leftData.validatorRegulator"
              v-model:regulatorFormatProps="item.leftData.formatorRegulator"
              :disabled="disabled"
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

          <!-- 运算符 + 判断规则（LC0850/LC0851） -->
          <div class="col-operator">
            <!-- 原 j-dict-select-tag dictCode=rule_conditions；选项联调后由字典提供 -->
            <ep-select
              v-model="regulatorChilds[index].operator"
              placeholder="请选择运算符"
              :disabled="disabled"
            >
              <ep-option
                v-for="opt in RULE_CONDITION_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </ep-select>
            <!-- 已迁移 JSelectRegulator（JSelectBizComponent 规则选择器，返回 regulatorId）：判断规则选择，写回 operatorRegulator -->
            <JSelectRegulator
              v-model="regulatorChilds[index].operatorRegulator"
              :multiple="false"
              :disabled="disabled"
              placeholder="判断规则"
            />
          </div>

          <!-- 右值条件 -->
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
            <!-- 已迁移 ItemBtn（源 a-popover 内嵌，改为内联两行选择器）：同左值 -->
            <ItemBtn
              v-if="regulatorChilds[index].rightData.fieldType !== 'TABLE'"
              v-model:regulatorValidateProps="item.rightData.validatorRegulator"
              v-model:regulatorFormatProps="item.rightData.formatorRegulator"
              :disabled="disabled"
            />
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

          <!-- 右括号（源 rightBrackets：NA/) ） -->
          <div class="col-bracket">
            <ep-select v-model="item.rightBrackets" :disabled="disabled" class="bracket-select">
              <ep-option label="NA" value="-" />
              <ep-option label=")" value=")" />
            </ep-select>
          </div>
        </div>
      </ep-card>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ItemBtn from '@/components/itemBtn/ItemBtn.vue'
import JSelectRegulator from '@/components/jSelectRegulator/JSelectRegulator.vue'
import {
  REGULATOR_FIELD_TYPE_OPTIONS,
  RULE_CONDITION_OPTIONS,
  selectorPlaceholder,
  ensureParams,
  sortByKey
} from './ruleConstants'

const props = defineProps({
  // 条件行数据（源 regulatorChildsParam，modal regulatorChilds）
  regulatorChildsParam: { type: Array, required: true, default: () => [] },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:regulatorChildsParam'])

const regulatorChilds = ref([])

// 本地副本 + 双向 watch（与源一致）；与源差异：回显行补齐 groups/leftData/rightData.params，适配 ep-select multiple 与 FIXED 内联输入
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

/** 新增条件行（源 handleDecisionRuleAdd：childType=JOIN，与源差异：groups 初始化空数组适配 ep-select multiple） */
const handleDecisionRuleAdd = () => {
  regulatorChilds.value.push({
    childType: 'JOIN',
    groups: [],
    assignSeq: regulatorChilds.value.length,
    leftData: { fieldType: 'MSG' },
    rightData: { fieldType: 'MSG' }
  })
}

/** 删除（源 handleDecisionRuleDel） */
const handleDecisionRuleDel = (index) => {
  regulatorChilds.value.splice(index, 1)
}

/** 上移（源 handleChildUp：交换 assignSeq 后按 assignSeq 重排） */
const handleChildUp = (index) => {
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

/** 下移（源 handleChildDown） */
const handleChildDown = (index) => {
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
.j-decision-rule {
  width: 100%;
  min-height: 60px;
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
.rule-card {
  margin-bottom: 10px;
}
.card-layout {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.col-mode {
  width: 110px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.col-mode .mode-select,
.col-mode .bracket-select {
  width: 100%;
}
.col-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  flex-shrink: 0;
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
.col-operator {
  flex: 0.8;
  min-width: 0;
}
.col-operator .ep-select,
.col-operator .ep-input {
  width: 100%;
  margin-bottom: 6px;
}
.col-bracket {
  width: 70px;
  flex-shrink: 0;
}
.col-bracket .bracket-select {
  width: 100%;
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
