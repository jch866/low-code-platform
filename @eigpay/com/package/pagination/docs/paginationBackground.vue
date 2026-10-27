<template>
  <div>
    <ep-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 100, 200, 300, 400]"
      :total-describe="`total ${40000}`"
      :disabled="disabled"
      background
      :total="40000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
const currentPage4 = ref(4)
const pageSize4 = ref(10)
const disabled = ref(false)

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}
</script>
<script>
export default {
  name: 'PaginationBackground'
}
</script>
