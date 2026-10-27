<template>
  <div class="limit-w">
    <ep-table ref="table" :data="data">
      <ep-table-column label="" width="40" type="expand">
        <template #default="{ expanded }">
          <ep-icon
            icon="ep-i-arrow-to-right"
            :class="{ anim: true, 'expanded-icon': expanded }"
          ></ep-icon>
        </template>
        <template #expand="{ row }">
          <ep-table :data="row.subinfos">
            <ep-table-column prop="subNo" label="子编号" min-width="100" />
            <ep-table-column prop="name" label="名称" min-width="100" />
            <ep-table-column prop="status" label="状态" min-width="100" />
            <ep-table-column prop="amount" label="金额" min-width="100" />
          </ep-table>
        </template>
      </ep-table-column>
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
const data = ref([
  {
    seqId: '158514516323493056',
    bankNo: '434HA63455',
    status: '交易已完成',
    amount: '34550.00',
    subinfos: [
      {
        subNo: 'R0001',
        name: 'Row1',
        status: 'Completed',
        amount: '345'
      },
      {
        subNo: 'R0002',
        name: 'Row2',
        status: 'Completed',
        amount: '346'
      },
      {
        subNo: 'R0003',
        name: 'Row3',
        status: 'Completed',
        amount: '347'
      }
    ]
  },
  {
    seqId: '158514543434493059',
    bankNo: '34537755',
    status: '交易进行中',
    amount: '1343550.00',
    subinfos: [
      {
        subNo: 'R1001',
        name: 'Row1',
        status: 'Queuing',
        amount: '345'
      },
      {
        subNo: 'R1002',
        name: 'Row2',
        status: 'Queuing',
        amount: '346'
      },
      {
        subNo: 'R1003',
        name: 'Row3',
        status: 'Queuing',
        amount: '347'
      }
    ]
  },
  {
    seqId: '127514543434493080',
    bankNo: '554537755',
    status: '交易进行中',
    amount: '963450.00',
    subinfos: []
  }
])
const detailInfo = ref({})
const handleDetail = (row) => {
  row.checked = !row.checked
  detailInfo.value = row
}
</script>
<style scoped>
.limit-w {
  max-width: 1000px;
}
.expanded-icon {
  @apply rotate-90;
}
.anim {
  @apply transition;
}
</style>
