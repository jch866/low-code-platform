<template>
  <div>
    <!-- 查询区（原两行布局；搜索字段：epfSystemId/epfFlowName/epfFlowCode/epfFlowState/createTime范围/epfFlowType；
         另有隐式参数 transCode 原由左侧 PayListDisplay 业务列表 .sync 注入，本页为标准列表无左侧导航，仅保留参数并注释说明） -->
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
      <ep-form-item prop="epfFlowName" label="搜索流程">
        <ep-input
          v-model="state.formModel.epfFlowName"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="epfFlowCode" label="流程编码">
        <ep-input
          v-model="state.formModel.epfFlowCode"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="epfFlowState" label="状态">
        <ep-select
          v-model="state.formModel.epfFlowState"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.flowStateList"
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
      <ep-form-item prop="epfFlowType" label="流程类型">
        <ep-select
          v-model="state.formModel.epfFlowType"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.flowTypeList"
            :key="item.lemmaItem"
            :label="item.itemName"
            :value="item.lemmaItem"
          />
        </ep-select>
      </ep-form-item>
    </SearchBlock>
    <!-- 列表区（原无 rowSelection、无批量操作） -->
    <TableBlock
      :table-columns="state.tableColumns"
      :table-data="state.tableData"
      :show-operation="true"
      :show-index-column="true"
      :button-groups="state.buttonGroups"
      :page-obj="state.paging"
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
         footer 已迁移 SubmitFooterWithReq 带开发需求码） -->
    <div v-if="state.drawerVisible" class="drawer-mask" @click.self="handleCancel">
      <div class="drawer-panel" :style="{ width: '700px' }">
        <div class="drawer-header">
          <span class="drawer-title">{{ state.title }}</span>
          <span class="drawer-close" @click="handleCancel">✕</span>
        </div>
        <div class="drawer-body">
          <ep-form ref="formRef" :model="state.form" :label-width="150">
            <ep-form-item
              prop="epfFlowCode"
              label="流程编码"
              :rules="[{ required: true, message: '请输入流程编码!', trigger: 'blur' }]"
            >
              <!-- 编辑态 readOnly（原 :readOnly="!!model.id"） -->
              <ep-input
                v-model="state.form.epfFlowCode"
                placeholder="请输入"
                type="text"
                :disabled="!!state.id"
              />
            </ep-form-item>
            <ep-form-item
              prop="epfFlowName"
              label="流程名称"
              :rules="[{ required: true, message: '请输入流程名称!', trigger: 'blur' }]"
            >
              <!-- 原外层 a-popover 红字提示 -->
              <span class="field-hint">建议流程名称长度控制在8位</span>
              <ep-input v-model="state.form.epfFlowName" placeholder="请输入" type="text" />
            </ep-form-item>
            <ep-form-item
              prop="epfSystemId"
              label="所属系统"
              :rules="[{ required: true, message: '请选择所属系统!', trigger: 'change' }]"
            >
              <!-- 编辑态禁用（原 :disabled="readOnly"）；TODO: 联调后接入表字典 local|develop_system,system_name,system_code -->
              <ep-radio-group v-model="state.form.epfSystemId" :disabled="!!state.id">
                <ep-radio
                  v-for="item in state.systemOptions"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="transCode" label="所属业务模块">
              <!-- 已迁移：JSelectService（业务模块多选，原 :multi="true"）；v-model=逗号拼接的业务树节点 key（与源 v-decorator=['transCode'] 一致） -->
              <JSelectService v-model="state.form.transCode" :multi="true" />
            </ep-form-item>
            <ep-form-item
              prop="epfFlowType"
              label="流程类型"
              :rules="[{ required: true, message: '请选择流程类型!', trigger: 'change' }]"
            >
              <ep-radio-group v-model="state.form.epfFlowType">
                <ep-radio
                  v-for="item in state.flowTypeList"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="commonFlow" label="是否共享组件">
              <div class="inline-fields">
                <ep-switch
                  v-model="state.form.commonFlow"
                  active-text="是"
                  inactive-text="否"
                />
                <span class="field-hint-inline">（开启共享后请确认当前流程有流程节点存在）</span>
              </div>
            </ep-form-item>
            <ep-form-item prop="parentFlowId" label="所属流程">
              <!-- 已迁移：JSelectFlow（流程选择器，原 :multiple="false"）；v-model=epfFlowCode（源 returnId=false 时 valueKey 取 returnKeys[1]，parentFlowId 实存流程编码） -->
              <JSelectFlow v-model="state.form.parentFlowId" :multiple="false" />
            </ep-form-item>
            <ep-form-item prop="epfFlowState" label="流程状态">
              <ep-radio-group v-model="state.form.epfFlowState">
                <ep-radio
                  v-for="item in state.flowStateList"
                  :key="item.lemmaItem"
                  :value="item.lemmaItem"
                >{{ item.itemName }}</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item prop="epfFlowVersion" label="流程版本">
              <ep-input-number v-model="state.form.epfFlowVersion" :min="1" />
            </ep-form-item>
            <ep-form-item prop="epfFlowRemarks" label="描述">
              <ep-input
                v-model="state.form.epfFlowRemarks"
                type="textarea"
                :rows="4"
                placeholder="请输入"
              />
            </ep-form-item>
          </ep-form>
        </div>
        <div class="drawer-footer">
          <!-- 已迁移 SubmitFooterWithReq：requireCode 输入 + 取消/提交（事件接回原 handleCancel/onClickSubmit） -->
          <SubmitFooterWithReq
            ref="reqSelectRef"
            :require-code-param="state.requireCodeParam"
            @ok="onClickSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </div>

    <!-- 流程设计器 全屏弹窗（原页内组件切换 FlowDesign，编辑/只读浏览共用；此处保留 FlowDesigner 集成） -->
    <ep-dialog
      v-model="state.flowDesignVisible"
      :title="`${state.flowViewOnly ? '流程浏览' : '流程设计'} - ${state.currentFlow?.epfFlowName || ''}`"
      top="0px"
      width="100%"
      :fullscreen="true"
      :show-close="true"
      destroy-on-close
      class="flow-design-dialog"
      @closed="onFlowDesignClosed"
    >
      <div class="flow-designer-wrapper">
        <FlowDesigner
          v-if="state.flowDesignVisible"
          :flow-data="state.currentFlowData"
          :flow-info="state.currentFlow"
          :view-only="state.flowViewOnly"
          @save="onFlowSave"
        />
      </div>
    </ep-dialog>

    <!-- 删除确认 弹窗（行内"流程删除"原无二次确认直接调用；此弹窗供通用确认场景保留） -->
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

    <!-- 已迁移：ParentProcess 查看关联流程（原 handProcess → toPkValue=row.id + vuex parentProcessData=true
         控制显隐，去 vuex 化改为 ref.edit(row) 打开，组件内 ep-dialog v-model 管理显隐） -->
    <ParentProcess ref="parentProcessRef" />

    <!-- 已迁移：DevelopProjectEnviSelectModal 比对数据环境选择（数据比对入口，ref.edit(row) 打开） -->
    <DevelopProjectEnviSelectModal ref="enviSelectRef" />
  </div>
</template>

<style scoped>
.flow-design-dialog :deep(.ep-dialog__body) {
  height: calc(100vh - 110px);
  overflow: hidden;
  padding: 0;
}
.flow-designer-wrapper {
  width: 100%;
  height: 100%;
}
.field-hint {
  display: block;
  color: #f5222d;
  font-size: 12px;
  line-height: 18px;
}
.field-hint-inline {
  color: #999;
  font-size: 12px;
}
.inline-fields {
  display: flex;
  align-items: center;
  gap: 8px;
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
</style>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBlock from '@/components/searchBlock/searchBlock.vue'
import { SUCCESS_STATUS, PAGE_SIZE, PAGE_NO } from '@/config/config'
import { EPMessageTips, debounce } from '@/utils/utils'
import { getMultiDictsMore } from '@/api/common/common.js'
import {
  getFlowList,
  getFlowAdd,
  getFlowEdit,
  getFlowDeleteFlow,
  getFlowDuplicateCheck
} from '@/api/lowCodePlatform/flowManage'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'
import FlowDesigner from '@/components/flowDesigner/FlowDesigner.vue'
import JSelectService from '@/components/jSelectService/JSelectService.vue'
import JSelectFlow from '@/components/jSelectFlow/JSelectFlow.vue'
// 已迁移组件：SubmitFooterWithReq 提交底栏（开发需求码） / DevelopProjectEnviSelectModal 比对数据环境选择
import SubmitFooterWithReq from '@/components/submitFooterWithReq/SubmitFooterWithReq.vue'
import DevelopProjectEnviSelectModal from '@/components/developProjectEnviSelectModal/DevelopProjectEnviSelectModal.vue'
// 已迁移：ParentProcess 查看关联流程（原 ../../develop/modules/BranchSubmit/parentProcess.vue）
import ParentProcess from '@/components/parentProcess/ParentProcess.vue'
import downFile, { formatDate } from '@/utils/downFile'

const formRef = ref(null)
// SubmitFooterWithReq（读取 requireCode 作为 developRequire 提交参数）与比对环境选择弹窗
const reqSelectRef = ref(null)
const enviSelectRef = ref(null)
// 查看关联流程弹窗（ParentProcess，ref.edit(row) 打开）
const parentProcessRef = ref(null)
const router = useRouter()

// TODO: 联调后接入表字典 local|develop_system,system_name,system_code（所属系统下拉/单选，联调前保持为空）
const systemOptions = []

// 权限码（原 v-has）：增加流程 flow:add；行编辑 flow:edit；导出SQL flow:export；
// 流程删除（无权限码）；历史记录 flow:history；数据比对 flow:compare；流程浏览 flow:edit；查看关联流程（无权限码）

const form = {
  epfFlowCode: '',
  epfFlowName: '',
  epfSystemId: '',
  transCode: '',
  epfFlowType: '',
  commonFlow: false,
  parentFlowId: '',
  epfFlowState: '0',
  epfFlowVersion: '1',
  epfFlowRemarks: ''
}

const state = reactive({
  // 查询（transCode 原由左侧 PayListDisplay .sync 注入并 watch 后 loadData(1)，本页无左侧导航，保留空参数）
  formModel: {
    epfSystemId: '',
    epfFlowName: '',
    epfFlowCode: '',
    epfFlowState: '',
    epfFlowType: '',
    transCode: '',
    createTime_begin: '',
    createTime_end: ''
  },
  // 创建时间范围（原 a-range-picker，onChange 写 queryParam.createTime_begin/createTime_end）
  createTimeRange: [],
  // 所属系统表字典选项（联调前为空）
  systemOptions,
  // 数据字典
  flowStateList: [],
  flowTypeList: [],
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
      prop: 'epfFlowName',
      label: '流程名称',
      minWidth: 150
    },
    {
      isShow: true,
      prop: 'epfFlowCode',
      label: '流程编码',
      minWidth: 160
    },
    {
      isShow: true,
      prop: 'epfFlowState_dictText',
      label: '流程状态',
      width: 100
    },
    {
      isShow: true,
      prop: 'epfFlowType_dictText',
      label: '流程类型',
      width: 150
    },
    {
      isShow: true,
      prop: 'createTime_dateText',
      label: '创建时间',
      width: 150
    },
    {
      isShow: true,
      slot: 'operation',
      label: '操作',
      minWidth: 250
    }
  ],
  // 操作列（首项直接展示，其余进入"更多"下拉）
  tableOperation: [
    {
      text: '编辑', // 权限码 flow:edit
      methods: (row) => handleEdit(row)
    },
    {
      text: '流程设计', // 打开 FlowDesigner（可编辑）
      methods: (row) => handleFlowDesign(row)
    },
    {
      text: '流程浏览', // 权限码 flow:edit；FlowDesigner 只读模式
      methods: (row) => handleFlowDesignView(row)
    },
    {
      text: '流程删除', // 无权限码；原 deleteFlow 无二次确认直接调用
      methods: (row) => onDeleteFlow(row)
    },
    {
      text: '导出SQL', // 权限码 flow:export
      methods: (row) => onExportSql(row)
    },
    {
      text: '历史记录', // 权限码 flow:history
      methods: (row) => onHistory(row)
    },
    {
      text: '数据比对', // 权限码 flow:compare
      methods: (row) => onEnviSelect(row)
    },
    {
      text: '查看关联流程', // 无权限码
      methods: (row) => onProcess(row)
    }
  ],
  // 添加按钮（原无批量操作、无 rowSelection）
  buttonGroups: [
    {
      text: '增加流程', // 权限码 flow:add；title="流程新增"
      methods: () => handleAdd()
    }
  ],
  // 分页器
  paging: {
    total: 0,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  // 新增编辑 抽屉
  drawerVisible: false,
  title: '',
  id: '',
  form: { ...form },
  // 开发需求码（原编辑回显 model.developRequire 传入 SubmitFooterWithReq.requireCodeParam）
  requireCodeParam: '',
  // 删除确认
  dialogVisibleDel: false,
  // 流程设计器（保留原集成：编辑/只读浏览共用一个弹窗，以 flowViewOnly 区分）
  flowDesignVisible: false,
  flowViewOnly: false,
  currentFlow: null,
  currentFlowData: null
})

/** 获取列表数据 */
const handleList = async () => {
  const param = {
    pageSize: state.paging.pageSize,
    pageNo: state.paging.pageNo,
    ...state.formModel
  }
  const res = await getFlowList(param)
  if (res.returnCode === SUCCESS_STATUS) {
    state.tableData = res.result
    state.paging.total = res.totalCount
  }
}

/** 数据字典（flow_state, flow_branch_type） */
const initDict = async () => {
  const res = await getMultiDictsMore('flow_state,flow_branch_type')
  if (res.returnCode === SUCCESS_STATUS) {
    state.flowStateList = res.result.flow_state || []
    state.flowTypeList = res.result.flow_branch_type || []
  }
}

/** 创建时间范围变化 → queryParam.createTime_begin/createTime_end */
const onDateChange = (val) => {
  const range = Array.isArray(val) ? val : []
  state.formModel.createTime_begin = range[0] || ''
  state.formModel.createTime_end = range[1] || ''
}

/** 新增（原覆写 handleAdd，title="{流程}{新增}"→"流程新增"） */
const handleAdd = () => {
  state.drawerVisible = true
  state.title = '流程新增'
  state.id = ''
  state.form = { ...form }
  state.requireCodeParam = ''
}

/** 编辑（原覆写 handleEdit，title="{流程}{编辑}"→"流程编辑"；编辑态所属系统禁用、流程编码只读） */
const handleEdit = (row) => {
  state.drawerVisible = true
  state.title = '流程编辑'
  state.id = row.id
  // 原 edit 回显 pick：epfFlowName/epfFlowCode/transCode/epfFlowType/epfSystemId/
  // epfFlowVersion/epfFlowState/commonFlow/parentFlowId/epfFlowRemarks
  state.form = {
    epfFlowName: row.epfFlowName || '',
    epfFlowCode: row.epfFlowCode || '',
    transCode: row.transCode || '',
    epfFlowType: row.epfFlowType || '',
    epfSystemId: row.epfSystemId || '',
    epfFlowVersion: row.epfFlowVersion || '1',
    epfFlowState: row.epfFlowState || '0',
    commonFlow: !!row.commonFlow,
    parentFlowId: row.parentFlowId || '',
    epfFlowRemarks: row.epfFlowRemarks || ''
  }
  // 回显开发需求码给 SubmitFooterWithReq（原 $refs.reqSelect.requireCode=record.developRequire）
  state.requireCodeParam = row.developRequire || ''
}

/** 取消（关闭抽屉） */
const handleCancel = () => {
  state.drawerVisible = false
}

/** 唯一性校验（原 duplicateCheck → /sys/duplicate/check，tableName=epf_flow；重复提示 "{字段名}已存在!"） */
const checkDuplicate = async (fieldName, fieldVal, label) => {
  const res = await getFlowDuplicateCheck({
    tableName: 'epf_flow',
    fieldName,
    fieldVal
  })
  // TODO: 联调后接真实校验结果（res.result 为 false 时提示 label + '已存在!'）
  return true
}

/** 提交（原提交 Object.assign(model, values) + developRequire/developEnvi；
 *  developRequire 已接 SubmitFooterWithReq.requireCode；developEnvi 来自 vuex getter，子应用无该模块未迁移） */
const onClickSubmit = debounce(async () => {
  const { isValid } = await formRef.value.validate()
  if (!isValid) return
  const passCode = await checkDuplicate('epf_flow_code', state.form.epfFlowCode, '流程编码')
  if (!passCode) return
  const passName = await checkDuplicate('epf_flow_name', state.form.epfFlowName, '流程名称')
  if (!passName) return
  const param = {
    ...state.form,
    // 原 formData.developRequire = this.$refs.reqSelect.requireCode（SubmitFooterWithReq 需求码）
    developRequire: reqSelectRef.value?.requireCode || null
  }
  // 原 add 为 postAction("/flow/manage/config/add")；edit 为 putAction("/flow/manage/config/edit")
  let apiUrl = ''
  if (state.id) {
    apiUrl = getFlowEdit
    param.id = state.id
  } else {
    apiUrl = getFlowAdd
  }
  const res = await apiUrl(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', state.id ? '修改成功' : '新增成功')
    state.drawerVisible = false
    handleList()
  }
})

/** 流程删除（原 deleteAction('/flow/manage/config/deleteFlow', {flowId})，无二次确认直接调用） */
const onDeleteFlow = async (row) => {
  const res = await getFlowDeleteFlow({ flowId: row.id })
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '流程删除成功')
    handleList()
  }
}

/**
 * 导出SQL（已迁移 downFile 下载封装：原 downFile('/flow/manage/config/exportBatchSql', {ids: record.id})，
 * 文件名=流程名称+（流程编码）+日期+'.sql' 全角括号；后端接口暂不通，失败时统一提示，联调后仅后端可用即真实下载）
 */
const onExportSql = async (row) => {
  try {
    // 真实接口：GET /flow/manage/config/exportBatchSql（参数 ids=record.id）
    await downFile(
      '/flow/manage/config/exportBatchSql',
      { ids: row.id },
      `${row.epfFlowName}（${row.epfFlowCode}）${formatDate(new Date())}.sql`
    )
  } catch (e) {
    EPMessageTips('warning', '导出功能已迁移，接口待联调')
  }
}

/** 历史记录（原 loadHistory：先 if (record.pkValue !== undefined) record.id = record.pkValue，再跳 dynamic-data-history-list，systemName=record.epfSystemId；历史数据查看页已迁移） */
const onHistory = (row) => {
  // 原先拷贝行为：pkValue 存在时以 pkValue 作为 id（并随 record 一起序列化传给历史页）
  const record = { ...row }
  if (record.pkValue !== undefined) {
    record.id = record.pkValue
  }
  // 原经路由 params 传参，子应用改为 sessionStorage（lowCode:dynamicHistoryParams）+ 路由跳转；
  // 流程类页面 systemName 取 record.epfSystemId；本页无 formField 概念，传空数组由历史页回退 listColumns 返回值
  sessionStorage.setItem(
    'lowCode:dynamicHistoryParams',
    JSON.stringify({
      tableName: record.tableName,
      systemName: record.epfSystemId,
      id: record.id,
      record: JSON.stringify(record),
      formField: JSON.stringify([])
    })
  )
  router.push('/lowCodePlatform/dynamicHistory/list')
}

/** 数据比对（已迁移 DevelopProjectEnviSelectModal：title=比对数据环境选择，原 ref.edit(record) 打开） */
const onEnviSelect = (row) => {
  enviSelectRef.value?.edit(row)
}

/** 查看关联流程（已迁移 ParentProcess：原 handProcess → toPkValue=val.id + vuex parentProcessData=true 显示，
 * 去 vuex 化改为 ref.edit(row)，显隐由组件内 ep-dialog v-model 管理） */
const onProcess = (row) => {
  parentProcessRef.value?.edit(row)
}

/** 打开流程设计器（可编辑；原 onFlowDesign：flowDesignVisible=true、viewOnly=false、selectedFlowDetail=record） */
const handleFlowDesign = (row) => {
  state.flowViewOnly = false
  state.currentFlow = row
  state.currentFlowData = {
    flowInfo: row,
    nodeList: [],
    linkList: []
  }
  state.flowDesignVisible = true
}

/** 流程浏览（只读；原 onFlowDesignView → onFlowDesignQuery，viewOnly 置为只读组件，此处以 flowViewOnly 标记） */
const handleFlowDesignView = (row) => {
  state.flowViewOnly = true
  state.currentFlow = row
  state.currentFlowData = {
    flowInfo: row,
    nodeList: [],
    linkList: []
  }
  state.flowDesignVisible = true
}

/** FlowDesigner 保存回调 */
const onFlowSave = async (flowData) => {
  const res = await getFlowEdit(flowData)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '流程保存成功')
    state.flowDesignVisible = false
    handleList()
  }
}

/** 弹窗关闭后的清理 */
const onFlowDesignClosed = () => {
  state.currentFlow = null
  state.currentFlowData = null
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

/** 查询 重置（原覆写 searchReset 清空后回填 transCode；本页无左侧导航，transCode 恒为空；回第一页） */
const handleSearchFunc = (type) => {
  state.paging.pageNo = PAGE_NO
  handleList()
}
// 页面加载时
onMounted(() => {
  initDict()
  handleList()
})
</script>
