<template>
  <div class="outer">
    <ScrollBar thumb-min-size="20" :always-show="false" :height="200">
      <div class="inner">innner</div>
    </ScrollBar>
  </div>
</template>
<script setup>
import ScrollBar from '../src/scrollBar.vue'
import { defineComponent } from 'vue'
defineComponent({
  name: 'ScrollTest'
})
</script>
<style>
.outer {
  width: 500px;
  /* height: 400px;
  border: 1px solid red; */
}
.inner {
  width: 1800px;
  height: 16000px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(181, 250, 181);
}
</style>
