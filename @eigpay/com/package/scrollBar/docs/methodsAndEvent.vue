<template>
  <div>
    <div>
      <p class="setting">
        <span class="label">Scroll Left:</span>
        <ep-input v-model.number="scrollLeft" type="text" />
      </p>
      <p class="setting">
        <span class="label">Scroll top:</span>
        <ep-input v-model.number="scrollTop" type="text" />
      </p>

      <p class="setting">
        <ep-button type="primary" @click="applyScroll">Apply</ep-button>
      </p>
    </div>
    <p>Scroll Event Data: {{ scrollData }}</p>
    <div class="demo">
      <ep-scroll-bar ref="bar" :height="300" @scroll="handleScroll">
        <ul class="list">
          <li v-for="i in count" :key="i">item {{ i }}</li>
        </ul>
      </ep-scroll-bar>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scrollLeft = ref(0)
const scrollTop = ref(0)
const count = ref(20)
const bar = ref(null)
const scrollData = ref(null)
const handleScroll = (data) => {
  scrollData.value = data
}

const applyScroll = () => {
  bar.value?.scrollTo(scrollLeft.value, scrollTop.value)
}
</script>
<style lang="scss" scoped>
.demo {
  width: 600px;
}
.list {
  width: 100%;
  li {
    border: 1px solid lightsteelblue;
    height: 45px;
    padding: 12px;
    width: 800px;
    & + li {
      border-top: none;
    }
  }
}
.label {
  width: 105px;
}
.setting {
  display: flex;
  align-items: center;
}
</style>
