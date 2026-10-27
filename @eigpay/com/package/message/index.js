import Message from './src/message.vue'
import EPMessage from './src/messageLib'

export default {
  install(app) {
    app.component(Message.name, Message)
    app.config.globalProperties.$message = EPMessage
  }
}
export { Message, EPMessage }
