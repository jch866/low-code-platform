<template>
  <ep-popover
    v-model="visible"
    title="this is title"
    content="this is content, this is content, this is content"
    trigger="hover"
  >
    <template #reference>
      <div class="reference">Hover to activate</div>
    </template>
  </ep-popover>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>

<script>
export default {
  name: 'PopoverDemo'
}
</script>

<style scoped lang="scss">
.reference {
  margin: 15px;
  padding: 20px;
  width: 200px;
  height: 150px;
  border: 1px solid;
}
</style>
