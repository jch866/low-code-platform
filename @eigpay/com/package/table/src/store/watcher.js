import { getCurrentInstance, ref, watch } from 'vue'
import useExpand from './expand'

// 把column和子column 压成一维数组
const doFlatColumns = (columns) => {
  const result = []
  columns.forEach((column) => {
    if (column.children) {
      result.push.apply(result, doFlatColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

function useWatcher() {
  const tableInstance = getCurrentInstance() // 当前table实例
  const data = ref([]) // 数据
  const _data = ref([]) // 数据私有属性
  const isComplex = ref(false) // 是不是有固定列
  const _columns = ref([]) // 所有列私有属性
  const originColumns = ref([]) // 所有列, 但不含子column
  const columns = ref([]) // 所有列, 在一个一维数组中
  const fixedColumns = ref([]) // 左fixed列
  const rightFixedColumns = ref([]) // 右fixed列
  const leafColumns = ref([]) // 非fixed列
  const fixedLeafColumns = ref([]) //左fixed列一维数组
  const rightFixedLeafColumns = ref([]) //右fixed列一维数组
  const leafColumnsLength = ref(0) // 非fixed列的数量
  const fixedLeafColumnsLength = ref(0) // 左fixed列一维数组的length
  const rightFixedLeafColumnsLength = ref(0) // 右fixed列一维数组的length

  watch(data, () => tableInstance.state && scheduleLayout(false), {
    deep: true
  })

  // 更新 fixed
  const updateChildFixed = (column) => {
    column.children &&
      column.children.forEach((childColumn) => {
        childColumn.fixed = column.fixed
        updateChildFixed(childColumn)
      })
  }
  // 更新列
  const updateColumns = () => {
    _columns.value.forEach((column) => {
      updateChildFixed(column)
    })
    // fixed or left fixed columns
    fixedColumns.value = _columns.value.filter(
      (column) => column.fixed === true || column.fixed === 'left'
    )
    // fixed to right columns
    rightFixedColumns.value = _columns.value.filter(
      (column) => column.fixed === 'right'
    )
    // none fixed columns
    const notFixedColumns = _columns.value.filter((column) => !column.fixed)
    // 合并所有列，不包括子column
    originColumns.value = []
      .concat(fixedColumns.value)
      .concat(notFixedColumns)
      .concat(rightFixedColumns.value)
    //
    const leafColumns = doFlatColumns(notFixedColumns)
    const fixedLeafColumns = doFlatColumns(fixedColumns.value)
    const rightFixedLeafColumns = doFlatColumns(rightFixedColumns.value)

    // 各种列的数量
    leafColumnsLength.value = leafColumns.length
    fixedLeafColumnsLength.value = fixedLeafColumns.length
    rightFixedLeafColumnsLength.value = rightFixedLeafColumns.length
    //合并所有列
    columns.value = []
      .concat(fixedLeafColumns)
      .concat(leafColumns)
      .concat(rightFixedLeafColumns)
    isComplex.value =
      fixedColumns.value.length > 0 || rightFixedColumns.value.length > 0
  }
  // 更新 DOM
  const scheduleLayout = (needUpdateColumns, immediate = false) => {
    if (needUpdateColumns) {
      updateColumns()
    }
    if (immediate) {
      tableInstance.state.doLayout()
    } else {
      tableInstance.state.debouncedUpdateLayout()
    }
  }

  const {
    toggleRowExpansion,
    updateExpandRows,
    states: expandStates,
    isRowExpanded
  } = useExpand()

  return {
    updateColumns,
    scheduleLayout,
    toggleRowExpansion,
    isRowExpanded,
    updateExpandRows,
    states: {
      data,
      _data,
      isComplex,
      _columns,
      originColumns,
      columns,
      fixedColumns,
      rightFixedColumns,
      leafColumns,
      fixedLeafColumns,
      rightFixedLeafColumns,
      leafColumnsLength,
      fixedLeafColumnsLength,
      rightFixedLeafColumnsLength,
      ...expandStates
    }
  }
}

export default useWatcher
