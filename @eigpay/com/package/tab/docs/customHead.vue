<template>
  <ep-tab v-model="activeName" type="card" @tab-click="handleClick">
    <ep-tab-pane name="first">
      <template #label>
        <ep-icon icon="ep-i-calendar21" size="14" color="#F53F3F"></ep-icon>
        <span style="margin-left: 5px">User</span>
      </template>
      UserContent
    </ep-tab-pane>
    <ep-tab-pane label="Config" name="second">ConfigContent</ep-tab-pane>
    <ep-tab-pane label="Role" name="third">RoleContent</ep-tab-pane>
    <ep-tab-pane label="Task" name="fourth">TaskContent</ep-tab-pane>
  </ep-tab>
</template>
<script setup>
import { ref } from 'vue'

const activeName = ref('first')

const handleClick = (tab, event) => {
  console.log(tab, event)
}
</script>
<script>
export default {
  name: 'TabDemo'
}
</script>
