<template>
  <div class="grid-layer">
    <div class="demo-item">
      <ep-date-picker
        v-model="month"
        placeholder="请选择月份"
        type="month"
        @change="($event) => handleChange('month', $event)"
      />
      <p>选择的月份是: {{ month }}</p>
    </div>
    <div class="demo-item">
      <ep-date-picker
        v-model="mon"
        placeholder="请选择月份"
        type="month"
        @change="($event) => handleChange('month1', $event)"
      />
      <p>选择的月份是: {{ mon }}</p>
    </div>
    <div class="demo-item">
      <ep-date-picker
        v-model="year"
        placeholder="请选择年份"
        type="year"
        @change="($event) => handleChange('year', $event)"
      />
      <p>选择的年份是: {{ year }}</p>
    </div>
    <div class="demo-item">
      <ep-date-picker
        v-model="y"
        placeholder="请选择年份"
        type="year"
        @change="($event) => handleChange('year1', $event)"
      />
      <p>选择的年份是: {{ y }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const month = ref(null)

const mon = ref('2024-01')

const year = ref(null)

const handleChange = (label, value) => {
  console.log(label, value)
}

const y = ref('2035')
</script>
<script>
export default {
  name: 'MultipleTypeDemo'
}
</script>

<style scoped>
.grid-layer {
  @apply grid grid-cols-2 gap-4;
}
.demo-item {
  @apply border border-indigo-200 p-10;
}
</style>
