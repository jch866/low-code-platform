<template>
  <div style="width: 150px">
    <ep-tooltip
      trigger="click"
      placement="bottom"
      :offset="10"
      popper-class="mycustom__tooltip"
    >
      <template #content>
        this is content, this is content, this is content
        <br />
        second line
        <br />
        thrid line
      </template>
      <ep-button>custom class tooltip</ep-button>
    </ep-tooltip>
  </div>
</template>

<script>
export default {
  name: 'ToolTipDemo'
}
</script>

<style>
.mycustom__tooltip {
  background-color: blueviolet;
  box-shadow: 0 2px 8px 0 blueviolet;
  color: #fff;
}
</style>
