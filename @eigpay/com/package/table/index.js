import Table from './src/table.vue'
import TableColumn from './src/tableColumn/index'

export default {
  install(app) {
    app.component(Table.name, Table)
    app.component(TableColumn.name, TableColumn)
    // app.component(CheckboxGroup.name, CheckboxGroup)
  }
}
export { Table, TableColumn }
