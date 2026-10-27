<template>
  <!-- 原 a-modal：width=modalWidth、cancelText=关闭(common.close)；上移 margin-top/-70px 样式由 ep-dialog 居中布局替代 -->
  <ep-dialog
    v-model="visible"
    :title="modalTitle"
    :width="modalWidth"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <!-- 原 a-row :gutter="10" 左 6/24 组织机构 + 右 18/24 项目列表；ep 组件库无栅格组件，用 flex 实现左右结构 -->
    <div class="dep-modal-row">
      <div class="dep-col dep-col-left">
        <div class="dep-panel">
          <!-- 组织机构（LC0333 当前选择： / LC0334 取消选择） -->
          <div class="dep-title">
            当前选择：<a>{{ selectedDepartName || '未选择' }}</a>
            <a class="clear-link" @click="onClearSelected">取消选择</a>
          </div>
          <!-- 原 a-input-search @search：ep 组件库无 search 输入框，组合为输入框 + 搜索按钮（回车亦可触发） -->
          <div class="dep-search">
            <ep-input
              v-model="keyWord"
              placeholder="请输入组织机构名称"
              @keyup.enter="handleTreeSearch"
            />
            <ep-button plain type="primary" @click="handleTreeSearch">搜索</ep-button>
          </div>
          <!-- 原 a-directory-tree selectable checkStrictly：点击树节点过滤右侧表格，highlight-current 高亮选中节点 -->
          <ep-tree
            ref="treeRef"
            :data="departTree"
            node-key="id"
            :props="{ label: 'departName', children: 'children' }"
            highlight-current
            default-expand-all
            @node-click="onNodeClick"
          />
        </div>
      </div>
      <div class="dep-col dep-col-right">
        <div class="dep-panel">
          <div class="table-toolbar">
            项目名称：
            <ep-input
              v-model="queryParam.projectName"
              class="name-input"
              placeholder="请输入项目名称"
              @keyup.enter="onSearch"
            />
            <ep-button plain @click="searchReset(true)">重置</ep-button>
          </div>
          <!-- 原 a-table rowKey=id，3 列：LC0636 项目编码 / LC0637 项目名称 / LC0638 项目状态 -->
          <!-- 原 rowSelection checkbox(multi)/radio：ep-table 无内置选择列，以首列 ep-checkbox/ep-radio 模拟 -->
          <ep-table :data="dataSource" row-key="id" empty-text="暂无数据">
            <ep-table-column width="50" align="center">
              <template #default="{ row }">
                <ep-checkbox
                  v-if="multi"
                  :model-value="selectedRowKeys.includes(row.id)"
                  @change="toggleSelect(row)"
                />
                <ep-radio
                  v-else
                  :model-value="selectedRowKeys[0] === row.id ? row.id : ''"
                  :value="row.id"
                  @change="toggleSelect(row)"
                />
              </template>
            </ep-table-column>
            <ep-table-column label="项目编码" prop="projectCode" align="center" min-width="120" />
            <ep-table-column label="项目名称" prop="projectName" align="center" min-width="160" />
            <ep-table-column label="项目状态" prop="projectStatus_dictText" align="center" min-width="100" />
          </ep-table>
          <!-- 原 ant 分页 pageSizeOptions 10/20/30、showTotal=LC0659「{start}-{end} 共{total}条」、showQuickJumper/showSizeChanger；
               ep-pagination 固定渲染 总数/上一页/页码/下一页/页大小/跳转，总数文案经 totalDescribe 注入 LC0659 格式 -->
          <ep-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.pageSize"
            :page-sizes="PAGE_SIZES"
            :total="pagination.total"
            :total-describe="totalText"
            background
          />
        </div>
      </div>
    </div>
    <template #footer>
      <!-- 原弹窗取消按钮文案为「关闭」而非「取消」 -->
      <ep-button plain @click="close">关闭</ep-button>
      <ep-button type="primary" @click="handleSubmit">确定</ep-button>
    </template>
  </ep-dialog>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { SUCCESS_STATUS, PAGE_SIZES } from '@/config/config'
import {
  queryDepartTreeList,
  queryChildDepartTreeList,
  searchByKeywords,
  getProjectList,
  queryProjectByDepId
} from '@/api/lowCodePlatform/develop'

const props = defineProps({
  // 弹窗宽度（原 a-modal width，默认 1250）
  modalWidth: {
    type: Number,
    default: 1250
  },
  // 是否多选（true→checkbox / false→radio，原 getType 计算属性）
  multi: {
    type: Boolean,
    default: true
  },
  // 是否仅查询当前用户有权限的部门（决定走 queryChildDepartTreeList 还是 queryDepartTreeList）
  userOwn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['ok'])

// 说明（与源实现差异）：原弹窗 watch projectIds → initUserNames 按 projectCode 匹配 dataSource → emit('initComp')
// 往返回显项目名，此处简化：外壳组件在 ok 回调里直接持有项目名，不再需要 initComp 往返。
// 原 selectedDepIds/selectedDepartName 由 ep-tree highlight-current + selectedDepartName 替代。

const visible = ref(false)
// 弹窗标题（LC0662 根据部门选择{name}，name=LC0412 项目）
const modalTitle = '根据部门选择项目'
// 组织机构搜索关键字
const keyWord = ref('')
// 组织机构树数据
const departTree = ref([])
const treeRef = ref(null)
// 左侧树选中部门名
const selectedDepartName = ref('')
// 右侧查询条件（原 queryParam：departId + projectName）
const queryParam = reactive({
  departId: '',
  projectName: ''
})
// 排序（原 isorter：createTime desc）
const sorter = reactive({
  column: 'createTime',
  order: 'desc'
})
// 表格数据（原 dataSource）
const dataSource = ref([])
// 已选行 key 与行数据（原 selectedRowKeys / selectUserRows）
const selectedRowKeys = ref([])
const selectedRows = ref([])
// 分页（原 ipagination：current/pageSize/total，pageSizeOptions 10/20/30 走 config.PAGE_SIZES）
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

/** 分页总数文案（LC0659「{start}-{end} 共{total}条」） */
const totalText = computed(() => {
  if (!pagination.total) return '共0条'
  const start = (pagination.current - 1) * pagination.pageSize + 1
  const end = Math.min(pagination.current * pagination.pageSize, pagination.total)
  return `${start}-${end} 共${pagination.total}条`
})

/** 查询项目列表（原 loadData：projectName 包装 *xx* 模糊、column/order 排序、pageNo/pageSize 分页） */
const loadData = async (resetPage = false) => {
  if (resetPage) pagination.current = 1
  const params = {
    departId: queryParam.departId || undefined,
    projectName: queryParam.projectName ? `*${queryParam.projectName}*` : undefined,
    column: sorter.column,
    order: sorter.order,
    pageNo: pagination.current,
    pageSize: pagination.pageSize
  }
  const res = await getProjectList(params)
  if (res.returnCode === SUCCESS_STATUS) {
    dataSource.value = res.result || []
    pagination.total = res.totalCount || 0
  }
}

/** 查询组织机构树（原 queryDepartTree：userOwn 走子部门树接口） */
const queryDepartTree = async () => {
  const res = props.userOwn ? await queryChildDepartTreeList() : await queryDepartTreeList()
  if (res.returnCode === SUCCESS_STATUS) {
    departTree.value = res.result || []
  }
}

/** 树关键字搜索（原 handleSearch：有关键字 searchByKeywords 整棵替换，否则恢复全量树；展开逻辑由 default-expand-all 替代） */
const handleTreeSearch = async () => {
  if (keyWord.value) {
    const res = await searchByKeywords({ keyWord: keyWord.value })
    if (res.returnCode === SUCCESS_STATUS) {
      departTree.value = res.result || []
    }
  } else {
    queryDepartTree()
  }
}

/** 按部门主键查询项目（原 initQueryProjectByDepId，接口即 /develop/project/list + departId） */
const initQueryProjectByDepId = async (departId) => {
  const res = await queryProjectByDepId({ departId })
  if (res.returnCode === SUCCESS_STATUS) {
    dataSource.value = res.result || []
    pagination.total = res.totalCount || 0
  }
}

/** 点击树节点过滤右侧表格（原 onDepSelect） */
const onNodeClick = (data) => {
  selectedDepartName.value = data.departName
  // 与源实现差异：原实现点击树节点后 queryParam.departId 未持久化，翻页会丢失部门过滤；此处持久化使分页保持过滤
  queryParam.departId = data.id
  pagination.current = 1
  initQueryProjectByDepId(data.id)
}

/** 取消部门选择（原 onClearSelected：清空部门 + searchReset(1) 清空查询条件与已选行并重新加载） */
const onClearSelected = () => {
  treeRef.value?.setCurrentKey(null)
  searchReset(true)
}

/** 勾选/取消一行（原 onSelectChange；radio 时仅保留一行） */
const toggleSelect = (row) => {
  if (props.multi) {
    if (selectedRowKeys.value.includes(row.id)) {
      selectedRowKeys.value = selectedRowKeys.value.filter((k) => k !== row.id)
    } else {
      selectedRowKeys.value.push(row.id)
    }
    selectedRows.value = dataSource.value.filter((i) => selectedRowKeys.value.includes(i.id))
  } else {
    selectedRowKeys.value = [row.id]
    selectedRows.value = [row]
  }
}

/** 项目名称搜索（原 onSearch：回到第 1 页重新加载） */
const onSearch = () => {
  loadData(true)
}

/** 重置（原 searchReset(1)：清空查询条件、已选行与部门选择并重新加载；reload=false 用于关闭弹窗时仅清状态） */
const searchReset = (reload) => {
  queryParam.departId = ''
  queryParam.projectName = ''
  selectedRowKeys.value = []
  selectedRows.value = []
  selectedDepartName.value = ''
  treeRef.value?.setCurrentKey(null)
  if (reload) loadData(true)
}

/** 打开弹窗（原 showModal：加载组织机构树 + 项目列表） */
const showModal = () => {
  visible.value = true
  queryDepartTree()
  loadData(true)
}

/** 关闭弹窗（原 close：searchReset(1) 会顺带刷新列表，此处弹窗即将隐藏故省略加载，打开时 showModal 会重新加载） */
const close = () => {
  searchReset(false)
  visible.value = false
}

/** 确认（原 handleSubmit：仅从当前页 dataSource 中取已选行，逗号拼接 projectCode 作为 v-model 值） */
const handleSubmit = () => {
  const rows = dataSource.value.filter((i) => selectedRowKeys.value.includes(i.id))
  const projectCodes = rows.map((i) => i.projectCode).join(',')
  emit('ok', rows, projectCodes)
  close()
}

defineExpose({
  showModal
})
</script>

<style scoped>
/* 原 a-row/a-col 6:18 栅格 → flex 左右布局（ep 组件库无栅格组件） */
.dep-modal-row {
  display: flex;
  gap: 10px;
  background-color: #ececec;
  padding: 10px;
  margin: -10px;
}
/* 左 6/24 组织机构树 */
.dep-col-left {
  width: 25%;
  flex-shrink: 0;
}
/* 右 18/24 项目列表 */
.dep-col-right {
  flex: 1;
  min-width: 0;
}
.dep-panel {
  background: #fff;
  padding: 12px;
  min-height: 320px;
}
.dep-title {
  margin-bottom: 10px;
}
.dep-title a {
  color: #1890ff;
  cursor: pointer;
}
.dep-title .clear-link {
  margin-left: 10px;
}
.dep-search {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.table-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}
.table-toolbar .name-input {
  width: 250px;
}
</style>
