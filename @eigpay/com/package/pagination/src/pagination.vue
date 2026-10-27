<template>
  <div
    v-if="!(hideOnSinglePage && pageCountBridge === 1)"
    :class="[ns.b(), ns.is('background', isBackground)]"
  >
    <Total
      :total="props.total"
      :disabled="props.disable"
      :total-describe="props.totalDescribe"
    />
    <Prev
      :disabled="props.disable"
      :current-page="currentPageBridge"
      @click="prev"
    />
    <Pager
      :disabled="props.disable"
      :page-count="pageCountBridge"
      :current-page="currentPageBridge"
      @change="handleCurrentChange"
    />
    <Next
      :disabled="props.disable"
      :current-page="currentPageBridge"
      :page-count="pageCountBridge"
      @click="next"
    />
    <Sizes
      :disabled="props.disable"
      :page-size="pageSizeBridge"
      :page-sizes="props.pageSizes"
      @page-size-change="handleSizeChange"
    />
    <Jumper
      :disabled="props.disable"
      :page-count="pageCountBridge"
      :current-page="currentPageBridge"
      @input-changed="handleInputChange"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, getCurrentInstance } from 'vue'
import isNumber from 'lodash/isNumber'
import Prev from './components/prev.vue'
import Next from './components/next.vue'
import Sizes from './components/sizes.vue'
import Jumper from './components/jumper.vue'
import Total from './components/total.vue'
import Pager from './components/pager.vue'
import { buildCssNamespace } from '@package/util'

const props = defineProps({
  total: {
    type: Number,
    default: 0,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40, 50, 100]
  },
  totalDescribe: {
    type: String,
    default: undefined
  },
  background: Boolean,
  disable: Boolean,
  hideOnSinglePage: Boolean
})

const emit = defineEmits([
  'update:current-page',
  'update:page-size',
  'size-change',
  'current-change',
  'prev-click',
  'next-click'
])

const ns = buildCssNamespace('pagination')
const isBackground = computed(() => props.background)

const vnodeProps = getCurrentInstance().vnode.props || {}
const hasCurrentPageListener =
  'onUpdate:currentPage' in vnodeProps ||
  'onUpdate:current-page' in vnodeProps ||
  'onCurrentChange' in vnodeProps
const hasPageSizeListener =
  'onUpdate:pageSize' in vnodeProps ||
  'onUpdate:page-size' in vnodeProps ||
  'onSizeChange' in vnodeProps

const innerPageSize = ref(10)
const innerCurrentPage = ref(1)

const pageSizeBridge = computed({
  get() {
    return isNumber(props.pageSize) ? props.pageSize : innerPageSize.value
  },
  set(val) {
    if (!isNumber(props.pageSize)) {
      innerPageSize.value = val
    }
    if (hasPageSizeListener) {
      emit('update:page-size', val)
      emit('size-change', val)
    }
  }
})

const pageCountBridge = computed(() => {
  let pageCount = 0
  if (isNumber(props.total)) {
    pageCount = Math.max(1, Math.ceil(props.total / pageSizeBridge.value))
  }
  return pageCount
})

const currentPageBridge = computed({
  get() {
    return isNumber(props.currentPage)
      ? props.currentPage
      : innerCurrentPage.value
  },
  set(val) {
    let newCurrentPage = val
    if (val < 1) {
      newCurrentPage = 1
    } else if (val > pageCountBridge.value) {
      newCurrentPage = pageCountBridge.value
    }
    if (!isNumber(props.currentPage)) {
      innerCurrentPage.value = newCurrentPage
    }
    if (hasCurrentPageListener) {
      emit('update:current-page', newCurrentPage)
      emit('current-change', newCurrentPage)
    }
  }
})

watch(pageCountBridge, (val) => {
  if (currentPageBridge.value > val) {
    currentPageBridge.value = val
  }
})

function handleInputChange(val) {
  currentPageBridge.value = val
}

function handleCurrentChange(val) {
  currentPageBridge.value = val
}

function handleSizeChange(val) {
  pageSizeBridge.value = val
  const newPageCount = pageCountBridge.value
  if (currentPageBridge.value > newPageCount) {
    currentPageBridge.value = newPageCount
  }
}

function prev() {
  if (props.disable) {
    return
  }
  currentPageBridge.value -= 1
  emit('prev-click', currentPageBridge.value)
}

function next() {
  if (props.disable) {
    return
  }
  currentPageBridge.value += 1
  emit('next-click', currentPageBridge.value)
}
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Pagination')
}
</script>
