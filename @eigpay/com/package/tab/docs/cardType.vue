<template>
  <ep-tab v-model="activeName" type="card" @tab-click="handleClick">
    <ep-tab-pane label="User" name="first" disabled>UserContent</ep-tab-pane>
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
  name: 'CardType'
}
</script>
>
