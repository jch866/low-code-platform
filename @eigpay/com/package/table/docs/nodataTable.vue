<template>
  <div class="limit-w">
    <ep-table
      ref="table"
      :data="data"
      empty-text="暂无数据"
      @row-click="handleRowClick"
    >
      <ep-table-column prop="seqId" label="流水号" min-width="100" />
      <ep-table-column prop="bankNo" label="接收行号" width="100" />
      <ep-table-column prop="status" label="业务主状态" />
      <ep-table-column
        prop="amount"
        label="金额"
        align="right"
        header-align="right"
      />
      <ep-table-column label="操作" align="center">
        <template #default="{ row }">
          <ep-button @click="handleDetail(row)">详情</ep-button>
        </template>
      </ep-table-column>
    </ep-table>
  </div>
  <p>详情信息: {{ detailInfo }}</p>
</template>
<script setup>
import { ref } from 'vue'
const table = ref()
const data = ref([])
const detailInfo = ref({})
const handleDetail = (row) => {
  detailInfo.value = row
}
const handleRowClick = (...args) => {
  console.log(...args)
}
</script>
<style scoped>
.limit-w {
  max-width: 1000px;
}
</style>
