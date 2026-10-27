<template>
  <transition :name="ns.b('transition')">
    <slot />
  </transition>
</template>
<script setup>
import { buildCssNamespace } from '@package/util'

const ns = buildCssNamespace('collapse')
</script>
