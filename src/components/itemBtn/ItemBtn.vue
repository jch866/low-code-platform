<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/param/ItemBtn.vue
       （源为独立组件：内嵌两个 JSelectRegulator 单选规则选择器，分别写回校验处理器 validatorRegulator / 格式化处理器 formatorRegulator，
       两个值都是 regulatorId（JSelectRegulator 默认返回 regulatorId），语义照搬源。
       取舍说明：源为独立组件，按源结构迁移至 src/components/itemBtn/ 而非给 jSelectRegulator 加 type prop） -->
  <!-- 与源差异：源在消费方由 a-popover（LC0832 设置数据校验）承载触发，此处改为内联两行选择器（行内编辑场景弹层易遮挡） -->
  <div class="item-btn-card">
    <!-- 原 j-select-regulator :placeholder="$t('LC.LC0904')" 数据校验，v-model=regulatorValidate → update:regulatorValidateProps -->
    <JSelectRegulator
      v-model="regulatorValidate"
      class="item-btn-row"
      :multiple="false"
      :disabled="disabled"
      placeholder="数据校验"
    />
    <!-- 原 j-select-regulator :placeholder="$t('LC.LC0905')" 数据格式化，v-model=regulatorFormat → update:regulatorFormatProps -->
    <JSelectRegulator
      v-model="regulatorFormat"
      class="item-btn-row"
      :multiple="false"
      :disabled="disabled"
      placeholder="数据格式化"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import JSelectRegulator from '@/components/jSelectRegulator/JSelectRegulator.vue'

// props 命名对齐源（regulatorValidateProps/regulatorFormatProps + update 事件，等价源 .sync）
const props = defineProps({
  // 校验处理器（源 regulatorValidateProps，写回 validatorRegulator 字段）
  regulatorValidateProps: {
    type: String,
    default: ''
  },
  // 格式化处理器（源 regulatorFormatProps，写回 formatorRegulator 字段）
  regulatorFormatProps: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:regulatorValidateProps', 'update:regulatorFormatProps'])

// 本地副本 + 双向 watch（与源 created/mounted 拷贝 + watch 回写 .sync 数据流一致）
const regulatorValidate = ref('')
const regulatorFormat = ref('')

watch(
  () => [props.regulatorValidateProps, props.regulatorFormatProps],
  ([validate, format]) => {
    regulatorValidate.value = validate || ''
    regulatorFormat.value = format || ''
  },
  { immediate: true }
)

watch(regulatorValidate, (val) => {
  // 设置监听，如果改变就更新 p_model（源注释）
  if (val === (props.regulatorValidateProps || '')) return
  emit('update:regulatorValidateProps', val)
})

watch(regulatorFormat, (val) => {
  // 设置监听，如果改变就更新 p_model（源注释）
  if (val === (props.regulatorFormatProps || '')) return
  emit('update:regulatorFormatProps', val)
})
</script>

<style scoped>
/* 与源差异：源 .item-btn-card 为 popover 内绝对定位卡片，此处改为行内纵向两行选择器 */
.item-btn-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}
.item-btn-row {
  width: 100%;
}
</style>
