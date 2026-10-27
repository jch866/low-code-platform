import ScrollBar from './src/scrollBar.vue'

export default {
  install(app) {
    app.component(ScrollBar.name, ScrollBar)
  }
}
export { ScrollBar }
