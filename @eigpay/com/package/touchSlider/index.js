import TouchSlider from './src/index.vue'

export default {
  install(app) {
    app.component(TouchSlider.name, TouchSlider)
  }
}
export { TouchSlider }
