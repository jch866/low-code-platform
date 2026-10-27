import TimePicker from './src/timePicker.vue'

export default {
  install(app) {
    app.component(TimePicker.name, TimePicker)
  }
}
export { TimePicker }
