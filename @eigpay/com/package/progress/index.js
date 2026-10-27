import Progress from './src/progress.vue'

export default {
  install(app) {
    app.component(Progress.name, Progress)
  }
}
export { Progress }
