import {
  Fragment,
  ref,
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  onBeforeMount,
  onMounted,
  onBeforeUnmount
  // ref
} from 'vue'
import { componetName } from '@package/constant'
import { generateId } from '../../../util'
import useRender from './renderHelper'
import get from 'lodash/get'
import isString from 'lodash/isString'
export default defineComponent({
  name: componetName('TableColumn'),
  props: {
    // 列标题
    label: {
      type: String,
      default: undefined
    },
    // 列固定宽度
    width: {
      type: [String, Number],
      default: undefined
    },
    // 列最小宽度
    minWidth: {
      type: [String, Number],
      default: undefined
    },
    // 该列要展示数据的属性名
    prop: {
      type: String,
      default: undefined
    },
    // 该列是否要固定，接受布尔值或String: 'left', 'right'
    fixed: {
      type: [String, Boolean],
      default: undefined
    },
    // 表格内容文字对齐方式，left, center, right
    align: {
      type: String,
      default: 'left'
    },
    // 表头标题文字对齐方式，left, center, right
    headerAlign: {
      type: String,
      default: 'left'
    },
    // 自定义数据格式化函数
    formatter: {
      type: Function,
      default: undefined
    },
    // 列的类型, 目前仅支持expand
    type: {
      type: String,
      default: undefined
    },
    // 列宽不够时是否显示tooltip
    showOverflowTooltip: {
      type: Boolean,
      default: false
    },
    // 是否显示眼睛，睁闭眼功能(默认是闭眼状态)
    showEye: {
      type: Boolean,
      default: false
    },
    //表头合并的名称
    mergeName: {
      type: String,
      default: undefined
    },
    colSpan: {
      type: String,
      default: undefined
    }
  },

  setup(props, { slots }) {
    const instance = getCurrentInstance()
    const columnConfig = ref({ ...props, slots })
    const owner = computed(() => {
      let parent = instance.parent
      while (parent && !parent.tableId) {
        parent = parent.parent
      }
      return parent
    })

    const {
      columnId,
      isSubColumn,
      realHeaderAlign,
      columnOrTableParent,
      setColumnWidth,
      makeColumnRenders,
      getPropsData,
      getColumnElIndex,
      realAlign
    } = useRender(props, slots, owner)

    columnId.value = owner.value.tableId + '-' + generateId('column')

    const parent = columnOrTableParent.value

    onBeforeMount(() => {
      isSubColumn.value = owner.value !== parent
      const baseConfig = {
        columnId: columnId.value,
        prop: props.prop,
        align: realAlign,
        headerAlign: realHeaderAlign,
        eyeStatus: 'close'
      }
      const basicProps = [
        'label',
        'className',
        'labelClassName',
        'type',
        'formatter',
        'fixed',
        'showOverflowTooltip',
        'showEye',
        'mergeName',
        'colSpan'
      ]

      const column = { ...baseConfig, ...getPropsData(basicProps) }
      setColumnWidth(column)
      makeColumnRenders(column)
      columnConfig.value = column
    })

    onMounted(() => {
      const parent = columnOrTableParent.value
      const children = isSubColumn.value
        ? parent.vnode.el.children
        : get(parent, 'refs.hiddenColumns.children')
      const getColIndex = () =>
        getColumnElIndex(children || [], instance.vnode.el)
      columnConfig.value.getColIndex = getColIndex

      const columnIndex = getColIndex()
      columnIndex > -1 &&
        owner.value.store.commit(
          'insertColumn',
          columnConfig.value,
          isSubColumn.value ? parent.columnConfig.value : null
        )
    })

    onBeforeUnmount(() => {
      owner.value.store.commit(
        'removeColumn',
        columnConfig.value,
        isSubColumn.value ? parent.columnConfig.value : null
      )
    })

    instance.columnId = columnId

    instance.columnConfig = columnConfig

    instance.eyeStatus = 'close'
  },
  render() {
    try {
      const renderDefault =
        this.$slots.default &&
        this.$slots.default({
          row: {},
          column: {},
          $index: -1
        })
      const children = []
      if (Array.isArray(renderDefault)) {
        for (const childNode of renderDefault) {
          if (
            childNode.type?.name === 'ElTableColumn' ||
            childNode.shapeFlag & 2
          ) {
            children.push(childNode)
          } else if (
            childNode.type === Fragment &&
            Array.isArray(childNode.children)
          ) {
            childNode.children.forEach((vnode) => {
              // No rendering when vnode is dynamic slot or text
              if (
                vnode?.patchFlag !== 1024 &&
                !isString(get(vnode, 'children'))
              ) {
                children.push(vnode)
              }
            })
          }
        }
      }
      const vnode = h('div', children)
      return vnode
    } catch {
      return h('div', [])
    }
  }
})
