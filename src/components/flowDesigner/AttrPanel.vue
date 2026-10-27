<template>
  <div class="attr-panel">
    <div class="panel-title">属性面板</div>

    <!-- 流程属性 -->
    <div v-if="!selectedNode && !selectedEdge" class="attr-section">
      <div class="section-title">流程信息</div>
      <ep-form :model="flowAttr" label-width="80px" size="small">
        <ep-form-item label="名称">
          <ep-input v-model="flowAttr.name" placeholder="请输入流程名称" />
        </ep-form-item>
        <ep-form-item label="编码">
          <ep-input v-model="flowAttr.code" placeholder="请输入流程编码" />
        </ep-form-item>
        <ep-form-item label="状态">
          <ep-select v-model="flowAttr.status">
            <ep-option label="草稿" value="DRAFT" />
            <ep-option label="已发布" value="PUBLISHED" />
          </ep-select>
        </ep-form-item>
      </ep-form>
    </div>

    <!-- 节点属性 -->
    <div v-else-if="selectedNode" class="attr-section">
      <div class="section-title">
        节点属性
        <span class="type-tag">{{ nodeTypeLabel }}</span>
      </div>
      <ep-form :model="nodeAttr" label-width="80px" size="small">
        <ep-form-item label="ID">
          <ep-input v-model="nodeAttr.id" disabled />
        </ep-form-item>
        <ep-form-item label="类型">
          <ep-input :value="nodeTypeLabel" disabled />
        </ep-form-item>
        <ep-form-item label="名称">
          <ep-input v-model="nodeAttr.text" placeholder="请输入节点名称" />
        </ep-form-item>
        <ep-form-item label="位置 X">
          <ep-input-number v-model="nodeAttr.x" :min="0" :step="10" />
        </ep-form-item>
        <ep-form-item label="位置 Y">
          <ep-input-number v-model="nodeAttr.y" :min="0" :step="10" />
        </ep-form-item>
        <ep-form-item label="宽度">
          <ep-input-number v-model="nodeAttr.width" :min="40" :step="10" />
        </ep-form-item>
        <ep-form-item label="高度">
          <ep-input-number v-model="nodeAttr.height" :min="30" :step="10" />
        </ep-form-item>
      </ep-form>
    </div>

    <!-- 连线属性 -->
    <div v-else-if="selectedEdge" class="attr-section">
      <div class="section-title">连线属性</div>
      <ep-form :model="edgeAttr" label-width="80px" size="small">
        <ep-form-item label="ID">
          <ep-input v-model="edgeAttr.id" disabled />
        </ep-form-item>
        <ep-form-item label="标签">
          <ep-input v-model="edgeAttr.text" placeholder="连线标签（可选）" />
        </ep-form-item>
        <ep-form-item label="源节点">
          <ep-input :value="edgeAttr.sourceNodeId" disabled />
        </ep-form-item>
        <ep-form-item label="目标节点">
          <ep-input :value="edgeAttr.targetNodeId" disabled />
        </ep-form-item>
      </ep-form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { NODE_TYPE_LABEL } from './adapter'

const props = defineProps({
  selectedNode: { type: Object, default: null },
  selectedEdge: { type: Object, default: null },
  flowInfo: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:flowInfo', 'update:selectedNode', 'update:selectedEdge'])

const flowAttr = reactive({
  name: props.flowInfo?.name || '',
  code: props.flowInfo?.code || '',
  status: props.flowInfo?.status || 'DRAFT'
})

const nodeAttr = reactive({
  id: '',
  type: '',
  text: '',
  x: 0,
  y: 0,
  width: 80,
  height: 60
})

const edgeAttr = reactive({
  id: '',
  text: '',
  sourceNodeId: '',
  targetNodeId: ''
})

const nodeTypeLabel = computed(() => {
  if (!props.selectedNode) return ''
  return NODE_TYPE_LABEL[props.selectedNode.type] || props.selectedNode.type
})

// 同步 flowInfo 变化
watch(
  () => props.flowInfo,
  (val) => {
    Object.assign(flowAttr, {
      name: val?.name || '',
      code: val?.code || '',
      status: val?.status || 'DRAFT'
    })
  },
  { deep: true }
)

// flowAttr → emit
watch(
  flowAttr,
  (val) => emit('update:flowInfo', { ...props.flowInfo, ...val }),
  { deep: true }
)

// selectedNode → nodeAttr
watch(
  () => props.selectedNode,
  (node) => {
    if (node) {
      Object.assign(nodeAttr, {
        id: node.id,
        type: node.type,
        text: node.text?.value || '',
        x: node.x,
        y: node.y,
        width: node.width || 80,
        height: node.height || 60
      })
    }
  },
  { immediate: true, deep: true }
)

// nodeAttr → emit
watch(
  nodeAttr,
  (val) => {
    if (props.selectedNode) {
      emit('update:selectedNode', {
        ...props.selectedNode,
        x: val.x,
        y: val.y,
        width: val.width,
        height: val.height,
        text: { value: val.text }
      })
    }
  },
  { deep: true }
)

// selectedEdge → edgeAttr
watch(
  () => props.selectedEdge,
  (edge) => {
    if (edge) {
      Object.assign(edgeAttr, {
        id: edge.id,
        text: edge.text?.value || '',
        sourceNodeId: edge.sourceNodeId,
        targetNodeId: edge.targetNodeId
      })
    }
  },
  { immediate: true, deep: true }
)

// edgeAttr → emit
watch(
  edgeAttr,
  (val) => {
    if (props.selectedEdge) {
      emit('update:selectedEdge', {
        ...props.selectedEdge,
        text: { value: val.text }
      })
    }
  },
  { deep: true }
)
</script>

<style scoped>
.attr-panel {
  width: 240px;
  height: 100%;
  background: #fafafa;
  border-left: 1px solid var(--ep-border-color-lighter);
  overflow-y: auto;
}
.panel-title {
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--ep-border-color-lighter);
  background: #fff;
}
.attr-section {
  padding: 16px;
}
.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.type-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--ep-color-primary);
  color: #fff;
  font-weight: normal;
}
</style>
