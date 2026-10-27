<template>
  <div>
    <!-- 查询区（原搜索字段：systemName/regulatorId/regulatorName/regulatorSubType/asCommon；asCommon、regulatorSubType 位于展开区；
         另有隐式参数 transCode 由原页面左侧 PayListDisplay 业务列表 .sync 注入，本页为标准列表无左侧导航，仅保留参数并注释说明） -->
    <SearchBlock
      :form-model="state.formModel"
      :label-width="130"
      :search-func="handleSearchFunc"
    >
      <ep-form-item prop="systemName" label="应用系统">
        <!-- TODO: 联调后接入表字典 local|develop_system,system_name,system_code -->
        <ep-select
          v-model="state.formModel.systemName"
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
      <ep-form-item prop="regulatorId" label="规则标识">
        <ep-input
          v-model="state.formModel.regulatorId"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="regulatorName" label="规则名称">
        <ep-input
          v-model="state.formModel.regulatorName"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="regulatorSubType" label="规则类型">
        <ep-select
          v-model="state.formModel.regulatorSubType"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.regulatorSubTypeList"
            :key="item.lemmaItem"
            :label="item.itemName"
            :value="item.lemmaItem"
          />
        </ep-select>
      </ep-form-item>
      <ep-form-item prop="asCommon" label="是否共享规则">
        <ep-select
          v-model="state.formModel.asCommon"
          placeholder="请选择"
        >
          <ep-option label="是" value="true" />
          <ep-option label="否" value="false" />
        </ep-select>
      </ep-form-item>
    </SearchBlock>
    <!-- 列表区 -->
    <!-- 已选提示（原：已选择 X 项 / 清空） -->
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

    <!-- 新增编辑 弹窗（原 a-modal 全屏宽 width='100%'，编辑态 readOnly=true；footer 原为 SubmitFooterWithReq 带开发需求码，待迁移） -->
    <ep-dialog
      v-model="state.dialogVisible"
      :title="state.title"
      width="100%"
      top="0px"
      class="fullscreen-dialog"
    >
      <ep-form ref="formRef" :model="state.form" :label-width="150">
        <ep-form-item
          prop="systemName"
          label="所属系统"
          :rules="[{ required: true, message: '请选择所属系统!', trigger: 'change' }]"
        >
          <!-- 编辑态禁用（原 :disabled="readOnly"） -->
          <ep-select v-model="state.form.systemName" placeholder="请选择" :disabled="!!state.id">
            <ep-option
              v-for="item in state.systemOptions"
              :key="item.lemmaItem"
              :label="item.itemName"
              :value="item.lemmaItem"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item
          prop="regulatorId"
          label="规则标识"
          :rules="[{ required: true, message: '请选择规则标识!', trigger: 'blur' }]"
        >
          <ep-input v-model="state.form.regulatorId" placeholder="请输入" type="text" />
        </ep-form-item>
        <ep-form-item prop="transCode" label="所属业务模块">
          <!-- 已迁移：JSelectService（业务模块多选，原 :multi="true"）；v-model=逗号拼接的业务树节点 key（与源 v-decorator=['transCode'] 一致） -->
          <JSelectService v-model="state.form.transCode" :multi="true" />
        </ep-form-item>
        <ep-form-item
          prop="regulatorName"
          label="规则名称"
          :rules="[{ required: true, message: '请输入规则别名!', trigger: 'blur' }]"
        >
          <ep-input
            v-model="state.form.regulatorName"
            type="textarea"
            :rows="2"
            placeholder="请输入"
          />
        </ep-form-item>
        <ep-form-item
          prop="regulatorSubType"
          label="规则子类型"
          :rules="[{ required: true, message: '请选择规则类型!', trigger: 'change' }]"
        >
          <!-- 原为 j-dict-select-tag type=radio，字典 regulator_sub_type；切换时清空 sourceDataSets/targetDataSets/resultRule/groupSets/regulatorChilds/errorInfo。
               中文文案由字典 regulator_sub_type 提供（联调后替换为字典渲染），此处为驱动联动区保留 8 个枚举值 -->
          <ep-radio-group v-model="state.form.regulatorSubType" @change="onSubTypeChange">
            <ep-radio
              v-for="item in subTypeOptions"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</ep-radio>
          </ep-radio-group>
        </ep-form-item>
        <ep-form-item label="是否并行执行">
          <ep-switch
            v-model="state.form.isParallelExecution"
            active-text="是"
            inactive-text="否"
          />
        </ep-form-item>
        <ep-form-item label="是否共享规则">
          <ep-switch
            v-model="state.form.asCommon"
            active-text="是"
            inactive-text="否"
          />
        </ep-form-item>
        <!-- 类处理器：仅单决策/单渲染显示；changeRuleInfo 调 queryByClassName 初始化源/目标数据集与扩展参数 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'SINGLE_DECISION' || state.form.regulatorSubType === 'SINGLE_RENDER'"
          prop="className"
          label="类处理器"
        >
          <!-- 已迁移：JSelectRegulatorInfo（规则处理器选择器，原 :multiple="false" + @change=changeRuleInfo）；
               v-model=className（源 returnId=false 时 valueKey 取 returnKeys[1]=className） -->
          <JSelectRegulatorInfo
            v-model="state.form.className"
            :multiple="false"
            @change="onChangeRuleInfo"
          />
        </ep-form-item>
        <!-- 异常信息：恒显；原组件: ErrorInfo（errorCode/errorMessage），待迁移，暂用两个输入框占位 -->
        <ep-form-item label="异常信息">
          <div class="inline-fields">
            <ep-input v-model="state.form.errorCode" placeholder="异常编码 errorCode" type="text" />
            <ep-input v-model="state.form.errorMessage" placeholder="异常信息 errorMessage" type="text" />
          </div>
        </ep-form-item>
        <!-- 校验结果：多决策/合并显示；原组件: ValidateResult，待迁移 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'MUTIL_DECISION' || state.form.regulatorSubType === 'JOIN'"
          label="校验结果"
        >
          <div class="sub-panel">
            <span class="placeholder-tip">子组件 ValidateResult（原路径 ./modules/result/ValidateResult），待迁移</span>
          </div>
        </ep-form-item>
        <!-- 规则分组设置：原组件: GroupSet（原路径 ./modules/group/GroupSet），待迁移；多决策/多渲染 + 子表规则 + 数据赋值场景均含该区块 -->
        <ep-form-item
          v-if="subTypeOptions.some((s) => s.value === state.form.regulatorSubType && s.hasGroup)"
          label="规则分组设置"
        >
          <div class="sub-panel">
            <span class="placeholder-tip">子组件 GroupSet（原路径 ./modules/group/GroupSet），待迁移</span>
          </div>
        </ep-form-item>
        <!-- 子规则列表：多决策/多渲染；原组件: ChildRegulatorList（原路径 ./modules/child/ChildRegulatorList），待迁移 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'MUTIL_DECISION' || state.form.regulatorSubType === 'MUTIL_RENDER'"
          label="子规则列表"
        >
          <div class="sub-panel">
            <span class="placeholder-tip">子组件 ChildRegulatorList（原路径 ./modules/child/ChildRegulatorList），待迁移</span>
          </div>
        </ep-form-item>
        <!-- 子表规则配置：多决策子表/多渲染子表；原组件: SubListRegulatorList，待迁移 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'MUTIL_DECISION_SUBLIST' || state.form.regulatorSubType === 'MUTIL_RENDER_SUBLIST'"
          label="子表规则配置"
        >
          <div class="sub-panel">
            <span class="placeholder-tip">子组件 SubListRegulatorList（原路径 modules/sublist/SubListRegulatorList），待迁移</span>
          </div>
        </ep-form-item>
        <!-- 数据赋值配置：原组件: DataAssign（原路径 ./modules/assgin/DataAssign），待迁移 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'DATA_ASSIGN'"
          label="赋值配置"
        >
          <div class="sub-panel">
            <span class="placeholder-tip">子组件 DataAssign（原路径 ./modules/assgin/DataAssign），待迁移</span>
          </div>
        </ep-form-item>
        <!-- 合并规则配置：合并(JOIN)；原组件: DecisionRule（原路径 ./modules/rule/DecisionRule），待迁移 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'JOIN'"
          label="合并规则配置"
        >
          <div class="sub-panel">
            <span class="placeholder-tip">子组件 DecisionRule（原路径 ./modules/rule/DecisionRule），待迁移</span>
          </div>
        </ep-form-item>
        <!-- 单决策/单渲染 源/目标数据集与扩展参数；原组件: SingleRule，待迁移 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'SINGLE_DECISION' || state.form.regulatorSubType === 'SINGLE_RENDER'"
          label="数据集配置"
        >
          <div class="sub-panel">
            <span class="placeholder-tip">子组件 SingleRule（源/目标数据集 sourceDataSets/targetDataSets + 扩展参数 extendParams，原路径 modules/single/SingleRule），待迁移</span>
          </div>
        </ep-form-item>
      </ep-form>
      <template #footer>
        <span>
          <!-- 原 handleCancel 会 $emit('ok') 强制刷新列表（防缓存脏数据），此处保持同行为 -->
          <ep-button plain @click="handleCancel">关闭</ep-button>
          <ep-button type="primary" @click="onClickSubmit">提交</ep-button>
        </span>
      </template>
    </ep-dialog>

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

    <!-- 查看关联引用 弹窗（原 a-modal width=800、footer=null，title=规则标识+规则名称；三类引用切换高亮） -->
    <ep-dialog v-model="state.refVisible" :title="state.refTitle" width="800px">
      <div class="ref-body">
        <div class="ref-tabs">
          <ep-button
            :type="state.refType === 'rule' ? 'primary' : ''"
            :plain="state.refType !== 'rule'"
            @click="onSwitchRef('rule')"
          >规则引用</ep-button>
          <ep-button
            :type="state.refType === 'flow' ? 'primary' : ''"
            :plain="state.refType !== 'flow'"
            @click="onSwitchRef('flow')"
          >流程引用</ep-button>
          <ep-button
            :type="state.refType === 'swap' ? 'primary' : ''"
            :plain="state.refType !== 'swap'"
            @click="onSwitchRef('swap')"
          >交互引用</ep-button>
        </div>
        <!-- 规则引用表：规则名称/规则标识；跳转=复制规则名称后关闭弹窗 -->
        <ep-table v-if="state.refType === 'rule'" :data="state.refData">
          <ep-table-column prop="name" label="规则名称" />
          <ep-table-column prop="code" label="规则标识" />
          <ep-table-column label="操作" width="100">
            <template #default="{ row }">
              <ep-button plain type="primary" @click="onJumpRef(row, 'rule')">跳转</ep-button>
            </template>
          </ep-table-column>
        </ep-table>
        <div v-if="state.refType === 'rule' && !state.refData.length" class="ref-empty">暂无规则引用当前规则</div>
        <!-- 流程引用表：流程名称/流程编码；跳转=复制后路由 /flow/manage -->
        <ep-table v-if="state.refType === 'flow'" :data="state.refData">
          <ep-table-column prop="name" label="流程名称" />
          <ep-table-column prop="code" label="流程编码" />
          <ep-table-column label="操作" width="100">
            <template #default="{ row }">
              <ep-button plain type="primary" @click="onJumpRef(row, 'flow')">跳转</ep-button>
            </template>
          </ep-table-column>
        </ep-table>
        <div v-if="state.refType === 'flow' && !state.refData.length" class="ref-empty">暂无流程引用当前规则</div>
        <!-- 交互引用表：交互名称/交互编码；跳转=复制后路由 /product/channel?tableName=swapInterface -->
        <ep-table v-if="state.refType === 'swap'" :data="state.refData">
          <ep-table-column prop="name" label="交互名称" />
          <ep-table-column prop="code" label="交互编码" />
          <ep-table-column label="操作" width="100">
            <template #default="{ row }">
              <ep-button plain type="primary" @click="onJumpRef(row, 'swap')">跳转</ep-button>
            </template>
          </ep-table-column>
        </ep-table>
        <div v-if="state.refType === 'swap' && !state.refData.length" class="ref-empty">暂无交互引用当前规则</div>
      </div>
    </ep-dialog>

    <!-- 待迁移功能 占位弹窗（数据比对；历史记录已改为真实跳转） -->
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
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBlock from '@/components/searchBlock/searchBlock.vue'
import { SUCCESS_STATUS, PAGE_SIZE, PAGE_NO } from '@/config/config'
import { EPMessageTips, debounce } from '@/utils/utils'
import { getMultiDictsMore } from '@/api/common/common.js'
import {
  getRegulatorRuleList,
  getRegulatorRuleAdd,
  getRegulatorRuleEdit,
  getRegulatorRuleDelete,
  getRegulatorRuleDeleteBatch,
  getRegulatorRuleExportBatchSql,
  getRuleInfoByClassName,
  getAssociatedRules,
  getAssociatedFlowRules,
  getAssociatedSwapRules
} from '@/api/lowCodePlatform/regulatorRule'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'
import JSelectService from '@/components/jSelectService/JSelectService.vue'
import JSelectRegulatorInfo from '@/components/jSelectRegulatorInfo/JSelectRegulatorInfo.vue'

const formRef = ref(null)
const router = useRouter()

// TODO: 联调后接入表字典 local|develop_system,system_name,system_code（应用系统下拉，联调前保持为空）
const systemOptions = []

// 规则子类型 8 个枚举值（原字典 regulator_sub_type）；label 暂用编码，中文文案联调后由字典提供；
// hasGroup 标记需展示"规则分组设置"区块（GroupSet）的子类型
const subTypeOptions = [
  { value: 'SINGLE_DECISION', label: 'SINGLE_DECISION', hasGroup: false },
  { value: 'SINGLE_RENDER', label: 'SINGLE_RENDER', hasGroup: false },
  { value: 'MUTIL_DECISION', label: 'MUTIL_DECISION', hasGroup: true },
  { value: 'MUTIL_RENDER', label: 'MUTIL_RENDER', hasGroup: true },
  { value: 'MUTIL_DECISION_SUBLIST', label: 'MUTIL_DECISION_SUBLIST', hasGroup: true },
  { value: 'MUTIL_RENDER_SUBLIST', label: 'MUTIL_RENDER_SUBLIST', hasGroup: true },
  { value: 'DATA_ASSIGN', label: 'DATA_ASSIGN', hasGroup: true },
  { value: 'JOIN', label: 'JOIN', hasGroup: false }
]

// 权限码（原 v-has）：新增 rule:add；批量删除/行删除 rule:delete；导出Sql rule:export；
// 行编辑 rule:edit；历史记录 rule:history；数据比对 rule:compare；查看关联引用（无权限码）

const form = {
  systemName: '',
  regulatorId: '',
  transCode: '',
  regulatorName: '',
  regulatorSubType: '',
  isParallelExecution: false,
  asCommon: false,
  className: '',
  errorCode: '',
  errorMessage: ''
}

const state = reactive({
  // 查询（transCode 原由左侧 PayListDisplay .sync 注入并 watch 后 loadData(1)，本页无左侧导航，保留空参数）
  formModel: {
    systemName: '',
    regulatorId: '',
    regulatorName: '',
    regulatorSubType: '',
    asCommon: '',
    transCode: ''
  },
  // 所属系统表字典选项（联调前为空）
  systemOptions,
  // 数据字典
  regulatorSubTypeList: [],
  // 列表
  tableData: [],
  tableColumns: [
    {
      isShow: true,
      prop: 'systemNameText',
      label: '所属系统',
      minWidth: 130
    },
    {
      isShow: true,
      prop: 'regulatorId',
      label: '规则标识',
      minWidth: 160
    },
    {
      isShow: true,
      prop: 'regulatorName',
      label: '规则名称',
      minWidth: 150
    },
    {
      isShow: true,
      prop: 'regulatorSubType_dictText',
      label: '规则类型',
      width: 110
    },
    {
      isShow: true,
      prop: 'asCommon',
      label: '是否共享规则',
      // 原 slot 'common'：真→是 / 假→否
      formatter: ({ row }) => (row.asCommon ? '是' : '否'),
      width: 110
    },
    {
      isShow: true,
      prop: 'createTime_dateText',
      label: '创建时间',
      width: 150
    },
    {
      isShow: true,
      prop: 'updateTime_dateText',
      label: '修改时间',
      width: 150
    },
    {
      isShow: true,
      slot: 'operation',
      label: '操作',
      minWidth: 120
    }
  ],
  // 操作列（首项直接展示，其余进入"更多"下拉）
  tableOperation: [
    {
      text: '编辑', // 权限码 rule:edit
      methods: (row) => handleEdit(row)
    },
    {
      text: '删除', // 权限码 rule:delete
      methods: (row) => onDelete(row)
    },
    {
      text: '历史记录', // 权限码 rule:history
      methods: (row) => onHistory(row)
    },
    {
      text: '数据比对', // 权限码 rule:compare
      methods: (row) => onEnviSelect(row)
    },
    {
      text: '查看关联引用', // 无权限码
      methods: (row) => showRegulatorProcessModal(row)
    }
  ],
  // 添加按钮（批量操作）
  buttonGroups: [
    {
      text: '新增', // 权限码 rule:add
      methods: () => handleAdd()
    },
    {
      text: '批量删除', // 权限码 rule:delete；原 mixin batchDel
      methods: () => onBatchDelete(),
      disabled: true
    },
    {
      text: '导出Sql', // 权限码 rule:export；原 mixin exportBatchSql
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
  // 新增编辑 弹窗（原全屏宽 '100%'）
  dialogVisible: false,
  title: '',
  id: '',
  form: { ...form },
  // 删除
  dialogVisibleDel: false,
  deleteIds: [],
  // 查看关联引用 弹窗
  refVisible: false,
  refTitle: '',
  refType: 'rule',
  refData: [],
  refRecord: null,
  // 占位弹窗
  placeholderVisible: false,
  placeholderText: ''
})

/** 获取列表数据 */
const handleList = async () => {
  const param = {
    pageSize: state.paging.pageSize,
    pageNo: state.paging.pageNo,
    ...state.formModel
  }
  const res = await getRegulatorRuleList(param)
  if (res.returnCode === SUCCESS_STATUS) {
    state.tableData = res.result
    state.paging.total = res.totalCount
  }
}

/** 数据字典（regulator_sub_type） */
const initDict = async () => {
  const res = await getMultiDictsMore('regulator_sub_type')
  if (res.returnCode === SUCCESS_STATUS) {
    state.regulatorSubTypeList = res.result.regulator_sub_type || []
  }
}

/** 多选 */
const onSelectionChange = (rows) => {
  state.selectedRows = rows
  const has = rows.length > 0
  state.buttonGroups[1].disabled = !has
  state.buttonGroups[2].disabled = !has
}

/** 清空已选 */
const onClearSelection = () => {
  state.tableData.forEach((item) => (item.checked = false))
  state.selectedRows = []
  state.buttonGroups[1].disabled = true
  state.buttonGroups[2].disabled = true
}

/** 规则子类型切换：清空 sourceDataSets/targetDataSets/resultRule/groupSets/regulatorChilds/errorInfo */
const onSubTypeChange = () => {
  state.form.className = ''
  state.form.errorCode = ''
  state.form.errorMessage = ''
}

/** 类处理器联动（原 changeRuleInfo → /configuation/regulatorinfo/config/queryByClassName 初始化源/目标数据集与扩展参数） */
const onChangeRuleInfo = async () => {
  await getRuleInfoByClassName({
    systemName: state.form.systemName,
    className: state.form.className
  })
  // mock 环境返回空数据集，暂无回填逻辑
}

/** 清空数据（原 edit 回显 pick：systemName/regulatorName/transCode/regulatorId/regulatorSubType） */
const pickForm = (record) => ({
  systemName: record.systemName || '',
  regulatorId: record.regulatorId || '',
  transCode: record.transCode || '',
  regulatorName: record.regulatorName || '',
  regulatorSubType: record.regulatorSubType || '',
  isParallelExecution: !!record.isParallelExecution,
  asCommon: !!record.asCommon,
  className: record.className || '',
  errorCode: (record.errorInfo && record.errorInfo.errorCode) || '',
  errorMessage: (record.errorInfo && record.errorInfo.errorMessage) || ''
})

/** 编辑（编辑态 readOnly=true：所属系统禁用） */
const handleEdit = (row) => {
  state.dialogVisible = true
  state.title = '业务规则配置页面编辑'
  state.id = row.id
  state.form = pickForm(row)
}

/** 新增（原 mixin handleAdd，title = description + "新增"，description=业务规则配置页面） */
const handleAdd = () => {
  state.dialogVisible = true
  state.title = '业务规则配置页面新增'
  state.id = ''
  state.form = { ...form }
}

/** 取消（原 handleCancel 会 $emit('ok') 强制刷新列表，防缓存脏数据） */
const handleCancel = () => {
  state.dialogVisible = false
  handleList()
}

/** 提交（原提交合并 regulatorParam/errorInfo/className/regulatorSources/regulatorTargets/resultRule/groupSets/asCommon/isParallelExecution/regulatorChilds，并附加 developRequire/developEnvi——依赖需求码组件与 vuex，未迁移） */
const onClickSubmit = debounce(async () => {
  const { isValid } = await formRef.value.validate()
  if (isValid) {
    const param = {
      ...state.form,
      errorInfo: {
        errorCode: state.form.errorCode,
        errorMessage: state.form.errorMessage
      }
    }
    // 原 add 为 post /configuation/regulatorrule/config/add；edit 为 put /configuation/regulatorrule/config/edit
    let apiUrl = ''
    if (state.id) {
      apiUrl = getRegulatorRuleEdit
      param.id = state.id
    } else {
      apiUrl = getRegulatorRuleAdd
    }
    const res = await apiUrl(param)
    if (res.returnCode === SUCCESS_STATUS) {
      EPMessageTips('success', state.id ? '修改成功' : '新增成功')
      handleList()
      state.dialogVisible = false
    }
  }
})

/** 行删除 */
const onDelete = (row) => {
  state.id = row.id
  state.deleteIds = []
  state.dialogVisibleDel = true
}

/** 批量删除（原 mixin batchDel → /configuation/regulatorrule/config/deleteBatch） */
const onBatchDelete = () => {
  state.deleteIds = state.selectedRows.map((row) => row.id)
  state.id = ''
  state.dialogVisibleDel = true
}

/** 确认删除 */
const handleDelete = debounce(async () => {
  if (state.deleteIds.length) {
    const res = await getRegulatorRuleDeleteBatch({ ids: state.deleteIds.join(',') })
    if (res.returnCode === SUCCESS_STATUS) {
      EPMessageTips('success', '批量删除成功')
      state.dialogVisibleDel = false
      state.selectedRows = []
      handleList()
    }
  } else {
    const param = { id: state.id }
    const res = await getRegulatorRuleDelete(param)
    if (res.returnCode === SUCCESS_STATUS) {
      EPMessageTips('success', '删除成功')
      state.dialogVisibleDel = false
      handleList()
    }
  }
})

/** 导出Sql（原 mixin exportBatchSql → downFile(/configuation/regulatorrule/config/exportBatchSql, {ids, sqlType})，mock 环境仅调用占位） */
const onExportBatchSql = async () => {
  const ids = state.selectedRows.map((row) => row.id).join(',')
  const res = await getRegulatorRuleExportBatchSql({ ids, sqlType: 'DML' })
  if (res.returnCode === SUCCESS_STATUS) {
    state.placeholderVisible = true
    state.placeholderText = '原通过 downFile 下载 /configuation/regulatorrule/config/exportBatchSql（参数 ids、sqlType=DML），下载组件待迁移'
  }
}

/** 历史记录（原跳转路由 dynamic-data-history-list，params: tableName=record.tableName、systemName=record.systemName、id、record、formField；历史数据查看页已迁移） */
const onHistory = (row) => {
  // 原经路由 params 传参，子应用改为 sessionStorage（lowCode:dynamicHistoryParams）+ 路由跳转；
  // 本页无 formField 概念（原传入自身列表 allColumnsItems），传空数组由历史页回退 listColumns 返回值
  sessionStorage.setItem(
    'lowCode:dynamicHistoryParams',
    JSON.stringify({
      tableName: row.tableName,
      systemName: row.systemName,
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

/** 查看关联引用（原 showRegulatorProcessModal 打开页内弹窗，title=规则标识+规则名称） */
const showRegulatorProcessModal = (row) => {
  state.refRecord = row
  state.refTitle = (row.regulatorId || '') + ' ' + (row.regulatorName || '')
  state.refVisible = true
  onSwitchRef('rule')
}

/** 切换引用类型（规则/流程/交互，均按 pkValue=规则 id 查询） */
const onSwitchRef = async (type) => {
  state.refType = type
  state.refData = []
  if (!state.refRecord) return
  let res = null
  if (type === 'rule') {
    res = await getAssociatedRules({ pkValue: state.refRecord.id })
  } else if (type === 'flow') {
    res = await getAssociatedFlowRules({ pkValue: state.refRecord.id })
  } else {
    res = await getAssociatedSwapRules({ pkValue: state.refRecord.id })
  }
  if (res.returnCode === SUCCESS_STATUS) {
    state.refData = res.result || []
  } else {
    EPMessageTips('error', '请求失败，请稍后再试。')
  }
}

/** 引用跳转：复制名称后按类型关闭弹窗/路由跳转 */
const onJumpRef = async (row, type) => {
  try {
    await navigator.clipboard.writeText(row.name)
    EPMessageTips('success', '已复制: ' + row.name)
  } catch (e) {
    EPMessageTips('error', '复制失败')
  }
  if (type === 'rule') {
    // 原逻辑：复制后仅关闭弹窗
    state.refVisible = false
  } else if (type === 'flow') {
    // 原逻辑：复制后 $router.push('/flow/manage')；本页为子应用路由，跳转待联调
    state.refVisible = false
  } else {
    // 原逻辑：复制后 $router.push({path:'/product/channel', query:{tableName:'swapInterface'}})；跳转待联调
    state.refVisible = false
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

<style scoped>
.fullscreen-dialog :deep(.ep-dialog__body) {
  overflow: auto;
}
.selected-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.inline-fields {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.sub-panel {
  width: 100%;
  min-height: 60px;
  border: 1px dashed #bfcae2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.placeholder-tip {
  color: #999;
}
.ref-body {
  max-height: 600px;
  overflow: auto;
}
.ref-tabs {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
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
