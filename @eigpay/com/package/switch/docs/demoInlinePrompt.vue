<template>
  <div>
    <p>描述文字在switch两边</p>
    <ep-switch
      v-model="model"
      :active-value="true"
      :inactive-value="false"
      active-text="Allow"
      inactive-text="Disallow"
    />
  </div>
  <div>
    <p>描述文字在switch内</p>
    <ep-switch
      v-model="model"
      :active-value="true"
      :inactive-value="false"
      active-text="Allow"
      inactive-text="Disallow"
      inline-prompt
    />
  </div>

  <p>state: {{ model }}</p>
</template>
<script setup>
import { ref } from 'vue'
const model = ref('')
</script>
<script>
export default {
  name: 'DemoInlinePrompt'
}
</script>
