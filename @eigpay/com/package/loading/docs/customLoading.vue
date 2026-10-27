<template>
  <ep-button :plain="true" @click="openLoading">自定义插槽</ep-button>
  <ep-button :plain="true" @click="openLoadingIcon">展示icon图标</ep-button>
  <ep-button :plain="true" @click="openLoadingAnimation">自定义动画</ep-button>
</template>
<script setup>
import { h } from 'vue'
import EPLoading from '../src/loadingLlib'
import ImageIcon from './ImageIcon.vue'
const openLoading = () => {
  const loadingInstance = EPLoading({
    target: 'body',
    icon: () => h(ImageIcon)
  })

  setTimeout(() => {
    loadingInstance.close()
  }, 5000)
}

const openLoadingIcon = () => {
  const loadingInstance2 = EPLoading({
    target: '.body',
    icon: 'ep-i-solid-cycle-cross-bold'
  })
  setTimeout(() => {
    loadingInstance2.close()
  }, 5000)
}

const openLoadingAnimation = () => {
  const loadingInstance3 = EPLoading({
    target: '.body',
    icon: () => h(ImageIcon),
    animationClass: 'loadingCustomAnimation'
  })
  setTimeout(() => {
    loadingInstance3.close()
  }, 5000)
}
</script>

<style>
.loadingCustomAnimation {
  animation: donghua 1s infinite;
}

@keyframes donghua {
  0% {
    transform: scale(0.6);
  }

  60% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(0.6);
  }
}
</style>
