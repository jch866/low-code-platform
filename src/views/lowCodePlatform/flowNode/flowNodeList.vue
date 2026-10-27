<template>
  <div>
    <!-- 查询区（原两行布局无展开收起；搜索字段：epfSystemId/epfFlowNodeName/epfFlowNodeProcessor/epfFlowNodeDealType/epfFlowNodeType/epfFlowNodeStatus + createTime 范围） -->
    <SearchBlock
      :form-model="state.formModel"
      :label-width="130"
      :search-func="handleSearchFunc"
    >
      <ep-form-item prop="epfSystemId" label="所属应用">
        <!-- TODO: 联调后接入表字典 local|develop_system,system_name,system_code -->
        <ep-select
          v-model="state.formModel.epfSystemId"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.systemOptions"
            :key="item.lemmaItem"
            :label="item.itemName"
            :value="item.lemmaItem"
          />
        </ep-select>
      </ep-form-item>
      <ep-form-item prop="epfFlowNodeName" label="节点名称">
        <ep-input
          v-model="state.formModel.epfFlowNodeName"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="epfFlowNodeProcessor" label="节点处理器">
        <ep-input
          v-model="state.formModel.epfFlowNodeProcessor"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="epfFlowNodeDealType" label="节点处理方式">
        <ep-select
          v-model="state.formModel.epfFlowNodeDealType"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.dealTypeList"
            :key="item.lemmaItem"
            :label="item.itemName"
            :value="item.lemmaItem"
          />
        </ep-select>
      </ep-form-item>
      <ep-form-item prop="epfFlowNodeType" label="节点类型">
        <ep-select
          v-model="state.formModel.epfFlowNodeType"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.flowNodeTypeList"
            :key="item.lemmaItem"
            :label="item.itemName"
            :value="item.lemmaItem"
          />
        </ep-select>
      </ep-form-item>
      <ep-form-item prop="epfFlowNodeStatus" label="节点状态">
        <ep-select
          v-model="state.formModel.epfFlowNodeStatus"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.nodeStatusList"
            :key="item.lemmaItem"
            :label="item.itemName"
            :value="item.lemmaItem"
          />
        </ep-select>
      </ep-form-item>
      <ep-form-item label="创建时间">
        <ep-date-picker
          v-model="state.createTimeRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          @change="onDateChange"
        />
      </ep-form-item>
    </SearchBlock>
    <!-- 列表区（rowKey=primaryKey，非 id；删除/选中仍用 id） -->
    <div v-if="state.selectedRows.length" class="selected-tip">
      <span>已选择 {{ state.selectedRows.length }} 项</span>
      <ep-button plain type="primary" class="text-button" @click="onClearSelection">清空</ep-button>
    </div>
    <TableBlock
      :table-columns="state.tableColumns"
      :table-data="state.tableData"
      :show-operation="true"
      :show-index-column="true"
      :show-multi-select-column="true"
      :button-groups="state.buttonGroups"
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
            <OperationCloumn
              :table-operation="state.tableOperation"
              :row="row"
            />
          </template>
        </ep-table-column>
      </template>
    </TableBlock>

    <!-- 新增编辑 抽屉（原 a-drawer placement=right，drawerWidth=700；@eigpay/components 未提供抽屉组件，以固定定位面板模拟；
         footer 原为 SubmitFooterWithReq 带开发需求码，待迁移） -->
    <div v-if="state.drawerVisible" class="drawer-mask" @click.self="handleCancel">
      <div class="drawer-panel" :style="{ width: '700px' }">
        <div class="drawer-header">
          <span class="drawer-title">{{ state.title }}</span>
          <span class="drawer-close" @click="handleCancel">✕</span>
        </div>
        <div class="drawer-body">
          <ep-form ref="formRef" :model="state.form" :label-width="150">
            <ep-form-item
              prop="epfFlowNodeName"
              label="节点名称"
              :rules="[{ required: true, message: '请输入节点名称!', trigger: 'blur' }]"
            >
              <!-- 原外层 a-popover 红字提示；编辑态 readOnly（name/code 编辑不可改） -->
              <span class="field-hint">建议节点名称长度控制在8位</span>
              <ep-input
                v-model="state.form.epfFlowNodeName"
                placeholder="请输入"
                type="text"
                :disabled="!!state.id"
              />
            </ep-form-item>
            <ep-form-item
              prop="epfFlowNodeCode"
              label="节点编码"
              :rules="[{ required: true, message: '请输入节点编码!', trigger: 'blur' }]"
            >
              <ep-input
                v-model="state.form.epfFlowNodeCode"
                placeholder="请输入"
                type="text"
                :disabled="!!state.id"
              />
            </ep-form-item>
            <ep-form-item prop="epfFlowNodeProcessor" label="流程节点处理器">
              <!-- 原实现此字段无必填校验 -->
              <ep-input v-model="state.form.epfFlowNodeProcessor" placeholder="请输入" type="text" />
            </ep-form-item>
            <ep-form-item
              prop="epfSystemId"
              label="所属系统"
              :rules="[{ required: true, message: '请选择所属系统!', trigger: 'change' }]"
            >
              <!-- TODO: 联调后接入表字典 local|develop_system,system_name,system_code -->
              <ep-radio-group v-model="state.form.epfSystemId">
                <ep-radio
                  v-for="item in state.systemOptions"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="epfFlowNodeDealType" label="节点处理方式">
              <ep-radio-group v-model="state.form.epfFlowNodeDealType">
                <ep-radio
                  v-for="item in state.dealTypeList"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="epfFlowNodeType" label="业务节点类型">
              <ep-radio-group v-model="state.form.epfFlowNodeType">
                <ep-radio
                  v-for="item in state.flowNodeTypeList"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="epfFlowSubNodeType" label="业务节点子类型">
              <ep-radio-group v-model="state.form.epfFlowSubNodeType">
                <ep-radio
                  v-for="item in state.subNodeTypeList"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="epfFlowNodeStatus" label="流程节点状态">
              <ep-radio-group v-model="state.form.epfFlowNodeStatus">
                <ep-radio
                  v-for="item in state.nodeStatusList"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="epfFlowNodeIcon" label="流程节点图标">
              <!-- 原组件: Icons（图标选择弹窗 @choose/@close/:iconChooseVisible），待迁移 -->
              <div class="inline-fields">
                <ep-input v-model="state.form.epfFlowNodeIcon" placeholder="请选择图标" type="text" />
                <ep-button plain type="primary" @click="onOpenIconSelect">选择图标</ep-button>
              </div>
            </ep-form-item>
            <ep-form-item prop="epfFlowNodeRemark" label="描述">
              <ep-input
                v-model="state.form.epfFlowNodeRemark"
                type="textarea"
                :rows="4"
                placeholder="请输入"
              />
            </ep-form-item>
          </ep-form>
        </div>
        <div class="drawer-footer">
          <!-- 原组件: SubmitFooterWithReq（带开发需求码 requireCode），待迁移 -->
          <ep-button plain @click="handleCancel">关闭</ep-button>
          <ep-button type="primary" @click="onClickSubmit">提交</ep-button>
        </div>
      </div>
    </div>

    <!-- 删除确认 弹窗（原为 popconfirm：确定要删除吗？） -->
    <ep-dialog
      v-model="state.dialogVisibleDel"
      title="确认删除"
      width="30%"
    >
      <span>此操作将永久删除该条数据，是否继续？</span>
      <template #footer>
        <span class="dialog-footer">
          <ep-button @click="state.dialogVisibleDel = false">取消</ep-button>
          <ep-button type="primary" @click="handleDelete">确定</ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 查看关联引用 弹窗（原 a-modal width=800、footer=null，含前端过滤搜索框；title=节点处理器+节点名称） -->
    <ep-dialog v-model="state.refVisible" :title="state.refTitle" width="800px">
      <div class="ref-body">
        <ep-input
          v-model="state.searchKeyword"
          placeholder="按流程名称/流程编码过滤"
          type="text"
          class="ref-search"
        />
        <ep-table :data="filteredRefData">
          <ep-table-column prop="name" label="流程名称" />
          <ep-table-column prop="code" label="流程编码" />
          <ep-table-column label="操作" width="100">
            <template #default="{ row }">
              <ep-button plain type="primary" @click="onJumpRef(row)">跳转</ep-button>
            </template>
          </ep-table-column>
        </ep-table>
        <div v-if="!filteredRefData.length" class="ref-empty">暂无流程引用当前节点</div>
      </div>
    </ep-dialog>

    <!-- 待迁移功能 占位弹窗（数据比对/图标选择/导出SQL；历史记录已改为真实跳转） -->
    <ep-dialog v-model="state.placeholderVisible" title="待迁移功能" width="480px">
      <div class="placeholder-body">{{ state.placeholderText }}</div>
      <template #footer>
        <span>
          <ep-button plain @click="state.placeholderVisible = false">关闭</ep-button>
        </span>
      </template>
    </ep-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBlock from '@/components/searchBlock/searchBlock.vue'
import { SUCCESS_STATUS, PAGE_SIZE, PAGE_NO } from '@/config/config'
import { EPMessageTips, debounce } from '@/utils/utils'
import { getMultiDictsMore } from '@/api/common/common.js'
import {
  getFlowNodeList,
  getFlowNodeAdd,
  getFlowNodeEdit,
  getFlowNodeDelete,
  getFlowNodeExportBatchSql,
  getFlowNodeDuplicateCheck,
  getAssociatedProcessNodes
} from '@/api/lowCodePlatform/flowNode'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'

const formRef = ref(null)
const router = useRouter()

// TODO: 联调后接入表字典 local|develop_system,system_name,system_code（所属应用下拉/单选，联调前保持为空）
const systemOptions = []

// 权限码（原 v-has）：增加节点 flow:node:add；导出SQL flow:node:export；行编辑 flow:node:edit；
// 行删除 flow:node:delete；历史记录 flow:node:history；数据比对 flow:node:compare；查看关联引用（无权限码）

const form = {
  epfFlowNodeName: '',
  epfFlowNodeCode: '',
  epfFlowNodeProcessor: '',
  epfSystemId: '',
  epfFlowNodeDealType: '',
  epfFlowNodeType: '0',
  epfFlowSubNodeType: '0',
  epfFlowNodeStatus: '0',
  epfFlowNodeIcon: '',
  epfFlowNodeRemark: ''
}

const state = reactive({
  // 查询
  formModel: {
    epfSystemId: '',
    epfFlowNodeName: '',
    epfFlowNodeProcessor: '',
    epfFlowNodeDealType: '',
    epfFlowNodeType: '',
    epfFlowNodeStatus: '',
    createTime_begin: '',
    createTime_end: ''
  },
  // 创建时间范围（原 a-range-picker，onChange 写 queryParam.createTime_begin/createTime_end）
  createTimeRange: [],
  // 所属应用表字典选项（联调前为空）
  systemOptions,
  // 数据字典
  dealTypeList: [],
  flowNodeTypeList: [],
  nodeStatusList: [],
  subNodeTypeList: [],
  // 列表
  tableData: [],
  tableColumns: [
    {
      isShow: true,
      prop: 'systemNameText',
      label: '所属应用',
      minWidth: 200
    },
    {
      isShow: true,
      prop: 'epfFlowNodeName',
      label: '节点名称',
      minWidth: 200
    },
    {
      isShow: true,
      prop: 'epfFlowNodeProcessor',
      label: '流程节点处理器',
      minWidth: 150
    },
    {
      isShow: true,
      prop: 'epfFlowNodeDealType_dictText',
      label: '节点处理方式',
      minWidth: 120
    },
    {
      isShow: true,
      prop: 'epfFlowNodeType_dictText',
      label: '节点类型',
      width: 120
    },
    {
      isShow: true,
      prop: 'epfFlowNodeStatus_dictText',
      label: '节点状态',
      width: 120
    },
    {
      isShow: true,
      prop: 'epfFlowNodeIcon',
      label: '流程节点图标',
      width: 100
    },
    {
      isShow: true,
      prop: 'createTime',
      // 原列此处为裸 createTime，无 _dateText 后缀（后端直接回字符串）
      label: '创建时间',
      width: 150
    },
    {
      isShow: true,
      slot: 'operation',
      label: '操作',
      minWidth: 200
    }
  ],
  // 操作列（首项直接展示，其余进入"更多"下拉）
  tableOperation: [
    {
      text: '编辑', // 权限码 flow:node:edit；title="节点编辑"
      methods: (row) => handleEdit(row)
    },
    {
      text: '删除', // 权限码 flow:node:delete
      methods: (row) => onDelete(row)
    },
    {
      text: '历史记录', // 权限码 flow:node:history
      methods: (row) => onHistory(row)
    },
    {
      text: '数据比对', // 权限码 flow:node:compare
      methods: (row) => onEnviSelect(row)
    },
    {
      text: '查看关联引用', // 无权限码
      methods: (row) => showRegulatorProcessModal(row)
    }
  ],
  // 添加按钮（原批量菜单仅导出，无批量删除）
  buttonGroups: [
    {
      text: '增加节点', // 权限码 flow:node:add；title="节点新增"
      methods: () => handleAdd()
    },
    {
      text: '导出SQL', // 权限码 flow:node:export；原 mixin exportBatchSql
      methods: () => onExportBatchSql(),
      disabled: true
    }
  ],
  // 分页器
  paging: {
    total: 0,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  // 多选
  selectedRows: [],
  // 新增编辑 抽屉
  drawerVisible: false,
  title: '',
  id: '',
  form: { ...form },
  // 删除
  dialogVisibleDel: false,
  // 查看关联引用 弹窗
  refVisible: false,
  refTitle: '',
  refData: [],
  searchKeyword: '',
  // 占位弹窗
  placeholderVisible: false,
  placeholderText: ''
})

/** 关联引用前端过滤（原 filterData 按 name/code 过滤） */
const filteredRefData = computed(() => {
  const kw = state.searchKeyword.trim()
  if (!kw) return state.refData
  return state.refData.filter(
    (item) => (item.name || '').includes(kw) || (item.code || '').includes(kw)
  )
})

/** 获取列表数据 */
const handleList = async () => {
  const param = {
    pageSize: state.paging.pageSize,
    pageNo: state.paging.pageNo,
    ...state.formModel
  }
  const res = await getFlowNodeList(param)
  if (res.returnCode === SUCCESS_STATUS) {
    state.tableData = res.result
    state.paging.total = res.totalCount
  }
}

/** 数据字典（flow_node_deal_type, flow_node_type, flow_node_status, flow_event_sub_node_type） */
const initDict = async () => {
  const res = await getMultiDictsMore(
    'flow_node_deal_type,flow_node_type,flow_node_status,flow_event_sub_node_type'
  )
  if (res.returnCode === SUCCESS_STATUS) {
    state.dealTypeList = res.result.flow_node_deal_type || []
    state.flowNodeTypeList = res.result.flow_node_type || []
    state.nodeStatusList = res.result.flow_node_status || []
    state.subNodeTypeList = res.result.flow_event_sub_node_type || []
  }
}

/** 创建时间范围变化 → queryParam.createTime_begin/createTime_end */
const onDateChange = (val) => {
  const range = Array.isArray(val) ? val : []
  state.formModel.createTime_begin = range[0] || ''
  state.formModel.createTime_end = range[1] || ''
}

/** 多选 */
const onSelectionChange = (rows) => {
  state.selectedRows = rows
  state.buttonGroups[1].disabled = rows.length === 0
}

/** 清空已选 */
const onClearSelection = () => {
  state.tableData.forEach((item) => (item.checked = false))
  state.selectedRows = []
  state.buttonGroups[1].disabled = true
}

/** 新增（原覆写 handleAdd，title="{节点}{新增}"→"节点新增"） */
const handleAdd = () => {
  state.drawerVisible = true
  state.title = '节点新增'
  state.id = ''
  state.form = { ...form }
}

/** 编辑（原覆写 handleEdit，title="{节点}{编辑}"→"节点编辑"；name/code 编辑态只读） */
const handleEdit = (row) => {
  state.drawerVisible = true
  state.title = '节点编辑'
  state.id = row.id
  // 原 edit 回显 pick：epfFlowNodeCode/epfFlowNodeName/epfFlowNodeProcessor/epfSystemId/
  // epfFlowNodeDealType/epfFlowNodeType/epfFlowSubNodeType/epfFlowNodeRemark/epfFlowNodeStatus
  state.form = {
    epfFlowNodeName: row.epfFlowNodeName || '',
    epfFlowNodeCode: row.epfFlowNodeCode || '',
    epfFlowNodeProcessor: row.epfFlowNodeProcessor || '',
    epfSystemId: row.epfSystemId || '',
    epfFlowNodeDealType: row.epfFlowNodeDealType || '',
    epfFlowNodeType: row.epfFlowNodeType || '0',
    epfFlowSubNodeType: row.epfFlowSubNodeType || '0',
    epfFlowNodeStatus: row.epfFlowNodeStatus || '0',
    epfFlowNodeIcon: row.epfFlowNodeIcon || '',
    epfFlowNodeRemark: row.epfFlowNodeRemark || ''
  }
}

/** 取消（关闭抽屉） */
const handleCancel = () => {
  state.drawerVisible = false
}

/** 唯一性校验（原 duplicateCheck → /sys/duplicate/check，参数 tableName/fieldName/fieldVal；重复提示 "{字段名}已存在!"） */
const checkDuplicate = async (fieldName, fieldVal, label) => {
  const res = await getFlowNodeDuplicateCheck({
    tableName: 'epf_flow_node',
    fieldName,
    fieldVal
  })
  // TODO: 联调后接真实校验结果（res.result 为 false 时提示 label + '已存在!'）
  return true
}

/** 图标选择（原组件: Icons 图标选择弹窗，选中后写 model.epfFlowNodeIcon，待迁移） */
const onOpenIconSelect = () => {
  state.placeholderVisible = true
  state.placeholderText = '原组件 Icons（图标选择弹窗 @choose/@close/:iconChooseVisible），待迁移'
}

/** 提交（原提交 Object.assign(model, values) + developRequire/developEnvi——需求码组件未迁移） */
const onClickSubmit = debounce(async () => {
  const { isValid } = await formRef.value.validate()
  if (!isValid) return
  // 唯一性校验：仅名称/编码（编辑态字段只读，原实现仍会校验，此处保持一致）
  const passName = await checkDuplicate('epf_flow_node_name', state.form.epfFlowNodeName, '节点名称')
  if (!passName) return
  const passCode = await checkDuplicate('epf_flow_node_code', state.form.epfFlowNodeCode, '节点编码')
  if (!passCode) return
  const param = { ...state.form }
  // 原 add 为 postAction("/flownode/manage/config/add")；edit 为 putAction("/flownode/manage/config/edit")
  let apiUrl = ''
  if (state.id) {
    apiUrl = getFlowNodeEdit
    param.id = state.id
  } else {
    apiUrl = getFlowNodeAdd
  }
  const res = await apiUrl(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', state.id ? '修改成功' : '新增成功')
    state.drawerVisible = false
    handleList()
  }
})

/** 行删除（删除/选中仍用 record.id） */
const onDelete = (row) => {
  state.id = row.id
  state.dialogVisibleDel = true
}

/** 确认删除（/flownode/manage/config/delete） */
const handleDelete = debounce(async () => {
  const param = { id: state.id }
  const res = await getFlowNodeDelete(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '删除成功')
    state.dialogVisibleDel = false
    handleList()
  }
})

/** 导出SQL（原 mixin exportBatchSql → downFile(/flownode/manage/config/exportBatchSql, {ids, sqlType})，mock 环境仅调用占位） */
const onExportBatchSql = async () => {
  const ids = state.selectedRows.map((row) => row.id).join(',')
  const res = await getFlowNodeExportBatchSql({ ids, sqlType: 'DML' })
  if (res.returnCode === SUCCESS_STATUS) {
    state.placeholderVisible = true
    state.placeholderText = '原通过 downFile 下载 /flownode/manage/config/exportBatchSql（参数 ids、sqlType=DML），下载组件待迁移'
  }
}

/** 历史记录（原跳转路由 dynamic-data-history-list，params: tableName=record.tableName、systemName=record.epfSystemId、id、record、formField；历史数据查看页已迁移） */
const onHistory = (row) => {
  // 原经路由 params 传参，子应用改为 sessionStorage（lowCode:dynamicHistoryParams）+ 路由跳转；
  // 流程类页面 systemName 取 record.epfSystemId；本页无 formField 概念，传空数组由历史页回退 listColumns 返回值
  sessionStorage.setItem(
    'lowCode:dynamicHistoryParams',
    JSON.stringify({
      tableName: row.tableName,
      systemName: row.epfSystemId,
      id: row.id,
      record: JSON.stringify(row),
      formField: JSON.stringify([])
    })
  )
  router.push('/lowCodePlatform/dynamicHistory/list')
}

/** 数据比对（原组件: DevelopProjectEnviSelectModal，title=比对数据环境选择，待迁移） */
const onEnviSelect = (row) => {
  state.placeholderVisible = true
  state.placeholderText = '原组件 DevelopProjectEnviSelectModal（比对数据环境选择），待迁移'
}

/** 查看关联引用（原 showRegulatorProcessModal → /related/process/queryAssociatedProcessNodes {pkValue}，title=节点处理器+节点名称） */
const showRegulatorProcessModal = async (row) => {
  state.refTitle = (row.epfFlowNodeProcessor || '') + ' ' + (row.epfFlowNodeName || '')
  state.searchKeyword = ''
  state.refVisible = true
  const res = await getAssociatedProcessNodes({ pkValue: row.id })
  if (res.returnCode === SUCCESS_STATUS) {
    state.refData = res.result || []
  } else {
    EPMessageTips('error', '请求失败，请稍后再试。')
  }
}

/** 引用跳转（原：复制流程名称后 $router.push('/flow/manage')；跳转待联调） */
const onJumpRef = async (row) => {
  try {
    await navigator.clipboard.writeText(row.name)
    EPMessageTips('success', '已复制: ' + row.name)
  } catch (e) {
    EPMessageTips('error', '复制失败')
  }
  state.refVisible = false
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

/** 查询 重置（原覆写 searchReset：清空后 loadData(当前页)，保持当前页码不回第一页） */
const handleSearchFunc = (type) => {
  if (type !== 'reset') {
    state.paging.pageNo = PAGE_NO
  }
  handleList()
}
// 页面加载时
onMounted(() => {
  initDict()
  handleList()
})
</script>

<style scoped>
.selected-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.field-hint {
  display: block;
  color: #f5222d;
  font-size: 12px;
  line-height: 18px;
}
.inline-fields {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
/* 模拟抽屉（原 a-drawer placement=right） */
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}
.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  box-shadow: -8px 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1001;
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f3fa;
}
.drawer-title {
  font-size: 16px;
  font-weight: 600;
}
.drawer-close {
  cursor: pointer;
  color: #666;
  font-size: 16px;
}
.drawer-body {
  flex: 1;
  overflow: auto;
  padding: 24px;
}
.drawer-footer {
  padding: 12px 24px;
  border-top: 1px solid #f0f3fa;
  text-align: right;
}
.ref-body {
  max-height: 600px;
  overflow: auto;
}
.ref-search {
  margin-bottom: 12px;
}
.ref-empty {
  color: #999;
  text-align: center;
  padding: 16px 0;
}
.placeholder-body {
  color: #999;
  padding: 12px 0;
}
</style>
