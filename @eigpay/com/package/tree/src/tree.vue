<template>
  <div
    ref="el$"
    :class="[
      ns.b(),
      // ns.is('dragging', !!dragState.draggingNode),
      // ns.is('drop-not-allow', !dragState.allowDrop),
      // ns.is('drop-inner', dragState.dropType === 'inner'),
      { [ns.m('highlight-current')]: highlightCurrent }
    ]"
    role="tree"
  >
    <ep-tree-node
      v-for="child in root.childNodes"
      :key="getNodeKey(child)"
      :node="child"
      :props="props"
      :accordion="accordion"
      :render-after-expand="renderAfterExpand"
      :show-checkbox="showCheckbox"
      :render-content="renderContent"
      @node-expand="handleNodeExpand"
    />
    <div v-if="isEmpty" :class="ns.e('empty-block')">
      <slot name="empty">
        <span :class="ns.e('empty-text')">
          {{ emptyText ?? t('el.tree.emptyText') }}
        </span>
      </slot>
    </div>
  </div>
</template>
<script>
// @ts-nocheck
import {
  computed,
  defineComponent,
  getCurrentInstance,
  provide,
  ref,
  watch
} from 'vue'
import { buildCssNamespace } from '@package/util'
import { useLocale } from '../../hooks/locale'
import TreeStore from './model/tree-store'
import { getNodeKey as getNodeKeyUtil, handleCurrentChange } from './model/util'
import EpTreeNode from './tree-node.vue'
import { useNodeExpandEventBroadcast } from './model/useNodeExpandEventBroadcast'
import { componetName } from '@package/constant'

export default defineComponent({
  name: componetName('Tree'),
  components: { EpTreeNode },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: 'ep-i-unfold-down'
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrag: Function,
    allowDrop: Function,
    props: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label',
        disabled: 'disabled'
      })
    },
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18
    }
  },
  emits: [
    'check-change',
    'current-change',
    'node-click',
    'node-contextmenu',
    'node-collapse',
    'node-expand',
    'check'
  ],
  setup(props, ctx) {
    const { t } = useLocale()
    const ns = buildCssNamespace('tree')

    const store = ref(
      new TreeStore({
        key: props.nodeKey,
        data: props.data,
        lazy: props.lazy,
        props: props.props,
        load: props.load,
        currentNodeKey: props.currentNodeKey,
        checkStrictly: props.checkStrictly,
        checkDescendants: props.checkDescendants,
        defaultCheckedKeys: props.defaultCheckedKeys,
        defaultExpandedKeys: props.defaultExpandedKeys,
        autoExpandParent: props.autoExpandParent,
        defaultExpandAll: props.defaultExpandAll,
        filterNodeMethod: props.filterNodeMethod
      })
    )

    store.value.initialize()

    const root = ref(store.value.root)
    const currentNode = ref(null)
    const el$ = ref(null)
    const dropIndicator$ = ref(null)

    const { broadcastExpanded } = useNodeExpandEventBroadcast(props)
    const isEmpty = computed(() => {
      const { childNodes } = root.value
      return (
        !childNodes ||
        childNodes.length === 0 ||
        childNodes.every(({ visible }) => !visible)
      )
    })

    watch(
      () => props.currentNodeKey,
      (newVal) => {
        store.value.setCurrentNodeKey(newVal)
      }
    )

    watch(
      () => props.defaultCheckedKeys,
      (newVal) => {
        store.value.setDefaultCheckedKey(newVal)
      }
    )

    watch(
      () => props.defaultExpandedKeys,
      (newVal) => {
        store.value.setDefaultExpandedKeys(newVal)
      }
    )

    watch(
      () => props.data,
      (newVal) => {
        store.value.setData(newVal)
      },
      { deep: true }
    )

    watch(
      () => props.checkStrictly,
      (newVal) => {
        store.value.checkStrictly = newVal
      }
    )

    const filter = (value) => {
      if (!props.filterNodeMethod)
        throw new Error('[Tree] filterNodeMethod is required when filter')
      store.value.filter(value)
    }

    const getNodeKey = (node) => {
      return getNodeKeyUtil(props.nodeKey, node.data)
    }

    const getNodePath = (data) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in getNodePath')
      const node = store.value.getNode(data)
      if (!node) return []
      const path = [node.data]
      let parent = node.parent
      while (parent && parent !== root.value) {
        path.push(parent.data)
        parent = parent.parent
      }
      return path.reverse()
    }

    const getCheckedNodes = (leafOnly, includeHalfChecked) => {
      return store.value.getCheckedNodes(leafOnly, includeHalfChecked)
    }

    const getCheckedKeys = (leafOnly) => {
      return store.value.getCheckedKeys(leafOnly)
    }

    const getCurrentNode = () => {
      const currentNode = store.value.getCurrentNode()
      return currentNode ? currentNode.data : null
    }

    const getCurrentKey = () => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in getCurrentKey')
      const currentNode = getCurrentNode()
      return currentNode ? currentNode[props.nodeKey] : null
    }

    const setCheckedNodes = (nodes, leafOnly) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      store.value.setCheckedNodes(nodes, leafOnly)
    }

    const setCheckedKeys = (keys, leafOnly) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCheckedKeys')
      store.value.setCheckedKeys(keys, leafOnly)
    }

    const setChecked = (data, checked, deep) => {
      store.value.setChecked(data, checked, deep)
    }

    const getHalfCheckedNodes = () => {
      return store.value.getHalfCheckedNodes()
    }

    const getHalfCheckedKeys = () => {
      return store.value.getHalfCheckedKeys()
    }

    const setCurrentNode = (node, shouldAutoExpandParent = true) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCurrentNode')

      handleCurrentChange(store, ctx.emit, () =>
        store.value.setUserCurrentNode(node, shouldAutoExpandParent)
      )
    }

    const setCurrentKey = (key, shouldAutoExpandParent = true) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCurrentKey')

      handleCurrentChange(store, ctx.emit, () =>
        store.value.setCurrentNodeKey(key, shouldAutoExpandParent)
      )
    }

    const getNode = (data) => {
      return store.value.getNode(data)
    }

    const remove = (data) => {
      store.value.remove(data)
    }

    const append = (data, parentNode) => {
      store.value.append(data, parentNode)
    }

    const insertBefore = (data, refNode) => {
      store.value.insertBefore(data, refNode)
    }

    const insertAfter = (data, refNode) => {
      store.value.insertAfter(data, refNode)
    }

    const handleNodeExpand = (nodeData, node, instance) => {
      broadcastExpanded(node)
      ctx.emit('node-expand', nodeData, node, instance)
    }

    const updateKeyChildren = (key, data) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in updateKeyChild')
      store.value.updateChildren(key, data)
    }

    provide('RootTree', {
      ctx,
      props,
      store,
      root,
      currentNode,
      instance: getCurrentInstance()
    })
    const formItemContextKey = Symbol('formItemContextKey')
    provide(formItemContextKey, undefined)

    return {
      ns,
      // ref
      store,
      root,
      currentNode,
      // dragState,
      el$,
      dropIndicator$,
      // computed
      isEmpty,
      // methods
      filter,
      getNodeKey,
      getNodePath,
      getCheckedNodes,
      getCheckedKeys,
      getCurrentNode,
      getCurrentKey,
      setCheckedNodes,
      setCheckedKeys,
      setChecked,
      getHalfCheckedNodes,
      getHalfCheckedKeys,
      setCurrentNode,
      setCurrentKey,
      t,
      getNode,
      remove,
      append,
      insertBefore,
      insertAfter,
      handleNodeExpand,
      updateKeyChildren
    }
  }
})
</script>
