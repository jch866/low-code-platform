import Tree from './src/tree.vue'
export default {
  install(app) {
    app.component(Tree.name, Tree)
  }
}
export { Tree }
