import Form from './src/form.vue'
import FormItem from './src/formItem.vue'
import Validation from './src/validation'

export default {
  install(app) {
    app.component(Form.name, Form)
    app.component(FormItem.name, FormItem)
    app.config.globalProperties.$r = Validation
  }
}
export { Form, FormItem, Validation }
