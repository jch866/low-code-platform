<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/result/ValidateResult.vue（多决策/合并 校验结果） -->
  <!-- 与源差异：原校验结果按 resultAction 分支内嵌 MsgData/CTXData/RedisData/RefMsgData/TableData 组件，均为深层选择器，此处以只读输入框占位 -->
  <ep-card class="j-validate-result">
    <div class="result-row">
      <!-- 校验结果（LC0859：0 校验成功 / 1 校验失败） -->
      <div class="result-item result-select">
        <ep-select v-model="resultRuleParam.result" placeholder="校验结果" :disabled="disabled">
          <ep-option label="校验成功" value="0" />
          <ep-option label="校验失败" value="1" />
        </ep-select>
      </div>
      <!-- 文本内容信息（LC0862） -->
      <div class="result-item result-val">
        <ep-input v-model="resultRuleParam.resultVal" placeholder="请输入文本内容信息" :disabled="disabled" type="text" />
      </div>
      <!-- 结果处理类型（原 j-dict-select-tag dictCode=regulator_field_type） -->
      <div class="result-item result-action">
        <ep-select v-model="resultRuleParam.resultAction" placeholder="请选择目标数据类型" :disabled="disabled">
          <ep-option
            v-for="opt in REGULATOR_FIELD_TYPE_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </ep-select>
      </div>
      <!-- 结果处理参数 -->
      <div class="result-item result-param">
        <!-- 各类型深层选择器占位（原组件与字段名见占位文案与 ruleConstants.SELECTOR_PLACEHOLDER_MAP） -->
        <ep-input
          v-if="['MSG', 'CTX', 'REDIS', 'REF_MSG', 'TABLE'].includes(resultRuleParam.resultAction)"
          :model-value="paramBrief(resultRuleParam.resultParam)"
          readonly
          :disabled="disabled"
          :placeholder="selectorPlaceholder(resultRuleParam.resultAction)"
          type="text"
        />
        <div v-else class="unsupported-tip">不支持</div>
      </div>
    </div>
  </ep-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { REGULATOR_FIELD_TYPE_OPTIONS, selectorPlaceholder } from './ruleConstants'

const props = defineProps({
  // 校验结果对象（源 resultRuleParamProps，modal resultRule：{result, resultVal, resultAction, resultParam}）
  resultRuleParamProps: { type: Object, default: () => ({}) },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:resultRuleParamProps'])

// 本地副本 + 双向 watch（与源 created/mounted 拷贝 + watch 回写一致）；
// 与源差异：补齐源默认结构（result/resultVal/resultAction/resultParam），保证 v-model 可写回
const resultRuleParam = ref({})

watch(
  () => props.resultRuleParamProps,
  (v) => {
    const param = v || {}
    if (param.result === undefined) param.result = ''
    if (param.resultVal === undefined) param.resultVal = ''
    if (param.resultAction === undefined) param.resultAction = ''
    if (!param.resultParam) param.resultParam = {}
    resultRuleParam.value = param
  },
  { immediate: true }
)
watch(resultRuleParam, (v) => emit('update:resultRuleParamProps', v), { deep: true })

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
.j-validate-result {
  width: 100%;
}
.result-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.result-item .ep-select,
.result-item .ep-input {
  width: 100%;
}
.result-select {
  width: 160px;
  flex-shrink: 0;
}
.result-val {
  flex: 1;
  min-width: 0;
}
.result-action {
  width: 180px;
  flex-shrink: 0;
}
.result-param {
  flex: 1;
  min-width: 0;
}
.unsupported-tip {
  color: #909399;
  text-align: center;
}
</style>
