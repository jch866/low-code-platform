<template>
  <!--
    系统交互面板（迁移自 Vue2 PayList.vue tab key=2 系统交互，i18n LC0357）：
    源为 4 张硬编码「渠道面板」卡片（channel-pannel），无数据加载接口、无子表、
    不参与交易保存 payload（源 submitCurrForm 仅合并 tab1 基本信息表单值）。
    卡片内链接在源中为 router-link 跳转 /product/channel 渠道管理页（不在本次迁移范围），
    点击以消息提示代替跳转，真实路由见 links 数据注释。
    i18n（zh_cn/lowCode.json）已解析为中文硬编码：
    LC0361 渠道接口 / LC0362 服务管理 / LC0363 接口管理 / LC0364 渠道权限 / LC0365 接口规范 /
    LC0366 核心接口 / LC0367 柜面核心服务 / LC0368 信用卡核心服务 / LC0369 电子核心服务 /
    LC0370 通道接口 / LC0371 农信银支付系统 / LC0372 网联支付系统 / LC0373 人行大额支付系统 /
    LC0374 人行小额支付系统 / LC0375 人行超网支付系统 / LC0376 下游接口 / LC0377 增加接口
  -->
  <div class="channel-pannel-wrapper">
    <div v-for="(card, cardIndex) in channelCards" :key="cardIndex" class="channel-pannel">
      <div class="pannel-left">
        <!-- 与源差异：a-icon type="disconnect" → ep-icon（ep 组件库无 disconnect 图标，取近似 ep-i-vector） -->
        <ep-icon icon="ep-i-vector" size="16" color="#08c" />
      </div>
      <div class="pannel-right">
        <h3 class="pannel-title">{{ card.title }}</h3>
        <ul>
          <li v-for="(link, linkIndex) in card.links" :key="linkIndex">
            <!-- 原 router-link（渠道管理页待迁移）：routeQuery 即源真实跳转路由 -->
            <a v-if="link.routeQuery" href="javascript:void(0);" @click="onLinkClick(link)">
              {{ link.label }}
            </a>
            <!-- 与源一致：渠道权限/接口规范/增加接口 源为无 href 的 <a>，仅文案展示 -->
            <span v-else>{{ link.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EPMessageTips } from '@/utils/utils'

/**
 * 卡片数据（源 PayList.vue tab key=2 硬编码结构照搬）：
 * routeQuery = 源 router-link 真实跳转路由（/product/channel 渠道管理页，tableName=swapService 交互服务表 /
 * swapInterface 交互接口表，systemId 为核心/通道系统标识），渠道管理页不在本次迁移范围
 */
const channelCards = [
  {
    title: '渠道接口',
    links: [
      { label: '服务管理', routeQuery: '/product/channel?tableName=swapService&title=服务管理' },
      { label: '接口管理', routeQuery: '/product/channel?tableName=swapInterface&title=接口管理' },
      { label: '渠道权限' },
      { label: '接口规范' }
    ]
  },
  {
    title: '核心接口',
    links: [
      { label: '柜面核心服务', routeQuery: '/product/channel?tableName=swapService&title=核心服务管理&systemId=BOOK1' },
      { label: '信用卡核心服务', routeQuery: '/product/channel?tableName=swapService&title=核心服务管理&systemId=BOOK3' },
      { label: '电子核心服务', routeQuery: '/product/channel?tableName=swapService&title=核心服务管理&systemId=BOOK2' }
    ]
  },
  {
    title: '通道接口',
    links: [
      { label: '农信银支付系统', routeQuery: '/product/channel?tableName=swapService&title=农信银支付系统&systemId=NPS2' },
      { label: '网联支付系统', routeQuery: '/product/channel?tableName=swapService&title=网联支付系统&systemId=NPS' },
      { label: '人行大额支付系统', routeQuery: '/product/channel?tableName=swapService&title=人行大额支付系统&systemId=CNAPS' },
      { label: '人行小额支付系统', routeQuery: '/product/channel?tableName=swapService&title=人行小额支付系统&systemId=CNAPS' },
      { label: '人行超网支付系统', routeQuery: '/product/channel?tableName=swapService&title=人行超网支付系统&systemId=CNAPS' }
    ]
  },
  {
    title: '下游接口',
    links: [{ label: '增加接口' }]
  }
]

/** 链接点击（原 router-link 跳转 /product/channel 渠道管理页，该页待迁移，以提示代替） */
const onLinkClick = (link) => {
  EPMessageTips('info', `原路由跳转 ${link.routeQuery}（渠道管理页待迁移）`)
}
</script>

<style scoped>
/* 卡片容器：源 a-col md=24(两行) × a-col md=12(半宽卡片) → flex 换行等价布局 */
.channel-pannel-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
  align-content: flex-start;
  align-items: flex-start;
}
.channel-pannel {
  display: flex;
  width: calc(50% - 30px);
  min-height: 158px;
  height: auto;
  position: relative;
  margin: 10px 15px;
  cursor: pointer;
  box-shadow: 0 0 2px rgb(0 0 0 / 20%);
  transition: all 0.15s;
  line-height: 1.2857;
  box-sizing: border-box;
}
.channel-pannel:hover {
  border: 1px solid #d9d9d9;
}
.channel-pannel ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.channel-pannel ul li {
  margin: 2px 0;
  display: inline-block;
  width: 115px;
}
.channel-pannel ul li a {
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
  color: rgb(55, 61, 65);
}
.channel-pannel ul li a:hover {
  text-decoration: underline;
}
.pannel-left {
  flex: 1;
  padding: 20px 20px 20px 20px;
}
.pannel-right {
  flex: 1;
  padding: 20px 20px 20px 0;
}
.pannel-title {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
