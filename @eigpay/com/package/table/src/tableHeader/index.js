import {
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  computed,
  renderSlot
} from 'vue'
import useLayoutObserver from '../layoutObserver'
import { tableContextKey } from '../tool'
import { buildCssNamespace } from '../../../util'
import useEvent from '../store/useEvent'
let slots
export default defineComponent({
  props: {
    fixed: {
      type: String,
      default: ''
    },
    store: {
      type: Object,
      required: true
    },
    border: {
      type: Boolean,
      default: false
    },
    //是否需要合并表头
    merge: {
      type: Boolean,
      default: false
    }
  },
  setup(props, slts) {
    slots = slts
    //table实例
    const tableInstance = inject(tableContextKey)
    // 当前header实例
    const headerInstance = getCurrentInstance()

    //创建layout 变化时的回调函数
    const { onColumnsChange } = useLayoutObserver(tableInstance)

    // header实例设置state, 是为了给layout进行回调
    headerInstance.state = {
      onColumnsChange
    }
    const columns = computed(() => {
      return props.store.states.columns.value
    })
    const { handleEyeClick } = useEvent(props)
    return {
      columns,
      ns: buildCssNamespace('table'),
      handleEyeClick
    }
  },
  render(getup, context) {
    const ns = this.ns
    const { handleEyeClick } = this
    const template = inject('tableSlots')

    if (getup.merge) {
      let mergeName,
        mergeObj = {}
      return h('thead', [
        h(
          'tr',
          this.columns.map((column, index) => {
            mergeName = column.mergeName
            if (!mergeName) {
              return h(
                'th',
                {
                  class: [
                    ns.e('cell'),
                    column.headerAlign,
                    column.fixed === true ||
                      column.fixed === '' ||
                      column.fixed === 'left'
                      ? ns.e('column-fixed-left')
                      : '',
                    column.fixed === 'right' ? ns.e('column-fixed-right') : ''
                  ],
                  key: column.id,
                  rowspan: 2
                },
                [
                  h(
                    'div',
                    { class: ['cell', column.showEye ? 'is-eye' : ''] },
                    [
                      column.headerRender
                        ? column.headerRender({ column, index })
                        : column.label,
                      column.showEye &&
                      h(
                        'i',
                        column.eyeStatus === 'open'
                          ? {
                            class: 'eigpay-icon ep-i-view ep-icon',
                            onClick: ($event) =>
                              handleEyeClick($event, column, 'close')
                          }
                          : {
                            class: 'eigpay-icon ep-i-hide ep-icon',
                            onClick: ($event) =>
                              handleEyeClick($event, column, 'open')
                          }
                      )
                    ]
                  )
                ]
              )
            } else {
              if (!mergeObj[mergeName]) {
                mergeObj[mergeName] = 1
                return h(
                  'th',
                  {
                    class: [ns.e('cell'), 'ep-th-merged'],
                    key: column.id || Math.random(),
                    colspan: column.colSpan
                  },
                  [mergeName]
                )
              }
            }
          })
        ),
        h(
          'tr',
          this.columns.map(
            (column, index) =>
              column.mergeName &&
              h(
                'th',
                {
                  class: [ns.e('cell'), column.headerAlign],
                  key: column.id,
                  colspan: null
                },
                [
                  h(
                    'div',
                    { class: ['cell', column.showEye ? 'is-eye' : ''] },
                    [
                      column.headerRender
                        ? column.headerRender({ column, index })
                        : column.label,
                      column.showEye &&
                      h(
                        'i',
                        column.eyeStatus === 'open'
                          ? {
                            class: 'eigpay-icon ep-i-view ep-icon',
                            onClick: ($event) =>
                              handleEyeClick($event, column, 'close')
                          }
                          : {
                            class: 'eigpay-icon ep-i-hide ep-icon',
                            onClick: ($event) =>
                              handleEyeClick($event, column, 'open')
                          }
                      )
                    ]
                  )
                ]
              )
          )
        )
      ])
    } else
      return h('thead', [
        h(template.tableHeaderMerge),
        h(
          'tr',
          this.columns.map((column, index) =>
            h(
              'th',
              {
                class: [
                  ns.e('cell'),
                  column.headerAlign,
                  column.fixed === true ||
                    column.fixed === '' ||
                    column.fixed === 'left'
                    ? ns.e('column-fixed-left')
                    : '',
                  column.fixed === 'right' ? ns.e('column-fixed-right') : ''
                ],
                key: column.id,
                colspan: null
              },
              [
                h('div', { class: ['cell', column.showEye ? 'is-eye' : ''] }, [
                  column.headerRender
                    ? column.headerRender({ column, index })
                    : column.label,
                  column.showEye &&
                  h(
                    'i',
                    column.eyeStatus === 'open'
                      ? {
                        class: 'eigpay-icon ep-i-view ep-icon',
                        onClick: ($event) =>
                          handleEyeClick($event, column, 'close')
                      }
                      : {
                        class: 'eigpay-icon ep-i-hide ep-icon',
                        onClick: ($event) =>
                          handleEyeClick($event, column, 'open')
                      }
                  )
                ])
              ]
            )
          )
        )
      ])
  }
})
