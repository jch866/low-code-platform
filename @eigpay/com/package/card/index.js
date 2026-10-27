import Card from './src/card.vue'

export default {
  install(app) {
    app.component(Card.name, Card)
  }
}
export { Card }
