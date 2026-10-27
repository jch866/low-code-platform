import Popover from './src/popover.vue'

export default {
  install(app) {
    app.component(Popover.name, Popover)
  }
}
export { Popover }
