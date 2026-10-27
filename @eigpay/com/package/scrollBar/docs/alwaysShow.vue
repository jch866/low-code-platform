<template>
  <div>
    <div>
      <div>
        <ep-checkbox v-model="alwaysShow" label="一直显示滚动条" />
      </div>
    </div>
    <div class="demo">
      <ep-scroll-bar :max-height="200" :always-show="alwaysShow">
        <ul class="list">
          <li v-for="i in 10" :key="i" :style="{ width: `${width}px` }">
            item {{ i }}
          </li>
        </ul>
      </ep-scroll-bar>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent } from 'vue'
defineComponent({
  name: 'AlwaysShow'
})

const alwaysShow = ref(true)
const width = ref(1000)
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
