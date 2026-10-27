<template>
  <ep-button :plain="true" @click="open1">message</ep-button>
  <ep-button :plain="true" @click="open2">success</ep-button>
  <ep-button :plain="true" @click="open3">warning</ep-button>
  <ep-button :plain="true" @click="open4">error</ep-button>
</template>

<script setup>
import { EPMessage } from '../../index'

const open1 = () => {
  EPMessage({
    message: 'this is a message.',
    styleType: 'pagetip',
    showClose: true
  })
}
const open2 = () => {
  EPMessage({
    styleType: 'pagetip',
    message: 'Congrats, this is a success message.',
    type: 'success',
    showClose: true
  })
}
const open3 = () => {
  EPMessage({
    styleType: 'pagetip',
    message: 'Warning, this is a warning message.',
    type: 'warning',
    showClose: true
  })
}
const open4 = () => {
  EPMessage.error({
    styleType: 'pagetip',
    message: 'Oops, this is a error message.',
    showClose: true
  })
}
</script>
