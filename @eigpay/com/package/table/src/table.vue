<template>
  <div
    ref="tableWrapper"
    :class="[
      ns.b(),
      ns.m('striped', stripe),
      ns.m('enable-row-hover', enableRowHover)
    ]"
  >
    <div :class="ns.e('inner-wrapper')" :style="tableInnerStyle">
      <div ref="hiddenColumns" class="hide">
        <slot />
      </div>

      <div
        v-if="showHeader && tableLayout === 'fixed'"
        ref="headerWrapper"
        :class="[ns.e('header-wrapper')]"
      >
        <table
          ref="tableHeader"
          :class="ns.e('header')"
          :style="tableBodyStyles"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
          <col-group
            :table-layout="tableLayout"
            :columns="store.states.columns.value"
          ></col-group>
          <table-header
            ref="tableHeaderRef"
            :border="border"
            :store="store"
            :merge="props.needMerge"
          ></table-header>
        </table>
      </div>

      <div ref="bodyWrapper" :class="ns.e('body-wrapper')">
        <scroll-bar
          ref="scrollBarRef"
          :wrap-style="scrollbarStyle"
          :view-style="scrollbarViewStyle"
          @scroll="handleContentScroll"
        >
          <table
            ref="tableBody"
            :class="ns.e('body')"
            cellspacing="0"
            cellpadding="0"
            border="0"
            :style="{
              width: bodyWidth,
              tableLayout
            }"
          >
            <col-group
              :columns="store.states.columns.value"
              :table-layout="tableLayout"
            />
            <table-header
              v-if="showHeader && tableLayout === 'auto'"
              ref="tableHeaderRef"
              :border="border"
              :store="store"
              :merge="props.needMerge"
            />
            <table-body :store="store"></table-body>
          </table>
          <div
            v-if="isEmpty"
            ref="emptyBlock"
            :style="emptyBlockStyle"
            :class="ns.e('empty-block')"
          >
            <div>
              <slot name="empty">
                <div :class="ns.e('empty-figure')" />
                <div :class="ns.e('empty-text')">
                  {{ computedEmptyText }}
                </div>
              </slot>
            </div>
          </div>
        </scroll-bar>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getCurrentInstance,
  provide,
  computed,
  useSlots,
  defineComponent
} from 'vue'
import { generateId, buildCssNamespace } from '../../util'
import { hColgroup as ColGroup } from './colGroup/colGroup'
import ScrollBar from '../../scrollBar/src/scrollBar.vue'
import TableHeader from './tableHeader'
import TableBody from './tableBody'
import useStore from './store'
import TableLayout from './store/tableLayout'
import useStyle from './store/useStyle'
import debounce from 'lodash/debounce'
import { tableContextKey } from './tool'
import { useLocale } from '../../hooks/locale'
const slts = useSlots()
const props = defineProps({
  // 表格高度
  height: {
    type: [String, Number],
    default: undefined
  },
  // 表格最大高度
  maxHeight: {
    type: [String, Number],
    default: undefined
  },
  // 列的宽度是否自撑开
  fit: {
    type: Boolean,
    default: true
  },
  // 表格布局
  tableLayout: {
    type: String,
    default: 'fixed'
  },
  // 是否显示表头
  showHeader: {
    type: Boolean,
    default: true
  },
  // 是否显示边框
  border: {
    type: Boolean,
    default: false
  },
  // 斑马线显示行
  stripe: {
    type: Boolean,
    default: false
  },
  // 鼠标hover行数时是否有背景变化
  enableRowHover: {
    type: Boolean,
    default: true
  },
  // 展示的数据
  data: {
    type: Array,
    default: undefined
  },
  emptyText: {
    type: String,
    default: undefined
  },
  rowKey: {
    type: [String, Function],
    default: undefined
  },
  spanMethod: {
    type: Function,
    default: undefined
  },
  //是否需要合并表头
  needMerge: {
    type: Boolean,
    default: false
  }
})

const ns = buildCssNamespace('table')

const table = getCurrentInstance()

provide(tableContextKey, table)

const store = useStore()
table.store = store
const layout = new TableLayout({
  store,
  table,
  fit: props.fit,
  showHeader: props.showHeader
})
table.layout = layout

table.tableId = generateId('table')

const isEmpty = computed(() => (store.states.data.value || []).length === 0)

const { t } = useLocale()

const computedEmptyText = computed(() => props.emptyText || t('table.noData'))

const {
  isGroup,
  resizeState,
  doLayout,
  tableLayout,
  bodyWidth,
  tableBodyStyles,
  tableInnerStyle,
  scrollbarStyle,
  scrollbarViewStyle,
  emptyBlockStyle,
  handleContentScroll
} = useStyle(props, layout, store, table)

const debouncedUpdateLayout = debounce(doLayout, 50)

table.state = {
  isGroup,
  resizeState,
  doLayout,
  debouncedUpdateLayout
}
defineExpose({
  toggleRowExpansion: store.toggleRowExpansion,
  isRowExpanded: store.isRowExpanded
})

provide('tableSlots', slts)
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Table')
}
</script>
