<template>
  <div class="box-item">
    <ep-tooltip
      v-model="visible"
      effect="light"
      content="this is content, this is content, this is content"
      trigger="click"
      placement="left"
      :offset="15"
      :teleported="true"
    >
      <a href="javascript:void(0);">Click to activate</a>
    </ep-tooltip>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const visible = ref(true)

watch(
  () => visible.value,
  (newVal) => {
    console.log('newVal', newVal)
  }
)
</script>

<script>
export default {
  name: 'ToolTipDemo'
}
</script>

<style scoped lang="scss">
.box-item {
  width: 115px;
  a {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #333;
    line-height: 22px;
    font-weight: 400;
  }
  a:hover {
    color: #0163ca;
  }
}
</style>
