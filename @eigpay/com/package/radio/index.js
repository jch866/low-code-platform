import Radio from './src/radio.vue'
import RadioGroup from './src/radioGroup.vue'

export default {
  install(app) {
    app.component(Radio.name, Radio)
    app.component(RadioGroup.name, RadioGroup)
  }
}
export { Radio, RadioGroup }
