<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/single/SingleRule.vue（单决策/单渲染 数据集配置） -->
  <div class="j-single-rule">
    <!-- 源数据区块（LC0852） -->
    <div v-if="sourceDataSets.length" class="dataset-block">
      <div class="dataset-title">源数据</div>
      <div
        v-for="(item, index) in sourceDataSets"
        :key="'source' + index"
        class="dataset-card"
      >
        <div class="dataset-head">
          <!-- 与源差异：原 a-popover 内嵌 ItemBtn（j-select-regulator 校验 validatorRegulator/格式化 formatorRegulator 选择器）为深层选择器，以只读输入框占位 -->
          <ep-input
            :model-value="
              (item.validatorRegulator || '') + (item.formatorRegulator || '')
            "
            readonly
            :disabled="disabled"
            placeholder="选择器待迁移：ItemBtn（validatorRegulator/formatorRegulator）"
            class="item-btn-input"
          />
          <span class="index-tag">{{ index }}</span>
          <!-- 原 j-dict-select-tag dictCode=regulator_field_type -->
          <ep-select
            v-model="item.fieldType"
            placeholder="请选择源数据类型"
            :disabled="disabled"
            class="field-type-select"
            @change="onFieldTypeChange(item)"
          >
            <ep-option
              v-for="opt in REGULATOR_FIELD_TYPE_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </ep-select>
        </div>
        <div class="dataset-body">
          <!-- FIXED：原 FixedData 即纯文本输入（绑定 params.value），原样内联实现 -->
          <ep-input
            v-if="item.fieldType === 'FIXED'"
            v-model="item.params.value"
            :disabled="disabled"
            placeholder="请输入文本内容信息"
            type="text"
          />
          <!-- 其余类型：深层选择器占位（原组件名与字段名见占位文案与 ruleConstants.SELECTOR_PLACEHOLDER_MAP） -->
          <ep-input
            v-else
            :model-value="paramBrief(item.params)"
            readonly
            :disabled="disabled"
            :placeholder="selectorPlaceholder(item.fieldType)"
            type="text"
          />
        </div>
      </div>
    </div>

    <!-- 目标数据区块（LC0853） -->
    <div v-if="targetDataSets.length" class="dataset-block">
      <div class="dataset-title">目标数据</div>
      <div
        v-for="(item, index) in targetDataSets"
        :key="'target' + index"
        class="dataset-card"
      >
        <div class="dataset-head">
          <!-- 与源差异：原 a-popover 内嵌 ItemBtn 同源数据区块，以只读输入框占位 -->
          <ep-input
            :model-value="
              (item.validatorRegulator || '') + (item.formatorRegulator || '')
            "
            readonly
            :disabled="disabled"
            placeholder="选择器待迁移：ItemBtn（validatorRegulator/formatorRegulator）"
            class="item-btn-input"
          />
          <span class="index-tag">{{ index }}</span>
          <ep-select
            v-model="item.fieldType"
            placeholder="请选择目标数据类型"
            :disabled="disabled"
            class="field-type-select"
            @change="onFieldTypeChange(item)"
          >
            <ep-option
              v-for="opt in REGULATOR_FIELD_TYPE_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </ep-select>
        </div>
        <div class="dataset-body">
          <ep-input
            v-if="item.fieldType === 'FIXED'"
            v-model="item.params.value"
            :disabled="disabled"
            placeholder="请输入文本内容信息"
            type="text"
          />
          <ep-input
            v-else
            :model-value="paramBrief(item.params)"
            readonly
            :disabled="disabled"
            :placeholder="selectorPlaceholder(item.fieldType)"
            type="text"
          />
        </div>
      </div>
    </div>

    <!-- 处理参数区块（LC0854，源由类处理器 changeRuleInfo 按 regulatorInfoParams 生成） -->
    <div v-if="extendParams.length" class="dataset-block">
      <div class="dataset-title">处理参数</div>
      <div
        v-for="(item, index) in extendParams"
        :key="'param' + index"
        class="dataset-card"
      >
        <div class="dataset-head">
          <span class="index-tag">{{ index }}</span>
          <span class="param-name-tag">{{ item.paramName }}</span>
          <!-- 原 a-select 仅两种类型：固定数据/数据字典（LC0797/LC0798） -->
          <ep-select
            v-model="item.fieldType"
            placeholder="请选择参数名称"
            :disabled="disabled"
            class="field-type-select"
            @change="onFieldTypeChange(item)"
          >
            <ep-option
              v-for="opt in EXT_PARAM_TYPE_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </ep-select>
        </div>
        <div class="dataset-body">
          <!-- FIXED：原 FixedData 内联（绑定 defaultValue.value） -->
          <ep-input
            v-if="item.fieldType === 'FIXED'"
            v-model="item.defaultValue.value"
            :disabled="disabled"
            placeholder="请输入文本内容信息"
            type="text"
          />
          <!-- DICT：原 DictData（j-select-dict 数据字典选择器）深层选择器占位 -->
          <ep-input
            v-else
            :model-value="paramBrief(item.defaultValue)"
            readonly
            :disabled="disabled"
            placeholder="选择器待迁移：DictData（fetchType/dictType/dictValue，j-select-dict）"
            type="text"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  REGULATOR_FIELD_TYPE_OPTIONS,
  EXT_PARAM_TYPE_OPTIONS,
  selectorPlaceholder,
  ensureParams
} from './ruleConstants'

// props 命名对齐源（*Param/*Ext + update 事件，等价源 .sync）
const props = defineProps({
  // 处理参数（源 extendParamsExt，由类处理器联动生成）
  extendParamsExt: { type: Array, required: true, default: () => [] },
  // 源数据集（源 sourceDataSetsParam，modal regulatorSources）
  sourceDataSetsParam: { type: Array, required: true, default: () => [] },
  // 目标数据集（源 targetDataSetsParam，modal regulatorTargets）
  targetDataSetsParam: { type: Array, required: true, default: () => [] },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits([
  'update:sourceDataSetsParam',
  'update:targetDataSetsParam',
  'update:extendParamsExt'
])

// 本地副本 + 双向 watch（与源 mounted 拷贝 + watch 回写 .sync 数据流一致）；与源差异：回显时补齐 params 对象，避免 FIXED 内联输入空引用
const sourceDataSets = ref([])
const targetDataSets = ref([])
const extendParams = ref([])
const normalizeDataSet = (list) => {
  ;(list || []).forEach((item) => ensureParams(item))
  return list
}
watch(() => props.sourceDataSetsParam, (v) => { sourceDataSets.value = normalizeDataSet(v) }, { immediate: true })
watch(sourceDataSets, (v) => emit('update:sourceDataSetsParam', v), { deep: true })
watch(() => props.targetDataSetsParam, (v) => { targetDataSets.value = normalizeDataSet(v) }, { immediate: true })
watch(targetDataSets, (v) => emit('update:targetDataSetsParam', v), { deep: true })
watch(
  () => props.extendParamsExt,
  (v) => {
    ;(v || []).forEach((item) => {
      if (!item.defaultValue) item.defaultValue = {}
    })
    extendParams.value = v
  },
  { immediate: true }
)
watch(extendParams, (v) => emit('update:extendParamsExt', v), { deep: true })

/** 切换字段类型时补齐 params（源依赖回显数据自带 params，此处防御性初始化，与源差异） */
const onFieldTypeChange = (item) => {
  ensureParams(item)
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
.j-single-rule {
  width: 100%;
}
.dataset-block {
  margin-bottom: 12px;
}
.dataset-title {
  font-weight: 900;
  background-color: #ebebeb;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}
.dataset-card {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}
.dataset-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.dataset-head .item-btn-input {
  flex: 1;
  min-width: 0;
}
.dataset-head .field-type-select {
  flex: 1;
  min-width: 0;
}
.dataset-body {
  display: flex;
}
.dataset-body .ep-input {
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
.param-name-tag {
  flex-shrink: 0;
  min-width: 100px;
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
</style>
