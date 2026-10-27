<template>
  <div :style="{ width: '100%', maxWidth: '1000px' }">
    <ep-tab
      v-model="activeName"
      lazy
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <ep-tab-pane
        v-for="(item, index) in tabData"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
        {{ item.label }}
      </ep-tab-pane>
    </ep-tab>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const activeName = ref('one')
const tabData = ref([])

setTimeout(() => {
  tabData.value = [
    { label: '普通消费明细', name: 'one' },
    { label: 'IPP消费明细', name: 'two' },
    { label: '退货明细', name: 'third' },
    { label: '请款撤销明细', name: 'fourth' },
    { label: '争议交易明细', name: 'five' },
    { label: '交易手续费明细', name: 'six' },
    { label: '非交易费用明细', name: 'seven' },
    { label: '交易处理费明细', name: 'eigth' },
    { label: '分润明细', name: 'nine' },
    { label: '调账明细', name: 'ten' },
    { label: 'HOLD PARTIAL明细', name: 'one_one' },
    { label: 'RELEASE PARTIAL明细', name: 'one_two' }
  ]
}, 500)

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const handleChange = (name) => {
  console.log(name)
}
</script>
<script>
export default {
  name: 'TabDemo'
}
</script>
