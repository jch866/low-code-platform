<template>
  <ep-button :plain="true" @click="openVnode">VnodeNativeElement</ep-button>
  <ep-button :plain="true" @click="openVnodeComponent">
    VnodeComponent
  </ep-button>
  <ep-button :plain="true" @click="openLink">customMessage</ep-button>
  <ep-button :plain="true" @click="openCustomIcon">customIcon</ep-button>
  <ep-button :plain="true" @click="openCustomIconComponent">
    IconComponent
  </ep-button>
</template>

<script setup>
import { h } from 'vue'
import { EPMessage } from '../../index'
import tmpMessage from './tmpMessage.vue'
import connectMessage from './connectMessage.vue'

const openVnode = () => {
  EPMessage({
    message: () => {
      return h('div', { style: { color: 'red' } }, '我是红色的Vnode消息！')
    }
  })
}

const openVnodeComponent = () => {
  EPMessage({
    message: () => {
      return h(tmpMessage, {
        tip: '信息提示标题',
        describe:
          '信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示信息提示'
      })
    }
  })
}

const openLink = () => {
  EPMessage({
    message: () => {
      return h(connectMessage, {
        tip: '信息提示',
        link: 'https://www.baidu.com/'
      })
    },
    styleType: 'pagetip',
    customClass: 'custom-class'
  })
}

const openCustomIcon = () => {
  EPMessage({
    message: '自定义图标',
    icon: 'ep-i-calendar'
  })
}

const openCustomIconComponent = () => {
  EPMessage({
    message: '使用具名插槽自定义图标',
    icon: () => {
      return h('img', {
        src: 'http://localhost:4000/src/assets/logo.svg',
        style: { width: '20px', height: '20px' }
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
