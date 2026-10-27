<template>
  <div class="flex_contain">
    <ep-menu
      class="ep-menu-vertical-demo"
      default-active="3-4-2"
      :collapse="isCollapse"
      popper-class="basic__custom-tooltip"
      @select="handleSelect"
      @open="handleOpen"
      @close="handelClose"
    >
      <ep-sub-menu index="1">
        <template #title>
          <ep-icon icon="ep-i-home"></ep-icon>
          <span>Navigator One</span>
        </template>
        <ep-menu-item index="1-1">item one</ep-menu-item>
        <ep-menu-item index="1-2">item two</ep-menu-item>
        <ep-menu-item index="1-3">item three</ep-menu-item>
        <ep-sub-menu index="1-4" disabled>
          <template #title><span>item four</span></template>
          <ep-menu-item index="1-4-1">item one</ep-menu-item>
          <ep-menu-item index="1-4-2">item two</ep-menu-item>
        </ep-sub-menu>
      </ep-sub-menu>
      <ep-menu-item index="2">
        <ep-icon icon="ep-i-calendar"></ep-icon>
        <template #title>Navigator Two</template>
      </ep-menu-item>
      <ep-sub-menu index="3">
        <template #title>
          <ep-icon icon="ep-i-time"></ep-icon>
          <span>Navigator Three</span>
        </template>
        <ep-menu-item index="3-1">item one</ep-menu-item>
        <ep-menu-item index="3-2">item two</ep-menu-item>
        <ep-sub-menu index="3-4">
          <template #title><span>item three</span></template>
          <ep-menu-item index="3-4-1">item one</ep-menu-item>
          <ep-menu-item index="3-4-2">item two</ep-menu-item>
          <ep-menu-item index="3-4-3">item three</ep-menu-item>
          <ep-sub-menu index="3-4-4">
            <template #title><span>item four</span></template>
            <ep-menu-item index="3-4-4-1">item one</ep-menu-item>
            <ep-menu-item index="3-4-4-2">item two</ep-menu-item>
            <ep-menu-item index="3-4-4-3">item three</ep-menu-item>
          </ep-sub-menu>
          <ep-menu-item index="3-4-5">item three</ep-menu-item>
        </ep-sub-menu>
      </ep-sub-menu>
      <ep-menu-item index="4">
        <ep-icon icon="ep-i-title"></ep-icon>
        <template #title>Navigator Four</template>
      </ep-menu-item>
      <ep-menu-item index="5">
        <ep-icon icon="ep-i-download"></ep-icon>
        <template #title>Navigator Five</template>
      </ep-menu-item>
    </ep-menu>
    <div class="right_contain">内容区域</div>
  </div>

  <div class="contain">
    <ep-button plain @click="isCollapse = !isCollapse">
      {{ isCollapse ? '展开' : '折叠' }}
    </ep-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isCollapse = ref(false)
const handleSelect = (index, indexPath, item) => {
  console.log('----select---', index, indexPath, item)
}

const handleOpen = (index, indexPath) => {
  console.log('----open---', index, indexPath)
}

const handelClose = (index, indexPath) => {
  console.log('----close---', index, indexPath)
}
</script>

<style scoped lang="scss">
.contain {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.flex_contain {
  display: flex;
  .right_contain {
    flex: 1;
    background: lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.ep-menu-vertical-demo:not(.ep-menu--collapse) {
  width: 230px;
}
</style>

<style>
.basic__custom-tooltip {
  box-shadow: 0 2px 8px 0 #0163ca;
  background-color: #0163ca;
  color: #fff;
  padding: 4px 0 !important;
}
</style>
