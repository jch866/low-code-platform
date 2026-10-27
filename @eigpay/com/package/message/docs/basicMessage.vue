<template>
  <ep-button :plain="true" @click="open1">message</ep-button>
  <ep-button :plain="true" @click="open2">success</ep-button>
  <ep-button :plain="true" @click="open3">warning</ep-button>
  <ep-button :plain="true" @click="open4">error</ep-button>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { EPMessage } from '../../index'

const instance = getCurrentInstance()
const global = instance.appContext.config.globalProperties

const open1 = () => {
  global.$message('this is a message')
  // EPMessage('this is a message.')
}
const open2 = () => {
  EPMessage.success('Congrats, this is a success message.')
}
const open3 = () => {
  EPMessage.warning('Warning, this is a warning message.')
}
const open4 = () => {
  EPMessage.error('Oops, this is a error message.')
}
</script>
