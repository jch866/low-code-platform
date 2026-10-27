import Icon from './src/icon.vue'

export default {
  install(app) {
    app.component(Icon.name, Icon)
  }
}
export { Icon as EpIcon }
