<template>
  <div class="limit-w">
    <ep-form>
      <ep-table
        need-merge="true"
        ref="table"
        :data="data"
        @row-click="handleRowClick"
      >
        <ep-table-column
          prop="seqId"
          label="流水号1"
          min-width="100"
          show-eye
          show-overflow-tooltip
          merge-name="col1"
          col-span="2"
        />
        <ep-table-column
          show-overflow-tooltip
          prop="bankNo"
          label="接收行号"
          width="100"
          merge-name="col1"
        />
        <ep-table-column
          prop="status"
          label="业务主状态"
          min-width="120"
          merge-name="col2"
          col-span="2"
        />
        <ep-table-column label="选择型号" min-width="120" merge-name="col2">
          <template #default="{ row }">
            <ep-form-item style="margin-bottom: 0">
              <ep-select v-model="row.sel">
                <ep-option v-for="o in list" :key="o" :label="o" :value="o" />
              </ep-select>
            </ep-form-item>
          </template>
        </ep-table-column>
        <ep-table-column label="商户行名称" min-width="120">
          <template #default="{ row }">
            <ep-form-item style="margin-bottom: 0">
              <ep-input
                v-model="row.inputValue"
                placeholder="请输入"
              ></ep-input>
            </ep-form-item>
          </template>
        </ep-table-column>
        <ep-table-column label="单选框列" min-width="140">
          <template #default="{ row }">
            <ep-form-item style="margin-bottom: 0">
              <ep-radio v-model="row.radioModel" value="Apple" label="是" />
              <ep-radio v-model="row.radioModel" value="Banana" label="否" />
            </ep-form-item>
          </template>
        </ep-table-column>

        <ep-table-column label="复选框列" min-width="180">
          <template #default="{ row }">
            <ep-form-item style="margin-bottom: 0">
              <ep-checkbox
                v-model="row.apple"
                true-value="Apple"
                false-value="BadApple"
                label="Apple"
              />
              <ep-checkbox v-model="row.watermelon">Water</ep-checkbox>
            </ep-form-item>
          </template>
        </ep-table-column>

        <ep-table-column label="切换列" min-width="100">
          <template #default="{ row }">
            <ep-form-item style="margin-bottom: 0">
              <ep-switch
                v-model="row.modelBool"
                :active-value="true"
                :inactive-value="false"
              />
            </ep-form-item>
          </template>
        </ep-table-column>

        <ep-table-column label="日期列" min-width="120">
          <template #default="{ row }">
            <ep-form-item style="margin-bottom: 0">
              <ep-date-picker
                v-model="row.date"
                placeholder="请选择日期"
              ></ep-date-picker>
            </ep-form-item>
          </template>
        </ep-table-column>

        <ep-table-column
          prop="amount"
          label="金额"
          align="right"
          header-align="right"
          show-eye
          min-width="130"
        />
        <ep-table-column label="操作" align="center">
          <template #default="{ row }">
            <ep-button @click="handleDetail(row)">详情</ep-button>
          </template>
        </ep-table-column>
      </ep-table>
    </ep-form>
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
    sel: ''
  },
  {
    seqId: '158514543434493059',
    bankNo: '34537755',
    status: '交易进行中',
    amount: '1343550.00',
    sel: ''
  },
  {
    seqId: '127514543434493059',
    bankNo: '554537755',
    status: '交易进行中',
    amount: '963450.00',
    sel: ''
  }
])

const list = ref(['A', 'B'])

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
