<template>
  <ep-menu
    mode="horizontal"
    default-active="2"
    background-color="#fff"
    hover-background-color="#EFF4FF"
    active-background-color="#EFF4FF"
    inside-background-color="#fff"
    text-color="#333333"
    hover-text-color="#333333"
    active-text-color="#0163CA"
    popper-class="horizontalmenu__custom-tooltip"
    indicator-top
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
</template>

<script setup>
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

<style>
.horizontalmenu__custom-tooltip {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;
  color: #333333;
  padding: 4px 0 !important;
}
</style>
