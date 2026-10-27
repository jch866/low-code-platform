<template>
  <div
    :class="[
      ns.b('item'),
      ns.is('active', isActive),
      ns.is('disabled', disabled)
    ]"
  >
    <div
      ref="collapseHeaderRef"
      data-type="ep_collapse"
      :data-name="dataName"
      :aria-expanded="isActive"
    >
      <div
        :class="[ns.b('item__header'), ns.is('active', isActive)]"
        @click="handleHeaderClick"
      >
        <ep-icon
          v-if="iconDirect == 'left'"
          :class="[ns.b('item__arrow'), ns.is('active', isActive), iconActive]"
          :icon="icon"
        />
        <slot name="title">{{ title }}</slot>
        <ep-icon
          v-if="iconDirect == 'right'"
          :class="[ns.b('item__arrow'), ns.is('active', isActive), iconActive]"
          :icon="icon"
        />
      </div>
    </div>
    <collapse-transition>
      <div v-show="isActive" :class="ns.b('item__wrap')">
        <div :class="ns.b('item__content')">
          <slot />
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { generateId, collapseKey } from './collapseLib'
import { buildCssNamespace } from '@package/util'
import collapseTransition from './collapse-transition.vue'

const props = defineProps({
  disabled: Boolean,
  title: {
    type: String,
    default: ''
  },
  //展开图标方向，默认左
  iconDirect: {
    type: String,
    default: 'left'
  },
  //展开图标
  icon: {
    type: String,
    default: 'ep-i-arrow-to-right'
  },
  //展开样式
  iconActive: {
    type: String,
    default: ''
  },
  name: {
    type: [String, Number],
    default: () => generateId()
  }
})

const ns = buildCssNamespace('collapse')
const collapse = inject(collapseKey)
const collapseHeaderRef = ref(null)

const isActive = computed(() =>
  collapse?.activeNames.value.includes(props.name)
)

const dataName = computed(
  () => collapseHeaderRef.value && collapseHeaderRef.value.innerText
)

const handleHeaderClick = () => {
  if (props.disabled) return
  collapse?.handleItemClick(props.name)
}
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('CollapseItem')
}
</script>
