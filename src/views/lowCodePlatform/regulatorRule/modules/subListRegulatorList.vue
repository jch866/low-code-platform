<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/sublist/SubListRegulatorList.vue（多决策子表/多渲染子表 规则子列表） -->
  <div class="j-sub-list-regulator-list">
    <div class="section-title">
      <span>规则子列表</span>
      <span class="title-tip">(建议添加规则子列表小于50条)</span>
    </div>

    <!-- 空态（原 a-empty + 两个新增链接：LC0809 新增关联节点 / LC0810 新增子节点） -->
    <div v-if="regulatorChilds.length === 0" class="empty-row">
      <span>没有配置数据规则条件</span>
      <span class="empty-divider">|</span>
      <ep-button v-if="!disabled" plain type="primary" class="text-button" @click="handleSubRuleAdd">点击新增关联节点</ep-button>
      <span class="empty-divider">|</span>
      <ep-button v-if="!disabled" plain type="primary" class="text-button" @click="handleChildRuleAdd">点击新增子节点</ep-button>
    </div>

    <template v-else>
      <ep-card
        v-for="(item, index) in regulatorChilds"
        :key="index"
        class="child-card"
      >
        <div class="card-layout">
          <!-- 左列：分组 + 序号 + 操作（与源差异：原操作按钮组 absolute 定位卡片左上，改为分组下方纵向排列） -->
          <div class="col-left">
            <!-- 分组多选（源 a-select mode=multiple，LC0822） -->
            <ep-select
              v-model="item.groups"
              multiple
              placeholder="请选择分组"
              :disabled="disabled"
              class="group-select"
            >
              <ep-option
                v-for="(subGroup, idx) in groupSets"
                :key="'group' + idx"
                :label="subGroup.groupName"
                :value="subGroup.groupId"
              />
            </ep-select>
            <div class="left-actions">
              <span class="index-tag">{{ index }}</span>
              <div class="action-btns">
                <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleChildUp(index)">上移</ep-button>
                <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleChildDown(index)">下移</ep-button>
                <ep-button v-if="!disabled" plain type="primary" class="button-text" @click="handleChildRuleAdd">新增类处理器</ep-button>
                <ep-button v-if="!disabled" plain type="primary" class="button-text" @click="handleSubRuleAdd">新增子节点处理器</ep-button>
                <ep-button plain type="danger" class="button-text" :disabled="disabled" @click="handleDecisionRuleDel(index)">删除</ep-button>
              </div>
            </div>
          </div>

          <!-- 中列：SUB=子节点处理器选择 / CHILD=类处理器 + 处理器参数 + 错误码描述 -->
          <div class="col-mid">
            <!-- childType=SUB：子节点处理器（已迁移 JSelectRegulator 规则选择器，返回 regulatorId；LC0827 请选择子节点处理器；
                 注意源字段名 regulatorName 实际存 regulatorId，语义照搬） -->
            <div v-if="item.childType === 'SUB'">
              <JSelectRegulator
                v-model="item.regulatorName"
                :multiple="false"
                :disabled="disabled"
                placeholder="请选择子节点处理器"
              />
            </div>

            <!-- childType=CHILD：类处理器联动（原 JSelectRegulatorInfo，已迁移共享组件） -->
            <template v-if="item.childType === 'CHILD'">
              <JSelectRegulatorInfo
                v-model="item.subRegulatorRule.className"
                :multiple="false"
                :disabled="disabled"
                @change="changeRuleInfo(index)"
              />
              <!-- 处理器参数（LC0829，由 changeRuleInfo 按 regulatorInfoParams 生成） -->
              <div
                v-if="item.subRegulatorRule.regulatorParam && item.subRegulatorRule.regulatorParam.length > 0"
                class="sub-title"
              >处理器参数</div>
              <div
                v-for="(items, paramIndex) in item.subRegulatorRule.regulatorParam"
                :key="'param' + paramIndex"
                class="param-row"
              >
                <span class="param-name-tag">{{ items.paramName }}</span>
                <!-- 原 a-select 仅两种类型：固定数据/数据字典（LC0797/LC0798） -->
                <ep-select v-model="items.fieldType" placeholder="请选择参数名称" :disabled="disabled" class="param-type-select">
                  <ep-option
                    v-for="opt in EXT_PARAM_TYPE_OPTIONS"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ep-select>
                <!-- FIXED：原 FixedData 内联（绑定 defaultValue.value） -->
                <ep-input
                  v-if="items.fieldType === 'FIXED'"
                  v-model="items.defaultValue.value"
                  :disabled="disabled"
                  placeholder="请输入文本内容信息"
                  type="text"
                />
                <!-- 已迁移 DictData（j-select-dict 数据字典选择器）：fetchType/dictType/dictValue 写回 defaultValue -->
                <DictData
                  v-else
                  v-model:dictDataParamProps="items.defaultValue"
                  :disabled="disabled"
                />
              </div>

              <!-- 错误码描述（LC0831）：已简化实现（原内嵌 ErrorInfo：errorCode 为字典 error_code 下拉 + errorMessage 输入框） -->
              <div class="sub-title">错误码描述</div>
              <div class="error-info-row">
                <ep-input
                  v-model="item.subRegulatorRule.errorInfo.errorCode"
                  :disabled="disabled"
                  placeholder="请选错误码"
                  type="text"
                />
                <ep-input
                  v-model="item.subRegulatorRule.errorInfo.errorMessage"
                  :disabled="disabled"
                  placeholder="请输入异常描述"
                  type="text"
                />
              </div>
            </template>
          </div>

          <!-- 右列：CHILD 时展示 输入/输出数据配置 -->
          <div v-if="item.childType === 'CHILD'" class="col-right">
            <!-- 输入数据配置（LC0833；与源差异：原标题外层含 a-popover 内嵌 ItemBtn 校验/格式化选择器，此处仅保留标题+字段类型） -->
            <div
              v-for="(sourceDataSet, sourceIndex) in item.subRegulatorRule.regulatorSources"
              :key="'source' + sourceIndex"
              class="dataset-item"
            >
              <div class="sub-title">输入数据配置</div>
              <ep-select
                v-model="sourceDataSet.fieldType"
                placeholder="请选择源数据类型"
                :disabled="disabled"
                @change="ensureParams(sourceDataSet)"
              >
                <ep-option
                  v-for="opt in REGULATOR_FIELD_TYPE_OPTIONS"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </ep-select>
              <!-- FIXED：原 FixedData 内联；其余类型深层选择器占位 -->
              <ep-input
                v-if="sourceDataSet.fieldType === 'FIXED'"
                v-model="sourceDataSet.params.value"
                :disabled="disabled"
                placeholder="请输入文本内容信息"
                type="text"
              />
              <ep-input
                v-else
                :model-value="paramBrief(sourceDataSet.params)"
                readonly
                :disabled="disabled"
                :placeholder="selectorPlaceholder(sourceDataSet.fieldType)"
                type="text"
              />
            </div>
            <!-- 输出数据配置（LC0835；ItemBtn 占位说明同上） -->
            <div
              v-for="(targetDataSet, targetIndex) in item.subRegulatorRule.regulatorTargets"
              :key="'target' + targetIndex"
              class="dataset-item"
            >
              <div class="sub-title">输出数据配置</div>
              <ep-select
                v-model="targetDataSet.fieldType"
                placeholder="请选择目标数据类型"
                :disabled="disabled"
                @change="ensureParams(targetDataSet)"
              >
                <ep-option
                  v-for="opt in REGULATOR_FIELD_TYPE_OPTIONS"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </ep-select>
              <ep-input
                v-if="targetDataSet.fieldType === 'FIXED'"
                v-model="targetDataSet.params.value"
                :disabled="disabled"
                placeholder="请输入文本内容信息"
                type="text"
              />
              <ep-input
                v-else
                :model-value="paramBrief(targetDataSet.params)"
                readonly
                :disabled="disabled"
                :placeholder="selectorPlaceholder(targetDataSet.fieldType)"
                type="text"
              />
            </div>
          </div>
        </div>
      </ep-card>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import JSelectRegulatorInfo from '@/components/jSelectRegulatorInfo/JSelectRegulatorInfo.vue'
import JSelectRegulator from '@/components/jSelectRegulator/JSelectRegulator.vue'
import DictData from '@/components/dictData/DictData.vue'
import { EPMessageTips } from '@/utils/utils'
import { getRuleInfoByClassName } from '@/api/lowCodePlatform/regulatorRule'
import {
  REGULATOR_FIELD_TYPE_OPTIONS,
  EXT_PARAM_TYPE_OPTIONS,
  selectorPlaceholder,
  ensureParams,
  sortByKey
} from './ruleConstants'

const props = defineProps({
  // 规则子列表（源 regulatorSubListParam，modal regulatorChilds）
  regulatorSubListParam: { type: Array, required: true, default: () => [] },
  // 分组行数据（源 groupSetsParam，与 GroupSet 共享）
  groupSetsParam: { type: Array, required: true, default: () => [] },
  // 规则子类型（源 regulatorSubTypeParam，决定新增子节点的 regulatorSubType）
  regulatorSubTypeParam: { type: String, required: true, default: 'SINGLE_RENDER' },
  // 所属系统（源 systemNameParam，changeRuleInfo 查询参数）
  systemNameParam: { type: String, required: true, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:regulatorSubListParam'])

const groupSets = ref([])
const regulatorChilds = ref([])
const regulatorSubType = ref('')
const systemName = ref('')

// changeRuleInfo 直接 return 标识（源模块级变量 changeRuleRtnFlag；与源差异：改为组件实例级，避免多实例串扰）
let changeRuleRtnFlag = false

// 本地副本 + 双向 watch（与源一致）；与源差异：回显数据补齐 CHILD 子规则的 errorInfo/regulatorParam 等结构，避免模板空引用
watch(() => props.groupSetsParam, (v) => { groupSets.value = v }, { immediate: true })
watch(
  () => props.regulatorSubListParam,
  (v) => {
    ;(v || []).forEach((item) => {
      if (!item.groups) item.groups = []
      if (item.childType === 'CHILD' && item.subRegulatorRule) {
        if (!item.subRegulatorRule.regulatorParam) item.subRegulatorRule.regulatorParam = []
        if (!item.subRegulatorRule.regulatorSources) item.subRegulatorRule.regulatorSources = []
        if (!item.subRegulatorRule.regulatorTargets) item.subRegulatorRule.regulatorTargets = []
        if (!item.subRegulatorRule.errorInfo) item.subRegulatorRule.errorInfo = {}
      }
    })
    regulatorChilds.value = v
  },
  { immediate: true }
)
watch(() => props.regulatorSubTypeParam, (v) => { regulatorSubType.value = v }, { immediate: true })
watch(() => props.systemNameParam, (v) => { systemName.value = v }, { immediate: true })
watch(regulatorChilds, (v) => emit('update:regulatorSubListParam', v), { deep: true })

/** 新增关联节点（源 handleSubRuleAdd：childType=SUB，无类处理器配置） */
const handleSubRuleAdd = () => {
  regulatorChilds.value.push({
    childType: 'SUB',
    groups: [],
    subRegulatorRule: { regulatorSources: [], regulatorTargets: [], regulatorParam: [] },
    assignSeq: regulatorChilds.value.length
  })
  sort('dsc')
}

/** 新增子节点（源 handleChildRuleAdd：childType=CHILD，含类处理器/左右数据；子表多决策→SINGLE_DECISION） */
const handleChildRuleAdd = () => {
  let childRuleSubType = 'SINGLE_RENDER'
  if (regulatorSubType.value === 'MUTIL_DECISION_SUBLIST') {
    childRuleSubType = 'SINGLE_DECISION'
  }
  regulatorChilds.value.push({
    childType: 'CHILD',
    groups: [],
    assignSeq: regulatorChilds.value.length,
    subRegulatorRule: {
      className: '',
      regulatorSubType: childRuleSubType,
      regulatorSources: [],
      regulatorTargets: [],
      regulatorParam: [],
      // 与源差异：源未初始化 errorInfo（ErrorInfo 组件内部 default {} 导致修改丢失），此处显式初始化保证回写
      errorInfo: {}
    },
    leftData: { fieldType: 'MSG' },
    rightData: { fieldType: 'MSG' }
  })
  // 新增子规则，重置 changeRuleInfo() 方法 return 标识为 false（源注释）
  changeRuleRtnFlag = false
}

/** 删除（源 handleDecisionRuleDel：更新 assignSeq 并重排，防止误清空其它子规则） */
const handleDecisionRuleDel = (index) => {
  regulatorChilds.value.splice(index, 1)
  regulatorChilds.value.forEach((val) => {
    if (val.assignSeq > index) {
      val.assignSeq = val.assignSeq - 1
    }
  })
  sortByKey(regulatorChilds.value, 'assignSeq')
  mdyChangeRuleRtnFlag()
}

/** 设置 changeRuleInfo 直接 return 标识（源 mdyChangeRuleRtnFlag） */
const mdyChangeRuleRtnFlag = () => {
  changeRuleRtnFlag = regulatorChilds.value.length > 0
}

/** 上移（源 handleChildUp） */
const handleChildUp = (index) => {
  const currentObj = regulatorChilds.value.find((p) => p.assignSeq === index)
  if (currentObj == null) return
  const changeObj = regulatorChilds.value[index - 1]
  if (changeObj == null) return
  mdyChangeRuleRtnFlag()
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
  mdyChangeRuleRtnFlag()
  const currentSeq = currentObj.assignSeq
  const changeSeq = changeObj.assignSeq
  currentObj.assignSeq = changeSeq
  changeObj.assignSeq = currentSeq
  sortByKey(regulatorChilds.value, 'assignSeq')
}

/** 排序（源 sort） */
const sort = (type) => {
  if (type === 'asc') {
    regulatorChilds.value.sort((a, b) => a.assignSeq > b.assignSeq)
  } else if (type === 'dsc') {
    regulatorChilds.value.sort((a, b) => a.assignSeq < b.assignSeq)
  }
}

/**
 * 类处理器联动（源 changeRuleInfo）：
 * 真实接口 GET /configuation/regulatorinfo/config/queryByClassName（参数 {systemName, className}），
 * 按返回 sourceAcct/targetAcct 初始化输入/输出数据集，regulatorInfoParams 初始化处理器参数
 */
const changeRuleInfo = async (index) => {
  if (changeRuleRtnFlag) return
  const child = regulatorChilds.value[index]
  if (!child || !child.subRegulatorRule) return
  const className = child.subRegulatorRule.className
  child.regulatorInfo = { sourceAcct: 0, targetAcct: 0, regulatorInfoParams: [] }
  if (className === undefined || className === '') return
  child.subRegulatorRule.regulatorParam = []
  child.subRegulatorRule.regulatorSources = []
  child.subRegulatorRule.regulatorTargets = []
  const res = await getRuleInfoByClassName({ systemName: systemName.value, className })
  if (res.success && res.result != null) {
    child.regulatorInfo = res.result
    child.regulatorInfo.regulatorClassName = res.result.className
    child.regulatorInfo.regulatorClassPath = res.result.classPath
    child.subRegulatorRule.regulatorInfo = child.regulatorInfo
    if (child.regulatorInfo.sourceAcct > 0) {
      const sourceDataSets = []
      for (let i = 0; i < child.regulatorInfo.sourceAcct; i++) {
        sourceDataSets.push({ fieldIndex: i, fieldType: 'MSG', sourceType: 'SOURCE' })
      }
      child.subRegulatorRule.regulatorSources = sourceDataSets
    }
    if (child.regulatorInfo.targetAcct > 0) {
      const targetDataSets = []
      for (let i = 0; i < child.regulatorInfo.targetAcct; i++) {
        targetDataSets.push({ fieldIndex: i, fieldType: 'MSG', sourceType: 'TARGET' })
      }
      child.subRegulatorRule.regulatorTargets = targetDataSets
    }
    if (child.regulatorInfo.regulatorInfoParams != null && child.regulatorInfo.regulatorInfoParams.length > 0) {
      // 与源差异：defaultValue 为对象（{value:''}），保证 FIXED 内联输入可写回
      child.subRegulatorRule.regulatorParam = child.regulatorInfo.regulatorInfoParams.map((val) => ({
        paramName: val.paramName,
        fieldType: val.dataType,
        defaultValue: val.paramDefaultValue || { value: '' }
      }))
    }
  }
  if (res.returnCode === '510') {
    EPMessageTips('warning', res.returnMsg || '查询类处理器失败')
  }
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
.j-sub-list-regulator-list {
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
.title-tip {
  color: red;
  margin-left: 6px;
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
.child-card {
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
  align-items: flex-start;
  gap: 8px;
}
.action-btns {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.col-mid {
  flex: 1.2;
  min-width: 0;
}
.col-right {
  flex: 1;
  min-width: 0;
}
.sub-title {
  width: 100%;
  background-color: #ebebeb;
  height: 26px;
  line-height: 26px;
  padding-left: 8px;
  font-size: 12px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.85);
  margin: 10px 0 6px;
}
.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.param-name-tag {
  flex-shrink: 0;
  min-width: 90px;
  text-align: center;
  padding: 5px 10px;
  background: #f0f2f5;
  border-radius: 2px;
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.param-type-select {
  width: 130px;
  flex-shrink: 0;
}
.error-info-row {
  display: flex;
  gap: 8px;
}
.dataset-item {
  margin-bottom: 10px;
}
.dataset-item .ep-select,
.dataset-item .ep-input {
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
