import Collapse from './src/collapse.vue'
import CollapseItem from './src/collapseItem.vue'

export default {
  install(app) {
    app.component(Collapse.name, Collapse)
    app.component(CollapseItem.name, CollapseItem)
  }
}
export { Collapse, CollapseItem }
