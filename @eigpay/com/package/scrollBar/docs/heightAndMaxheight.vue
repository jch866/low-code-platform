<template>
  <div>
    <p>
      <span>
        <span>Height:</span>
        <ep-input v-model.number="height" type="text" />
      </span>
      <span>
        <span>Max Height:</span>
        <ep-input v-model.number="maxHeight" type="text" />
      </span>
      <span>
        <span>Item count:</span>
        <ep-input v-model.number="count" type="text" />
      </span>
    </p>
    <div class="demo">
      <ep-scroll-bar :height="height" :max-height="maxHeight">
        <ul class="list">
          <li v-for="i in count" :key="i">item {{ i }}</li>
        </ul>
      </ep-scroll-bar>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const height = ref(200)
const maxHeight = ref(500)
const count = ref(5)
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
    & + li {
      border-top: none;
    }
  }
}
</style>
