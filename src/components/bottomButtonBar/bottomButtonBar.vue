<template>
  <div class="bottom-button-bar">
    <div class="bottom-button-bar-left">
      <slot name="left-buttons" />
    </div>
    <div class="bottom-button-bar-right">
      <slot name="right-buttons" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.bottom-button-bar {
  @apply fixed bottom-0;
  left: var(--menuWidth) - 16px;
  width: calc(100% - var(--menuWidth) - 30px);
  @apply flex justify-between;
  z-index: 100;
  @apply py-[12px] px-[24px];
  box-shadow: 0px -5px 10px 0px #f1f3f7;
  background: #ffffff;
  &-left {
    @apply flex;
    .ep-button {
      @apply mr-[16px];
    }
  }
  &-right {
    @apply flex;
    .ep-button {
      @apply ml-[16px];
    }
  }
}
</style>
