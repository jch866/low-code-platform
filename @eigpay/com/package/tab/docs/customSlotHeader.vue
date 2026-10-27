<template>
  <ep-tab
    v-model="activeName"
    @tab-click="handleClick"
    @tab-change="handleChange"
  >
    <ep-tab-pane name="first">
      <template #header>
        <div class="custom_header">
          <ep-icon icon="ep-i-calendar21" size="18"></ep-icon>
          <span style="margin-left: 5px">User</span>
        </div>
      </template>
      <div>UserContent</div>
    </ep-tab-pane>
    <ep-tab-pane name="second">
      <template #header>
        <div class="custom_header color_green">
          <ep-icon icon="ep-i-done" size="18"></ep-icon>
          <span style="margin-left: 5px">Config</span>
        </div>
      </template>
      <div>ConfigContent</div>
    </ep-tab-pane>
    <ep-tab-pane name="third">
      <template #header>
        <div class="custom_header color_greenyellow">
          <ep-icon icon="ep-i-back-top-rocket1" size="18"></ep-icon>
          <span style="margin-left: 5px">Role</span>
        </div>
      </template>
      <div>RoleContent</div>
    </ep-tab-pane>
    <ep-tab-pane name="fourth">
      <template #header>
        <div class="custom_header color_grey">
          <ep-icon icon="ep-i-calendar21" size="18"></ep-icon>
          <span style="margin-left: 5px">Task</span>
        </div>
      </template>
      TaskContent
    </ep-tab-pane>
    <ep-tab-pane label="Config-2" name="five">
      <template #header>
        <div class="custom_header color_white">
          <ep-icon icon="ep-i-calendar21" size="18"></ep-icon>
          <span style="margin-left: 5px">Settings</span>
        </div>
      </template>
      ConfigContent
    </ep-tab-pane>
  </ep-tab>
</template>
<script setup>
import { ref } from 'vue'

const activeName = ref('first')

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const handleChange = (name) => {
  console.log(name)
}
</script>

<style lang="scss" scoped>
.custom_header {
  padding: 10px 20px;
  background: orange;
  height: 80px;
  display: flex;
  align-items: center;
}

.color_green {
  background: green;
}

.color_greenyellow {
  background: greenyellow;
}

.color_grey {
  background: grey;
}

.color_white {
  background: #fff;
}
</style>
