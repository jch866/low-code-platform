/**
 * 数据适配器：原始 frog flowData ↔ LogicFlow 格式互转
 *
 * 原始 flowData 格式：
 *   { flowInfo: {...}, nodeList: [{id,type,name,top,left,...}], linkList: [{id,sourceId,targetId,...}], eventList: [] }
 * LogicFlow 格式：
 *   { nodes: [{id,type,x,y,text,properties:{...}}], edges: [{id,type,sourceNodeId,targetNodeId,text,properties:{...}}] }
 */

// 原始类型 → LogicFlow 类型映射
const NODE_TYPE_MAP = {
  start: 'startEvent',
  end: 'endEvent',
  task: 'userTask',
  auto: 'serviceTask',
  gateway_d: 'exclusiveGateway',
  gateway_e: 'exclusiveGateway',
  event: 'intermediateCatchEvent',
  subflow: 'subProcess',
  lane_start: 'swimlane',
  lane_end: 'swimlane'
}

// LogicFlow 类型 → 原始类型映射（反向）
const NODE_TYPE_REVERSE_MAP = Object.fromEntries(
  Object.entries(NODE_TYPE_MAP).map(([k, v]) => [v, k])
)

/**
 * 原始 flowData → LogicFlow data
 */
export function toLogicFlowData(flowData) {
  if (!flowData) return { nodes: [], edges: [] }

  const nodes = (flowData.nodeList || []).map((node) => {
    const lfType = NODE_TYPE_MAP[node.type] || node.type
    return {
      id: node.id || `${lfType}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: lfType,
      x: (node.left || 0) + (node.width || 80) / 2,
      y: (node.top || 0) + (node.height || 60) / 2,
      width: node.width || 80,
      height: node.height || 60,
      text: { value: node.name || node.label || '' },
      properties: {
        originalType: node.type,
        flowInfo: node
      }
    }
  })

  const edges = (flowData.linkList || []).map((link) => {
    return {
      id: link.id || `edge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: 'polyline',
      sourceNodeId: link.sourceId,
      targetNodeId: link.targetId,
      text: { value: link.text || '' },
      properties: {
        flowInfo: link
      }
    }
  })

  return { nodes, edges }
}

/**
 * LogicFlow data → 原始 flowData
 */
export function toOriginalFlowData(lfData, flowInfo = {}) {
  const nodeList = (lfData.nodes || []).map((node) => {
    const origType = node.properties?.originalType || NODE_TYPE_REVERSE_MAP[node.type] || node.type
    const width = node.width || 80
    const height = node.height || 60
    return {
      id: node.id,
      type: origType,
      name: node.text?.value || '',
      label: node.text?.value || '',
      top: node.y - height / 2,
      left: node.x - width / 2,
      width,
      height,
      properties: node.properties,
      ...node.properties?.flowInfo
    }
  })

  const linkList = (lfData.edges || []).map((edge) => {
    return {
      id: edge.id,
      sourceId: edge.sourceNodeId,
      targetId: edge.targetNodeId,
      text: edge.text?.value || '',
      ...edge.properties?.flowInfo
    }
  })

  return {
    flowInfo: {
      id: flowInfo.id || '',
      name: flowInfo.name || '未命名流程',
      code: flowInfo.code || '',
      ...flowInfo
    },
    nodeList,
    linkList,
    eventList: [],
    status: flowInfo.status || 'DRAFT'
  }
}

/**
 * LogicFlow 节点类型 → 中文显示名
 */
export const NODE_TYPE_LABEL = {
  startEvent: '开始事件',
  endEvent: '结束事件',
  userTask: '人工任务',
  serviceTask: '自动任务',
  exclusiveGateway: '网关',
  intermediateCatchEvent: '事件节点',
  subProcess: '子流程',
  swimlane: '泳道'
}
