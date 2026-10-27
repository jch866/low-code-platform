import Button from './src/index.vue'

export default {
  install(app) {
    app.component(Button.name, Button)
  }
}
export { Button }
