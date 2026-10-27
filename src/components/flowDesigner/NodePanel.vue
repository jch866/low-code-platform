<template>
  <div class="node-panel">
    <div class="panel-title">节点库</div>

    <div v-for="group in nodeGroups" :key="group.title" class="node-group">
      <div class="group-title">{{ group.title }}</div>
      <div class="group-items">
        <div
          v-for="node in group.items"
          :key="node.type"
          class="node-item"
          :draggable="true"
          @dragstart="onDragStart($event, node)"
          @dragend="onDragEnd"
        >
          <div class="node-icon" :style="{ background: node.color }">
            <svg v-if="node.icon" v-html="node.icon" />
            <ep-icon v-else icon="ep-i-box" :size="16" />
          </div>
          <div class="node-label">{{ node.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * LogicFlow 的 BPMN 节点不能直接用 Vue 拖拽 → canvas 方式，
 * 这里用 LogicFlow 原生的 DndPanel 插件思路简化版：
 * 点击节点 → 画布自动添加到中央位置
 * （完整版拖拽逻辑在 FlowDesigner 中通过 LF.extension.dndPanel 实现）
 */

const emit = defineEmits(['node-click'])

const nodeGroups = [
  {
    title: '开始/结束',
    items: [
      { type: 'startEvent', label: '开始事件', color: '#52c41a' },
      { type: 'endEvent', label: '结束事件', color: '#ff4d4f' }
    ]
  },
  {
    title: '任务',
    items: [
      { type: 'userTask', label: '人工任务', color: '#1890ff' },
      { type: 'serviceTask', label: '自动任务', color: '#722ed1' }
    ]
  },
  {
    title: '网关/事件',
    items: [
      { type: 'exclusiveGateway', label: '网关', color: '#fa8c16' },
      { type: 'intermediateCatchEvent', label: '事件', color: '#13c2c2' }
    ]
  },
  {
    title: '高级',
    items: [
      { type: 'subProcess', label: '子流程', color: '#2f54eb' }
    ]
  }
]

const onDragStart = (e, node) => {
  e.dataTransfer.setData('application/logicflow-node', JSON.stringify(node))
  e.dataTransfer.effectAllowed = 'copy'
  emit('node-click', node)
}

const onDragEnd = () => {
  // 拖拽结束回调
}
</script>

<style scoped>
.node-panel {
  width: 180px;
  height: 100%;
  background: #fafafa;
  border-right: 1px solid var(--ep-border-color-lighter);
  overflow-y: auto;
}
.panel-title {
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--ep-border-color-lighter);
  background: #fff;
}
.node-group {
  padding: 8px;
}
.group-title {
  font-size: 12px;
  color: var(--ep-text-color-secondary);
  margin-bottom: 6px;
  padding: 0 4px;
}
.group-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.node-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--ep-border-color-lighter);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}
.node-item:hover {
  border-color: var(--ep-color-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.node-item:active {
  cursor: grabbing;
}
.node-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.node-label {
  font-size: 13px;
}
</style>
