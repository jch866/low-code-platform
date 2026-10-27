import Tab from './src/tab.vue'
import TabPane from './src/tabPane.vue'

export default {
  install(app) {
    app.component(Tab.name, Tab)
    app.component(TabPane.name, TabPane)
  }
}
export { Tab, TabPane }
