<template>
  <div class="limit-w">
    <ep-table ref="table" :data="data">
      <ep-table-column width="80">
        <template #header>
          <ep-checkbox
            ref="selectAll"
            v-model="isAll"
            :indeterminate="indeterminate"
            @change="handleChange"
          />
        </template>
        <template #default="{ row }">
          <ep-checkbox v-model="row.checked" />
        </template>
      </ep-table-column>
      <ep-table-column prop="name" label="姓名" min-width="100" />
      <ep-table-column prop="math" label="数学" width="100" />
      <ep-table-column prop="phys" label="物理" />
      <ep-table-column prop="bio" label="生物" />
      <ep-table-column
        label="总成绩"
        :formatter="({ row }) => row.math + row.phys + row.bio"
      />
    </ep-table>
  </div>
</template>
<script setup>
import { ref, watchEffect, computed } from 'vue'
const selectAll = ref(null)
const isAll = ref(false)
const data = ref([
  {
    name: 'Tim',
    math: 77,
    phys: 90,
    bio: 67,
    checked: false
  },
  {
    name: 'Jiner',
    math: 59,
    phys: 61,
    bio: 22,
    checked: false
  },
  {
    name: 'Steering',
    math: 90,
    phys: 90,
    bio: 100,
    checked: false
  },
  {
    name: 'Charry',
    math: 80,
    phys: 70,
    bio: 67,
    checked: false
  }
])
watchEffect(() => {
  const checkedItems = data.value.filter((item) => item.checked)
  isAll.value =
    checkedItems.length > 0 && checkedItems.length === data.value.length
})
const indeterminate = computed(() => {
  const checkedItems = data.value.filter((item) => item.checked)
  return checkedItems.length > 0 && checkedItems.length !== data.value.length
})

const handleChange = (event) => {
  var checked = event.target.checked
  data.value.forEach((item) => (item.checked = checked))
}

const table = ref()
</script>
<style scoped>
.limit-w {
  max-width: 1000px;
}
</style>
