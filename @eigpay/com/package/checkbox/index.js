import Checkbox from './src/checkbox.vue'
// import CheckboxGroup from './src/checkboxGroup.vue'

export default {
  install(app) {
    app.component(Checkbox.name, Checkbox)
    // app.component(CheckboxGroup.name, CheckboxGroup)
  }
}
export { Checkbox }
