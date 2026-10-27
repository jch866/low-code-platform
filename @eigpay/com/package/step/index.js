import Step from './src/step.vue'
import StepItem from './src/stepItem.vue'

export default {
  install(app) {
    app.component(Step.name, Step)
    app.component(StepItem.name, StepItem)
  }
}
export { Step, StepItem }
