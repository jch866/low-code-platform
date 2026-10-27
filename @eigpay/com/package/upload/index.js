import Upload from './src/upload.vue'

export default {
  install(app) {
    app.component(Upload.name, Upload)
  }
}
export { Upload }
