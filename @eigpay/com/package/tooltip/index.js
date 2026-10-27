import Tooltip from './src/tooltip.vue'

export default {
  install(app) {
    app.component(Tooltip.name, Tooltip)
  }
}
export { Tooltip }
