import Tag from './src/tag.vue'

export default {
  install(app) {
    app.component(Tag.name, Tag)
  }
}
export { Tag }
