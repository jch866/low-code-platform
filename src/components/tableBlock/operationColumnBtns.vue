<template>
<!-- 平铺操作按钮 -->
  <div class="table-operation table-operation-simple">
    <span
      v-for="(item, i) in state.tableOperation"
      :key="item.text + i"
      class="table-operation-item"
      @click="operationItem(item)"
    >
      <ep-button plain type="primary" class="button-text text-button">
        {{ $t(item.text) }}
      </ep-button>
      <span v-if="i !== state.tableOperation.length - 1" class="split">
        |
      </span>
    </span>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({
  tableOperation: {
    type: Array,
    default: () => []
  },
  row: {
    type: Object,
    default: () => {}
  },
  rowIndex: {
    type: Number,
    default: () => 0
  },
  handleFunc: {
    type: Function,
    default: () => null
  }
})
const state = reactive({
  visible: false,
  tableOperation: []
})

const operationItem = (item, type) => {
  item.methods(props.row, props.rowIndex)
  type === '1' && (state.visible = false)
}
watch(
  () => props.tableOperation,
  (newV) => {
    newV.forEach((item) => item.isShow === true)
    state.tableOperation = newV
  },
  { immediate: true, deep: true }
)
watch(
  () => props.row,
  (newV) => {
    if (props.handleFunc(newV)) {
      const tableOperation = props.handleFunc(newV)
      state.tableOperation = tableOperation.filter((item) => item.isShow)
    }
  },
  { immediate: true, deep: true }
)
</script>

<script>
export default {
  name: 'OperationCloumn'
}
</script>
