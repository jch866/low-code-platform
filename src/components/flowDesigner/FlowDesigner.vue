<template>
  <div class="flow-designer">
    <!-- 左侧节点面板 -->
    <NodePanel :extra-groups="commonNodeGroups" @node-click="onNodeClick" />

    <!-- 中间画布 -->
    <div class="canvas-area">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <ep-button size="small" @click="onSave">
            <template #icon><ep-icon icon="ep-i-folder-checked" /></template>
            保存
          </ep-button>
          <ep-button size="small" plain @click="onExportJson">
            <template #icon><ep-icon icon="ep-i-download" /></template>
            导出 JSON
          </ep-button>
          <ep-button size="small" plain @click="onImportJson">
            <template #icon><ep-icon icon="ep-i-upload" /></template>
            导入 JSON
          </ep-button>
        </div>

        <div class="toolbar-center">
          <ep-button-group size="small">
            <ep-button @click="onZoomOut">
              <template #icon><ep-icon icon="ep-i-zoom-out" /></template>
            </ep-button>
            <ep-button @click="onResetZoom">{{ Math.round(currentZoom * 100) }}%</ep-button>
            <ep-button @click="onZoomIn">
              <template #icon><ep-icon icon="ep-i-zoom-in" /></template>
            </ep-button>
          </ep-button-group>
          <ep-button size="small" plain @click="onFitView">
            <template #icon><ep-icon icon="ep-i-expand" /></template>
            适应画布
          </ep-button>
          <ep-button size="small" plain @click="onClear">
            <template #icon><ep-icon icon="ep-i-delete" /></template>
            清空
          </ep-button>
        </div>

        <div class="toolbar-right">
          <ep-switch v-model="viewOnlyRef" active-text="只读" inactive-text="编辑" />
        </div>
      </div>

      <!-- LogicFlow 画布 -->
      <div
        ref="containerRef"
        class="lf-container"
        @dragover.prevent
        @drop="onCanvasDrop"
      />
    </div>

    <!-- 右侧属性面板 -->
    <AttrPanel
      :selected-node="selectedNode"
      :selected-edge="selectedEdge"
      :flow-info="flowInfo"
      @update:selected-node="onNodeAttrUpdate"
      @update:selected-edge="onEdgeAttrUpdate"
      @update:flow-info="onFlowInfoUpdate"
    />

    <!-- 隐藏的 file input 用于导入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import LogicFlow from '@logicflow/core'
import { BpmnElement } from '@logicflow/extension'
import '@logicflow/core/dist/index.css'
import '@logicflow/extension/lib/style/index.css'
import NodePanel from './NodePanel.vue'
import AttrPanel from './AttrPanel.vue'
import { toLogicFlowData, toOriginalFlowData } from './adapter'

const props = defineProps({
  // 原始 flowData（初始化用）
  flowData: { type: Object, default: () => null },
  // 只读模式
  viewOnly: { type: Boolean, default: false },
  // 流程基本信息
  flowInfo: { type: Object, default: () => ({}) },
  // 业务节点列表（原设计器 commonFlows：左侧可拖公共节点，此处统一映射为自动任务节点展示于节点库末尾）
  commonNodes: { type: Array, default: () => [] }
})

const emit = defineEmits(['save', 'flow-data-change', 'update:viewOnly'])

// 业务节点 → 动态分组（原设计器按 basic-node-config 渲染专有节点类型，此处统一映射为自动任务节点）
const commonNodeGroups = computed(() => {
  if (!props.commonNodes || !props.commonNodes.length) return []
  return [
    {
      title: '业务节点',
      items: props.commonNodes.map((node) => ({
        type: 'serviceTask',
        label: node.name || node.nodeName || node.label || node.code || '业务节点',
        color: '#722ed1'
      }))
    }
  ]
})

const containerRef = ref(null)
const fileInputRef = ref(null)
let lf = null

// LogicFlow 当前选中的节点/边的 id（不是 LF 对象本身，LF 对象有内部状态）
const selectedNodeId = ref(null)
const selectedEdgeId = ref(null)

// 用于 AttrPanel 的响应式数据（从 LF 实例里读）
const selectedNode = ref(null)
const selectedEdge = ref(null)

const currentZoom = ref(1)
const viewOnlyRef = ref(props.viewOnly)

// 画布中的节点/边数据（用于外部同步）
const lfData = reactive({ nodes: [], edges: [] })

/** 初始化 LogicFlow */
const initLogicFlow = () => {
  if (!containerRef.value) return

  LogicFlow.use(BpmnElement)

  lf = new LogicFlow({
    container: containerRef.value,
    grid: {
      size: 20,
      visible: true,
      type: 'dot',
      config: { color: '#d9d9d9' }
    },
    background: {
      backgroundColor: '#fafafa'
    },
    edgeType: 'polyline',
    keyboard: { enabled: true },
    // 注意：构造时必须非静默——LogicFlow 仅在构造时非静默才注册默认键盘快捷键（Delete 等），
    // 只读模式在初始化完成后经 updateEditConfig 应用，保证只读→编辑切换后快捷键仍可用
    plugins: []
  })

  // 应用初始只读模式（流程浏览等入口）
  if (props.viewOnly) {
    lf.updateEditConfig({ isSilentMode: true })
  }

  // 节点点击
  lf.on('node:click', ({ data }) => {
    selectedEdgeId.value = null
    selectedEdge.value = null
    selectedNodeId.value = data.id
    selectedNode.value = { ...data }
  })

  // 连线点击
  lf.on('edge:click', ({ data }) => {
    selectedNodeId.value = null
    selectedNode.value = null
    selectedEdgeId.value = data.id
    selectedEdge.value = { ...data }
  })

  // 画布空白点击（取消选中）
  lf.on('blank:click', () => {
    selectedNodeId.value = null
    selectedEdgeId.value = null
    selectedNode.value = null
    selectedEdge.value = null
  })

  // 节点/边更新时同步 selected 引用
  lf.on('node:drop', () => syncSelected())
  lf.on('edge:add', () => syncSelected())
  lf.on('node:mousedown', () => syncSelected())

  // 缩放
  lf.on('graph:transform', ({ transform }) => {
    currentZoom.value = transform.SCALE_X
  })

  // 删除事件
  lf.on('node:delete,edge:delete', () => {
    if (selectedNodeId.value && !lf.getNodeById(selectedNodeId.value)) {
      selectedNodeId.value = null
      selectedNode.value = null
    }
    if (selectedEdgeId.value && !lf.getEdgeById(selectedEdgeId.value)) {
      selectedEdgeId.value = null
      selectedEdge.value = null
    }
    emitDataChange()
  })

  // 加载初始数据
  if (props.flowData) {
    renderFlowData(props.flowData)
  } else {
    // 新建空白流程，自动加一个开始节点
    lf.render({
      nodes: [
        {
          id: 'start_1',
          type: 'startEvent',
          x: 200,
          y: 200,
          text: { value: '开始' }
        }
      ],
      edges: []
    })
  }
}

/** 从原始 flowData 渲染 */
const renderFlowData = (flowData) => {
  const data = toLogicFlowData(flowData)
  lf.render(data)
}

/** 同步 selected 的最新引用 */
const syncSelected = () => {
  if (selectedNodeId.value) {
    const node = lf.getNodeById(selectedNodeId.value)
    if (node) selectedNode.value = node.getData()
  }
  if (selectedEdgeId.value) {
    const edge = lf.getEdgeById(selectedEdgeId.value)
    if (edge) selectedEdge.value = edge.getData()
  }
}

/** 通知外部数据变更 */
const emitDataChange = () => {
  if (!lf) return
  const data = lf.getGraphData()
  Object.assign(lfData, data)
  const original = toOriginalFlowData(data, props.flowInfo)
  emit('flow-data-change', original)
}

/** 左侧点击节点 → 添加到画布 */
const onNodeClick = (nodeDef) => {
  if (!lf || viewOnlyRef.value) return
  const position = lf.getPointByClient(window.innerWidth / 2, window.innerHeight / 2)
  lf.addNode({
    type: nodeDef.type,
    x: position.x,
    y: position.y,
    text: { value: nodeDef.label }
  })
  emitDataChange()
}

/** 画布 drop 事件处理（NodePanel 拖拽进来） */
const onCanvasDrop = (e) => {
  if (!lf || viewOnlyRef.value) return
  const raw = e.dataTransfer?.getData('application/logicflow-node')
  if (!raw) return
  e.preventDefault()
  const nodeDef = JSON.parse(raw)
  // 屏幕坐标 → 画布坐标
  const position = lf.getPointByClient(e.clientX, e.clientY)
  lf.addNode({
    type: nodeDef.type,
    x: position.x,
    y: position.y,
    text: { value: nodeDef.label }
  })
  emitDataChange()
}

/** AttrPanel → LF 更新 */
const onNodeAttrUpdate = (updated) => {
  if (!lf || !selectedNodeId.value) return
  const node = lf.getNodeById(selectedNodeId.value)
  if (node) {
    node.setPosition({ x: updated.x, y: updated.y })
    if (updated.width && updated.height) {
      node.setProperties({ width: updated.width, height: updated.height })
    }
    node.setText(updated.text?.value || '')
    selectedNode.value = updated
    emitDataChange()
  }
}

const onEdgeAttrUpdate = (updated) => {
  if (!lf || !selectedEdgeId.value) return
  const edge = lf.getEdgeById(selectedEdgeId.value)
  if (edge) {
    edge.setText(updated.text?.value || '')
    selectedEdge.value = updated
    emitDataChange()
  }
}

const onFlowInfoUpdate = (info) => {
  // flowInfo 是 props，这里只 emit
  emit('flow-data-change', toOriginalFlowData(lf.getGraphData(), info))
}

/** 工具栏 */
const onSave = () => {
  if (!lf) return
  const data = lf.getGraphData()
  const original = toOriginalFlowData(data, props.flowInfo)
  emit('save', original)
}

const onExportJson = () => {
  if (!lf) return
  const data = lf.getGraphData()
  const original = toOriginalFlowData(data, props.flowInfo)
  const blob = new Blob([JSON.stringify(original, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.flowInfo?.name || 'flow-design'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const onImportJson = () => {
  fileInputRef.value?.click()
}

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const flowData = JSON.parse(ev.target.result)
      if (lf) renderFlowData(flowData)
    } catch (err) {
      console.error('导入失败:', err)
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

const onZoomIn = () => {
  lf?.zoom(1.2)
}
const onZoomOut = () => {
  lf?.zoom(0.8)
}
const onResetZoom = () => {
  lf?.resetZoom()
  currentZoom.value = 1
}
const onFitView = () => {
  lf?.fitView(40)
}
const onClear = () => {
  lf?.clearData()
  selectedNodeId.value = null
  selectedEdgeId.value = null
  selectedNode.value = null
  selectedEdge.value = null
  emitDataChange()
}

// viewOnly 切换同步（LogicFlow v2 无 setEditMode，须经 updateEditConfig 切换静默模式）
watch(
  viewOnlyRef,
  (val) => {
    if (lf) lf.updateEditConfig({ isSilentMode: val })
    emit('update:viewOnly', val)
  }
)

// props.viewOnly 外部变更同步到本地
watch(
  () => props.viewOnly,
  (val) => {
    viewOnlyRef.value = val
  }
)

// flowData prop 变更时重新渲染
watch(
  () => props.flowData,
  (val) => {
    if (lf && val) renderFlowData(val)
  }
)

onMounted(() => {
  setTimeout(initLogicFlow, 50) // 延迟确保容器尺寸就绪
})

onBeforeUnmount(() => {
  if (lf) {
    lf.destroy()
    lf = null
  }
})
</script>

<style>
/* LogicFlow 默认样式需要全局引入 */
</style>

<style scoped>
.flow-designer {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: #fff;
}
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--ep-border-color-lighter);
  background: #fff;
  gap: 12px;
}
.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
.lf-container {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
