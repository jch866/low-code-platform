import { computed, defineComponent, getCurrentInstance, h, inject } from 'vue'
import useLayoutObserver from '../layoutObserver'
import { tableContextKey, createTablePopper } from '../tool'
import { buildCssNamespace } from '../../../util'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

import { camelize } from 'vue'
import { isClient } from '@vueuse/core'

export const getCell = function (event) {
  return event.target?.closest('td')
}

export const getStyle = (element, styleName) => {
  if (!isClient || !element || !styleName) return ''

  let key = camelize(styleName)
  if (key === 'float') key = 'cssFloat'
  try {
    const style = element.style[key]
    if (style) return style
    const computed = document.defaultView?.getComputedStyle(element, '')
    return computed ? computed[key] : ''
  } catch {
    return element.style[key]
  }
}
export const hasClass = (el, cls) => {
  if (!el || !cls) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')
  return el.classList.contains(cls)
}

const getColspanRealWidth = (columns, colspan, index) => {
  if (colspan < 1) {
    return columns[index].realWidth
  }
  const widthArr = columns
    .map(({ realWidth, width }) => realWidth || width)
    .slice(index, index + colspan)
  return Number(
    widthArr.reduce((acc, width) => Number(acc) + Number(width), -1)
  )
}

const handleCellMouseEnter = (event, row, tooltipEffect = 'light', parent) => {
  // const table = parent
  const ns = buildCssNamespace('table')
  const cell = getCell(event)
  // 判断是否text-overflow, 如果是就显示tooltip
  const cellChild = event.target.querySelector('.cell')
  if (
    !(hasClass(cellChild, `${ns.m('tooltip')}`) && cellChild.childNodes.length)
  ) {
    return
  }
  // use range width instead of scrollWidth to determine whether the text is overflowing
  // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
  const range = document.createRange()
  range.setStart(cellChild, 0)
  range.setEnd(cellChild, cellChild.childNodes.length)
  const rangeWidth = range.getBoundingClientRect().width
  const padding =
    (Number.parseInt(getStyle(cellChild, 'paddingLeft'), 10) || 0) +
    (Number.parseInt(getStyle(cellChild, 'paddingRight'), 10) || 0)
  if (
    rangeWidth + padding > cellChild.offsetWidth ||
    cellChild.scrollWidth > cellChild.offsetWidth
  ) {
    createTablePopper(
      parent?.refs.tableWrapper,
      cell,
      cell.innerText || cell.textContent,
      {
        placement: 'top',
        strategy: 'fixed'
      },
      tooltipEffect
    )
  }
}

export default defineComponent({
  props: {
    store: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    //table实例
    const tableInstance = inject(tableContextKey)
    //当前body实例
    const bodyInstance = getCurrentInstance()

    const { onColumnsChange } = useLayoutObserver(tableInstance)

    // body实例设置state, 是为了给layout进行回调
    bodyInstance.state = {
      onColumnsChange
    }
    const columns = computed(() => {
      return props.store.states.columns.value
    })
    const data = computed(() => {
      return props.store.states.data.value
    })
    const handleRowClick = (row, rowIndex, $event) => {
      tableInstance.emit('rowClick', row, rowIndex, $event)
    }
    return {
      columns,
      data,
      ns: buildCssNamespace('table'),
      handleRowClick,
      tableInstance
    }
  },
  render() {
    const data = this.data
    const store = this.store
    const handleRowClick = this.handleRowClick
    const ns = this.ns
    const hasExpandColumn = this.columns.some(({ type }) => type === 'expand')
    const getSpan = (row, column, rowIndex, columnIndex) => {
      let colspan = 1,
        rowspan = 1,
        tdClass = ''
      const method = this.tableInstance?.props.spanMethod
      if (isFunction(method)) {
        const result = method(row, column, rowIndex, columnIndex)
        if (isArray(result)) {
          ;[rowspan, colspan, tdClass] = result
        } else if (isObject(result)) {
          ;({ rowspan, colspan, tdClass } = result)
        }
        console.log(result)
      }
      return { rowspan, colspan, tdClass }
    }
    return h(
      'tbody',
      { class: '' },
      data.reduce((acc, row, rowIndex) => {
        let expanded = false
        if (hasExpandColumn) {
          expanded = store.isRowExpanded(row)
        }
        acc.push(
          h(
            'tr',
            {
              class: '',
              key: rowIndex,
              onClick: ($event) => handleRowClick(row, rowIndex, $event)
            },
            this.columns.map((column, colIndex) => {
              const { rowspan, colspan, tdClass } = getSpan(
                row,
                column,
                rowIndex,
                colIndex
              )
              if (!rowspan || !colspan) {
                return null
              }
              const realWidth = getColspanRealWidth(
                this.columns,
                colspan,
                colIndex
              )
              const columnData = {
                ...column,
                realWidth
              }
              return h(
                'td',
                {
                  class: [
                    tdClass,
                    rowspan > 1 ? 'ep-td-merge-row' : '',
                    colspan > 1 ? 'ep-td-merge-col' : '',
                    ns.e('cell'),
                    column.align,
                    column.fixed === true ||
                    column.fixed === '' ||
                    column.fixed === 'left'
                      ? ns.e('column-fixed-left')
                      : '',
                    column.fixed === 'right' ? ns.e('column-fixed-right') : ''
                  ],
                  key: `${column.columnId}_${colIndex}`,
                  tmpColumnlabel: column.label,
                  rowspan,
                  colspan,
                  onMouseenter: ($event) =>
                    handleCellMouseEnter(
                      $event,
                      row,
                      this.tableInstance.tooltipEffect,
                      this.tableInstance
                    )
                },
                [
                  column.cellRender(
                    { row, column: columnData, rowIndex, colIndex, expanded },
                    store
                  )
                ]
              )
            })
          )
        )

        if (hasExpandColumn) {
          const renderExpanded = this.tableInstance.renderExpanded
          if (expanded) {
            if (!renderExpanded) {
              console.error('[Table Error]renderExpanded is required.')
              return acc
            }
            acc.push(
              h(
                'tr',
                {
                  class: '',
                  key: `expanded_${rowIndex}`
                },
                [
                  h(
                    'td',
                    {
                      colspan: this.columns.length,
                      class: [ns.e('cell'), ns.e('expanded-cell')]
                    },
                    [renderExpanded({ row, rowIndex, expanded })]
                  )
                ]
              )
            )
          }
        }
        return acc
      }, [])
    )
  }
})
