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

    <!-- 新增编辑 弹窗（原 a-modal 全屏宽 width='100%'，编辑态 readOnly=true；footer 已迁移 SubmitFooterWithReq 带开发需求码） -->
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
        <!-- 异常信息：已简化实现（原组件 ErrorInfo：errorCode 为字典 error_code 下拉 + errorMessage 输入框，本页以两个输入框等价占位，联调后可换字典下拉） -->
        <ep-form-item label="异常信息">
          <div class="inline-fields">
            <ep-input v-model="state.form.errorCode" placeholder="异常编码 errorCode" type="text" />
            <ep-input v-model="state.form.errorMessage" placeholder="异常信息 errorMessage" type="text" />
          </div>
        </ep-form-item>
        <!-- 校验结果：已迁移 ValidateResult（原路径 ./modules/result/ValidateResult）；结果对象按引用传入，子组件变更直接回写（等价源 .sync） -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'MUTIL_DECISION' || state.form.regulatorSubType === 'JOIN'"
          label="校验结果"
        >
          <ValidateResult :result-rule-param-props="state.form.resultRule" />
        </ep-form-item>
        <!-- 规则分组设置：已迁移 GroupSet（原路径 ./modules/group/GroupSet）；isGroup 同步 model.hasGroup，分组行深变更 emit call（源 modal setGroupSet） -->
        <ep-form-item
          v-if="subTypeOptions.some((s) => s.value === state.form.regulatorSubType && s.hasGroup)"
          label="规则分组设置"
        >
          <GroupSet
            v-model:is-group-prop="state.form.hasGroup"
            :group-sets-param="state.form.groupSets"
            @call="setGroupSet"
          />
        </ep-form-item>
        <!-- 子规则列表：已迁移 ChildRegulatorList（原路径 ./modules/child/ChildRegulatorList） -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'MUTIL_DECISION' || state.form.regulatorSubType === 'MUTIL_RENDER'"
          label="子规则列表"
        >
          <ChildRegulatorList
            v-model:regulator-childs-param="state.form.regulatorChilds"
            :group-sets-param="state.form.groupSets"
          />
        </ep-form-item>
        <!-- 子表规则配置：已迁移 SubListRegulatorList（原路径 modules/sublist/SubListRegulatorList）；子表多决策/多渲染共用，规则子类型与所属系统用于新增子节点联动 -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'MUTIL_DECISION_SUBLIST' || state.form.regulatorSubType === 'MUTIL_RENDER_SUBLIST'"
          label="子表规则配置"
        >
          <SubListRegulatorList
            v-model:regulator-sub-list-param="state.form.regulatorChilds"
            :group-sets-param="state.form.groupSets"
            :regulator-sub-type-param="state.form.regulatorSubType"
            :system-name-param="state.form.systemName"
          />
        </ep-form-item>
        <!-- 赋值配置：已迁移 DataAssign（原路径 ./modules/assgin/DataAssign） -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'DATA_ASSIGN'"
          label="赋值配置"
        >
          <DataAssign
            v-model:regulator-childs-param="state.form.regulatorChilds"
            :group-sets-param="state.form.groupSets"
          />
        </ep-form-item>
        <!-- 合并规则配置：已迁移 DecisionRule（原路径 ./modules/rule/DecisionRule） -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'JOIN'"
          label="合并规则配置"
        >
          <DecisionRule v-model:regulator-childs-param="state.form.regulatorChilds" />
        </ep-form-item>
        <!-- 数据集配置：已迁移 SingleRule（源/目标数据集 sourceDataSets/targetDataSets + 扩展参数 extendParams，原路径 modules/single/SingleRule） -->
        <ep-form-item
          v-if="state.form.regulatorSubType === 'SINGLE_DECISION' || state.form.regulatorSubType === 'SINGLE_RENDER'"
          label="数据集配置"
        >
          <SingleRule
            v-model:source-data-sets-param="state.form.sourceDataSets"
            v-model:target-data-sets-param="state.form.targetDataSets"
            v-model:extend-params-ext="state.form.extendParams"
          />
        </ep-form-item>
      </ep-form>
      <template #footer>
        <!-- 已迁移 SubmitFooterWithReq：requireCode 输入 + 取消/提交（事件接回原 handleCancel/onClickSubmit） -->
        <SubmitFooterWithReq
          ref="reqSelectRef"
          :require-code-param="state.requireCodeParam"
          @ok="onClickSubmit"
          @cancel="handleCancel"
        />
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

    <!-- 已迁移：DevelopProjectEnviSelectModal 比对数据环境选择（数据比对入口，ref.edit(row) 打开） -->
    <DevelopProjectEnviSelectModal ref="enviSelectRef" />
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
  getRuleInfoByClassName,
  getAssociatedRules,
  getAssociatedFlowRules,
  getAssociatedSwapRules
} from '@/api/lowCodePlatform/regulatorRule'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'
import JSelectService from '@/components/jSelectService/JSelectService.vue'
import JSelectRegulatorInfo from '@/components/jSelectRegulatorInfo/JSelectRegulatorInfo.vue'
// 已迁移组件：SubmitFooterWithReq 提交底栏（开发需求码） / DevelopProjectEnviSelectModal 比对数据环境选择
import SubmitFooterWithReq from '@/components/submitFooterWithReq/SubmitFooterWithReq.vue'
import DevelopProjectEnviSelectModal from '@/components/developProjectEnviSelectModal/DevelopProjectEnviSelectModal.vue'
// 已迁移规则子组件（B 组，原 RegulatorRuleModal ./modules/* 七件套）
import SingleRule from './modules/singleRule.vue'
import GroupSet from './modules/groupSet.vue'
import ChildRegulatorList from './modules/childRegulatorList.vue'
import SubListRegulatorList from './modules/subListRegulatorList.vue'
import DataAssign from './modules/dataAssign.vue'
import DecisionRule from './modules/decisionRule.vue'
import ValidateResult from './modules/validateResult.vue'
import downFile from '@/utils/downFile'

const formRef = ref(null)
// SubmitFooterWithReq（读取 requireCode 作为 developRequire 提交参数）与比对环境选择弹窗
const reqSelectRef = ref(null)
const enviSelectRef = ref(null)
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

/** 表单数据对象工厂（与源 Modal 字段一一对应；子组件 B 组共用的 sourceDataSets/targetDataSets/extendParams/resultRule/groupSets/regulatorChilds/hasGroup
 *  必须每次返回全新引用，避免 { ...form } 浅拷贝导致嵌套对象跨新增共享，与源差异：源为 data() 函数每次重建） */
const makeForm = () => ({
  systemName: '',
  regulatorId: '',
  transCode: '',
  regulatorName: '',
  regulatorSubType: '',
  isParallelExecution: false,
  asCommon: false,
  className: '',
  errorCode: '',
  errorMessage: '',
  // 源 model.hasGroup（GroupSet 是否分组）
  hasGroup: false,
  // 源/目标数据集（源 regulatorSources/regulatorTargets）
  sourceDataSets: [],
  targetDataSets: [],
  // 处理参数（源 regulatorParam）
  extendParams: [],
  // 校验结果（源 resultRule）
  resultRule: {},
  // 分组行（源 groupSets）
  groupSets: [],
  // 子规则/赋值/条件行（源 regulatorChilds）
  regulatorChilds: []
})

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
  form: makeForm(),
  // 开发需求码（原编辑回显 model.developRequire 传入 SubmitFooterWithReq.requireCodeParam）
  requireCodeParam: '',
  // 删除
  dialogVisibleDel: false,
  deleteIds: [],
  // 查看关联引用 弹窗
  refVisible: false,
  refTitle: '',
  refType: 'rule',
  refData: [],
  refRecord: null
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

/** 规则子类型切换（源 toggleType：清空 sourceDataSets/targetDataSets/resultRule/groupSets/regulatorChilds/errorInfo） */
const onSubTypeChange = () => {
  state.form.className = ''
  state.form.errorCode = ''
  state.form.errorMessage = ''
  state.form.sourceDataSets = []
  state.form.targetDataSets = []
  state.form.extendParams = []
  state.form.resultRule = {}
  state.form.groupSets = []
  state.form.regulatorChilds = []
  state.form.hasGroup = false
}

/** 类处理器联动（源 changeRuleInfo → /configuation/regulatorinfo/config/queryByClassName 初始化源/目标数据集与扩展参数） */
const onChangeRuleInfo = async () => {
  const res = await getRuleInfoByClassName({
    systemName: state.form.systemName,
    className: state.form.className
  })
  // 按返回 sourceAcct/targetAcct 重建数据集、regulatorInfoParams 生成处理参数（与源一致；与源差异：省略 isLoad 编辑回显守卫与 ruleClassName 去重，mock 联调后自然替换）
  if (res.success && res.result != null) {
    const info = res.result
    const sourceDataSets = []
    for (let i = 0; i < (info.sourceAcct || 0); i++) {
      sourceDataSets.push({ fieldIndex: i, fieldType: 'MSG', sourceType: 'SOURCE' })
    }
    const targetDataSets = []
    for (let i = 0; i < (info.targetAcct || 0); i++) {
      targetDataSets.push({ fieldIndex: i, fieldType: 'MSG', sourceType: 'TARGET' })
    }
    state.form.sourceDataSets = sourceDataSets
    state.form.targetDataSets = targetDataSets
    state.form.extendParams = (info.regulatorInfoParams || []).map((val) => ({
      paramName: val.paramName,
      fieldType: val.dataType,
      defaultValue: val.paramDefaultValue || {}
    }))
  }
}

/** 源 setGroupSet：GroupSet 分组行深变更回调（行数据为共享引用，此处仅保留事件对齐） */
const setGroupSet = (val) => {
  state.form.groupSets = val
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
  errorMessage: (record.errorInfo && record.errorInfo.errorMessage) || '',
  hasGroup: !!record.hasGroup,
  // 源 edit 回显 300ms 延迟赋值：regulatorSources/regulatorTargets/regulatorParam/resultRule/groupSets/regulatorChilds
  sourceDataSets: record.regulatorSources || [],
  targetDataSets: record.regulatorTargets || [],
  extendParams: record.regulatorParam || [],
  resultRule: record.resultRule || {},
  groupSets: record.groupSets || [],
  regulatorChilds: record.regulatorChilds || []
})

/** 编辑（编辑态 readOnly=true：所属系统禁用；回显开发需求码给 SubmitFooterWithReq） */
const handleEdit = (row) => {
  state.dialogVisible = true
  state.title = '业务规则配置页面编辑'
  state.id = row.id
  state.form = pickForm(row)
  state.requireCodeParam = row.developRequire || ''
}

/** 新增（原 mixin handleAdd，title = description + "新增"，description=业务规则配置页面） */
const handleAdd = () => {
  state.dialogVisible = true
  state.title = '业务规则配置页面新增'
  state.id = ''
  state.form = makeForm()
  state.requireCodeParam = ''
}

/** 取消（原 handleCancel 会 $emit('ok') 强制刷新列表，防缓存脏数据） */
const handleCancel = () => {
  state.dialogVisible = false
  handleList()
}

/** 提交（原提交合并 regulatorParam/errorInfo/className/regulatorSources/regulatorTargets/resultRule/groupSets/asCommon/isParallelExecution/regulatorChilds；
 *  developRequire 已接 SubmitFooterWithReq.requireCode；developEnvi 来自 vuex getter，子应用无该模块未迁移） */
const onClickSubmit = debounce(async () => {
  const { isValid } = await formRef.value.validate()
  if (isValid) {
    const param = {
      ...state.form,
      // 源 handleOk 提交字段映射：regulatorParam=处理参数(extendParams)、regulatorSources/regulatorTargets=源/目标数据集、
      // resultRule/groupSets/regulatorChilds 原样提交（对象引用来自子组件双向回写）
      regulatorParam: state.form.extendParams,
      regulatorSources: state.form.sourceDataSets,
      regulatorTargets: state.form.targetDataSets,
      resultRule: state.form.resultRule,
      groupSets: state.form.groupSets,
      regulatorChilds: state.form.regulatorChilds,
      errorInfo: {
        errorCode: state.form.errorCode,
        errorMessage: state.form.errorMessage
      },
      // 原 formData.developRequire = this.$refs.reqSelect.requireCode（SubmitFooterWithReq 需求码）
      developRequire: reqSelectRef.value?.requireCode || null
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

/**
 * 导出Sql（已迁移 downFile 下载封装：原 mixin exportBatchSql → downFile('/configuation/regulatorrule/config/exportBatchSql', {ids, sqlType})，
 * 文件名默认 yyyyMMddHHmmss.sql；后端接口暂不通，失败时统一提示，联调后仅后端可用即真实下载）
 */
const onExportBatchSql = async () => {
  const ids = state.selectedRows.map((row) => row.id).join(',')
  try {
    // 真实接口：GET /configuation/regulatorrule/config/exportBatchSql（参数 ids、sqlType=DML）
    await downFile('/configuation/regulatorrule/config/exportBatchSql', { ids, sqlType: 'DML' })
  } catch (e) {
    EPMessageTips('warning', '导出功能已迁移，接口待联调')
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

/** 数据比对（已迁移 DevelopProjectEnviSelectModal：title=比对数据环境选择，原 ref.edit(record) 打开） */
const onEnviSelect = (row) => {
  enviSelectRef.value?.edit(row)
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
</style>
