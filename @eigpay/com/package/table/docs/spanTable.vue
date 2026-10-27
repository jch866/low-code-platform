<template>
  <div class="limit-w">
    <ep-table ref="table" :data="data" :span-method="arraySpan">
      <ep-table-column prop="seqId" label="流水号" min-width="100">
        <template #default="{ rowIndex, row }">
          <span v-if="rowIndex < data.length - 1">
            {{ row.seqId }}
          </span>
          <div v-else style="text-align: right">Total Amount:</div>
        </template>
      </ep-table-column>
      <ep-table-column prop="bankNo" label="接收行号" width="150" />
      <ep-table-column prop="status" label="业务主状态">
        <template #default="{ rowIndex, row }">
          <span v-if="rowIndex < data.length - 1">
            {{ row.status }}
          </span>
          <div v-else style="text-align: left">
            {{ totalAmount }}
          </div>
        </template>
      </ep-table-column>
      <ep-table-column
        prop="amount"
        label="金额"
        align="right"
        header-align="right"
      />
    </ep-table>
    <p></p>
    <ep-table ref="table" :data="data" :span-method="objectSpan">
      <ep-table-column prop="seqId" label="流水号" min-width="100" />
      <ep-table-column prop="bankNo" label="接收行号" width="150" />
      <ep-table-column prop="status" label="业务主状态" />
      <ep-table-column
        prop="amount"
        label="金额"
        align="right"
        header-align="right"
        width="120"
      />
    </ep-table>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const table = ref()
const data = ref([
  {
    seqId: '158514516323493056',
    bankNo: '434HA63455',
    status: '交易已完成',
    amount: '34550.00'
  },
  {
    seqId: '158514543434493059',
    bankNo: '34537755',
    status: '交易进行中',
    amount: '1343550.00'
  },
  {
    seqId: '127514543434493059',
    bankNo: '554537755',
    status: '交易进行中',
    amount: '963450.00'
  },
  {}
])
const totalAmount = computed(() => {
  return data.value.reduce((sum, row) => {
    sum += row.amount ? Number(row.amount) : 0
    return sum
  }, 0)
})
const arraySpan = (row, column, rowIndex, columnIndex) => {
  //自定义样式
  let tdClass = 'customclass'
  if (rowIndex == 1 && columnIndex == 0) {
    return [1, 1, tdClass]
  }
  if (rowIndex === data.value.length - 1) {
    let rowspan = 0
    let colspan = 0
    if (columnIndex === 0 || columnIndex === 2) {
      rowspan = 1
      colspan = 2
    }
    return [rowspan, colspan, tdClass]
  }
}
const objectSpan = (row, column, rowIndex, columnIndex) => {
  //自定义样式
  let tdClass = 'customclass'
  if (rowIndex == 1 && columnIndex == 0) {
    return [1, 1, tdClass]
  }
  if (rowIndex % 2 === 1 && columnIndex === 2) {
    let rowspan = 2
    let colspan = 1

    return { rowspan, colspan, tdClass }
  } else if (columnIndex === 2 && rowIndex > 1) {
    return { rowspan: 0, colspan: 0, tdClass }
  }
}
</script>
<style scoped>
.limit-w {
  max-width: 1000px;
}
</style>
