import Breadcrumb from './src/breadcrumb.vue'
import BreadcrumbItem from './src/breadcrumb-item.vue'

export default {
  install(app) {
    app.component(Breadcrumb.name, Breadcrumb)
    app.component(BreadcrumbItem.name, BreadcrumbItem)
  }
}
export { Breadcrumb, BreadcrumbItem }
