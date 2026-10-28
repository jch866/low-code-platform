<template>
  <!-- 迁移自 Vue2 工程 frog-payadmin-vue的副本/src/views/develop/modules/BranchSubmit/parentProcessRuleInfoList.vue
       （组件原名 ParentProcessList，规则处理器「查看关联引用」面板） -->
  <!-- 原 a-modal：width=800、bodyStyle height=650px、footer=null、:visible="$store.state.parentProcess"、cancelText=关闭(common.close)；
       与源差异：去 vuex 化，显隐改为组件内 ep-dialog v-model，父页面经 ref.edit(row) 打开（row.id 作 pkValue）；
       原 a-modal 无 title，此处以入口按钮文案「查看关联引用」补充弹窗标题；
       内嵌说明：源组件为独立弹窗，未内嵌 ParentProcess/ParentProcessNodeList（三者平级，NodeList 属流程节点入口，未在本次迁移范围） -->
  <ep-dialog
    :model-value="visible"
    title="查看关联引用"
    width="800px"
    append-to-body
    @close="handleClose"
  >
    <div class="rule-info-body">
      <h2 class="rule-title">{{ cardCount.code }} - {{ cardCount.name }}</h2>
      <div v-if="cardCount.children">
        <!-- 原搜索框：a-input v-model=searchQuery，placeholder=LC0760「搜索关联节点」 -->
        <ep-input
          v-model="searchQuery"
          placeholder="搜索关联节点"
          type="text"
          class="rule-search"
        />
        <!-- 原 ul/li 引用名称列表（按搜索词过滤，每页 15 条） -->
        <ul class="rule-list">
          <li v-for="child in filteredChildren" :key="child.name">{{ child.name }}</li>
        </ul>
        <!-- 原分页：LC0739「上一页」/ LC0740「下一页」/ LC0741「第 {current} 页 / 共 {total} 页」 -->
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="currentPage--">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
        </div>
      </div>
    </div>
    <!-- 原 a-modal footer=null（无确定/关闭按钮，经取消/遮罩关闭），ep-dialog 未提供 #footer 插槽即不渲染底栏 -->
  </ep-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { getAssociatedRuleProcessor } from '@/api/lowCodePlatform/regulatorRule'

// 弹窗显隐（原 vuex parentProcessData，与源差异见模板注释）
const visible = ref(false)
// 关联引用数据（原 cardCount：{code, name, children:[{name}]}）
const cardCount = ref({})
// 搜索词（原 searchQuery）
const searchQuery = ref('')
// 当前页（原 currentPage）
const currentPage = ref(1)
// 修复顾问项：搜索词变化重置回第 1 页（源缺陷继承——翻页后搜索缩减结果会停在校界外空页）
watch(searchQuery, () => {
  currentPage.value = 1
})
// 每页条数（原 pageSize）
const pageSize = 15

// 原 url 配置：
// queryAssociatedRuleProcessor: GET /related/process/queryAssociatedRuleProcessor（参数 {pkValue}）

/** 过滤 + 分页（原 computed filteredChildren；与源差异：增加 children 空值兜底，源由模板 v-if 拦截） */
const filteredChildren = computed(() => {
  if (!cardCount.value.children) {
    return []
  }
  const children = cardCount.value.children.filter(
    (child) => child.name && child.name.includes(searchQuery.value)
  )
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return children.slice(start, end)
})

/** 总页数（原 computed totalPages） */
const totalPages = computed(() => {
  if (!cardCount.value.children) {
    return 1
  }
  const filteredChildrenCount = cardCount.value.children.filter(
    (child) => child.name && child.name.includes(searchQuery.value)
  ).length
  return Math.ceil(filteredChildrenCount / pageSize) || 1
})

/**
 * 打开弹窗（原由 vuex parentProcessData=true 显示 + props watch regulatorInfoPkValue 触发查询；
 * record.id 作 regulatorInfoPkValue/pkValue 查询关联引用，父页面接线方式与既有弹窗一致：ref.edit(row)）
 */
const edit = (record) => {
  cardCount.value = {}
  searchQuery.value = ''
  currentPage.value = 1
  visible.value = true
  if (record && record.id) {
    queryRegulatorInfoCount(record.id)
  }
}

/** 关联引用查询（原 queryRegulatorInfoCount：getAction(queryAssociatedRuleProcessor, {pkValue})） */
const queryRegulatorInfoCount = (val) => {
  cardCount.value = {}
  // 真实接口：GET /related/process/queryAssociatedRuleProcessor（参数 {pkValue}）
  getAssociatedRuleProcessor({ pkValue: val }).then((res) => {
    if (res.returnCode === SUCCESS_STATUS && res.result) {
      cardCount.value = res.result
    }
  })
}

/** 关闭并重置（原 close：emit update:regulatorInfoPkValue null，vuex parentProcessData=false，currentPage=1） */
const handleClose = () => {
  cardCount.value = {}
  currentPage.value = 1
  visible.value = false
}

defineExpose({
  edit
})
</script>

<style scoped>
/* 原 bodyStyle height=650px、内层 #chart height=1000px，改为弹窗体内固定最小高度 + 内部滚动 */
.rule-info-body {
  min-height: 650px;
  max-height: 70vh;
  overflow: auto;
}
.rule-title {
  margin: 0 0 12px;
  font-size: 18px;
}
.rule-search {
  width: 200px;
  margin-bottom: 12px;
}
.rule-list {
  margin: 0;
  padding-left: 20px;
  font-size: 16px;
}
.rule-list li {
  line-height: 28px;
}
/* 原分页样式（.pagination margin-top: 20px） */
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.pagination button {
  cursor: pointer;
  padding: 2px 10px;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
