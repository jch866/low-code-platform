import Anchor from './src/anchor.vue'
import AnchorItem from './src/anchorItem.vue'

export default {
  install(app) {
    app.component(Anchor.name, Anchor)
    app.component(AnchorItem.name, AnchorItem)
  }
}
export { Anchor, AnchorItem }
