<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/components/jeecgbiz/JSelectBizComponent/JSelectBizComponentModal.vue
       （JSelectRegulator 配置：name=LC0153 规则、listUrl=/configuation/regulatorrule/config/listPage、
       displayKey=regulatorName、returnKeys=[id,regulatorId]、idPreStr=regulatorrule） -->
  <!-- 原 a-modal：title=LC0656「选择{name}」(name=LC0153 规则)、width=900、cancelText=关闭(common.close)、centered -->
  <ep-dialog
    v-model="visible"
    title="选择规则"
    :width="modalWidth"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <!-- 查询区（原 a-form inline：queryParam[valueKey]=regulatorId 首字段 + selectParam(regulatorName/systemName/regulatorSubType)；
         ep 无栅格，flex 换行布局） -->
    <div class="biz-search">
      <div class="biz-search-item">
        <span class="biz-search-label">规则标识</span>
        <!-- 原首查询字段 a-input v-model=queryParam[valueKey]（valueKey=regulatorId，LC0308） -->
        <ep-input
          v-model="queryParam.regulatorId"
          placeholder="请输入规则标识"
          @keyup.enter="searchQuery"
        />
      </div>
      <div class="biz-search-item">
        <span class="biz-search-label">规则名称</span>
        <!-- 原 selectParam[0] input：LC0325 规则名称 -->
        <ep-input
          v-model="queryParam.regulatorName"
          placeholder="请输入规则名称"
          @keyup.enter="searchQuery"
        />
      </div>
      <div class="biz-search-item">
        <span class="biz-search-label">所属应用</span>
        <!-- 原 selectParam[1] dict：local|develop_system,system_name,system_code（LC0697）；联调后替换为表字典渲染 -->
        <ep-select v-model="queryParam.systemName" placeholder="请选择所属应用">
          <ep-option v-for="item in SYSTEM_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </ep-select>
      </div>
      <div class="biz-search-item">
        <span class="biz-search-label">规则类型</span>
        <!-- 原 selectParam[2] dict：regulator_sub_type（LC0152）；联调后替换为表字典渲染 -->
        <ep-select v-model="queryParam.regulatorSubType" placeholder="请选择规则类型">
          <ep-option v-for="item in REGULATOR_SUB_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </ep-select>
      </div>
      <div class="biz-search-item">
        <ep-button type="primary" @click="searchQuery">查询</ep-button>
        <ep-button type="primary" plain @click="searchReset">重置</ep-button>
      </div>
    </div>

    <!-- 候选/已选 双表（原 a-col 16/24 待选 + 8/24 已选；ep 无栅格，flex 布局） -->
    <div class="biz-modal-row">
      <div class="biz-col-left">
        <!-- 原 a-card title=LC0657 待选{name} -->
        <div class="biz-card-title">待选规则</div>
        <!-- 原 a-table size=small bordered rowKey=id scroll.y=240 rowSelection checkbox/radio @change=onSelectChange -->
        <ep-table :data="dataSource" row-key="id" empty-text="暂无数据" max-height="240" @row-click="onRowClick">
          <ep-table-column width="50" align="center">
            <template #default="{ row }">
              <ep-checkbox
                v-if="multiple"
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
          <!-- 原 columns：regulatorId(LC0308 规则标识)/regulatorName(LC0325 规则名称)/regulatorSubType_dictText(LC0152 规则类型) -->
          <ep-table-column label="规则标识" prop="regulatorId" align="center" min-width="200" />
          <ep-table-column label="规则名称" prop="regulatorName" align="center" min-width="200" />
          <ep-table-column label="规则类型" prop="regulatorSubType_dictText" align="center" width="100" />
        </ep-table>
        <!-- 原 mixin ipagination：pageSizeOptions 10/20/30、showTotal=LC0659、showQuickJumper/showSizeChanger -->
        <ep-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="PAGE_SIZES"
          :total="pagination.total"
          :total-describe="totalText"
          background
        />
      </div>
      <div class="biz-col-right">
        <!-- 原 a-card title=LC0658 已选{name} -->
        <div class="biz-card-title">已选规则</div>
        <!-- 原 selectedTable：propColumns[0]（规则标识）+ 操作(删除)，pagination=false scroll.y=240 -->
        <ep-table :data="selectedRows" row-key="id" empty-text="暂无数据" max-height="240">
          <ep-table-column label="规则标识" prop="regulatorId" align="center" min-width="160" />
          <ep-table-column label="操作" align="center" width="60">
            <template #default="{ row }">
              <a class="delete-link" @click="removeSelected(row)">删除</a>
            </template>
          </ep-table-column>
        </ep-table>
      </div>
    </div>
    <template #footer>
      <!-- 原弹窗取消按钮文案为「关闭」而非「取消」 -->
      <ep-button plain @click="close">关闭</ep-button>
      <ep-button type="primary" @click="handleOk">确定</ep-button>
    </template>
  </ep-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { SUCCESS_STATUS, PAGE_SIZES } from '@/config/config'
import { getRegulatorRuleList } from '@/api/lowCodePlatform/regulatorRule'

// 原字典 local|develop_system,system_name,system_code（所属应用）；选项与 regulatorRule.js mockList systemName 对齐，联调后替换为表字典
const SYSTEM_OPTIONS = [
  { label: '支付核心', value: 'pay_core' },
  { label: '支付管理', value: 'pay_mgr' }
]
// 原字典 regulator_sub_type（规则类型）；label 中文为示意，联调后由字典提供
const REGULATOR_SUB_TYPE_OPTIONS = [
  { label: '单决策', value: 'SINGLE_DECISION' },
  { label: '单渲染', value: 'SINGLE_RENDER' },
  { label: '多决策', value: 'MUTIL_DECISION' },
  { label: '多渲染', value: 'MUTIL_RENDER' },
  { label: '合并', value: 'JOIN' },
  { label: '数据赋值', value: 'DATA_ASSIGN' },
  { label: '多决策子表', value: 'MUTIL_DECISION_SUBLIST' },
  { label: '多渲染子表', value: 'MUTIL_RENDER_SUBLIST' }
]

const props = defineProps({
  // 弹窗宽度（原 a-modal width 默认 '900'）
  modalWidth: {
    type: Number,
    default: 900
  },
  // 是否多选（true→checkbox / false→radio 且整行点击选中，原 multiple）
  multiple: {
    type: Boolean,
    default: true
  },
  // 是否返回 id（源 returnKeys=['id','regulatorId']，默认 false 返回 regulatorId——注意与 JSelectRegulatorInfo 返回 className 不同）
  returnId: {
    type: Boolean,
    default: false
  },
  // 外壳已选行（用于打开时恢复已选表与勾选状态，见外壳 与源差异 说明）
  selectedRows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['ok', 'selectRecords'])

// 提交值字段（源 valueKey = returnId ? returnKeys[0] : returnKeys[1]，即 'id' 或 'regulatorId'）
const valueKey = computed(() => (props.returnId ? 'id' : 'regulatorId'))

const visible = ref(false)
// 查询条件（原 queryParam：regulatorId 首字段 + selectParam regulatorName/systemName/regulatorSubType）
const queryParam = reactive({
  regulatorId: '',
  regulatorName: '',
  systemName: '',
  regulatorSubType: ''
})
// 排序（原 isorter：createTime desc）
const sorter = reactive({
  column: 'createTime',
  order: 'desc'
})
// 待选表数据（原 dataSource）
const dataSource = ref([])
// 已选行与 key（原 selectedTable.dataSource / selectedRowKeys）
const selectedRows = ref([])
const selectedRowKeys = ref([])
// 分页（原 ipagination）
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

/** 查询待选列表（原 mixin loadData：getQueryParams + pageNo/pageSize/column/order；返回 res.result.records || res.result） */
const loadData = async (resetPage = false) => {
  if (resetPage) pagination.current = 1
  const res = await getRegulatorRuleList({
    regulatorId: queryParam.regulatorId || undefined,
    regulatorName: queryParam.regulatorName || undefined,
    systemName: queryParam.systemName || undefined,
    regulatorSubType: queryParam.regulatorSubType || undefined,
    column: sorter.column,
    order: sorter.order,
    pageNo: pagination.current,
    pageSize: pagination.pageSize
  })
  if (res.returnCode === SUCCESS_STATUS) {
    dataSource.value = res.result || []
    pagination.total = res.totalCount || 0
  }
}

/** 查询（原 searchQuery：回到第 1 页重新加载） */
const searchQuery = () => {
  loadData(true)
}

/** 重置（原 searchReset：清空查询条件并重新加载，保留已选） */
const searchReset = () => {
  queryParam.regulatorId = ''
  queryParam.regulatorName = ''
  queryParam.systemName = ''
  queryParam.regulatorSubType = ''
  loadData(true)
}

/** 勾选/取消一行（原 onSelectChange；radio 时仅保留一行） */
const toggleSelect = (row) => {
  if (props.multiple) {
    if (selectedRowKeys.value.includes(row.id)) {
      removeSelected(row)
    } else {
      selectedRowKeys.value.push(row.id)
      selectedRows.value.push(row)
    }
  } else {
    selectedRowKeys.value = [row.id]
    selectedRows.value = [row]
  }
}

/** 整行点击（原 customRowFn：multiple=false 时点击行即选中） */
const onRowClick = (row) => {
  if (!props.multiple) {
    toggleSelect(row)
  }
}

const removeSelected = (row) => {
  selectedRowKeys.value = selectedRowKeys.value.filter((k) => k !== row.id)
  selectedRows.value = selectedRows.value.filter((i) => i.id !== row.id)
}

/** 打开弹窗（恢复外壳已选 + 加载待选列表） */
const showModal = () => {
  visible.value = true
  selectedRows.value = [...props.selectedRows]
  selectedRowKeys.value = selectedRows.value.map((i) => i.id)
  loadData(true)
}

/** 关闭弹窗（原 close：仅隐藏，保留状态供再次打开恢复） */
const close = () => {
  visible.value = false
}

/** 确定（原 handleOk：提交 selectedTable.dataSource 按 valueKey 取值拼接，emit selectRecords 行数据） */
const handleOk = () => {
  const rows = selectedRows.value
  const values = rows.map((data) => data[valueKey.value])
  emit('ok', rows, values.join(','))
  emit('selectRecords', rows)
  close()
}

defineExpose({
  showModal
})
</script>

<style scoped>
/* 原 a-form inline 查询区 → flex 换行布局（ep 组件库无栅格组件） */
.biz-search {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.biz-search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.biz-search-item .ep-input,
.biz-search-item .ep-select {
  width: 180px;
}
.biz-search-label {
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}
/* 原 a-col 16/24 待选 + 8/24 已选 → flex 左右布局 */
.biz-modal-row {
  display: flex;
  gap: 12px;
}
.biz-col-left {
  flex: 2;
  min-width: 0;
}
.biz-col-right {
  flex: 1;
  min-width: 0;
}
.biz-card-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.delete-link {
  color: #1890ff;
  cursor: pointer;
}
</style>
