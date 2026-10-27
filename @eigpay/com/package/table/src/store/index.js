import { getCurrentInstance, nextTick, unref } from 'vue'
import { buildCssNamespace } from '../../../util'
import useWatcher from './watcher'

// 替换把id相同的原有column替换为新的column
function replaceColumn(array, column) {
  return array.map((item) => {
    if (item.id === column.id) {
      return column
    } else if (item.children?.length) {
      item.children = replaceColumn(item.children, column)
    }
    return item
  })
}

// 根据columnIndex 排序
function sortColumn(array) {
  array.forEach((item) => {
    if (item.children && item.children.length) {
      sortColumn(item.children)
    }
  })
  array.sort((cur, pre) => cur.getColIndex() - pre.getColIndex())
}

function useStore() {
  // table实例
  const tableInstance = getCurrentInstance()
  // watcher, watcher.state下保存了数据data， 和列信息维护(列分类)
  const watcher = useWatcher()
  const ns = buildCssNamespace('table')
  const mutations = {
    //
    setData(states, data) {
      states.data.value = data || []
      states._data.value = data || []
      tableInstance.store.updateExpandRows()
      // 每次设置完数据后，如果表更已经挂载的话，要重新计算布局
      if (tableInstance.$ready) {
        tableInstance.store.scheduleLayout()
      }
    },

    insertColumn(states, column, parent) {
      const array = unref(states._columns)
      let newColumns = []
      if (!parent) {
        array.push(column)
        newColumns = array
      } else {
        if (parent && !parent.children) {
          parent.children = []
        }
        parent.children.push(column)
        newColumns = replaceColumn(array, parent)
      }
      sortColumn(newColumns)
      states._columns.value = newColumns
      if (tableInstance.$ready) {
        tableInstance.store.updateColumns() // hack for dynamics insert column
        tableInstance.store.scheduleLayout()
      }
    },

    removeColumn(states, column, parent) {
      const array = unref(states._columns) || []
      if (parent) {
        parent.children.splice(
          parent.children.findIndex(
            (item) => item.columnId === column.columnId
          ),
          1
        )
        if (parent.children.length === 0) {
          delete parent.children
        }
        states._columns.value = replaceColumn(array, parent)
      } else {
        const index = array.findIndex(
          (item) => item.columnId === column.columnId
        )
        if (index > -1) {
          array.splice(index, 1)
          states._columns.value = array
        }
      }

      if (tableInstance.$ready) {
        tableInstance.store.updateColumns() // hack for dynamics remove column
        tableInstance.store.scheduleLayout()
      }
    }
  }
  const commit = function (name, ...args) {
    const mutations = tableInstance.store.mutations
    if (mutations[name]) {
      mutations[name].apply(
        tableInstance,
        [tableInstance.store.states].concat(args)
      )
    } else {
      throw new Error(`Action not found: ${name}`)
    }
  }
  const updateTableScrollY = function () {
    nextTick(() =>
      tableInstance.layout.updateScrollY.apply(tableInstance.layout)
    )
  }
  return {
    ns,
    ...watcher,
    mutations,
    commit,
    updateTableScrollY
  }
}

export default useStore
