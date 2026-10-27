<template>
  <div class="j-select-project-by-dep">
    <!-- 原 a-input-search(v-model=projectNames, enterButton)：readonly 输入框展示已选项目名 + 「选择项目」按钮 -->
    <!-- 组件库 ep-input 的 clearable 清除图标在 readonly 时不渲染（showClear 排除 readonly），故用 suffix 插槽自实现清除 -->
    <ep-input
      :model-value="projectNames"
      readonly
      :placeholder="'请选择项目'"
      @click="openModal"
    >
      <template #suffix>
        <span
          v-if="projectNames"
          class="clear-icon"
          @click.stop="onClear"
        >×</span>
      </template>
    </ep-input>
    <!-- LC0656 选择{name}，name=LC0412 项目 → 「选择项目」 -->
    <ep-button :disabled="disabled" @click="openModal">选择项目</ep-button>

    <JSelectProjectByDepModal
      ref="modalRef"
      :modal-width="modalWidth"
      :multi="multi"
      :user-own="userOwn"
      @ok="selectOK"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JSelectProjectByDepModal from './JSelectProjectByDepModal.vue'

const props = defineProps({
  // v-model 值：逗号拼接的 projectCode（注意不是 id，与源实现一致）
  modelValue: {
    type: String,
    default: ''
  },
  // 弹窗宽度（原 a-modal width，默认 1250）
  modalWidth: {
    type: Number,
    default: 1250
  },
  // 「选择项目」按钮禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否多选（true→checkbox / false→radio）
  multi: {
    type: Boolean,
    default: true
  },
  // 是否仅查询当前用户有权限的部门（原 userOwn）
  userOwn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// 输入框展示的已选项目名（逗号拼接 projectName）
const projectNames = ref('')
const modalRef = ref(null)

const openModal = () => {
  modalRef.value?.showModal()
}

/** 确认回调（原 selectOK：rows 拼接 projectName 用于展示，projectCodes(逗号拼接 projectCode) 作为 v-model 提交） */
const selectOK = (rows, projectCodes) => {
  if (!rows || !rows.length) {
    projectNames.value = ''
    emit('update:modelValue', '')
  } else {
    projectNames.value = rows.map((item) => item.projectName).join(',')
    emit('update:modelValue', projectCodes)
  }
}

/** 清空选择（suffix × 图标） */
const onClear = () => {
  projectNames.value = ''
  emit('update:modelValue', '')
}

// 说明（与源实现差异）：原组件经 modal watch projectIds → initUserNames → emit('initComp') 往返回显项目名，
// 且该回显仅匹配弹窗当前页 dataSource（跨页/跨次打开基本失效）。此处简化：选中后外壳直接在 ok 回调持有项目名，
// 不再走 initComp 往返；外层已有 projectCode 回显时输入框暂不显示项目名。
</script>

<style scoped>
.j-select-project-by-dep {
  display: flex;
  gap: 8px;
  align-items: center;
}
.clear-icon {
  cursor: pointer;
  font-size: 14px;
  color: #999;
  line-height: 1;
}
.clear-icon:hover {
  color: #666;
}
</style>
