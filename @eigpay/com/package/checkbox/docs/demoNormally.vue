<template>
  <div>
    <ep-checkbox
      ref="appleCheckRef"
      v-model="apple"
      true-value="Apple"
      false-value="BadApple"
      label="Apple"
    />
    <ep-checkbox
      ref="bananaCheckRef"
      v-model="banana"
      true-value="Banana"
      false-value="BadBanana"
      label="Banana"
    />
    <ep-checkbox ref="watermelonCheckRef" v-model="watermelon">
      Watermelon
    </ep-checkbox>
  </div>
  <p>Apple: {{ apple }}</p>
  <p>SelectedB: {{ banana }}</p>
  <p>Watermelon: {{ watermelon }}</p>
</template>
<script setup>
import { ref } from 'vue'
const apple = ref('')
const banana = ref('Banana')
const watermelon = ref(true)

const appleCheckRef = ref(null)
const bananaCheckRef = ref(null)
const watermelonCheckRef = ref(null)
</script>
<script>
export default {
  name: 'RadioWithoutGroup'
}
</script>
