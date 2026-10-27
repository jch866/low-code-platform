<template>
  <div class="contain">
    <div class="tiplabel">{{ tip }}，</div>
    <div class="linklabel" @click="cliclLink">查看链接</div>
  </div>
</template>

<script setup>
const props = defineProps({
  tip: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  }
})

function cliclLink() {
  window.open(props.link)
}
</script>

<style lang="scss" scoped>
.contain {
  display: flex;
  align-items: center;
}

.tiplabel {
  font-size: 14px;
  color: #333;
}

.linklabel {
  font-size: 14px;
  color: #0163ca;
  text-decoration: underline;
  cursor: pointer;
}
</style>
