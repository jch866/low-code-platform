<template>
  <!-- 迁移自 Vue2 工程 frog-payadmin-vue的副本/src/views/develop/modules/BranchSubmit/parentProcess.vue（业务流程查看） -->
  <!-- 原 a-modal：width=1400、footer=null、:visible="$store.state.parentProcess"、cancelText=关闭(common.close)；
       与源差异：去 vuex 化，显隐改为组件内 ep-dialog v-model，父页面经 ref.edit(row) 打开（row.id 作 toPkValue）；
       原 a-modal 无 title，此处以入口按钮文案「查看关联流程」补充弹窗标题 -->
  <ep-dialog
    :model-value="visible"
    title="查看关联流程"
    width="1400px"
    append-to-body
    @close="handleClose"
  >
    <!-- 原 a-row/a-col 内嵌 ParentChartProcess（echarts 横向树图：initialTreeDepth=3、expandAndCollapse、
         点击节点复制名称并提示 LC0761）；子应用未引入 echarts，与源差异改为纵向缩进树形列表展示，
         保留默认展开 3 层与节点折叠/展开交互，点击节点名称仍复制到剪贴板 -->
    <div class="process-tree">
      <div v-if="!cardCount.name" class="tree-empty">暂无关联流程数据</div>
      <div
        v-for="node in visibleNodes"
        :key="node.key"
        class="tree-row"
        :style="{ paddingLeft: node.depth * 28 + 'px' }"
      >
        <span v-if="node.hasChildren" class="tree-toggle" @click="toggleNode(node)">
          {{ node.expanded ? '−' : '+' }}
        </span>
        <span v-else class="tree-toggle-placeholder"></span>
        <span class="tree-label" :title="node.name" @click="copyNodeName(node.name)">{{ node.name }}</span>
      </div>
    </div>
    <!-- 原 a-modal footer=null（无确定/关闭按钮，经取消/遮罩关闭），ep-dialog 未提供 #footer 插槽即不渲染底栏 -->
  </ep-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { EPMessageTips } from '@/utils/utils'
import { getAssociatedProcess } from '@/api/lowCodePlatform/flowManage'
import { getAssociatedRules } from '@/api/lowCodePlatform/regulatorRule'

// 弹窗显隐（原 vuex parentProcessData，与源差异见模板注释）
const visible = ref(false)
// 关联流程树数据（原 cardCount，echarts 树图数据源：{name, children:[...]}）
const cardCount = ref({})
// 节点展开/折叠记录（key → boolean；未记录时按默认展开层数处理）
const expandedMap = ref({})
// 树图默认展开层数（原 echarts initialTreeDepth=3：可见 3 层，更深层级折叠）
const INIT_TREE_DEPTH = 2

// 原 url 配置：
// queryAssociatedProcess:   GET /related/process/queryAssociatedProcess（参数 {pkValue}，业务流程关联流程树）
// queryAssociatedRegulator: GET /related/process/queryAssociatedRules（参数 {pkValue}，规则关联引用树，
//                           复用 regulatorRule.js 既有 getAssociatedRules mock）

/** 树形数据扁平化为可见节点列表（depth 控制缩进层级） */
const visibleNodes = computed(() => {
  const nodes = []
  if (!cardCount.value || !cardCount.value.name) {
    return nodes
  }
  const walk = (node, depth, key) => {
    const hasChildren = !!(node.children && node.children.length)
    const expanded =
      expandedMap.value[key] !== undefined ? expandedMap.value[key] : depth < INIT_TREE_DEPTH
    nodes.push({ key, name: node.name, depth, hasChildren, expanded })
    if (hasChildren && expanded) {
      node.children.forEach((child, index) => {
        walk(child, depth + 1, key + '-' + index)
      })
    }
  }
  walk(cardCount.value, 0, '0')
  return nodes
})

/** 展开/折叠节点（原 echarts expandAndCollapse 交互） */
const toggleNode = (node) => {
  expandedMap.value[node.key] = !node.expanded
}

/** 点击节点名称复制（原 chart.on('click') → navigator.clipboard + 提示 LC0761「节点名称 "{name}" 已复制」） */
const copyNodeName = (name) => {
  navigator.clipboard
    .writeText(name)
    .then(() => {
      EPMessageTips('success', `节点名称 "${name}" 已复制`)
    })
    .catch((err) => {
      console.error('无法复制节点名称：', err)
    })
}

/**
 * 打开弹窗（原由 vuex parentProcessData=true 显示 + props watch 触发查询；
 * record.id 作 toPkValue 查询关联流程；regulatorPkValue 为源组件保留入参（监管方入口），当前两处接线均未使用）
 */
const edit = (record, regulatorPkValue = '') => {
  cardCount.value = {}
  expandedMap.value = {}
  visible.value = true
  if (record && record.id) {
    queryCount(record.id)
  }
  if (regulatorPkValue) {
    queryRegulatorCount(regulatorPkValue)
  }
}

/** 关联流程树查询（原 queryCount：getAction(queryAssociatedProcess, {pkValue})） */
const queryCount = (val) => {
  // 真实接口：GET /related/process/queryAssociatedProcess（参数 {pkValue}）
  getAssociatedProcess({ pkValue: val }).then((res) => {
    if (res.returnCode === SUCCESS_STATUS && res.result && res.result.name) {
      cardCount.value = res.result
    }
  })
}

/** 规则关联引用树查询（原 queryRegulatorCount：getAction(queryAssociatedRules, {pkValue})） */
const queryRegulatorCount = (val) => {
  // 真实接口：GET /related/process/queryAssociatedRules（参数 {pkValue}）
  getAssociatedRules({ pkValue: val }).then((res) => {
    if (res.returnCode === SUCCESS_STATUS && res.result && res.result.name) {
      cardCount.value = res.result
    }
  })
}

/** 关闭并重置（原 close：清空 cardCount，emit update:toPkValue/regulatorPkValue 空，vuex parentProcessData=false） */
const handleClose = () => {
  cardCount.value = {}
  expandedMap.value = {}
  visible.value = false
}

defineExpose({
  edit
})
</script>

<style scoped>
.process-tree {
  max-height: 65vh;
  overflow: auto;
  padding: 4px 0;
}
.tree-row {
  display: flex;
  align-items: center;
  line-height: 30px;
}
.tree-toggle {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  line-height: 16px;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  color: #666;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}
.tree-toggle:hover {
  border-color: #0060fb;
  color: #0060fb;
}
.tree-toggle-placeholder {
  width: 18px;
  margin-right: 6px;
  flex-shrink: 0;
}
/* 原 echarts 节点标签样式（背景 #0060fb、白字、圆角）迁移至节点名称 */
.tree-label {
  font-size: 14px;
  padding: 2px 8px;
  background-color: #0060fb;
  color: #fff;
  border-radius: 2px;
  cursor: pointer;
}
.tree-label:hover {
  opacity: 0.85;
}
.tree-empty {
  color: #999;
  text-align: center;
  padding: 40px 0;
}
</style>
