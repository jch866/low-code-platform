<template>
  <div>
    <!-- 查询区（原页面 2 个搜索字段：动态表表名 / 所属应用） -->
    <SearchBlock
      :form-model="state.formModel"
      :label-width="130"
      :search-func="handleSearchFunc"
    >
      <ep-form-item prop="tableName" label="动态表表名">
        <!-- 原 a-input 无 placeholder -->
        <ep-input v-model="state.formModel.tableName" type="text" />
      </ep-form-item>
      <ep-form-item prop="systemName" label="所属应用">
        <!-- 原组件: j-dict-select-tag，表字典 local|develop_system,system_name,system_code -->
        <ep-select v-model="state.formModel.systemName" placeholder="请选择所属应用">
          <ep-option
            v-for="item in state.systemOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ep-select>
      </ep-form-item>
    </SearchBlock>

    <!-- 「已选择 N 项」提示条（原 LC0750/LC0751 + 清空） -->
    <div v-if="state.selectedRows.length > 0" class="selected-tip">
      <span>已选择 {{ state.selectedRows.length }} 项</span>
      <ep-button plain type="primary" class="button-text" @click="onClearSelected">
        清空
      </ep-button>
    </div>

    <!-- 列表区（多选框供批量删除/批量导出使用） -->
    <TableBlock
      :table-columns="state.tableColumns"
      :table-data="state.tableData"
      :show-operation="true"
      :show-multi-select-column="true"
      :button-groups="buttonGroups"
      :page-obj="state.paging"
      @selection-change="onSelectionChange"
      @page-size-change="handleSizeChange"
      @handle-current-change="handleCurrentChange"
    >
      <template #operation="{ colConfig }">
        <ep-table-column
          :label="colConfig.label"
          :min-width="colConfig.minWidth"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <!-- 原页面为「编辑 | 更多(详情)」下拉，因仅一项平铺为「编辑 | 详情」 -->
            <OperationCloumn
              :table-operation="state.tableOperation"
              :row="row"
            />
          </template>
        </ep-table-column>
      </template>
    </TableBlock>

    <!-- 新增/编辑/详情 弹窗（原 DynamicTableModal：a-modal width='100%' 全屏，destroyOnClose，取消文案=关闭） -->
    <ep-dialog
      v-model="state.dialogVisible"
      :title="state.title"
      width="100%"
      :show-close="false"
    >
      <ep-form ref="formRef" :model="state.form" :label-width="130">
        <ep-form-item
          prop="tableName"
          label="动态表名称"
          :rules="[{ required: true, message: '请输入动态表名称!', trigger: 'blur' }]"
        >
          <!-- 原 @blur 查重 isTableNameExist，重复则清空 + warning -->
          <ep-input
            v-model="state.form.tableName"
            placeholder="请输入动态表名称"
            type="text"
            :disabled="state.mode === 'detail'"
            @blur="onTableNameBlur"
          />
        </ep-form-item>
        <ep-form-item prop="tableComments" label="动态表描述">
          <ep-input
            v-model="state.form.tableComments"
            placeholder="请输入动态表描述"
            type="textarea"
            :rows="4"
            :disabled="state.mode === 'detail'"
          />
        </ep-form-item>
        <ep-form-item
          prop="systemName"
          label="所属系统"
          :rules="[{ required: true, message: '请选择所属系统!', trigger: 'change' }]"
        >
          <!-- 原编辑态 readOnly 时禁用；表字典 local|develop_system,system_name,system_code -->
          <ep-select
            v-model="state.form.systemName"
            placeholder="请选择所属系统"
            :disabled="state.mode !== 'add'"
          >
            <ep-option
              v-for="item in state.systemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item prop="version" label="版本标识">
          <ep-input
            v-model="state.form.version"
            placeholder="请输入版本标识"
            type="text"
            :disabled="state.mode === 'detail'"
          />
        </ep-form-item>
        <ep-form-item prop="publishEnvi" label="发布环境">
          <!-- 原组件为 a-input（非下拉） -->
          <ep-input
            v-model="state.form.publishEnvi"
            placeholder="请输入发布环境"
            type="text"
            :disabled="state.mode === 'detail'"
          />
        </ep-form-item>
      </ep-form>

      <!-- 主表单下方 tabs（原 a-tabs defaultActiveKey="1"） -->
      <ep-tab v-model="state.activeTab">
        <!-- Tab1 动态表字段（原组件: DynamicTableColumns.vue / JEditableTables 多级可编辑表格，待迁移） -->
        <ep-tab-pane name="1" label="动态表字段">
          <div class="sub-table-toolbar">
            <ep-button plain type="primary" :disabled="state.mode === 'detail'" @click="addColumnRow">
              添加行
            </ep-button>
            <ep-button
              plain
              type="danger"
              :disabled="state.mode === 'detail' || state.columnRows.length === 0"
              @click="removeColumnRow"
            >
              删除行
            </ep-button>
          </div>
          <ep-table :data="state.columnRows" empty-text="暂无数据" max-height="420">
            <ep-table-column label="#" width="50" align="center">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </ep-table-column>
            <ep-table-column label="字段名称" min-width="140">
              <template #default="{ row }">
                <ep-input v-model="row.columnName" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="字段类型" min-width="130">
              <template #default="{ row }">
                <ep-input v-model="row.columnType" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="字段长度" min-width="100">
              <template #default="{ row }">
                <ep-input v-model="row.length" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="允许NULL" width="90" align="center">
              <template #default="{ row }">
                <ep-checkbox v-model="row.nullable" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="默认值" min-width="110">
              <template #default="{ row }">
                <ep-input v-model="row.defaultValue" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="字段属性" min-width="110">
              <template #default="{ row }">
                <ep-input v-model="row.property" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="字段描述" min-width="140">
              <template #default="{ row }">
                <ep-input v-model="row.columnComments" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="当前版本" min-width="100">
              <template #default="{ row }">
                <ep-input v-model="row.version" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="发布环境" min-width="100">
              <template #default="{ row }">
                <ep-input v-model="row.publishEnvi" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="是否查询条件" width="110" align="center">
              <template #default="{ row }">
                <ep-checkbox v-model="row.isInquiry" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="是否列表展示" width="110" align="center">
              <template #default="{ row }">
                <ep-checkbox v-model="row.isListShow" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="是否必填数据" width="110" align="center">
              <template #default="{ row }">
                <ep-checkbox v-model="row.isRequired" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="是否提交申请展示" width="130" align="center">
              <template #default="{ row }">
                <ep-checkbox v-model="row.isCommitShow" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="是否业务主键" min-width="110" align="center">
              <template #default="{ row }">
                <ep-checkbox v-model="row.isBusinessKey" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="操作" width="70" fixed="right" align="center">
              <template #default="{ $index }">
                <!-- 原为 JEditableTable 行删除按钮 -->
                <ep-button
                  plain
                  type="primary"
                  class="button-text"
                  :disabled="state.mode === 'detail'"
                  @click="state.columnRows.splice($index, 1)"
                >
                  删除
                </ep-button>
              </template>
            </ep-table-column>
          </ep-table>
        </ep-tab-pane>
        <!-- Tab2 动态表索引（原组件: DynamicTableIndex.vue / JEditableTable 可编辑表格，待迁移） -->
        <ep-tab-pane name="2" label="动态表索引">
          <!-- 原 LC0918 提示 -->
          <div class="index-tip">
            如果索引用于文件名称生成，索引类型固定为: FILE-NAME-INDEX
          </div>
          <div class="sub-table-toolbar">
            <ep-button plain type="primary" :disabled="state.mode === 'detail'" @click="addIndexRow">
              添加行
            </ep-button>
            <ep-button
              plain
              type="danger"
              :disabled="state.mode === 'detail' || state.indexRows.length === 0"
              @click="removeIndexRow"
            >
              删除行
            </ep-button>
          </div>
          <ep-table :data="state.indexRows" empty-text="暂无数据" max-height="420">
            <ep-table-column label="#" width="50" align="center">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </ep-table-column>
            <ep-table-column label="索引类型" min-width="180">
              <template #default="{ row }">
                <ep-input v-model="row.indexType" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="索引字段" min-width="220">
              <template #default="{ row }">
                <ep-input v-model="row.indexColumns" type="text" :disabled="state.mode === 'detail'" />
              </template>
            </ep-table-column>
            <ep-table-column label="操作" width="70" fixed="right" align="center">
              <template #default="{ $index }">
                <!-- 原为 JEditableTable 行删除按钮 -->
                <ep-button
                  plain
                  type="primary"
                  class="button-text"
                  :disabled="state.mode === 'detail'"
                  @click="state.indexRows.splice($index, 1)"
                >
                  删除
                </ep-button>
              </template>
            </ep-table-column>
          </ep-table>
        </ep-tab-pane>
      </ep-tab>

      <template #footer>
        <span class="dialog-footer">
          <ep-button plain @click="state.dialogVisible = false">关闭</ep-button>
          <ep-button v-if="state.mode !== 'detail'" type="primary" @click="onClickSubmit">
            确定
          </ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 三态删除确认弹窗（原自定义 a-modal：title=提示、正文 LC0915，按钮 取消/仅删除模型(flag=false)/确定(flag=true)） -->
    <ep-dialog v-model="state.batchDelVisible" title="提示" width="30%">
      <span>是否删除选中数据?(点击确认后模型关联数据也会被清理)</span>
      <template #footer>
        <span class="dialog-footer">
          <ep-button @click="state.batchDelVisible = false">取消</ep-button>
          <ep-button plain type="primary" @click="handleBatchDelete(false)">仅删除模型</ep-button>
          <ep-button type="primary" @click="handleBatchDelete(true)">确定</ep-button>
        </span>
      </template>
    </ep-dialog>

  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import SearchBlock from '@/components/searchBlock/searchBlock.vue'
import { SUCCESS_STATUS, PAGE_SIZE, PAGE_NO } from '@/config/config'
import { EPMessageTips, debounce } from '@/utils/utils'
import {
  getDynamicTableList,
  getDynamicTableAdd,
  getDynamicTableEdit,
  getDynamicTableDeleteBatch,
  getDynamicTableIsTableNameExist,
  getDynamicTableColumnListAll,
  getDynamicTableIndexListAll
} from '@/api/lowCodePlatform/dynamicTable'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'
// 已迁移：downFile 下载封装（导出DDL/导出Sql 真实下载，接口待联调）
import downFile from '@/utils/downFile'

const formRef = ref(null)

const form = {
  tableName: '',
  tableComments: '',
  systemName: '',
  version: '',
  publishEnvi: ''
}

/** 字段子表默认行（原 columnType 默认 'VARCHAR'） */
const defaultColumnRow = () => ({
  columnName: '',
  columnType: 'VARCHAR',
  length: '',
  nullable: true,
  defaultValue: '',
  property: '',
  columnComments: '',
  version: '',
  publishEnvi: '',
  isInquiry: false,
  isListShow: true,
  isRequired: false,
  isCommitShow: false,
  isBusinessKey: false
})

/** 索引子表默认行 */
const defaultIndexRow = () => ({
  indexType: '',
  indexColumns: ''
})

/** 布尔字段列表（加载 'Y'/'N'→true/false，提交反向转 'Y'/'N'） */
const BOOL_KEYS = ['nullable', 'isInquiry', 'isListShow', 'isRequired', 'isCommitShow', 'isBusinessKey']

/** 'Y'/'N' → 布尔（原加载时含 children 递归，此处无 children） */
const fromYn = (rows) =>
  (rows || []).map((row) => {
    const item = { ...row }
    BOOL_KEYS.forEach((key) => {
      item[key] = row[key] === 'Y'
    })
    return item
  })

/** 布尔 → 'Y'/'N'（原提交时反向转换，含 children 递归） */
const toYn = (rows) =>
  (rows || []).map((row) => {
    const item = { ...row }
    BOOL_KEYS.forEach((key) => {
      item[key] = row[key] ? 'Y' : 'N'
    })
    return item
  })

const state = reactive({
  // 查询（字段名与原页面 queryParam 一致：tableName / systemName）
  formModel: {
    tableName: '',
    systemName: ''
  },
  // 列表
  tableData: [],
  tableColumns: [
    {
      isShow: true,
      prop: 'tableName',
      label: '动态表名称',
      minWidth: 140
    },
    {
      isShow: true,
      prop: 'tableComments',
      label: '动态表描述',
      minWidth: 140
    },
    {
      // 原列直接展示原值，无 _dictText
      isShow: true,
      prop: 'systemName',
      label: '所属应用',
      minWidth: 110
    },
    {
      isShow: true,
      prop: 'version',
      label: '当前版本',
      minWidth: 100
    },
    {
      isShow: true,
      prop: 'publishEnvi',
      label: '发布环境',
      minWidth: 100
    },
    {
      isShow: true,
      slot: 'operation',
      label: '操作',
      minWidth: 150
    }
  ],
  // 操作列（权限码: dynamic:table:edit / 详情无权限码；原「更多」下拉仅含详情，平铺展示）
  tableOperation: [
    {
      text: '编辑',
      methods: (row) => handleEdit(row)
    },
    {
      text: '详情',
      methods: (row) => handleDetail(row)
    }
  ],
  // 分页器
  paging: {
    total: 0,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  // 表字典 local|develop_system,system_name,system_code 的下拉选项
  // TODO: 联调后接入表字典 local|develop_system,system_name,system_code
  systemOptions: [],
  // 选中行（原 selectedRowKeys，批量操作数据源）
  selectedRows: [],
  // 新增/编辑/详情 弹窗
  dialogVisible: false,
  title: '',
  mode: 'add',
  id: '',
  form: { ...form },
  activeTab: '1',
  // 字段子表 / 索引子表行数据
  columnRows: [],
  indexRows: [],
  // 三态删除确认
  batchDelVisible: false
})

/** 顶部按钮（原为「批量操作」下拉：删除/导出DDL/导出Sql，选中行 > 0 时才出现，此处平铺为按钮；权限码见注释） */
const buttonGroups = computed(() => [
  {
    text: '添加动态表', // 权限码: dynamic:table:add（原标题拼接「动态参数表管理新增」）
    methods: () => handleAdd()
  },
  {
    text: '批量删除', // 权限码: dynamic:table:delete
    isShow: state.selectedRows.length > 0,
    methods: () => openBatchDelete()
  },
  {
    text: '导出DDL', // 权限码: dynamic:table:ddl:export；已迁移 downFile 下载封装
    isShow: state.selectedRows.length > 0,
    methods: () => onExportBatchSql('DDL')
  },
  {
    text: '导出Sql', // 权限码: dynamic:table:export；已迁移 downFile 下载封装
    isShow: state.selectedRows.length > 0,
    methods: () => onExportBatchSql('DML')
  }
])

/** 获取列表数据（原列表接口 /dynamic/table/list） */
const handleList = async () => {
  const param = {
    pageSize: state.paging.pageSize,
    pageNo: state.paging.pageNo,
    ...state.formModel
  }
  const res = await getDynamicTableList(param)
  if (res.returnCode === SUCCESS_STATUS) {
    state.tableData = res.result
    state.paging.total = res.totalCount
  }
}

/** 多选勾选（TableBlock selectionChange 回调选中行集合） */
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

/** 清空数据 */
const clearDate = () => {
  formRef.value && formRef.value.resetFields()
}

/** 新增（原标题=「动态参数表管理新增」） */
const handleAdd = () => {
  clearDate()
  state.dialogVisible = true
  state.mode = 'add'
  state.id = ''
  state.title = '动态参数表管理新增'
  state.form = { ...form }
  state.activeTab = '1'
  state.columnRows = []
  state.indexRows = []
}

/** 编辑（原标题=「动态参数表管理编辑」，readOnly=true 仅禁用所属系统，子表经 url.list 加载） */
const handleEdit = async (row) => {
  clearDate()
  state.dialogVisible = true
  state.mode = 'edit'
  state.id = row.id
  state.title = '动态参数表管理编辑'
  state.form = {
    tableName: row.tableName,
    tableComments: row.tableComments,
    systemName: row.systemName,
    version: row.version,
    publishEnvi: row.publishEnvi
  }
  state.activeTab = '1'
  await loadSubTables(row.tableName)
}

/** 详情（原 handleDetail：title=「详情」，disableSubmit=true 全部只读） */
const handleDetail = async (row) => {
  clearDate()
  state.dialogVisible = true
  state.mode = 'detail'
  state.id = row.id
  state.title = '详情'
  state.form = {
    tableName: row.tableName,
    tableComments: row.tableComments,
    systemName: row.systemName,
    version: row.version,
    publishEnvi: row.publishEnvi
  }
  state.activeTab = '1'
  await loadSubTables(row.tableName)
}

/** 加载字段子表 / 索引子表（原 /dynamic/table/column/listAll、/dynamic/table/index/define/listAll） */
const loadSubTables = async (tableName) => {
  const columnRes = await getDynamicTableColumnListAll({ tableName })
  if (columnRes.returnCode === SUCCESS_STATUS) {
    // 原 data 中 'Y'/'N'→布尔转换
    state.columnRows = fromYn(columnRes.result)
  }
  const indexRes = await getDynamicTableIndexListAll()
  if (indexRes.returnCode === SUCCESS_STATUS) {
    state.indexRows = indexRes.result || []
  }
}

/** 表名失焦查重（原 GET dynamic/table/data/isTableNameExist?tableName=，重复则清空 + warning） */
const onTableNameBlur = debounce(async () => {
  if (!state.form.tableName) return
  const res = await getDynamicTableIsTableNameExist({ tableName: state.form.tableName })
  if (res.returnCode === SUCCESS_STATUS && res.result) {
    state.form.tableName = ''
    EPMessageTips('warning', '动态表名称已存在，请重新输入!')
  }
})

/** 字段子表 添加行 */
const addColumnRow = () => {
  state.columnRows.push(defaultColumnRow())
}

/** 字段子表 删除行（默认删除末行） */
const removeColumnRow = () => {
  state.columnRows.pop()
}

/** 索引子表 添加行 */
const addIndexRow = () => {
  state.indexRows.push(defaultIndexRow())
}

/** 索引子表 删除行（默认删除末行） */
const removeIndexRow = () => {
  state.indexRows.pop()
}

/** 提交（原新增 POST /dynamic/table/add、编辑 PUT /dynamic/table/edit） */
const onClickSubmit = debounce(async () => {
  const { isValid } = await formRef.value.validate()
  if (!isValid) {
    // 原 LC0917 表单校验异常
    EPMessageTips('warning', '表单校验异常')
    return
  }
  // 索引子表必填校验（原 LC0921 请输入索引类型 / LC0922 请选择索引字段）
  for (const row of state.indexRows) {
    if (!row.indexType) {
      EPMessageTips('warning', '请输入索引类型')
      return
    }
    if (!row.indexColumns) {
      EPMessageTips('warning', '请选择索引字段')
      return
    }
  }
  // 原 payload 结构保真：{ virtualTable, virtualTableIndexDefineVO, virtualTableConfigDefineVO, virtualTableColumnVO }
  const param = {
    virtualTable: { ...state.form },
    // 原 payload 含 virtualTableConfigDefineVO（原组件 DynamicTableConfig 引入未使用，置空保真）
    virtualTableConfigDefineVO: {},
    virtualTableColumnVO: { values: toYn(state.columnRows) },
    virtualTableIndexDefineVO: { values: state.indexRows }
  }
  let apiUrl = ''
  if (state.id) {
    apiUrl = getDynamicTableEdit
    param.id = state.id
  } else {
    apiUrl = getDynamicTableAdd
  }
  const res = await apiUrl(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', state.id ? '编辑成功' : '新增成功')
    state.dialogVisible = false
    handleList()
  }
})

/** 批量删除入口（原「批量操作」下拉内 删除 → 自定义三态确认） */
const openBatchDelete = () => {
  if (!state.selectedRows.length) {
    EPMessageTips('warning', '请先选择要删除的数据!')
    return
  }
  state.batchDelVisible = true
}

/**
 * 三态删除确认（原 deleteAction {ids, flag}）
 * @param {Boolean} flag true=确定（删除模型关联数据）/ false=仅删除模型
 */
const handleBatchDelete = debounce(async (flag) => {
  const param = {
    ids: state.selectedRows.map((row) => row.id).join(','),
    flag
  }
  const res = await getDynamicTableDeleteBatch(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '删除成功')
    state.batchDelVisible = false
    state.selectedRows = []
    handleList()
  }
})

/**
 * 批量导出 SQL（已迁移 downFile 下载封装：原 mixin exportBatchSql → downFile('/dynamic/table/exportBatchSql', {ids, sqlType})，
 * sqlType 取值 DDL-数据库定义语言 / DML-数据库管理语言（不传默认 DML），文件名默认 yyyyMMddHHmmss.sql；
 * 后端接口暂不通，失败时统一提示，联调后仅后端可用即真实下载）
 */
const onExportBatchSql = async (sqlType) => {
  const ids = state.selectedRows.map((row) => row.id).join(',')
  try {
    // 真实接口：GET /dynamic/table/exportBatchSql（参数 ids、sqlType）
    await downFile('/dynamic/table/exportBatchSql', { ids, sqlType })
  } catch (e) {
    EPMessageTips('warning', '导出功能已迁移，接口待联调')
  }
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

/** 查询/重置（原搜索回车触发 searchQuery） */
const handleSearchFunc = () => {
  state.paging.pageNo = PAGE_NO
  handleList()
}

// 页面加载时
onMounted(() => {
  handleList()
})
</script>

<style scoped>
.selected-tip {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: #f0f3fa;
  border-radius: 4px;
}
.sub-table-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.index-tip {
  padding: 8px 12px;
  margin-bottom: 12px;
  color: #b26a00;
  background: #fff7e6;
  border-radius: 4px;
}
.button-text {
  padding: 0;
}
</style>
