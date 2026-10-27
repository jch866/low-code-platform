<template>
  <div>
    <ep-button @click="switchMethod">切换是否显示</ep-button>
    <ep-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 100, 200, 300, 400]"
      :total="100"
      :hide-on-single-page="isshow"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
const currentPage4 = ref(1)
const pageSize4 = ref(100)
const isshow = ref(false)

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}

function switchMethod() {
  isshow.value = !isshow.value
}
</script>
<script>
export default {
  name: 'PaginationHideonpage'
}
</script>
