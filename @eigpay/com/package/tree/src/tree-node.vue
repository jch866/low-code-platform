<template>
  <div
    v-show="node.visible"
    ref="node$"
    :class="[
      ns.b('node'),
      ns.is('expanded', expanded),
      ns.is('current', node.isCurrent),
      ns.is('hidden', !node.visible),
      ns.is('focusable', !node.disabled),
      ns.is('checked', !node.disabled && node.checked),
      getNodeClass(node)
    ]"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.props.draggable"
    :data-key="getNodeKey(node)"
    @click.stop="handleClick"
    @contextmenu="handleContextMenu"
  >
    <div
      :class="ns.em('node', 'content')"
      :style="{ paddingLeft: (node.level - 1) * tree.props.indent + 'px' }"
    >
      <ep-icon
        :icon="tree.props.icon"
        :class="[
          ns.is('leaf', node.isLeaf),
          nodeNs.em('expand-icon'),
          {
            expanded: !node.isLeaf && expanded
          }
        ]"
        @click.stop="handleExpandIconClick"
      ></ep-icon>
      <ep-checkbox
        v-if="showCheckbox"
        :model-value="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.stop
        @change="handleCheckChange"
      />

      <node-content :node="node" :render-content="renderContent" />
    </div>
    <ep-collapse-transition>
      <div
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        :class="ns.em('node', 'children')"
        role="group"
        :aria-expanded="expanded"
      >
        <ep-tree-node
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :render-content="renderContent"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :node="child"
          :accordion="accordion"
          :props="props"
          @node-expand="handleChildNodeExpand"
        />
      </div>
    </ep-collapse-transition>
  </div>
</template>
<script>
// @ts-nocheck
import {
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  provide,
  ref,
  watch
} from 'vue'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isFunction'
import EpCollapseTransition from '@package/collapse/src/collapse-transition.vue'
import { buildCssNamespace } from '@package/util'
import NodeContent from './tree-node-content.vue'
import { getNodeKey as getNodeKeyUtil, handleCurrentChange } from './model/util'
import { useNodeExpandEventBroadcast } from './model/useNodeExpandEventBroadcast'

import Node from './model/node'

export default defineComponent({
  name: 'EpTreeNode',
  components: {
    EpCollapseTransition,
    NodeContent
  },
  props: {
    node: {
      type: Node,
      default: () => ({})
    },
    props: {
      type: Object,
      default: () => ({})
    },
    accordion: Boolean,
    renderContent: Function,
    renderAfterExpand: Boolean,
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  emits: ['node-expand'],
  setup(props, ctx) {
    const ns = buildCssNamespace('tree')
    const nodeNs = buildCssNamespace('tree-node')
    const { broadcastExpanded } = useNodeExpandEventBroadcast(props)
    const tree = inject('RootTree')
    const expanded = ref(false)
    const childNodeRendered = ref(false)
    const oldChecked = ref(null)
    const oldIndeterminate = ref(null)
    const node$ = ref(null)

    const instance = getCurrentInstance()

    provide('NodeInstance', instance)
    if (!tree) {
      // debugWarn('Tree', "Can not find node's tree.")
    }

    if (props.node.expanded) {
      expanded.value = true
      childNodeRendered.value = true
    }

    const childrenKey = tree.props['children'] || 'children'
    watch(
      () => {
        const children = props.node.data[childrenKey]
        return children && [...children]
      },
      () => {
        props.node.updateChildren()
      }
    )

    watch(
      () => props.node.indeterminate,
      (val) => {
        handleSelectChange(props.node.checked, val)
      }
    )

    watch(
      () => props.node.checked,
      (val) => {
        handleSelectChange(val, props.node.indeterminate)
      }
    )

    watch(
      () => props.node.expanded,
      (val) => {
        nextTick(() => (expanded.value = val))
        if (val) {
          childNodeRendered.value = true
        }
      }
    )

    const getNodeKey = (node) => {
      return getNodeKeyUtil(tree.props.nodeKey, node.data)
    }

    const getNodeClass = (node) => {
      const nodeClassFunc = props.props.class
      if (!nodeClassFunc) {
        return {}
      }
      let className
      if (isFunction(nodeClassFunc)) {
        const { data } = node
        className = nodeClassFunc(data, node)
      } else {
        className = nodeClassFunc
      }

      if (isString(className)) {
        return { [className]: true }
      } else {
        return className
      }
    }

    const handleSelectChange = (checked, indeterminate) => {
      if (
        oldChecked.value !== checked ||
        oldIndeterminate.value !== indeterminate
      ) {
        tree.ctx.emit('check-change', props.node.data, checked, indeterminate)
      }
      oldChecked.value = checked
      oldIndeterminate.value = indeterminate
    }

    const handleClick = (e) => {
      handleCurrentChange(tree.store, tree.ctx.emit, () =>
        tree.store.value.setCurrentNode(props.node)
      )
      tree.currentNode.value = props.node

      if (tree.props.expandOnClickNode) {
        handleExpandIconClick()
      }

      if (tree.props.checkOnClickNode && !props.node.disabled) {
        handleCheckChange({
          target: { checked: !props.node.checked }
        })
      }
      tree.ctx.emit('node-click', props.node.data, props.node, instance, e)
    }

    const handleContextMenu = (event) => {
      if (tree.instance.vnode.props['onNodeContextmenu']) {
        event.stopPropagation()
        event.preventDefault()
      }
      tree.ctx.emit(
        'node-contextmenu',
        event,
        props.node.data,
        props.node,
        instance
      )
    }

    const handleExpandIconClick = () => {
      if (props.node.isLeaf) return
      if (expanded.value) {
        tree.ctx.emit('node-collapse', props.node.data, props.node, instance)
        props.node.collapse()
      } else {
        props.node.expand()
        ctx.emit('node-expand', props.node.data, props.node, instance)
      }
    }

    const handleCheckChange = (ev) => {
      props.node.setChecked(ev.target.checked, !tree.props.checkStrictly)
      nextTick(() => {
        const store = tree.store.value
        tree.ctx.emit('check', props.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        })
      })
    }

    const handleChildNodeExpand = (nodeData, node, instance) => {
      broadcastExpanded(node)
      tree.ctx.emit('node-expand', nodeData, node, instance)
    }

    return {
      ns,
      nodeNs,
      node$,
      tree,
      expanded,
      childNodeRendered,
      oldChecked,
      oldIndeterminate,
      getNodeKey,
      getNodeClass,
      handleSelectChange,
      handleClick,
      handleContextMenu,
      handleExpandIconClick,
      handleCheckChange,
      handleChildNodeExpand
    }
  }
})
</script>
