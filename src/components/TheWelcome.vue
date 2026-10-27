<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Router</template>
    Route 配置在 <span class="b">src/routers</span> 目录下, 为了兼容micro-app,
    history 采用了WebHashHistory 点击右边的Home, Pinia explore, Counter state
    试一下路由跳转的效果。
    <p>
      Router官方地址:
      <a href="https://router.vuejs.org/" target="_blank" rel="noopener"
        >Vue Router</a
      >
    </p>
  </WelcomeItem>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Pinia</template>
    Pinia 配置在 <span class="b">src/stores</span>目录下, 右侧菜单Pinia
    explore中点击increment 按钮, 触发计数器的变化, 再切换到Counter state菜单,
    看看计数器的状态。
    <p>
      Pinia官方地址:
      <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener"
        >Pinia</a
      >
    </p>
  </WelcomeItem>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>I18N</template>
    I18N 配置在 <span class="b">src/lang</span>目录下, 点击i18n菜单看看效果
    <p>
      I18N官方地址:
      <a
        href="https://vue-i18n.intlify.dev/guide/"
        target="_blank"
        rel="noopener"
        >VUE-I18N</a
      >
    </p>
  </WelcomeItem>
</template>
<style lang="scss" scoped>
.b {
  font-weight: 600;
  background-color: var(--color-border);
}
</style>
