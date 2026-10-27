<template>
  <div class="box-item">
    <ep-tooltip v-model="visible" trigger="click" :offset="8" effect="light">
      <template #content>
        multiple lines
        <br />
        second line
      </template>
      <ep-button>Top center</ep-button>
    </ep-tooltip>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(true)
</script>

<style scoped lang="scss">
.box-item {
  width: 105px;
}
</style>
