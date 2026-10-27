<template>
  <div class="home-page">
    <ep-card>
      <template #header>
        <div class="card-header">
          <span>低代码平台</span>
        </div>
      </template>
      <div class="module-list">
        <div
          v-for="item in modules"
          :key="item.path"
          class="module-card"
          @click="goTo(item.path)"
        >
          <ep-icon :icon="item.icon" size="32" />
          <div class="module-info">
            <div class="module-title">{{ item.title }}</div>
            <div class="module-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </ep-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const modules = [
  { path: '/lowCodePlatform/paymentProduct/list', title: '应用管理', desc: '支付产品-应用管理', icon: 'ep-i-apps' },
  { path: '/lowCodePlatform/paymentBiz/list', title: '支付业务', desc: '支付产品-支付业务', icon: 'ep-i-credit-card' },
  { path: '/lowCodePlatform/dynamicTable/list', title: '动态表管理', desc: '参数中心-动态表管理', icon: 'ep-i-grid' },
  { path: '/lowCodePlatform/regulatorInfo/list', title: '规则处理器', desc: '基础规则-规则处理器', icon: 'ep-i-cpu' },
  { path: '/lowCodePlatform/regulatorRule/list', title: '业务规则', desc: '基础规则-业务规则', icon: 'ep-i-document' },
  { path: '/lowCodePlatform/flowManage/list', title: '流程管理', desc: '流程中心-流程管理', icon: 'ep-i-share' },
  { path: '/lowCodePlatform/flowNode/list', title: '流程节点管理', desc: '流程中心-流程节点管理', icon: 'ep-i-circle-check' }
]

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home-page {
  padding: 20px;
}
.card-header {
  font-size: 18px;
  font-weight: 600;
}
.module-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.module-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--ep-border-color-lighter);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.module-card:hover {
  border-color: var(--ep-color-primary);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.module-info {
  flex: 1;
}
.module-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}
.module-desc {
  font-size: 12px;
  color: var(--ep-text-color-secondary);
}
</style>
