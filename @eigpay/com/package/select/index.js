import Select from './src/select.vue'
import Option from './src/option.vue'

export default {
  install(app) {
    app.component(Select.name, Select)
    app.component(Option.name, Option)
  }
}
export { Select, Option }
