<template>
  <span :class="[ns.e('item'), ns.is('highlight', isHighlight)]">
    <span
      ref="link"
      :class="[ns.e('inner'), ns.is('link', !!to)]"
      role="link"
      data-type="breadcrumb"
      :data-name="dataName"
      @click="onClick"
    >
      <slot />
    </span>
    <ep-icon
      v-if="separatorIcon"
      :icon="separatorIcon"
      :class="[ns.e('separator'), ns.is('icon', !!separatorIcon)]"
    />
    <span v-else :class="ns.e('separator')">{{ separator }}</span>
  </span>
</template>

<script setup>
import { inject, ref, toRefs, getCurrentInstance, computed } from 'vue'
import { buildCssNamespace } from '@package/util'
import { breadcrumbKey } from './breadcrumbLib'
const props = defineProps({
  to: {
    type: [String, Object],
    default: ''
  },
  replace: {
    type: Boolean,
    default: false
  },
  highlight: Boolean
})

const link = ref()
const instance = getCurrentInstance()
const ns = buildCssNamespace('breadcrumb')
const isHighlight = computed(() => props.highlight)
const breadcrumbContext = inject(breadcrumbKey, undefined)
const { separator, separatorIcon } = toRefs(breadcrumbContext)
const router = instance.appContext.config.globalProperties.$router

const onClick = () => {
  if (!props.to || !router) {
    return
  }
  props.replace ? router.replace(props.to) : router.push(props.to)
}

const dataName = computed(() => link.value && link.value.innerText)
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('BreadcrumbItem')
}
</script>
