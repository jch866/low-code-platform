<template>
  <div>
    <p>
      <ep-checkbox v-model="indeterminate" label="Indeterminate Controller" />
    </p>
    <p>
      <ep-checkbox
        v-model="state"
        :indeterminate="indeterminate"
        true-value="On"
        false-value="Off"
        @change="handleChange"
      >
        State: {{ state }}
      </ep-checkbox>
    </p>
  </div>
  <p>Checked: {{ checked }}</p>
</template>
<script setup>
import { ref } from 'vue'
const state = ref('Off')
const indeterminate = ref(false)
const checked = ref(false)

const handleChange = (event) => {
  checked.value = event.target.checked
}
</script>
<script>
export default {
  name: 'RadioWithoutGroup'
}
</script>
