<template>
  <div>
    <!-- 查询区（原搜索字段：systemName/processorName/className/scriptType，scriptType 位于展开区） -->
    <SearchBlock
      :form-model="state.formModel"
      :label-width="130"
      :search-func="handleSearchFunc"
    >
      <ep-form-item prop="systemName" label="所属系统">
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
      <ep-form-item prop="processorName" label="处理器名称">
        <ep-input
          v-model="state.formModel.processorName"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="className" label="处理器类">
        <ep-input
          v-model="state.formModel.className"
          placeholder="请输入"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="scriptType" label="脚本类型">
        <ep-select
          v-model="state.formModel.scriptType"
          placeholder="请选择"
        >
          <ep-option
            v-for="item in state.scriptTypeList"
            :key="item.lemmaItem"
            :label="item.itemName"
            :value="item.lemmaItem"
          />
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

    <!-- 新增编辑 弹窗（原 a-modal width=1200，footer 已迁移 SubmitFooterWithReq 带开发需求码） -->
    <ep-dialog
      v-model="state.dialogVisible"
      :title="state.title"
      width="1200px"
    >
      <ep-form ref="formRef" :model="state.form" :label-width="150">
        <ep-form-item
          prop="systemName"
          label="所属系统"
          :rules="[{ required: true, message: '请选择所属系统!', trigger: 'change' }]"
        >
          <!-- TODO: 联调后接入表字典 local|develop_system,system_name,system_code -->
          <ep-select v-model="state.form.systemName" placeholder="请选择">
            <ep-option
              v-for="item in state.systemOptions"
              :key="item.lemmaItem"
              :label="item.itemName"
              :value="item.lemmaItem"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item
          prop="processorName"
          label="处理器名称"
          :rules="[{ required: true, message: '请输入规则处理器名称!', trigger: 'blur' }]"
        >
          <!-- 原外层 a-popover 红字提示 -->
          <span class="field-hint">建议处理器名称长度控制在8位</span>
          <ep-input v-model="state.form.processorName" placeholder="请输入" type="text" />
        </ep-form-item>
        <ep-form-item
          prop="className"
          label="处理器类"
          :rules="[{ required: true, message: '请输入规则处理器类!', trigger: 'blur' }]"
        >
          <ep-input v-model="state.form.className" placeholder="请输入" type="text" />
        </ep-form-item>
        <!-- 类路径：仅脚本类型为 JAVA 时显示 -->
        <ep-form-item v-show="state.form.scriptType === 'JAVA'" prop="classPath" label="处理器类路径">
          <ep-input v-model="state.form.classPath" placeholder="请输入" type="text" />
        </ep-form-item>
        <ep-form-item label="数据源信息">
          <div class="inline-fields">
            <span class="inline-label">源数据个数</span>
            <ep-input-number v-model="state.form.sourceAcct" :min="0" />
            <span class="inline-label">目标数据个数</span>
            <ep-input-number v-model="state.form.targetAcct" :min="0" />
          </div>
        </ep-form-item>
        <!-- 扩展参数（动态行：paramName/dataType/paramDefaultValue/require） -->
        <ep-form-item label="扩展参数">
          <div class="param-list">
            <div
              v-for="(param, index) in state.regulatorInfoParams"
              :key="index"
              class="param-row"
            >
              <ep-input v-model="param.paramName" placeholder="参数名" type="text" />
              <ep-select v-model="param.dataType" placeholder="请选择">
                <ep-option label="固定数据" value="FIXED" />
                <ep-option label="数据字典" value="DICT" />
              </ep-select>
              <!-- 原组件: ./modules/param/FixedData（固定数据）/ ./modules/param/DictData（数据字典），待迁移，暂用输入框占位 -->
              <ep-input v-model="param.paramDefaultValue" placeholder="默认值" type="text" />
              <ep-switch
                v-model="param.require"
                active-text="必填"
                inactive-text="非必填"
              />
              <ep-button plain type="danger" @click="onRemoveParam(index)">删除行</ep-button>
            </div>
            <div v-if="!state.regulatorInfoParams.length" class="param-empty">
              没有设置扩展参数数据
            </div>
            <ep-button plain type="primary" @click="onAddParam">新增</ep-button>
          </div>
        </ep-form-item>
        <ep-form-item
          prop="scriptType"
          label="脚本类型"
          :rules="[{ required: true, message: '请输入规则处理器脚本类型!', trigger: 'change' }]"
        >
          <ep-select v-model="state.form.scriptType" placeholder="请选择" @change="onScriptTypeChange">
            <ep-option
              v-for="item in state.scriptTypeList"
              :key="item.lemmaItem"
              :label="item.itemName"
              :value="item.lemmaItem"
            />
          </ep-select>
        </ep-form-item>
        <!-- 脚本内容：仅 GROOVY 时显示；已迁移 JCodeEditor（原 language=Java, lineNumbers, fullScreen） -->
        <ep-form-item v-show="state.form.scriptType === 'GROOVY'" prop="scriptContent" label="脚本内容">
          <JCodeEditor
            v-model="state.form.scriptContent"
            language="Java"
            :line-numbers="true"
            :full-screen="true"
            placeholder="请输入脚本内容"
          />
        </ep-form-item>
      </ep-form>
      <template #footer>
        <!-- 已迁移 SubmitFooterWithReq：requireCode 输入 + 取消/提交（事件接回原 onClickClear/onClickSubmit） -->
        <SubmitFooterWithReq
          ref="reqSelectRef"
          :require-code-param="state.requireCodeParam"
          @ok="onClickSubmit"
          @cancel="onClickClear"
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

    <!-- 已迁移：ParentProcessRuleInfoList 查看关联引用（原 handRegulatorProcess → regulatorInfoPkValue=row.id +
         vuex parentProcessData=true 控制显隐，去 vuex 化改为 ref.edit(row) 打开，组件内 ep-dialog v-model 管理显隐） -->
    <ParentProcessRuleInfoList ref="parentProcessRef" />

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
  getRegulatorInfoList,
  getRegulatorInfoAdd,
  getRegulatorInfoEdit,
  getRegulatorInfoDelete,
  getRegulatorInfoDeleteBatch
} from '@/api/lowCodePlatform/regulatorInfo'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'
// 已迁移组件：JCodeEditor 轻量脚本编辑器 / SubmitFooterWithReq 提交底栏（开发需求码） / DevelopProjectEnviSelectModal 比对数据环境选择
import JCodeEditor from '@/components/jCodeEditor/JCodeEditor.vue'
import SubmitFooterWithReq from '@/components/submitFooterWithReq/SubmitFooterWithReq.vue'
import DevelopProjectEnviSelectModal from '@/components/developProjectEnviSelectModal/DevelopProjectEnviSelectModal.vue'
// 已迁移：ParentProcessRuleInfoList 查看关联引用（原 ../../develop/modules/BranchSubmit/parentProcessRuleInfoList.vue）
import ParentProcessRuleInfoList from '@/components/parentProcess/ParentProcessRuleInfoList.vue'
import downFile from '@/utils/downFile'

const formRef = ref(null)
// SubmitFooterWithReq（读取 requireCode 作为 developRequire 提交参数）与比对环境选择弹窗
const reqSelectRef = ref(null)
const enviSelectRef = ref(null)
// 查看关联引用弹窗（ParentProcessRuleInfoList，ref.edit(row) 打开）
const parentProcessRef = ref(null)
const router = useRouter()

// TODO: 联调后接入表字典 local|develop_system,system_name,system_code（所属系统下拉，联调前保持为空）
const systemOptions = []

// 权限码（原 v-has）：新增 rule:processor:add；批量删除/行删除 rule:processor:delete；
// 导出Sql rule:processor:export；行编辑 rule:edit；历史记录 rule:processor:history；
// 数据比对 rule:processor:compare；查看关联引用（无权限码）

const form = {
  systemName: '',
  processorName: '',
  className: '',
  classPath: '',
  sourceAcct: '1',
  targetAcct: '1',
  scriptType: '',
  scriptContent: ''
}

const state = reactive({
  // 查询
  formModel: {
    systemName: '',
    processorName: '',
    className: '',
    scriptType: ''
  },
  // 所属系统表字典选项（联调前为空）
  systemOptions,
  // 数据字典
  scriptTypeList: [],
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
      prop: 'processorName',
      label: '处理器名称',
      minWidth: 150
    },
    {
      isShow: true,
      prop: 'className',
      label: '处理器类',
      minWidth: 150
    },
    {
      isShow: true,
      prop: 'scriptType_dictText',
      label: '脚本类型',
      width: 120
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
      text: '删除', // 权限码 rule:processor:delete
      methods: (row) => onDelete(row)
    },
    {
      text: '历史记录', // 权限码 rule:processor:history
      methods: (row) => onHistory(row)
    },
    {
      text: '数据比对', // 权限码 rule:processor:compare
      methods: (row) => onEnviSelect(row)
    },
    {
      text: '查看关联引用', // 无权限码
      methods: (row) => onRegulatorProcess(row)
    }
  ],
  // 添加按钮（批量操作）
  buttonGroups: [
    {
      text: '新增', // 权限码 rule:processor:add
      methods: () => handleAdd()
    },
    {
      text: '批量删除', // 权限码 rule:processor:delete；原 mixin batchDel
      methods: () => onBatchDelete(),
      disabled: true
    },
    {
      text: '导出Sql', // 权限码 rule:processor:export；原 mixin exportBatchSql
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
  // 新增编辑 弹窗
  dialogVisible: false,
  title: '',
  id: '',
  form: { ...form },
  // 开发需求码（原编辑回显 model.developRequire 传入 SubmitFooterWithReq.requireCodeParam）
  requireCodeParam: '',
  // 扩展参数动态行（regulatorInfoParams）
  regulatorInfoParams: [],
  // 删除
  dialogVisibleDel: false,
  deleteIds: []
})

/** 获取列表数据 */
const handleList = async () => {
  const param = {
    pageSize: state.paging.pageSize,
    pageNo: state.paging.pageNo,
    ...state.formModel
  }
  const res = await getRegulatorInfoList(param)
  if (res.returnCode === SUCCESS_STATUS) {
    state.tableData = res.result
    state.paging.total = res.totalCount
  }
}

/** 数据字典（regulator_script_type） */
const initDict = async () => {
  const res = await getMultiDictsMore('regulator_script_type')
  if (res.returnCode === SUCCESS_STATUS) {
    state.scriptTypeList = res.result.regulator_script_type || []
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

/** 清空数据（原 edit 回显仅 pick 以下字段，regulatorInfoParams 原实现未回显，此处保持一致） */
const pickForm = (record) => ({
  systemName: record.systemName || '',
  processorName: record.processorName || '',
  className: record.className || '',
  classPath: record.classPath || '',
  scriptType: record.scriptType || '',
  scriptContent: record.scriptContent || '',
  sourceAcct: record.sourceAcct || '1',
  targetAcct: record.targetAcct || '1'
})

/** 编辑（回显开发需求码给 SubmitFooterWithReq，原 $refs.reqSelect.requireCode=record.developRequire） */
const handleEdit = (row) => {
  state.dialogVisible = true
  state.title = '规则处理器配置页面编辑'
  state.id = row.id
  state.form = pickForm(row)
  state.requireCodeParam = row.developRequire || ''
  state.regulatorInfoParams = []
}

/** 新增（原 mixin handleAdd，title = description + "新增"） */
const handleAdd = () => {
  state.dialogVisible = true
  state.title = '规则处理器配置页面新增'
  state.id = ''
  state.form = { ...form }
  state.requireCodeParam = ''
  state.regulatorInfoParams = []
}

/** 脚本类型联动：GROOVY→显示脚本内容隐藏类路径；JAVA→显示类路径隐藏脚本内容；其他→都隐藏 */
const onScriptTypeChange = () => {
  // 显隐由模板中 scriptType 判断驱动，无需额外处理
}

/** 扩展参数：添加行 */
const onAddParam = () => {
  state.regulatorInfoParams.push({
    paramName: '',
    dataType: 'FIXED',
    paramDefaultValue: '',
    require: false
  })
}

/** 扩展参数：删除行 */
const onRemoveParam = (index) => {
  state.regulatorInfoParams.splice(index, 1)
}

/** 取消 */
const onClickClear = () => {
  state.dialogVisible = false
}

/** 提交（原提交合并 formData.regulatorInfoParams/scriptContent + developRequire/developEnvi；
 *  developRequire 已接 SubmitFooterWithReq.requireCode；developEnvi 来自 vuex getter，子应用无该模块未迁移） */
const onClickSubmit = debounce(async () => {
  const { isValid } = await formRef.value.validate()
  if (isValid) {
    const param = {
      ...state.form,
      regulatorInfoParams: state.regulatorInfoParams,
      // 原 formData.developRequire = this.$refs.reqSelect.requireCode（SubmitFooterWithReq 需求码）
      developRequire: reqSelectRef.value?.requireCode || null
    }
    // 原 add 为 post /configuation/regulatorinfo/config/add；edit 为 put /configuation/regulatorinfo/config/edit
    let apiUrl = ''
    if (state.id) {
      apiUrl = getRegulatorInfoEdit
      param.id = state.id
    } else {
      apiUrl = getRegulatorInfoAdd
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

/** 批量删除（原 mixin batchDel → /configuation/regulatorinfo/config/deleteBatch） */
const onBatchDelete = () => {
  state.deleteIds = state.selectedRows.map((row) => row.id)
  state.id = ''
  state.dialogVisibleDel = true
}

/** 确认删除 */
const handleDelete = debounce(async () => {
  if (state.deleteIds.length) {
    const res = await getRegulatorInfoDeleteBatch({ ids: state.deleteIds.join(',') })
    if (res.returnCode === SUCCESS_STATUS) {
      EPMessageTips('success', '批量删除成功')
      state.dialogVisibleDel = false
      state.selectedRows = []
      handleList()
    }
  } else {
    const param = { id: state.id }
    const res = await getRegulatorInfoDelete(param)
    if (res.returnCode === SUCCESS_STATUS) {
      EPMessageTips('success', '删除成功')
      state.dialogVisibleDel = false
      handleList()
    }
  }
})

/**
 * 导出Sql（已迁移 downFile 下载封装：原 mixin exportBatchSql → downFile('/configuation/regulatorinfo/config/exportBatchSql', {ids, sqlType})，
 * 文件名默认 yyyyMMddHHmmss.sql；后端接口暂不通，失败时统一提示，联调后仅后端可用即真实下载）
 */
const onExportBatchSql = async () => {
  const ids = state.selectedRows.map((row) => row.id).join(',')
  try {
    // 真实接口：GET /configuation/regulatorinfo/config/exportBatchSql（参数 ids、sqlType=DML）
    await downFile('/configuation/regulatorinfo/config/exportBatchSql', { ids, sqlType: 'DML' })
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

/** 查看关联引用（已迁移 ParentProcessRuleInfoList：原 handRegulatorProcess → regulatorInfoPkValue=val.id + vuex
 * parentProcessData=true 显示，去 vuex 化改为 ref.edit(row)，显隐由组件内 ep-dialog v-model 管理） */
const onRegulatorProcess = (row) => {
  parentProcessRef.value?.edit(row)
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

/** 查询 重置（原 mixin searchReset 直接清空后回第一页） */
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
}
.inline-label {
  color: #666;
}
.param-list {
  width: 100%;
}
.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.param-empty {
  color: #999;
  margin-bottom: 8px;
}
</style>
