<template>
  <ep-button :plain="true" @click="openIconCenter">icon-center</ep-button>
  <ep-button :plain="true" @click="openIconTop">icon-not-center</ep-button>
</template>

<script setup>
import { h } from 'vue'
import { EPMessage } from '../../index'
import tmpMessage from './tmpMessage.vue'

const openIconCenter = () => {
  EPMessage({
    showClose: true,
    styleType: 'pagetip',
    onClose: () => {
      console.log('----onClose-----')
    },
    message: () => {
      return h(tmpMessage, {
        tip: '信息提示标题',
        describe:
          '信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示'
      })
    }
  })
}

const openIconTop = () => {
  EPMessage({
    showClose: true,
    iconCenter: false,
    styleType: 'pagetip',
    message: () => {
      return h(tmpMessage, {
        tip: '信息提示标题',
        describe:
          '信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示'
      })
    }
  })
}
</script>

<style>
.custom-class {
  width: 400px;
}
</style>
