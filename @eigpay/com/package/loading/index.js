import Loading from './src/loading.vue'
import EPLoading from './src/loadingLlib'

export default {
  install(app) {
    app.component(Loading.name, Loading)
    app.config.globalProperties.$loading = EPLoading
  }
}
export { Loading, EPLoading }
