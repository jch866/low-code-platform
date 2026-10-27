<script>
import { defineComponent, h, inject } from 'vue'
import { buildCssNamespace } from '@package/util'

export default defineComponent({
  name: 'ElTreeNodeContent',
  props: {
    node: {
      type: Object,
      required: true
    },
    renderContent: Function
  },
  setup(props) {
    const ns = buildCssNamespace('tree')
    const nodeInstance = inject('NodeInstance')
    const tree = inject('RootTree')
    return () => {
      const node = props.node
      const { data, store } = node
      return props.renderContent
        ? props.renderContent(h, { _self: nodeInstance, node, data, store })
        : tree.ctx.slots.default
        ? tree.ctx.slots.default({ node, data })
        : h('span', { class: ns.em('node', 'label') }, [node.label])
    }
  }
})
</script>
