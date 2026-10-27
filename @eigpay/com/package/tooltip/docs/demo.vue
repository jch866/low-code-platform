<template>
  <div class="box-item">
    <ep-tooltip
      content="this is content, this is content, this is content"
      trigger="hover"
      placement="right"
      :offset="10"
    >
      <a v-if="isShow" href="javascript:void(0);">Hover to activate</a>
    </ep-tooltip>
  </div>
  <ep-button @click="isShow = !isShow">Show or No</ep-button>
</template>

<script>
export default {
  name: 'ToolTipDemo',
  data() {
    return {
      isShow: false
    }
  }
}
</script>

<style scoped lang="scss">
.box-item {
  width: 115px;
  a {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #333;
    line-height: 22px;
    font-weight: 400;
  }
  a:hover {
    color: #0163ca;
  }
}
</style>
