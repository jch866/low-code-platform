<template>
  <div>
    <!-- 查询区（原页面：应用编码/应用名称/应用分类/归属项目 4 个搜索字段） -->
    <SearchBlock
      :form-model="state.formModel"
      :label-width="130"
      :search-func="handleSearchFunc"
    >
      <ep-form-item prop="systemCode" label="应用编码">
        <ep-input
          v-model="state.formModel.systemCode"
          placeholder="请输入应用编码"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="applicationSystemName" label="应用名称">
        <ep-input
          v-model="state.formModel.applicationSystemName"
          placeholder="请输入应用名称"
          type="text"
        />
      </ep-form-item>
      <ep-form-item prop="systemCategory" label="应用分类">
        <ep-select
          v-model="state.formModel.systemCategory"
          placeholder="请选择应用分类"
        >
          <ep-option label="平台应用" value="platform" />
          <ep-option label="项目应用" value="project" />
          <ep-option label="关联应用" value="refer" />
          <ep-option label="外部应用" value="outter" />
        </ep-select>
      </ep-form-item>
      <!-- 原组件: JSelectProjectByDep（按部门选项目，ref=projectSelect, userOwn），已迁移；v-model 为逗号拼接的 projectCode 串 -->
      <ep-form-item prop="projectCode" label="归属项目">
        <JSelectProjectByDep v-model="state.formModel.projectCode" />
      </ep-form-item>
    </SearchBlock>
    <!-- 列表区（原页面 9 列：#/应用编码/应用名称/应用类型/应用分类/归属项目/应用状态/应用负责人/操作） -->
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

    <!-- 新增/编辑弹窗（原 add.vue，a-modal width=50%，closable=false，取消文案=关闭） -->
    <ep-dialog
      v-model="state.dialogVisible"
      :title="state.title"
      width="50%"
      :show-close="false"
    >
      <ep-form ref="formRef" :model="state.form" :label-width="130">
        <ep-form-item
          prop="applicationName"
          label="应用名称"
          :rules="[{ required: true, message: '请输入应用名称!', trigger: 'blur' }]"
        >
          <ep-input
            v-model="state.form.applicationName"
            placeholder="请输入应用名称"
            type="text"
          />
        </ep-form-item>
        <ep-form-item
          prop="systemName"
          label="应用所属系统"
          :rules="[{ required: true, message: '请选择应用所属系统!', trigger: 'change' }]"
        >
          <!-- 原组件: j-dict-select-tag，表字典 local|develop_system,system_name,system_code -->
          <ep-select
            v-model="state.form.systemName"
            placeholder="请选择应用所属系统"
          >
            <ep-option
              v-for="item in state.systemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item prop="applicationIcon" label="应用图标">
          <!-- 已迁移 Icons 图标选择弹窗（原 addonAfter setting 图标按钮；点按钮开弹窗、选中回写 applicationIcon、关闭回调） -->
          <div class="icon-input">
            <ep-input
              v-model="state.form.applicationIcon"
              placeholder="请输入应用图标"
              type="text"
            />
            <ep-button plain type="primary" @click="onOpenIconSelect">设置图标</ep-button>
          </div>
        </ep-form-item>
        <ep-form-item
          prop="applicationType"
          label="应用所属类型"
          :rules="[{ required: true, message: '请选择应用所属类型!', trigger: 'change' }]"
        >
          <ep-select
            v-model="state.form.applicationType"
            placeholder="请选择应用所属类型"
          >
            <ep-option label="技术" value="technology" />
            <ep-option label="业务" value="business" />
            <ep-option label="公共" value="public" />
          </ep-select>
        </ep-form-item>
      </ep-form>

      <!-- 场景列表（原 add.vue 内嵌 a-table，:pagination=false） -->
      <div class="scene-block">
        <div class="scene-title">
          <span>场景列表</span>
          <ep-button plain type="primary" @click="openSceneAdd(-1)">
            添加场景
          </ep-button>
        </div>
        <ep-table :data="state.sceneList" empty-text="暂无数据">
          <ep-table-column label="编号" width="60" align="center">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </ep-table-column>
          <ep-table-column label="场景名称" prop="sceneName" min-width="150" />
          <ep-table-column label="操作" width="260" align="center">
            <template #default="{ row, $index }">
              <!-- 原页面仅 title=场景配置 时显示「业务节点配置」（打开全屏流程设计），此处保留按钮入口 -->
              <ep-button
                plain
                type="primary"
                class="button-text"
                @click="openFlowDesigner(row)"
              >
                业务节点配置
              </ep-button>
              <ep-button
                plain
                type="primary"
                class="button-text"
                @click="openSceneAdd($index)"
              >
                详情
              </ep-button>
              <ep-button
                plain
                type="primary"
                class="button-text"
                @click="deleteScene($index)"
              >
                删除
              </ep-button>
            </template>
          </ep-table-column>
        </ep-table>
      </div>

      <template #footer>
        <!-- 原弹窗取消按钮文案为「关闭」而非「取消」 -->
        <span class="dialog-footer">
          <ep-button plain @click="onClickClear">关闭</ep-button>
          <ep-button type="primary" @click="onClickSubmit">确定</ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 场景新增/编辑弹窗（原组件: sceneAdd.vue 为 a-drawer 抽屉 width=700，组件库暂无 drawer，暂以弹窗占位） -->
    <ep-dialog
      v-model="state.sceneDialogVisible"
      :title="state.sceneTitle"
      width="700px"
      :show-close="false"
    >
      <ep-form ref="sceneFormRef" :model="state.sceneForm" :label-width="110">
        <ep-form-item
          prop="sceneName"
          label="场景名称"
          :rules="[{ required: true, message: '请输入场景名称!', trigger: 'blur' }]"
        >
          <ep-input
            v-model="state.sceneForm.sceneName"
            placeholder="请输入场景名称"
            type="text"
          />
        </ep-form-item>
        <ep-form-item
          prop="sceneType"
          label="场景类型"
          :rules="[{ required: true, message: '请选择场景类型!', trigger: 'change' }]"
        >
          <!-- 原组件: j-dict-select-tag，表字典 local|develop_system,system_name,system_code -->
          <ep-select v-model="state.sceneForm.sceneType" placeholder="请选择场景类型">
            <ep-option
              v-for="item in state.systemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ep-select>
        </ep-form-item>
      </ep-form>
      <template #footer>
        <span class="dialog-footer">
          <ep-button plain @click="state.sceneDialogVisible = false">关闭</ep-button>
          <ep-button type="primary" @click="confirmScene">确定</ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 业务节点流程设计（原组件: applicationAdd.vue 全屏流程设计，已迁移为 LogicFlow 版 FlowDesigner 包装） -->
    <ApplicationAdd ref="applicationAddRef" @ok="onFlowSaved" />

    <!-- 删除 弹窗（原 a-popconfirm「确定要删除吗？」，接口 dynamic/table/data/delete） -->
    <ep-dialog
      v-model="state.dialogVisibleDel"
      title="删除"
      width="30%"
    >
      <span>确定要删除吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <ep-button @click="state.dialogVisibleDel = false">取消</ep-button>
          <ep-button type="primary" @click="handleDelete">确定</ep-button>
        </span>
      </template>
    </ep-dialog>
    <!-- 已迁移 Icons 图标选择弹窗（应用图标选择入口，选中回写 model.applicationIcon） -->
    <Icons
      :icon-choose-visible="state.iconChooseVisible"
      @choose="onIconChoose"
      @close="state.iconChooseVisible = false"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import SearchBlock from '@/components/searchBlock/searchBlock.vue'
import { SUCCESS_STATUS, PAGE_SIZE, PAGE_NO } from '@/config/config'
import { EPMessageTips, debounce } from '@/utils/utils'
import {
  getApplicationSystemList,
  getApplicationSystemAdd,
  getApplicationSystemEdit,
  getApplicationSystemDelete,
  getApplicationSystemDetail
} from '@/api/lowCodePlatform/paymentProduct'
import TableBlock from '@/components/tableBlock/tableBlock.vue'
import OperationCloumn from '@/components/tableBlock/operationColumn.vue'
import ApplicationAdd from './applicationAdd.vue'
// 按部门选项目（原 develop/components/biz/JSelectProjectByDep，v-model 为逗号拼接的 projectCode）
import JSelectProjectByDep from '@/components/jSelectProjectByDep/JSelectProjectByDep.vue'
// 已迁移组件：Icons 图标选择弹窗（应用图标字段选择）
import Icons from '@/components/icons/Icons.vue'

const formRef = ref(null)
const sceneFormRef = ref(null)
// 业务节点流程设计（applicationAdd 组件实例，暴露 add(id)/close()）
const applicationAddRef = ref(null)

const form = {
  applicationName: '',
  systemName: '',
  applicationIcon: '',
  applicationType: ''
}

/** 应用状态渲染：'0'→草稿状态 / '1'→激活状态 / '2'→失效状态，其他返回 '' */
const formatSystemStatus = (val) => {
  if (val === '0') return '草稿状态'
  if (val === '1') return '激活状态'
  if (val === '2') return '失效状态'
  return ''
}

const state = reactive({
  // 查询（字段名与原页面 queryParam 完全一致）
  formModel: {
    systemCode: '',
    applicationSystemName: '',
    systemCategory: '',
    projectCode: ''
  },
  // 列表
  tableData: [],
  tableColumns: [
    // 原列均带 sorter: true，TableBlock 暂不支持排序透传
    {
      isShow: true,
      prop: 'systemCode',
      label: '应用编码',
      minWidth: 120
    },
    {
      isShow: true,
      prop: 'applicationSystemName',
      label: '应用名称',
      minWidth: 150
    },
    {
      isShow: true,
      prop: 'systemType_dictText',
      label: '应用类型',
      minWidth: 120
    },
    {
      isShow: true,
      prop: 'systemCategory_dictText',
      label: '应用分类',
      minWidth: 120
    },
    {
      isShow: true,
      prop: 'projectCode_dictText',
      label: '归属项目',
      minWidth: 130
    },
    {
      isShow: true,
      prop: 'systemStatus',
      label: '应用状态',
      formatter: ({ row }) => formatSystemStatus(row.systemStatus),
      minWidth: 110
    },
    {
      isShow: true,
      prop: 'systemOwner_dictText',
      label: '应用负责人',
      minWidth: 110
    },
    {
      isShow: true,
      slot: 'operation',
      label: '操作',
      minWidth: 150
    }
  ],
  // 操作列（原页面无 v-has 权限码；无行内更多下拉）
  tableOperation: [
    {
      text: '编辑',
      methods: (row) => handleEdit(row)
    },
    {
      text: '删除',
      methods: (row) => onDelete(row)
    }
  ],
  // 顶部按钮：创建应用（原按钮包在 router-link /system/edit 中并同时打开弹窗，此处省略跳转仅保留弹窗行为）
  buttonGroups: [
    {
      text: '创建应用',
      methods: () => handleAdd()
    }
  ],
  // 分页器（原 mixin 分页文案「{start}-{end} 共{total}条」，由组件库统一渲染）
  paging: {
    total: 0,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  // 表字典 local|develop_system,system_name,system_code 的下拉选项
  // TODO: 联调后接入表字典 local|develop_system,system_name,system_code
  systemOptions: [],
  // 新增/编辑弹窗
  dialogVisible: false,
  title: '',
  id: '',
  form: { ...form },
  // 图标选择弹窗显隐（已迁移 Icons）
  iconChooseVisible: false,
  // 场景列表（原 add.vue 内嵌场景表格，确认后写入 sceneList）
  sceneList: [],
  // 场景弹窗（原 sceneAdd.vue 抽屉）
  sceneDialogVisible: false,
  sceneTitle: '',
  sceneIndex: -1,
  sceneForm: { sceneName: '', sceneType: '' },
  // 删除
  dialogVisibleDel: false
})

/** 获取列表数据（原列表接口 dynamic/table/data/listObject 无前导斜杠，tableName 固定 applicationSystem） */
const handleList = async () => {
  const param = {
    pageSize: state.paging.pageSize,
    pageNo: state.paging.pageNo,
    tableName: 'applicationSystem',
    ...state.formModel
  }
  const res = await getApplicationSystemList(param)
  if (res.returnCode === SUCCESS_STATUS) {
    state.tableData = res.result
    // 原 mixin loadData 对 total 的取值存在 res.result.records || res.result 兼容逻辑，此处按标准 totalCount 处理
    state.paging.total = res.totalCount
  }
}

/** 清空数据 */
const clearDate = () => {
  formRef.value && formRef.value.resetFields()
}

/** 打开图标选择弹窗（已迁移 Icons，原 addonAfter「设置图标」按钮） */
const onOpenIconSelect = () => {
  state.iconChooseVisible = true
}

/** 图标选中回调（原 @choose → model.applicationIcon = 图标类名；与源差异：值为 ep-i-* 图标类名而非 antd 图标名） */
const onIconChoose = (icon) => {
  state.form.applicationIcon = icon
  state.iconChooseVisible = false
}

const handleAdd = () => {
  clearDate()
  state.dialogVisible = true
  state.id = ''
  state.title = '应用管理新增'
  state.form = { ...form }
  state.sceneList = []
}

/** 编辑（原弹窗标题=「应用管理编辑」；原 handleEdit 传 record.dataValueObject，内部 JSON.parse(dataValue) 回显） */
const handleEdit = (row) => {
  clearDate()
  state.dialogVisible = true
  state.title = '应用管理编辑'
  state.id = row.id
  const dataValueObject = row.dataValueObject || {}
  try {
    state.form = { ...form, ...JSON.parse(dataValueObject.dataValue || '{}') }
  } catch (e) {
    state.form = { ...form }
  }
  // 原编辑时经 GET /application/config/detail?ids={sceneIds} 拉取场景列表
  initSceneList(row.id)
}

/** 获取场景列表（原接口 /application/config/detail?ids=） */
const initSceneList = async (ids) => {
  const res = await getApplicationSystemDetail({ ids })
  if (res.returnCode === SUCCESS_STATUS) {
    state.sceneList = res.result || []
  }
}

/** 场景新增/详情（原 sceneAdd.vue 抽屉：新增场景 / 编辑场景，确认后 $emit('ok') 写入 sceneList） */
const openSceneAdd = (index) => {
  state.sceneIndex = index
  if (index >= 0) {
    state.sceneTitle = '编辑场景'
    // 原编辑回显 pick('sceneName','sceneType')
    state.sceneForm = {
      sceneName: state.sceneList[index].sceneName,
      sceneType: state.sceneList[index].sceneType
    }
  } else {
    state.sceneTitle = '新增场景'
    state.sceneForm = { sceneName: '', sceneType: '' }
  }
  state.sceneDialogVisible = true
}

/** 场景确认（原 sceneAdd 不发请求，由父组件写入 sceneList） */
const confirmScene = async () => {
  const { isValid } = await sceneFormRef.value.validate()
  if (isValid) {
    if (state.sceneIndex >= 0) {
      state.sceneList[state.sceneIndex] = { ...state.sceneForm }
    } else {
      state.sceneList.push({ ...state.sceneForm })
    }
    state.sceneDialogVisible = false
  }
}

/** 场景删除（原页面为本地 splice，不发请求） */
const deleteScene = (index) => {
  state.sceneList.splice(index, 1)
}

/** 业务节点配置：打开全屏流程设计（原 add.vue 中打开 applicationAdd 传场景行 id） */
const openFlowDesigner = (row) => {
  applicationAddRef.value?.add(row.id || row.sceneId || '')
}

/** 业务节点流程保存成功回调（原 saveFlow 成功后关闭，此处刷新场景列表） */
const onFlowSaved = () => {
  if (state.id) initSceneList(state.id)
}

/** 取消 */
const onClickClear = () => {
  state.dialogVisible = false
}

/** 提交（原新增 POST /application/config/add、编辑 PUT /application/config/edit） */
const onClickSubmit = debounce(async () => {
  const { isValid } = await formRef.value.validate()
  if (isValid) {
    const param = state.form
    let apiUrl = ''
    if (state.id) {
      apiUrl = getApplicationSystemEdit
      param.id = state.id
    } else {
      apiUrl = getApplicationSystemAdd
    }
    const res = await apiUrl(param)
    if (res.returnCode === SUCCESS_STATUS) {
      EPMessageTips('success', state.id ? '编辑成功' : '新增成功')
      handleList()
      state.dialogVisible = false
    }
  }
})

/** 删除（原 handleDelete(record.id) → dynamic/table/data/delete） */
const onDelete = (row) => {
  state.id = row.id
  state.dialogVisibleDel = true
}

/** 确认 删除 */
const handleDelete = debounce(async () => {
  const param = { id: state.id }
  const res = await getApplicationSystemDelete(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '删除成功')
    state.dialogVisibleDel = false
    handleList()
  }
})

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

/**
 * 查询/重置（SearchBlock 重置会回调 searchFunc('reset')）
 * 原页面 searchReset() 清空后仍强制保留 tableName='applicationSystem'，并在重置时手动清 projectSelect.projectNames
 */
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
.icon-input {
  display: flex;
  gap: 8px;
  align-items: center;
}
.scene-block {
  margin-top: 8px;
}
.scene-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
}
.placeholder-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  background: #f7f9fd;
}
</style>
