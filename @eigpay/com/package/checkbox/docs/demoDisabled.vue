<template>
  <div>
    <p>使用checkbox的disabled属性</p>
    <ep-checkbox
      v-model="apple"
      true-value="Apple"
      false-value="BadApple"
      label="Apply"
      disabled
    />
  </div>
  <div>
    <p>使用form的disabled属性</p>
    <ep-form :model="params" disabled>
      <ep-form-item label="Fruit" prop="fruit">
        <ep-checkbox
          v-model="params.fruit"
          true-value="Cherry"
          false-value="BadCheery"
          label="Cherry"
        />
      </ep-form-item>
    </ep-form>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const apple = ref('Apple')
const params = reactive({
  fruit: ''
})
</script>
<script>
export default {
  name: 'RadioWithoutGroup'
}
</script>
