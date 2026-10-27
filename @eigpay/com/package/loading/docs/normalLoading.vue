<template>
  <div class="divContain"></div>
  <span class="opetateContain">
    <ep-button :plain="true" @click="openLoading">全局加载</ep-button>
    <ep-button :plain="true" @click="openLoadingDiv">加载到div容器</ep-button>
  </span>
</template>
<script setup>
import EPLoading from '../src/loadingLlib'

const openLoading = () => {
  const loadingInstance = EPLoading({
    target: 'body',
    text: 'loading...',
    textColor: '#fff'
  })
  const loadingInstanceAnother = EPLoading({
    target: 'body',
    text: 'loading...',
    textColor: '#fff'
  })
  console.log(loadingInstanceAnother.vm === loadingInstance.vm)
  setTimeout(() => {
    loadingInstanceAnother.close()
  }, 5000)
}

const openLoadingDiv = () => {
  const loadingInstance2 = EPLoading({
    target: '.divContain'
  })
  setTimeout(() => {
    loadingInstance2.close()
  }, 5000)
}
</script>

<style scoped>
.divContain {
  width: 100%;
  height: 200px;
  border: 1px solid gray;
}

.opetateContain {
  display: inline-flex;
  align-items: center;
}
</style>
