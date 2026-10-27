import DatePickerApp from './src/datePickerApp.vue'

export default {
  install(app) {
    app.component(DatePickerApp.name, DatePickerApp)
  }
}
export { DatePickerApp }
