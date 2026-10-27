<template>
  <span
    v-if="disableTransitions"
    :class="classes"
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <span :class="ns.e('content')">
      <slot />
    </span>
    <ep-icon
      v-if="closable"
      icon="ep-i-delete"
      :class="ns.e('close')"
      @click.stop="handleClose"
    />
  </span>
  <transition v-else :name="`${ns.namespace}-zoom-in-center`" appear>
    <span
      :class="classes"
      :style="{ backgroundColor: color }"
      @click="handleClick"
    >
      <span :class="ns.e('content')">
        <slot />
      </span>
      <ep-icon
        v-if="closable"
        icon="ep-i-delete"
        :class="ns.e('close')"
        @click.stop="handleClose"
      />
    </span>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { buildCssNamespace } from '../../util'
import { tagEmits, tagProps } from './tag'

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)

const ns = buildCssNamespace('tag')
const classes = computed(() => {
  const { type, hit, effect, closable, round } = props
  return [
    ns.b(),
    ns.is('closable', closable),
    ns.m(type),
    ns.m(effect),
    ns.is('hit', hit),
    ns.is('round', round)
  ]
})

// methods
const handleClose = (event) => {
  emit('close', event)
}

const handleClick = (event) => {
  emit('click', event)
}
</script>
<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Tag')
}
</script>
