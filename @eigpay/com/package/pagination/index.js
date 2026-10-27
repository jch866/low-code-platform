import Pagination from './src/pagination.vue'

export default {
  install(app) {
    app.component(Pagination.name, Pagination)
  }
}
export { Pagination }
