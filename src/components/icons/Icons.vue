<template>
  <!-- 迁移自 Vue2 工程 frog-payadmin-vue的副本/src/components/icon/Icons.vue -->
  <!-- 原 a-modal：width=900、keyboard=false、closable=false、centered、mask=false、okText=确认、cancelText=取消；
       ep-dialog 居中布局由组件自身处理，mask 关闭经 close-on-click-modal=false 禁用 -->
  <ep-dialog
    :model-value="iconChooseVisible"
    title="图标选择"
    width="900px"
    :close-on-click-modal="false"
    append-to-body
    @close="onCancel"
  >
    <!-- 与源差异：源使用 antd 图标并按 6 个 tab 分类（方向性/指示性/编辑类/数据类/网站通用/品牌和标识）；
         ep 字体集（@eigpay/com/package/icon/docs/icons-categories.json，共 36 个 ep-i-* 图标）与源图标集不同，
         按迁移约定取 ep 字体集全部图标，单网格平铺展示（无分类 tab，ep-icon 渲染）。
         选中回写值为完整图标类名（如 ep-i-home），业务字段可直接用于 <ep-icon :icon="xxx"> 渲染 -->
    <div class="icon-grid">
      <span
        v-for="icon in iconList"
        :key="icon"
        :class="['icon-item', { active: activeIndex === icon }]"
        :title="icon"
        @click="chooseIcon(icon)"
      >
        <ep-icon :icon="icon" :size="18" />
      </span>
    </div>
    <template #footer>
      <span>
        <ep-button plain @click="onCancel">取消</ep-button>
        <ep-button type="primary" @click="onOk">确认</ep-button>
      </span>
    </template>
  </ep-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { EPMessageTips } from '@/utils/utils'

// 图标清单来源：@eigpay/com/package/icon/docs/icons-categories.json（ep 字体集全部 36 个图标）
const iconList = [
  'ep-i-hide',
  'ep-i-view',
  'ep-i-clip',
  'ep-i-done',
  'ep-i-solid-cycle-cross-bold',
  'ep-i-download',
  'ep-i-vector',
  'ep-i-clock',
  'ep-i-time',
  'ep-i-home',
  'ep-i-solid-cycle-smile',
  'ep-i-icon-16-tishi-baocuotishi',
  'ep-i-cross',
  'ep-i-cycle-solid-tick',
  'ep-i-solid-cycle-cross',
  'ep-i-cycle-solid-exclamation-mark-inverted',
  'ep-i-cycle-solid-exclamation-mark',
  'ep-i-BackTop',
  'ep-i-back-top-rocket1',
  'ep-i-back-top-text',
  'ep-i-tick',
  'ep-i-minus',
  'ep-i-back-top-arrow',
  'ep-i-delete',
  'ep-i-plus',
  'ep-i-a-to-left',
  'ep-i-arrow-to-right',
  'ep-i-arrow-up',
  'ep-i-calendar',
  'ep-i-calendar21',
  'ep-i-warning',
  'ep-i-title',
  'ep-i-sound',
  'ep-i-soundless',
  'ep-i-unfold-down',
  'ep-i-unfold-up'
]

const props = defineProps({
  // 弹窗显隐（原 :iconChooseVisible，父组件控制）
  iconChooseVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['choose', 'close'])

// 已选图标与高亮（原 choosedIcon/activeIndex）
const activeIndex = ref('')
const choosedIcon = ref('')

/** 点选图标（原 chooseIcon：记录选中项并 success 提示） */
const chooseIcon = (icon) => {
  activeIndex.value = icon
  choosedIcon.value = icon
  EPMessageTips('success', `选中 ${icon}`)
}

/** 重置选中（原 reset） */
const reset = () => {
  activeIndex.value = ''
  choosedIcon.value = ''
}

/** 确认（原 ok：未选择时 warning，否则 emit choose 回传图标类名，由父组件回写业务字段） */
const onOk = () => {
  if (choosedIcon.value === '') {
    EPMessageTips('warning', '尚未选择任何图标')
    return
  }
  const icon = choosedIcon.value
  reset()
  emit('choose', icon)
}

/** 取消/关闭（原 cancel：重置并 emit close，父组件收起弹窗） */
const onCancel = () => {
  reset()
  emit('close')
}
</script>

<style scoped>
/* 图标网格（原 ul/li + Icon.less 样式等价实现） */
.icon-grid {
  display: flex;
  flex-wrap: wrap;
  max-height: 420px;
  overflow: auto;
}
.icon-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 2px;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.icon-item:hover {
  background-color: #e6f7ff;
}
.icon-item.active {
  color: #1890ff;
  background-color: #bae7ff;
}
</style>
