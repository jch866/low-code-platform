<template>
  <div
    v-if="state.tableOperation.length <= 2"
    class="table-operation table-operation-simple"
  >
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
  <div v-else class="table-operation table-operation-more">
    <ep-button
      class="button-text text-button"
      plain
      type="primary"
      @click="operationItem(state.tableOperation[0])"
      >{{ $t(state.tableOperation[0].text) }}</ep-button
    >
    <span class="split">|</span>
    <ep-popover
      v-model="state.visible"
      effect="light"
      trigger="click"
      class="table-operation-popover"
    >
      <template #reference>
        <ep-button plain type="primary" class="text text-button">
          {{ $t('common.oprationField.more') }}
        </ep-button>
      </template>
      <div
        v-for="(item, i) in state.tableOperation.slice(1)"
        :key="item.text + i"
        class="table-operation-item"
        @click="operationItem(item, '1')"
      >
        <ep-button plain type="primary" class="text text-button">{{
          $t(item.text)
        }}</ep-button>
      </div>
    </ep-popover>
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
  item.methods(props.row)
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
