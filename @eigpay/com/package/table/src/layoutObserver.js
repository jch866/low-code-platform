// @ts-nocheck
import {
  computed,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onUnmounted,
  onUpdated
} from 'vue'

// 布局变化监听器
function useLayoutObserver(tableInstance) {
  const instance = getCurrentInstance()
  const tableLayout = computed(() => {
    const layout = tableInstance.layout
    if (!layout) {
      throw new Error('Can not find table layout.')
    }
    return layout
  })
  //当列有变化时，从layout中拿到所有的列(一维)，也根据layout中计算的每一列的实际宽度，设置对应的[colgroup > col]的width属性
  const onColumnsChange = (layout) => {
    const cols =
      tableInstance.vnode.el?.querySelectorAll('colgroup > col') || []
    if (!cols.length) return
    const flattenColumns = layout.getFlattenColumns()
    const columnsMap = {}
    flattenColumns.forEach((column) => {
      columnsMap[column.columnId] = column
    })
    for (let i = 0, j = cols.length; i < j; i++) {
      const col = cols[i]
      const name = col.getAttribute('name')
      const column = columnsMap[name]
      if (column) {
        col.setAttribute('width', column.realWidth || column.width)
      }
    }
  }

  onBeforeMount(() => {
    // 把当前实例添加到layout的观察者中
    tableLayout.value.addObserver(instance)
  })
  onMounted(() => {
    // 当前实例挂载后就先执行一次
    onColumnsChange(tableLayout.value)
  })
  onUpdated(() => {
    // 当前实例有更新也先执行一次
    onColumnsChange(tableLayout.value)
  })
  onUnmounted(() => {
    // 把当前实例从layout的观察者中移除
    tableLayout.value.removeObserver(instance)
  })

  return {
    tableLayout: tableLayout.value,
    onColumnsChange
  }
}

export default useLayoutObserver
