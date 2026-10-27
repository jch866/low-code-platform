import DatePicker from './src/datePicker.vue'

export default {
  install(app) {
    app.component(DatePicker.name, DatePicker)
  }
}
export { DatePicker }
