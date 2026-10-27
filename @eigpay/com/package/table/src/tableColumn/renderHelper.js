import { getCurrentInstance, ref, watchEffect, computed, h } from 'vue'
import { buildCssNamespace } from '../../../util'
import { parseWidth, parseMinWidth } from '../tool'
import { componetName } from '../../../constant'
import get from 'lodash/get'

function useRender(props, slots, owner) {
  const instance = getCurrentInstance()
  const columnId = ref('')
  const isSubColumn = ref(false)
  const realAlign = ref()
  const realHeaderAlign = ref()
  const ns = buildCssNamespace('table')

  watchEffect(() => {
    realAlign.value = props.align ? `is-${props.align}` : null
    // nextline help render
    realAlign.value
  })
  watchEffect(() => {
    realHeaderAlign.value = props.headerAlign
      ? `is-${props.headerAlign}`
      : realAlign.value
    // nextline help render
    realHeaderAlign.value
  })
  const columnOrTableParent = computed(() => {
    let parent = instance.vnode.vParent || instance.parent
    while (parent && !parent.tableId && !parent.columnId) {
      parent = parent.vnode.vParent || parent.parent
    }
    return parent
  })
  const realWidth = ref(parseWidth(props.width))
  const realMinWidth = ref(parseMinWidth(props.minWidth))

  // 给列设置缺省的的宽度和最小宽度
  const setColumnWidth = (column) => {
    // props有设置width就用props中的width给列的width赋值
    if (realWidth.value) column.width = realWidth.value
    // props有设置minWidth就用props中的minWidth给列的minWidth赋值
    if (realMinWidth.value) {
      column.minWidth = realMinWidth.value
    }
    // props有设置minWith但没有width, 设列的width为null
    if (!realWidth.value && realMinWidth.value) {
      column.width = undefined
    }
    // 列的minWidth 为Falsy值， 设默认值80
    if (!column.minWidth) {
      column.minWidth = 80
    }
    // colum的真实宽度以width优先
    column.realWidth = Number(
      column.width === undefined ? column.minWidth : column.width
    )
    return column
  }

  const checkSubColumn = (nodes) => {
    function check(item) {
      if (get(item, 'type.name') === componetName('TableColumn')) {
        item.vParent = instance
      }
    }
    if (Array.isArray(nodes)) {
      nodes.forEach((child) => check(child))
    } else {
      check(nodes)
    }
  }

  const defaultRenderCell = ({ row, column, rowIndex, colIndex }) => {
    const property = props.prop
    const value = property && get(row, property)
    if (column && column.formatter) {
      return column.formatter({ row, column, rowIndex, colIndex, value })
    }
    // 判断是否闭眼加密显示
    const isEncryption = column.showEye && column.eyeStatus === 'close'
    return `${value !== undefined ? (isEncryption ? '*********' : value) : ''}`
  }

  const makeColumnRenders = (column) => {
    column.headerRender = (scope) => {
      // help render
      // instance.columnConfig.value['label']
      const renderHeader = slots.header
      return renderHeader ? renderHeader(scope) : column.label
    }

    let originRenderCell = column.renderCell || defaultRenderCell
    // 对 renderCell 进行包装
    column.cellRender = (data, store) => {
      let children = null
      if (slots.default) {
        const vnodes = slots.default(data)
        children = vnodes.some((v) => v.type !== Comment)
          ? vnodes
          : originRenderCell(data)
      } else {
        children = originRenderCell(data)
      }
      const props = {
        class: 'cell',
        style: {}
      }
      if (column.type === 'expand') {
        props.onClick = (event) => {
          event.stopPropagation()
          store.toggleRowExpansion(data.row)
        }
      }
      if (column.showOverflowTooltip) {
        props.class = `${props.class} ${ns.m('tooltip')}`
        props.style = {
          width: `${(data.column.realWidth || Number(data.column.width)) - 1}px`
        }
      }
      checkSubColumn(children)
      return h('div', props, [children])
    }
    if (column.type === 'expand') {
      owner.value.renderExpanded = slots.expand
    }
    return column
  }

  const getPropsData = (...propsKey) => {
    return propsKey.reduce((prev, cur) => {
      if (Array.isArray(cur)) {
        cur.forEach((key) => {
          prev[key] = props[key]
        })
      }
      return prev
    }, {})
  }
  const getColumnElIndex = (children, child) => {
    return Array.prototype.indexOf.call(children, child)
  }

  return {
    columnId,
    realAlign,
    isSubColumn,
    realHeaderAlign,
    columnOrTableParent,
    setColumnWidth,
    makeColumnRenders,
    getPropsData,
    getColumnElIndex
  }
}

export default useRender
