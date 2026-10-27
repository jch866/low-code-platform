<template>
  <div
    ref="breadcrumb"
    :class="ns.b()"
    aria-label="Breadcrumb"
    role="navigation"
  >
    <slot />
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'
import { buildCssNamespace } from '@package/util'
import { breadcrumbKey } from './breadcrumbLib'
const props = defineProps({
  separator: {
    type: String,
    default: '/'
  },
  separatorIcon: {
    type: String,
    default: ''
  }
})

const ns = buildCssNamespace('breadcrumb')
const breadcrumb = ref()
provide(breadcrumbKey, props)
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Breadcrumb')
}
</script>
