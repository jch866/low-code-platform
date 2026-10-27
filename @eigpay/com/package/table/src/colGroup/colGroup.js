import { h } from 'vue'
export function hColgroup(props) {
  const isAuto = props.tableLayout === 'auto'
  let columns = props.columns || []
  // 如果是自动布局并且所有的column没有width，就不需要生成colgroup的col
  if (isAuto) {
    if (columns.every((column) => column.width === undefined)) {
      columns = []
    }
  }
  const getPropsData = (column) => {
    const propsData = {
      key: `${props.tableLayout}_${column.columnId}`,
      style: {},
      name: column.columnId
    }
    if (isAuto) {
      propsData.style = {
        width: `${column.width}px`
      }
    }
    return propsData
  }

  return h(
    'colgroup',
    {},
    columns.map((column) => h('col', getPropsData(column)))
  )
}

hColgroup.props = ['columns', 'tableLayout']
