import Badge from './src/badge.vue'

export default {
  install(app) {
    app.component(Badge.name, Badge)
  }
}
export { Badge }
