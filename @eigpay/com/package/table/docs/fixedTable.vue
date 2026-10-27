<template>
  <div class="limit-w">
    <ep-table ref="table" :data="data" table-layout="fixed" :max-height="400">
      <ep-table-column
        prop="seqId"
        label="流水号"
        fixed="left"
        min-width="200"
      />
      <ep-table-column prop="bankNo" label="接收行号" width="200" />
      <ep-table-column prop="status" label="业务主状态" width="200" />
      <ep-table-column
        prop="amount"
        label="金额"
        align="right"
        header-align="right"
        width="250"
      />
      <ep-table-column prop="percent" label="占比" width="150" />
      <ep-table-column prop="e2eNo" label="端到端指示号" width="150" />
      <ep-table-column prop="status" label="业务主状态" width="150" />
      <ep-table-column prop="createTime" label="创建时间" width="150" />
      <ep-table-column label="操作" fixed="right" width="200">
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
for (let i = 1; i < 10; i++) {
  const salt = Number.parseInt(Math.random() * 100)
  data.value.push({
    seqId: `158514516323493${salt}`,
    bankNo: '434HA63455',
    status: '交易已完成',
    amount: `3455${salt}0.00`,
    e2eNo: `${salt}0`,
    percent: `${salt}%`,
    createTime: `2099-12-19`
  })
}
const detailInfo = ref({})
const handleDetail = (row) => {
  detailInfo.value = row
}
</script>
<style scoped>
.limit-w {
  max-width: 1000px;
}
</style>
