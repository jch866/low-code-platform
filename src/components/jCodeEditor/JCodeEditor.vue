<template>
  <!-- 迁移自 Vue2 工程 frog-payadmin-vue的副本/src/components/jeecg/JCodeEditor.vue（轻量版）
       与源差异：ep- 库无代码编辑器，不引入 codemirror，改为 等宽字体 textarea + 左侧行号列 + 全屏切换 + 顶部语言标签；
       props 接口对齐源（v-model/language/lineNumbers/fullScreen），无语法高亮/fold 折叠能力（foldable 入参保留但未启用） -->
  <div :class="['j-code-editor', { 'full-screen': fullCoder }]" :style="fullCoder ? { zIndex } : {}">
    <!-- 顶部栏：language 标签 + languageChange 时的语言下拉 + 全屏切换（与源差异：源全屏图标 hover 显现于右上角，
         此处常显于顶部栏右侧，避免遮挡首行代码） -->
    <div class="editor-toolbar">
      <ep-select
        v-if="languageChange"
        v-model="currentMode"
        class="code-mode-select"
        placeholder="请选择语言"
        @change="changeMode"
      >
        <ep-option v-for="mode in modes" :key="mode.value" :label="mode.label" :value="mode.value" />
      </ep-select>
      <span v-else-if="modeLabel" class="language-tag">{{ modeLabel }}</span>
      <span class="toolbar-spring" />
      <span
        v-if="fullScreen"
        class="full-screen-toggle"
        :title="fullCoder ? '退出全屏' : '全屏'"
        @click="fullCoder = !fullCoder"
      >
        <ep-icon icon="ep-i-unfold-up" :size="14" />
      </span>
    </div>
    <!-- 编辑区：左侧行号列（scroll 同步）+ 等宽 textarea -->
    <div class="editor-body">
      <div v-if="lineNumbers" ref="gutterRef" class="line-numbers">
        <div v-for="n in lineCount" :key="n" class="line-no">{{ n }}</div>
      </div>
      <textarea
        ref="textareaRef"
        class="code-textarea"
        :value="modelValue"
        :placeholder="placeholderShow"
        :readonly="readOnly === true"
        spellcheck="false"
        @input="onInput"
        @scroll="onScroll"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  // 外部传入的内容（v-model，源 props.value）
  modelValue: {
    type: String,
    default: ''
  },
  // 外部传入的语法类型（如 Java/SQL，按源 modes 列表匹配展示标签）
  language: {
    type: String,
    default: null
  },
  // 是否显示语言切换下拉（源 languageChange）
  languageChange: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: null
  },
  // 显示行号（源 lineNumbers）
  lineNumbers: {
    type: Boolean,
    default: true
  },
  // 是否显示全屏切换（源 fullScreen）
  fullScreen: {
    type: Boolean,
    default: false
  },
  // 全屏 z-index（源 zIndex）
  zIndex: {
    type: [Number, String],
    default: 999
  },
  // 只读模式（源 readOnly，轻量版仅支持布尔）
  readOnly: {
    type: [Boolean, String],
    default: false
  },
  // 源 foldable（代码折叠）入参保留，轻量版无折叠能力，未启用（与源差异）
  foldable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'language-change'])

// 支持的语言列表（照搬源 modes，轻量版仅作标签/切换展示，无语法高亮）
const modes = [
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'Javascript' },
  { value: 'html', label: 'XML/HTML' },
  { value: 'x-java', label: 'Java' },
  { value: 'x-objectivec', label: 'Objective-C' },
  { value: 'x-python', label: 'Python' },
  { value: 'x-rsrc', label: 'R' },
  { value: 'x-sh', label: 'Shell' },
  { value: 'x-sql', label: 'SQL' },
  { value: 'x-swift', label: 'Swift' },
  { value: 'x-vue', label: 'Vue' },
  { value: 'markdown', label: 'Markdown' }
]

const textareaRef = ref(null)
const gutterRef = ref(null)
// code 编辑器是否全屏（源 fullCoder）
const fullCoder = ref(false)
// 当前语言（languageChange 下拉用；初始值由 language 解析）
const currentMode = ref(resolveModeValue(props.language))

/** 按源 _getLanguage：label/value 均忽略大小写匹配 */
function resolveModeValue(language) {
  if (!language) return 'javascript'
  const current = language.toLowerCase()
  const mode = modes.find(
    (m) => m.label.toLowerCase() === current || m.value.toLowerCase() === current
  )
  return mode ? mode.value : 'javascript'
}

/** 顶部语言标签（源 language watch → mode=label） */
const modeLabel = computed(() => {
  const mode = modes.find((m) => m.value === currentMode.value)
  return mode ? mode.label : ''
})

/** 占位文案（源 placeholderShow：placeholder 为 null 时不出占位） */
const placeholderShow = computed(() => (props.placeholder == null ? '' : props.placeholder))

/** 行号数量（按换行计算，至少 1 行） */
const lineCount = computed(() => Math.max((props.modelValue || '').split('\n').length, 1))

/** 输入（源 coder.on('change') → emit input） */
const onInput = (e) => {
  emit('update:modelValue', e.target.value)
}

/** 行号随文本滚动同步 */
const onScroll = (e) => {
  if (gutterRef.value) {
    gutterRef.value.scrollTop = e.target.scrollTop
  }
}

/** 语言切换（源 changeMode：emit language-change 回传小写 label） */
const changeMode = (val) => {
  const mode = modes.find((m) => m.value === val)
  if (mode) {
    emit('language-change', mode.label.toLowerCase())
  }
}

/** 以下方法对齐源组件对外 API（getCodeContent/setCodeContent/resetCodeContent） */
const getCodeContent = () => props.modelValue
const setCodeContent = (val) => {
  emit('update:modelValue', val || '')
}
const resetCodeContent = () => {
  emit('update:modelValue', '')
}

defineExpose({
  getCodeContent,
  setCodeContent,
  resetCodeContent
})
</script>

<style scoped>
.j-code-editor {
  position: relative;
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
}
/* 全屏样式（照搬源 .full-screen-parent.full-screen） */
.j-code-editor.full-screen {
  position: fixed;
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  padding: 10px;
  background-color: #f5f5f5;
}
.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}
.language-tag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 12px;
  line-height: 20px;
  color: #1890ff;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 10px;
}
.code-mode-select {
  width: 150px;
}
.toolbar-spring {
  flex: 1;
}
.full-screen-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
}
.full-screen-toggle:hover {
  color: #1890ff;
  background: #e6f7ff;
}
.editor-body {
  display: flex;
  height: 220px;
  overflow: hidden;
}
.j-code-editor.full-screen .editor-body {
  height: calc(100% - 34px);
}
/* 左侧行号列（等宽字体 + 右分隔线） */
.line-numbers {
  flex-shrink: 0;
  width: 36px;
  padding: 8px 0;
  overflow: hidden;
  text-align: center;
  color: #999;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 20px;
  background: #fafafa;
  border-right: 1px solid #ebeef5;
  user-select: none;
}
/* 等宽编辑区（源 CodeMirror 等价） */
.code-textarea {
  flex: 1;
  padding: 8px 12px;
  border: 0;
  outline: none;
  resize: vertical;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 20px;
  color: #333;
}
.j-code-editor.full-screen .code-textarea {
  resize: none;
  height: 100%;
}
</style>
