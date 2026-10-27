import { ref, getCurrentInstance } from 'vue'
import isBoolean from 'lodash/isBoolean'
import isFunction from 'lodash/isFunction'

const toggleRowStatus = (statusArray, row, expanded, rowKey) => {
  let change = false
  let index
  if (rowKey) {
    index = findIndexByKey(statusArray, row, rowKey)
  } else {
    index = statusArray.indexOf(row)
  }
  const included = index !== -1
  const toggleStatus = (opr) => {
    if (opr === 'add') {
      statusArray.push(row)
    } else {
      statusArray.splice(index, 1)
    }
    change = true
  }
  if (isBoolean(expanded)) {
    if (expanded && !included) {
      toggleStatus('add')
    } else if (!expanded && included) {
      toggleStatus('remove')
    }
  } else {
    toggleStatus(included ? 'remove' : 'add')
  }
  return change
}

const findIndexByKey = (array, row, rowKey) => {
  return array.findIndex((value) => {
    if (isFunction(rowKey)) {
      return rowKey(row) === rowKey(value)
    } else {
      return row[rowKey] === value[rowKey]
    }
  })
}

function useExpand() {
  const table = getCurrentInstance()
  const rowKey = table.props.rowKey
  const expandRows = ref([])
  const updateExpandRows = () => {
    const remains = expandRows.value.filter((value) => {
      if (rowKey) {
        return (
          findIndexByKey(table.store.states.data.value, value, rowKey) !== -1
        )
      } else {
        return table.store.states.data.value.includes(value)
      }
    })
    expandRows.value = remains
  }
  const toggleRowExpansion = (row, expanded) => {
    const changed = toggleRowStatus(expandRows.value, row, expanded, rowKey)
    if (changed) {
      table.emit('expand-change', row, expandRows.value.slice())
    }
  }

  const isRowExpanded = (row) => {
    if (rowKey) {
      return findIndexByKey(expandRows.value, row, rowKey) !== -1
    } else {
      return expandRows.value.includes(row)
    }
  }

  return {
    updateExpandRows,
    toggleRowExpansion,
    isRowExpanded,
    states: {
      expandRows
    }
  }
}
export default useExpand
