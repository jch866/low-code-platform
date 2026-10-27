<template>
  <ep-button plain @click="isShowIcon = !isShowIcon">
    显示图标按钮: {{ isShowIcon }}
  </ep-button>
  <ep-button plain @click="isShowSize = !isShowSize">
    显示调整尺寸: {{ isShowSize }}
  </ep-button>
  <ep-anchor>
    <ep-anchor-item label="基础用法">
      <div class="item_height">基础用法</div>
    </ep-anchor-item>
    <ep-anchor-item label="禁用状态">
      <div class="item_height">禁用状态</div>
    </ep-anchor-item>
    <ep-anchor-item label="链接按钮">
      <div class="item_height">链接按钮</div>
    </ep-anchor-item>
    <ep-anchor-item label="文字按钮">
      <div class="item_height">文字按钮</div>
    </ep-anchor-item>
    <ep-anchor-item v-if="isShowIcon" label="图标按钮">
      <div class="item_height">图标按钮</div>
    </ep-anchor-item>
    <ep-anchor-item label="按钮组">
      <div class="item_height">按钮组</div>
    </ep-anchor-item>
    <ep-anchor-item label="加载状态按钮">
      <div class="item_height">加载状态按钮</div>
    </ep-anchor-item>
    <ep-anchor-item v-if="isShowSize" label="调整尺寸">
      <div class="item_height">调整尺寸</div>
    </ep-anchor-item>
    <ep-anchor-item label="自定义颜色">
      <div class="item_height">自定义颜色</div>
    </ep-anchor-item>
    <ep-anchor-item label="自定义插槽">
      <div class="item_height">自定义插槽</div>
    </ep-anchor-item>
  </ep-anchor>
</template>
<script setup>
import { ref } from 'vue'
const isShowIcon = ref(true)
const isShowSize = ref(false)
</script>
<style scoped lang="scss">
.item_height {
  height: 600px;
  width: 600px;
}
</style>
