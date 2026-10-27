<template>
  <div>
    <p>Boolean 类型值</p>
    <ep-switch
      v-model="modelBool"
      :active-value="true"
      :inactive-value="false"
    />
  </div>
  <p>Boolean state: {{ modelBool }}</p>

  <div>
    <p>Number 类型值</p>
    <ep-switch v-model="modelNum" :active-value="100" :inactive-value="10" />
  </div>
  <p>Number state: {{ modelNum }}</p>

  <div>
    <p>String 类型值</p>
    <ep-switch
      v-model="modelStr"
      :active-value="'Y'"
      :inactive-value="'N'"
      active-text="On"
      inactive-text="Off"
      @change="handleChange"
    ></ep-switch>
  </div>
  <p>String state: {{ modelStr }}</p>
  <p>Change event: {{ val }}</p>
</template>
<script setup>
import { ref } from 'vue'
const modelBool = ref(true)
const modelNum = ref(100)
const modelStr = ref('N')
const val = ref()
const handleChange = (value) => {
  val.value = value
}
</script>
<script>
export default {
  name: 'DemoSwitchNormally'
}
</script>
