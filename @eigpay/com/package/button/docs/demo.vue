<template>
  <div>
    <div class="button-group">
      <ep-button @click="onClick('Default')">Default</ep-button>
      <ep-button plain @click="onClick('Plain')">Plain</ep-button>
      <ep-button type="primary" @click="onClick('Primary')">Primary</ep-button>
      <ep-button plain type="primary" @click="onClick('Primary Plain')">
        Primary Plain
      </ep-button>
      <ep-button plain disabled type="primary">
        Primary Plain Disabled
      </ep-button>
      <ep-button disabled @click="onClick('Disabled')">Disabled</ep-button>
    </div>
    <div class="button-group">
      <ep-button plain dashed @click="onClick('Dashed')">Dashed</ep-button>
      <ep-button type="primary"><ep-icon icon="ep-i-plus" /></ep-button>
      <ep-button
        ref="iconButtonRef"
        plain
        @click="onClick(iconButtonRef.dataName)"
      >
        <ep-icon icon="ep-i-plus" />
        icon Buton
      </ep-button>
      <ep-button
        ref="innerButtonRef"
        plain
        dashed
        @click="onClick(innerButtonRef.dataName)"
      >
        <div>
          <span>button Inner Content</span>
        </div>
      </ep-button>
    </div>
  </div>
  <div>
    <span class="msg-info">{{ msg }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const msg = ref(null)
const iconButtonRef = ref(null)
const innerButtonRef = ref(null)
const onClick = (text) => {
  msg.value = `${text} Clicked!`
}
</script>

<script>
export default {
  name: 'ButtonDemo'
}
</script>
<style scoped>
.button-group {
  @apply mt-3;
}
.msg-info {
  @apply pl-1 text-red-600;
}
</style>
