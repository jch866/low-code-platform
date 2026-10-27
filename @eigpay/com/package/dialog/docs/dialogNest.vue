<template>
  <ep-button @click="outerVisible = true">open the outer Dialog</ep-button>

  <ep-dialog v-model="outerVisible" title="Outer Dialog">
    <template #default>
      <ep-dialog
        v-model="innerVisible"
        width="30%"
        title="Inner Dialog"
        append-to-body
      />
    </template>
    <template #footer>
      <div class="dialog-footer">
        <ep-button @click="outerVisible = false">Cancel</ep-button>
        <ep-button type="primary" @click="innerVisible = true">
          open the inner Dialog
        </ep-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const outerVisible = ref(false)
const innerVisible = ref(false)
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
