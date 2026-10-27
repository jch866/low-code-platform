<template>
  <div class="j-select-service">
    <!-- 原 a-input(v-model=transNames, readOnly) @click=openModal：readonly 输入框展示已选业务名称，点击打开弹窗 -->
    <!-- 组件库 ep-input 的 clearable 清除图标在 readonly 时不渲染（showClear 排除 readonly），故用 suffix 插槽自实现清除（原 suffix close-circle 图标） -->
    <ep-input
      :model-value="transNames"
      readonly
      :disabled="disabled"
      :placeholder="'请选择业务名称'"
      @click="openModal"
    >
      <template #suffix>
        <span
          v-if="transNames && !onlyView"
          class="clear-icon"
          title="清空"
          @click.stop="handleEmpty"
        >×</span>
      </template>
    </ep-input>

    <JSelectServiceModal
      ref="modalRef"
      :modal-width="modalWidth"
      :multi="multi"
      :root-opened="rootOpened"
      :trans-code="modelValue"
      @ok="handleOK"
      @init-comp="initComp"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JSelectServiceModal from './JSelectServiceModal.vue'

const props = defineProps({
  // v-model 值：逗号拼接的业务模块树节点 key（源组件 modal handleSubmit → checkedKeys.join(",")，与表单 transCode 字段绑定，注意不是 id/transCode）
  modelValue: {
    type: String,
    default: ''
  },
  // 弹窗宽度（原 a-modal width，默认 500）
  modalWidth: {
    type: Number,
    default: 500
  },
  // 是否多选（true→树 checkbox 可多勾 / false→单选，原 multi）
  multi: {
    type: Boolean,
    default: false
  },
  // 是否默认展开树根节点（原 rootOpened）
  rootOpened: {
    type: Boolean,
    default: true
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 仅查看模式：隐藏清除图标（原 onlyView）
  onlyView: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 输入框展示的已选业务名称（逗号拼接 transName，由 modal initComp 回显 / ok 回调写入）
const transNames = ref('')
const modalRef = ref(null)

const openModal = () => {
  if (props.disabled) return
  modalRef.value?.showModal()
}

/** 弹窗回显（原 initComp：modal 按树 dataList 匹配 transCode 返回名称串） */
const initComp = (names) => {
  transNames.value = names
}

/** 确认回调（原 handleOK：rows 拼 transName 展示，idstr(逗号拼接节点 key) 作为 v-model 提交并 emit change） */
const handleOK = (rows, idstr) => {
  if (!rows) {
    transNames.value = ''
    emit('update:modelValue', '')
    emit('change', '')
  } else {
    let temp = ''
    for (const item of rows) {
      temp += ',' + item.transName
    }
    transNames.value = temp.substring(1)
    emit('update:modelValue', idstr)
    emit('change', idstr)
  }
}

/** 清空选择（原 handleEmpty → handleOK('')） */
const handleEmpty = () => {
  handleOK('')
}

// 说明（与源差异）：名称展示来源有二——modal 加载树后 initComp 按 transCode 匹配回显、ok 回调直接写入，
// 故不再 watch modelValue 清空（参考实现 jSelectProjectByDep 同样不做 value 回显往返）。
</script>

<style scoped>
.j-select-service {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}
.clear-icon {
  cursor: pointer;
  font-size: 14px;
  color: #ccc;
  line-height: 1;
}
.clear-icon:hover {
  color: #f5222d;
}
</style>
