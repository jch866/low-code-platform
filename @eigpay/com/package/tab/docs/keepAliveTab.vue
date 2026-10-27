<template>
  <ep-button type="primary" @click="saveStatusMethod">
    是否保存状态: {{ isKeepAlive }}
  </ep-button>
  <ep-tab
    v-model="activeName"
    :is-keep-alive="isKeepAlive"
    @tab-click="handleClick"
    @tab-change="handleChange"
  >
    <ep-tab-pane
      v-for="item in tabPanlArray"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
      <div class="margin_top10">
        <first-component ref="firstComponentRef" @data-change="dataChange" />
      </div>
    </ep-tab-pane>
    <!-- <ep-tab-pane label="Config" name="second">
      <div class="margin_top10">
        <second-component />
      </div>
    </ep-tab-pane>
    <ep-tab-pane label="Role" name="third">
      <div class="margin_top10">
        <third-component />
      </div>
    </ep-tab-pane>
    <ep-tab-pane label="Task" name="fourth">TaskContent</ep-tab-pane> -->
  </ep-tab>
</template>
<script setup>
import { ref } from 'vue'
import FirstComponent from './components/firstComponent.vue'
// import secondComponent from './components/secondComponent.vue'
// import ThirdComponent from './components/thirdComponent.vue'

const activeName = ref('first')

const tabPanlArray = ref([
  { label: 'User', name: 'first' },
  { label: 'Config', name: 'second' },
  { label: 'Role', name: 'third' }
])
const firstComponentRef = ref(null)

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const handleChange = (name) => {
  console.log(name)
}

const isKeepAlive = ref(true)
const saveStatusMethod = () => {
  isKeepAlive.value = !isKeepAlive.value
}

const dataChange = () => {
  const result = tabPanlArray.value.map((item, index) => {
    return firstComponentRef.value[index].formModel
  })
  console.log('=====dataChange======', result)
}
</script>

<style scoped lang="scss">
.margin_top10 {
  margin-top: 10px;
}
</style>
