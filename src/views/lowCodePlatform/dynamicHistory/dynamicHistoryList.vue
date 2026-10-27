<template>
  <div>
    <!-- 页头标题（原 page-layout :title="titleContent"，LC0777 中文原文格式插值；systemName 可能为 undefined，展示为空串容错） -->
    <div class="page-title">{{ state.titleContent }}</div>

    <!-- 顶部卡片：数据详情（原 a-card title=LC0774，DetailList col=3：按 formField 逐字段渲染来源行 record 的 label:value） -->
    <div class="detail-card">
      <div class="card-title">数据详情</div>
      <div class="detail-list">
        <div v-for="(item, index) in state.formItem" :key="index" class="detail-list-item">
          <span class="term">{{ item.columnComments }}</span>
          <span class="content">{{ defaultIfNull(state.model[item.columnName]) }}</span>
        </div>
      </div>
    </div>

    <!-- 底部卡片：历史数据列表（原 a-card title=LC0775 + a-table rowSelection 多选） -->
    <div class="history-card">
      <div class="card-title">历史数据列表</div>

      <!-- 「已选择 N 项」提示条（原 LC0750/LC0751 + 数据比对链接(选中>1 时出现) + 清空） -->
      <div v-if="state.selectedRows.length > 0" class="selected-tip">
        <span>已选择 <span class="tip-count">{{ state.selectedRows.length }}</span> 项</span>
        <ep-button
          v-if="state.selectedRows.length > 1"
          plain
          type="primary"
          class="button-text"
          @click="onSelectedDiff"
        >
          数据比对
        </ep-button>
        <ep-button plain type="primary" class="button-text" @click="onClearSelected">
          清空
        </ep-button>
      </div>

      <!-- 列表区（列顺序固定：序号 → 4 个固定列 → 动态列(listColumns 返回 tableColumns) → 操作列） -->
      <TableBlock
        :table-columns="state.tableColumns"
        :table-data="state.tableData"
        :show-multi-select-column="true"
        :page-obj="state.paging"
        @selection-change="onSelectionChange"
        @page-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <!-- 序号列（原列为 title='#'、空 dataIndex、customRender=index+1，此处带分页偏移计算） -->
        <template #rowIndex>
          <ep-table-column label="#" width="60" align="center">
            <template #default="{ rowIndex }">
              <span>{{ (state.paging.pageNo - 1) * state.paging.pageSize + rowIndex + 1 }}</span>
            </template>
          </ep-table-column>
        </template>
        <!-- 操作列（原 action 列 width=150：详情 | 数据比对，无权限码） -->
        <template #operation="{ colConfig }">
          <ep-table-column
            :label="colConfig.label"
            :width="colConfig.width"
            fixed="right"
            header-align="center"
            align="center"
          >
            <template #default="{ row }">
              <OperationCloumn :table-operation="state.tableOperation" :row="row" />
            </template>
          </ep-table-column>
        </template>
      </TableBlock>
    </div>

    <!-- 明细详情 弹窗（原 DynamicTableDataDetail：a-modal width=1200，DetailList col=1 逐字段只读展示）
         原分支: 设计查看（tableName==='regulatorRule' 时标题区出现「设计查看」链接，内嵌 RegulatorRuleModal），待迁移 -->
    <ep-dialog v-model="state.detailVisible" title="明细详情" width="1200px">
      <div class="detail-list detail-list-dialog">
        <div v-for="(item, index) in state.formItem" :key="index" class="detail-list-item">
          <span class="term">{{ item.columnComments }}</span>
          <span class="content">{{ defaultIfNull(state.detailModel[item.columnName]) }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <ep-button plain @click="state.detailVisible = false">关闭</ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 原组件: IssueJobsProcessDetailDisplay，待迁移（历史数据对比占位弹窗） -->
    <ep-dialog v-model="state.diffVisible" title="历史数据对比" width="480px">
      <div class="placeholder-block">原比对组件 IssueJobsProcessDetailDisplay 待迁移，当前仅保留数据比对入口</div>
      <template #footer>
        <span class="dialog-footer">
          <ep-button plain @click="state.diffVisible = false">关闭</ep-button>
        </span>
      </template>
    </ep-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'
import { SUCCESS_STATUS, PAGE_SIZE, PAGE_NO } from '@/config/config'
import { EPMessageTips } from '@/utils/utils'
import { getDynamicHistoryList, getDynamicHistoryListColumns } from '@/api/lowCodePlatform/dynamicHistory'

// 历史数据查看页传参键（来源页跳转前写入，JSON 字符串，含 tableName/systemName/id/record/formField）
const HISTORY_PARAMS_KEY = 'lowCode:dynamicHistoryParams'

const route = useRoute()

// 原页面 defaultIfNull：空值统一展示 '-'
const defaultIfNull = (val) => (!val ? '-' : val)

const state = reactive({
  // 来源行 record（原 $route.params.record 反序列化，顶部详情卡片与行级数据比对使用）
  model: {},
  // 明细详情弹窗当前行
  detailModel: {},
  // 顶部详情字段（原 $route.params.formField 反序列化；调用方多传空数组，loadColumn 后若为空回退 allColumnsItems）
  formItem: [],
  // 标题（原 LC0777：模型所属应用 : {systemName}  ,  模型名称 : {tableName}  ,  数据标识 : {id}）
  titleContent: '',
  // 查询条件（原 queryParam：tableName 固定，systemName/pkValue 仅非空才加入）
  tableName: '',
  systemName: '',
  id: '',
  // 原页 queryItem = res.result.columnsItems（源页仅存储未渲染查询区，保真保留）
  queryItem: [],
  // 列表
  tableData: [],
  // 列顺序固定：序号(#) → 4 个固定列 → 动态列(tableColumns) → 操作列，loadColumn 中组装
  tableColumns: [],
  // 行操作（原 action 列：详情 common.detail / 数据比对 LC0754，均无权限码）
  tableOperation: [
    {
      text: '详情',
      methods: (row) => handleDetail(row)
    },
    {
      text: '数据比对',
      methods: (row) => handleDiff(row, state.model, true)
    }
  ],
  // 选中行（原 selectedRowKeys/selectionRows，最多 2 条用于数据比对）
  selectedRows: [],
  // 分页器
  paging: {
    total: 0,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  // 明细详情弹窗
  detailVisible: false,
  // 数据比对占位弹窗
  diffVisible: false
})

/** 页面挂载：读取传参并初始化（每次进入覆盖读取 sessionStorage） */
onMounted(() => {
  initData()
})

/** 初始化（原 initData：$route.params.record/formField/tableName/systemName/id → 改为 sessionStorage + route.query 兜底） */
const initData = () => {
  // 传参约定：跳转主入口经 sessionStorage（键 lowCode:dynamicHistoryParams）写入；
  // route.query 仅作为手输 URL 的兜底，sessionStorage 优先（保证每次进入都以最新跳转参数为准）
  let params = {}
  try {
    const raw = sessionStorage.getItem(HISTORY_PARAMS_KEY)
    if (raw) {
      params = JSON.parse(raw) || {}
    }
  } catch (e) {
    params = {}
  }
  const query = route.query || {}
  state.tableName = params.tableName ?? query.tableName ?? ''
  // systemName 可能 undefined：标题与查询参数均需容错（查询参数仅非空才加入）
  state.systemName = params.systemName ?? query.systemName ?? ''
  state.id = params.id ?? query.id ?? ''
  try {
    state.model =
      typeof params.record === 'string' ? JSON.parse(params.record) || {} : params.record || {}
  } catch (e) {
    state.model = {}
  }
  try {
    const formField =
      typeof params.formField === 'string'
        ? JSON.parse(params.formField) || []
        : params.formField || []
    state.formItem = Array.isArray(formField) ? formField : []
  } catch (e) {
    state.formItem = []
  }
  // 标题按 LC0777 中文原文格式插值，空值展示为空串
  state.titleContent = `模型所属应用 : ${state.systemName || ''}  ,  模型名称 : ${
    state.tableName || ''
  }  ,  数据标识 : ${state.id || ''}`
  loadColumn()
  handleList()
}

/** 加载列表动态列（原 GET /dynamic/table/column/listColumns，参数 tableName；result 三处消费见下） */
const loadColumn = async () => {
  const res = await getDynamicHistoryListColumns({ tableName: state.tableName })
  if (res.returnCode === SUCCESS_STATUS) {
    // ① result.allColumnsItems：原 this.formField = res.result.allColumnsItems（供详情展示）；
    //    此处顶部详情字段为空时回退使用，保证顶部卡片有内容
    const allColumnsItems = res.result.allColumnsItems || []
    if (!state.formItem.length) {
      state.formItem = allColumnsItems
    }
    // 4 个固定列（label 为 i18n 解析出的中文：LC0778~LC0781；宽度列注释为原 ant 列宽）
    const fixedColumns = [
      {
        isShow: true,
        prop: 'developRequire', // 原 width 80
        label: '变更需求',
        minWidth: 110
      },
      {
        isShow: true,
        prop: 'gmtModified_dateText', // 原 width 80
        label: '变更时间',
        minWidth: 160
      },
      {
        isShow: true,
        prop: 'modifiedUser_userNameText', // 原 width 60
        label: '变更提交人',
        minWidth: 110
      },
      {
        isShow: true,
        prop: 'operateType_dictText', // 原 width 60
        label: '变更类型',
        minWidth: 110
      }
    ]
    // ② result.tableColumns：动态列，后端返回 ant 风格（title/dataIndex/width），转换为 ep 风格（label/prop）
    const dynamicColumns = (res.result.tableColumns || []).map((col) => ({
      isShow: true,
      prop: col.dataIndex,
      label: col.title,
      minWidth: col.width || 120
    }))
    // 操作列（原 action 列 width=150）
    const actionColumn = {
      isShow: true,
      slot: 'operation',
      label: '操作', // 原 common.operation
      width: 150
    }
    // 序号列（原列为 title='#'、空 dataIndex、customRender=index+1）
    const rowIndexColumn = {
      isShow: true,
      slot: 'rowIndex',
      label: '#',
      width: 60
    }
    // 列顺序固定：序号 → 4 个固定列 → 动态列 → 操作列
    state.tableColumns = [rowIndexColumn, ...fixedColumns, ...dynamicColumns, actionColumn]
    // ③ result.columnsItems：原 this.queryItem = res.result.columnsItems（源页仅存储未渲染查询区，保真保留）
    state.queryItem = res.result.columnsItems || []
  }
}

/** 获取历史列表数据（原 GET /dynamic/table/data/history/listObject） */
const handleList = async () => {
  const param = {
    pageSize: state.paging.pageSize,
    pageNo: state.paging.pageNo,
    tableName: state.tableName
  }
  // 原逻辑：systemName/id 非 undefined 才加入查询参数
  if (state.systemName) {
    param.systemName = state.systemName
  }
  if (state.id) {
    param.pkValue = state.id
  }
  const res = await getDynamicHistoryList(param)
  if (res.returnCode === SUCCESS_STATUS) {
    state.tableData = res.result
    state.paging.total = res.totalCount
  }
}

/** 多选勾选（原 onSelectChange 限选 2 条，此处放开勾选、比对时校验条数） */
const onSelectionChange = (checkedRows) => {
  state.selectedRows = checkedRows || []
}

/** 清空选择（原 onClearSelected） */
const onClearSelected = () => {
  state.tableData.forEach((row) => {
    row.checked = false
  })
  state.selectedRows = []
}

/** 批量数据比对入口（原 onSelectedDiff：选中条数 !== 2 时 warning LC0782） */
const onSelectedDiff = () => {
  if (state.selectedRows.length !== 2) {
    EPMessageTips('warning', '对比的数据暂时只支持2条')
    return
  }
  // 原逻辑：两条选中行置 developMode='HISTORY' 后调用 handleDiff(rows[0], rows[1], false)
  openDiffPlaceholder()
}

/**
 * 数据比对（原 handleDiff：组装 changeJobProjectCode/changeSheetJobReferContentObject/
 * changeSheetJobContentObject 后打开 IssueJobsProcessDetailDisplay 弹窗，
 * isRecover=true 时 diffType='history'）——比对组件待迁移，保留入口与弹窗占位
 */
const handleDiff = (sourceRecord, targetRecord, isRecover) => {
  openDiffPlaceholder(isRecover)
}

/** 打开数据比对占位弹窗 */
const openDiffPlaceholder = () => {
  state.diffVisible = true
}

/** 查看详情（原 handleDetail：detailForm.edit(record, formItem)，title=LC0784 明细详情） */
const handleDetail = (row) => {
  state.detailModel = row
  state.detailVisible = true
}

/* 分页器相关操作 */
const handleSizeChange = (val) => {
  state.paging.pageSize = val
  handleList()
}
// 修改当前页
const handleCurrentChange = (val) => {
  state.paging.pageNo = val
  handleList()
}
</script>

<style scoped>
.page-title {
  padding: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.detail-card,
.history-card {
  padding: 16px 20px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 4px;
}
.card-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
/* 原 DetailList col=3（顶部卡片）/ col=1（明细详情弹窗）布局 */
.detail-list {
  display: flex;
  flex-wrap: wrap;
}
.detail-list-item {
  display: flex;
  padding: 8px 0;
  font-size: 14px;
  line-height: 1.5;
}
.detail-list:not(.detail-list-dialog) .detail-list-item {
  width: 33.33%;
}
.detail-list-item .term {
  font-weight: bold;
  color: #333;
}
.detail-list-item .term::after {
  content: '：';
}
.detail-list-item .content {
  flex: 1;
  color: #666;
  word-break: break-all;
}
.selected-tip {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: #f0f3fa;
  border-radius: 4px;
}
.tip-count {
  font-weight: 600;
}
.placeholder-block {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  color: #999;
  background: #f7f9fd;
}
.button-text {
  padding: 0;
}
.dialog-footer {
  display: inline-flex;
  gap: 12px;
}
</style>
