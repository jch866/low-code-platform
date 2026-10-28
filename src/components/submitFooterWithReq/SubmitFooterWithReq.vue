<template>
  <!-- 迁移自 Vue2 工程 frog-payadmin-vue的副本/src/views/develop/components/biz/require/SubmitFooterWithReq.vue -->
  <!-- 原 a-spin :spinning="loading"（loading 恒为 false 未实际启用，此处不渲染 loading 态） -->
  <div class="submit-footer-with-req">
    <!-- 与源差异：需求选择原为 JSelectRequirement（开发需求列表选择器，属 B 组未迁移），
         按迁移约定降级为 requireCode 输入框直接填写需求码（placeholder=LC0768 需求名称），
         后续 B 组需求选择器迁移后替换回选择器即可，ok/cancel 事件与 developRequire 取值方式不变 -->
    <ep-input
      v-model="requireCode"
      class="require-input"
      :disabled="disabled"
      placeholder="需求名称"
    />
    <!-- 原 a-popconfirm LC0772「确定放弃编辑？」包裹取消按钮：ep 组件库无 popconfirm，直接取消（与源差异） -->
    <ep-button v-if="requireCode" class="footer-btn" @click="handleCancel">取消</ep-button>
    <ep-button
      v-if="requireCode"
      type="primary"
      :disabled="confirmLoading"
      class="footer-btn"
      @click="handleOk"
    >提交</ep-button>
    <span class="require-hint">[ 数据新建或者修改，请先指定具体关联需求 ]</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // 提交 loading 态（原 confirmLoading，true 时禁用提交按钮）
  confirmLoading: {
    type: Boolean,
    default: false
  },
  // 外部传入需求码（原 requireCodeParam，编辑态传 model.developRequire，传入后输入框禁用）
  requireCodeParam: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['ok', 'cancel'])

// 需求码与输入框禁用态（原 requireCode/disabled）
const requireCode = ref('')
const disabled = ref(true)

// 原 watch requireCodeParam（immediate）：有传入值则回显并禁用；
// 无传入值时原从 vuex developReqm getter 取默认需求码——子应用无该 vuex 模块，置空并允许输入（与源差异）
watch(
  () => props.requireCodeParam,
  (val) => {
    requireCode.value = val
    disabled.value = true
    if (!requireCode.value) {
      requireCode.value = ''
      disabled.value = false
    }
  },
  { immediate: true }
)

/** 提交（原 handleOk：emit ok，由父页面执行校验与提交） */
const handleOk = () => {
  emit('ok')
}

/** 取消（原 handleCancel：emit cancel，由父页面关闭弹窗/抽屉） */
const handleCancel = () => {
  emit('cancel')
}

// 暴露 requireCode/disabled：父页面提交时读取（原 formData.developRequire = this.$refs.reqSelect.requireCode）
defineExpose({
  requireCode,
  disabled
})
</script>

<style scoped>
.submit-footer-with-req {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.require-input {
  width: 320px;
  text-align: left;
}
.footer-btn {
  margin-left: 12px;
  margin-right: 12px;
}
/* 原 <br/> + darkred 红字提示（LC0773），独占一行 */
.require-hint {
  flex-basis: 100%;
  margin-top: 4px;
  color: darkred;
}
</style>
