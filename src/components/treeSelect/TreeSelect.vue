<template>
  <!-- 替代 a-tree-select（ep 组件库无 tree-select）：readonly ep-input 回显节点名 + ep-popover 内嵌 ep-tree 单选 -->
  <ep-popover
    v-model="popoverVisible"
    trigger="click"
    effect="light"
    :disabled="disabled"
    placement="bottom"
  >
    <template #reference>
      <ep-input
        :model-value="selectedLabel"
        readonly
        :disabled="disabled"
        :placeholder="placeholder"
      >
        <!-- 与源差异：源 a-tree-select 未开 allowClear，此处为非禁用态提供 × 清空（便于取消上级交易），禁用态不显示 -->
        <template #suffix>
          <span
            v-if="modelValue && !disabled"
            class="clear-icon"
            title="清空"
            @click.stop="onClear"
          >×</span>
        </template>
      </ep-input>
    </template>
    <div class="tree-select-pop">
      <!-- 单选树：highlight-current 高亮 + default-expand-all 展开；点击节点即选中并关闭浮层 -->
      <ep-tree
        ref="treeRef"
        :data="treeData"
        node-key="key"
        :props="{ label: 'title', children: 'children' }"
        highlight-current
        default-expand-all
        @node-click="onNodeClick"
      />
    </div>
  </ep-popover>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  // v-model 值：树节点 key（源 a-tree-select v-model=model.parentId，即节点 key=交易记录主键；回显走节点 title）
  modelValue: {
    type: String,
    default: ''
  },
  // 树数据（节点结构 {key, title, children}，与源 queryTransList/queryIdTree 返回一致）
  treeData: {
    type: Array,
    default: () => []
  },
  // 占位文案
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否禁用（源 PayList 基本信息页签 disable 恒为 true，仅作回显展示）
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const popoverVisible = ref(false)
const treeRef = ref(null)

/** 按 key 递归查找节点（回显 title） */
const findNode = (nodes, key) => {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.children && node.children.length) {
      const found = findNode(node.children, key)
      if (found) return found
    }
  }
  return null
}

/** 选中节点名称（未命中时与 a-tree-select 一致回退显示 key） */
const selectedLabel = computed(() => {
  if (!props.modelValue) return ''
  const node = findNode(props.treeData, props.modelValue)
  return node ? node.title : props.modelValue
})

/** 点击节点（单选：写入节点 key 并关闭浮层） */
const onNodeClick = (data) => {
  emit('update:modelValue', data.key)
  popoverVisible.value = false
}

/** 清空选择 */
const onClear = () => {
  emit('update:modelValue', '')
}

// 打开浮层时定位当前选中节点（高亮回显）
watch(popoverVisible, (val) => {
  if (val && props.modelValue) {
    nextTick(() => {
      treeRef.value?.setCurrentKey(props.modelValue)
    })
  }
})
</script>

<style scoped>
.tree-select-pop {
  width: 280px;
  max-height: 220px;
  overflow: auto;
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
