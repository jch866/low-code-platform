<template>
  <div class="pay-biz-page">
    <!-- 左侧：业务/交易树导航（原组件: PayListDisplay.vue，a-tree checkable + 搜索框） -->
    <div class="left-tree-panel">
      <div class="tree-search">
        <ep-input
          v-model="state.keyWord"
          placeholder="请输入交易名称"
          type="text"
          @keyup.enter="onTreeSearch"
        />
        <ep-button plain type="primary" @click="onTreeSearch">搜索</ep-button>
      </div>
      <div class="tree-wrap">
        <ep-tree
          ref="treeRef"
          :data="state.treeData"
          node-key="key"
          show-checkbox
          :check-strictly="true"
          :props="{ label: 'title', children: 'children' }"
          default-expand-all
          @node-click="onNodeClick"
          @check="onTreeCheck"
        />
      </div>
      <!-- 树操作下拉（原 LC0350 树操作：父子关联/取消关联/全部勾选/取消全选/展开所有/合并所有） -->
      <div class="tree-operation">
        <ep-popover trigger="click" effect="light">
          <template #reference>
            <ep-button plain type="primary" class="button-text">树操作</ep-button>
          </template>
          <div
            v-for="item in state.treeOperations"
            :key="item"
            class="tree-operation-item"
            @click="onTreeOperation(item)"
          >
            {{ item }}
          </div>
        </ep-popover>
      </div>
    </div>

    <!-- 右侧：交易节点列表 + 基本信息 tabs -->
    <div class="right-content-panel">
      <!-- 顶部提示条（原 LC0333 当前选择： + 节点 title + LC0334 取消选择） -->
      <div class="selected-tip">
        <template v-if="state.currentNode">
          <span>当前选择：{{ state.currentNode.title }}</span>
          <ep-button plain type="primary" class="button-text" @click="onClearSelect">
            取消选择
          </ep-button>
        </template>
        <span v-else>当前选择：暂未选中节点</span>
      </div>

      <!-- 操作按钮区（权限码见各行注释） -->
      <div class="action-bar">
        <!-- 权限码: product:pay:buss:add -->
        <ep-button type="primary" @click="onAddTrans(1)">添加交易</ep-button>
        <!-- 权限码: product:pay:buss:add -->
        <ep-button type="primary" plain @click="onAddTrans(2)">添加子交易</ep-button>
        <!-- 权限码: product:pay:buss:export -->
        <ep-button plain @click="onPlaceholder('导出 Excel（product/payment/exportXls）')">
          导出
        </ep-button>
        <!-- 权限码: product:pay:buss:import -->
        <ep-button plain @click="onPlaceholder('导入 Excel（product/payment/importExcel）')">
          导入
        </ep-button>
        <!-- 权限码: product:pay:buss:delete（原批量删除数据源=树勾选 checkedKeys，非表格选中行） -->
        <ep-button type="danger" plain @click="onBatchDelete">批量删除</ep-button>
        <ep-button plain @click="loadTree">刷新</ep-button>
        <!-- 权限码: product:pay:buss:module:add（原 PayModel.vue 独立模块管理页，已迁移为 ModuleInfoModal 弹窗） -->
        <ep-button plain @click="onOpenModuleManage">模块管理</ep-button>
      </div>

      <!-- 交易节点列表（原页面无 a-table，此处按右侧内容承载交易节点数据） -->
      <ep-table
        :data="state.transList"
        empty-text="暂无数据"
        @row-click="onRowClick"
      >
        <ep-table-column label="交易名称" prop="transName" min-width="130" />
        <ep-table-column label="交易编码" prop="transCode" min-width="120" />
        <ep-table-column label="交易类型" min-width="100" align="center">
          <template #default="{ row }">
            {{ formatTransCategory(row.transCategory) }}
          </template>
        </ep-table-column>
        <ep-table-column label="报文编号" prop="msgType" min-width="110" />
        <ep-table-column label="交易描述" prop="description" min-width="150" />
        <ep-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <!-- 权限码: product:pay:buss:edit -->
            <ep-button plain type="primary" class="button-text" @click.stop="onEditTrans(row)">
              编辑
            </ep-button>
            <!-- 权限码: product:pay:buss:delete -->
            <ep-button plain type="primary" class="button-text" @click.stop="onDeleteTrans(row)">
              删除
            </ep-button>
          </template>
        </ep-table-column>
      </ep-table>

      <!-- 右侧 tabs（原 key1 基本信息 / key2 系统交互 / key3 业务流程 / key4 业务模型 / key5 智能路由 / key6 系统适配） -->
      <ep-tab v-model="state.activeTab" class="right-tabs">
        <ep-tab-pane name="1" label="基本信息">
          <ep-form ref="editFormRef" :model="state.editForm" :label-width="120">
            <ep-form-item
              prop="transName"
              label="交易名称"
              :rules="[{ required: true, message: '请输入交易名称!', trigger: 'blur' }]"
            >
              <ep-input v-model="state.editForm.transName" placeholder="请输入交易名称" type="text" />
            </ep-form-item>
            <ep-form-item label="上级交易名称">
              <!-- 已迁移：a-tree-select → TreeSelect 包装（LC0347 上级交易名称，placeholder=LC0386 无）；
                   v-model=parentId（树节点 key）；源 disable 恒为 true，仅回显展示；树=queryTransTreeList（GET /product/payment/queryTransList） -->
              <TreeSelect
                v-model="state.editForm.parentId"
                :tree-data="state.treeData"
                disabled
                placeholder="无"
              />
            </ep-form-item>
            <ep-form-item
              prop="transCode"
              label="交易编码"
              :rules="[{ required: true, message: '请输入交易编码!', trigger: 'blur' }]"
            >
              <ep-input v-model="state.editForm.transCode" placeholder="请输入交易编码" type="text" />
            </ep-form-item>
            <ep-form-item
              prop="transCategory"
              label="交易类型"
              :rules="[{ required: true, message: '请选择交易类型!', trigger: 'change' }]"
            >
              <ep-radio-group v-model="state.editForm.transCategory">
                <ep-radio value="1">交易服务</ep-radio>
                <ep-radio value="2">交易场景</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item label="报文编号">
              <ep-input v-model="state.editForm.msgType" placeholder="请输入报文编号" type="text" />
            </ep-form-item>
            <ep-form-item label="业务描述">
              <ep-input
                v-model="state.editForm.description"
                placeholder="请输入业务描述"
                type="textarea"
                :rows="3"
              />
            </ep-form-item>
            <ep-form-item>
              <!-- 权限码: product:pay:buss:edit（原 LC0346 修改并保存 → submitCurrForm PUT /product/payment/edit） -->
              <ep-button type="primary" @click="onSubmitCurrForm">修改并保存</ep-button>
            </ep-form-item>
          </ep-form>
        </ep-tab-pane>
        <!--
          保存 payload 说明（对照源 submitCurrForm）：源保存交易 = Object.assign(currSelected, 表单值) 后
          PUT /product/payment/edit，payload 仅含 tab1 基本信息表单字段 + 树节点原始字段；
          tab2~tab6 面板（系统交互/业务流程/业务模型/智能路由/系统适配）均为展示型面板，
          无子表数组参与保存 payload 合并（源中不存在交互配置/流程配置/模块关联子表）。
        -->
        <!-- 原 tab2 系统交互（LC0357）：硬编码渠道/核心/通道/下游接口链接卡片 → TransChannelPanel -->
        <ep-tab-pane name="2" label="系统交互">
          <TransChannelPanel />
        </ep-tab-pane>
        <!-- 原 tab3 业务流程（LC0358）：源 PayList.vue 未实现 tabKey==='3' 内容面板（任务预期的「流程配置子表」在源中不存在），保持空面板 -->
        <ep-tab-pane name="3" label="业务流程">
          <div class="empty-tab-pane">源面板为空（PayList.vue 未实现 tabKey=3 内容）</div>
        </ep-tab-pane>
        <!-- 原 tab4 业务模型（LC0345）：moduleTreeData 模块卡片（tableName=child.virtualTableName）→ TransModelPanel（tab 切换加载） -->
        <ep-tab-pane name="4" label="业务模型">
          <TransModelPanel :active="state.activeTab === '4'" />
        </ep-tab-pane>
        <!-- 原 tab5 智能路由（LC0359）：源为空面板 -->
        <ep-tab-pane name="5" label="智能路由">
          <div class="empty-tab-pane">源面板为空（PayList.vue 未实现 tabKey=5 内容）</div>
        </ep-tab-pane>
        <!-- 原 tab6 系统适配（LC0360）：源为空面板 -->
        <ep-tab-pane name="6" label="系统适配">
          <div class="empty-tab-pane">源面板为空（PayList.vue 未实现 tabKey=6 内容）</div>
        </ep-tab-pane>
      </ep-tab>
    </div>

    <!-- 新增交易弹窗（原组件: PayInfoModal.vue，a-modal width=800，仅新增恒 POST /product/payment/add） -->
    <ep-dialog
      v-model="state.addDialogVisible"
      :title="state.addTitle"
      width="800px"
      :show-close="false"
    >
      <ep-form ref="addFormRef" :model="state.addForm" :label-width="120">
        <ep-form-item
          prop="transName"
          label="交易名称"
          :rules="[{ required: true, message: '请输入交易名称!', trigger: 'blur' }]"
        >
          <ep-input v-model="state.addForm.transName" placeholder="请输入交易名称" type="text" />
        </ep-form-item>
        <ep-form-item label="交易编码">
          <ep-input v-model="state.addForm.transCode" placeholder="请输入交易编码" type="text" />
        </ep-form-item>
        <!-- 原字段 :hidden="seen"：添加子交易/树右键添加时显示上级交易，根新增时隐藏 -->
        <ep-form-item v-if="!state.parentSeen" label="上级交易">
          <!-- 已迁移：a-tree-select → TreeSelect 包装（树=transTree from queryIdTree，见 api/lowCodePlatform/paymentBiz.js 注释：
               源 PayInfoModal 实际引用 @/api/api 的 queryIdTree → GET /sys/sysDepart/queryIdTree，与 /product/payment/queryIdTree 并存，
               mock 按交易树同源返回）；v-model=parentId（树节点 key），placeholder=请选择+LC0388 上级交易 -->
          <TreeSelect
            v-model="state.addForm.parentId"
            :tree-data="state.addTreeData"
            placeholder="请选择上级交易"
          />
        </ep-form-item>
        <ep-form-item label="交易类型">
          <ep-radio-group v-model="state.addForm.transCategory">
            <ep-radio value="1">交易服务</ep-radio>
            <ep-radio value="2">交易场景</ep-radio>
          </ep-radio-group>
        </ep-form-item>
        <ep-form-item label="报文编号">
          <ep-input v-model="state.addForm.msgType" placeholder="请输入报文编号" type="text" />
        </ep-form-item>
        <ep-form-item label="交易描述">
          <ep-input
            v-model="state.addForm.description"
            placeholder="请输入交易描述"
            type="textarea"
            :rows="3"
          />
        </ep-form-item>
      </ep-form>
      <template #footer>
        <!-- 原 modal 取消按钮文案为 common.close「关闭」 -->
        <span class="dialog-footer">
          <ep-button plain @click="state.addDialogVisible = false">关闭</ep-button>
          <ep-button type="primary" @click="onAddSubmit">确定</ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 批量删除确认弹窗（原 batchDel confirm：LC0381 确认删除 / LC0382 确定要删除所选中的 N 条数据，以及子节点数据吗?） -->
    <ep-dialog v-model="state.batchDelVisible" title="确认删除" width="30%">
      <span>确定要删除所选中的 {{ state.checkedKeys.length }} 条数据，以及子节点数据吗?</span>
      <template #footer>
        <span class="dialog-footer">
          <ep-button @click="state.batchDelVisible = false">取消</ep-button>
          <ep-button type="primary" @click="handleBatchDelete">确定</ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 删除确认弹窗（原树右键删除 / 行删除 deleteByTransId({id})，成功 LC0379 删除成功!） -->
    <ep-dialog v-model="state.delVisible" title="确认删除" width="30%">
      <span>确定要删除吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <ep-button @click="state.delVisible = false">取消</ep-button>
          <ep-button type="primary" @click="handleDelete">确定</ep-button>
        </span>
      </template>
    </ep-dialog>

    <!-- 占位弹窗（导出/导入等复杂功能） -->
    <ep-dialog v-model="state.placeholderVisible" title="待迁移功能" width="30%">
      <div class="placeholder-block">{{ state.placeholderText }}</div>
      <template #footer>
        <ep-button plain @click="state.placeholderVisible = false">关闭</ep-button>
      </template>
    </ep-dialog>

    <!--
      模块管理弹窗（原 PayModel.vue 独立模块管理页 + payment/modules/ModuleInfoModal.vue 迁移）：
      checkInfo 传当前选中业务节点（对照源消费方 PayModel.vue handleAdd(2) 传本页树 selectedKeys 作上级预填参数的映射，
      此处取页面左树选中交易节点 state.currentNode，弹窗内模块树无选中时回退作「添加子模块」上级预填）；
      @ok 按源消费方行为为刷新（原 @ok="loadTree" 刷新模块树，模块树在弹窗内自刷新，此处刷新交易列表）
    -->
    <ModuleInfoModal ref="moduleModalRef" :check-info="state.currentNode" @ok="onModuleManageOk" />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { EPMessageTips, debounce } from '@/utils/utils'
import {
  queryTransTreeList,
  queryIdTree,
  searchTransByKeywords,
  getPaymentTransList,
  getPaymentAdd,
  getPaymentEdit,
  deleteByTransId,
  getPaymentDeleteBatch
} from '@/api/lowCodePlatform/paymentBiz'
import TreeSelect from '@/components/treeSelect/TreeSelect.vue'
// 模块管理弹窗（原 PayModel.vue / payment/modules/ModuleInfoModal.vue 迁移）
import ModuleInfoModal from './modules/moduleInfoModal.vue'
// 系统交互面板（原 PayList.vue tab key=2 硬编码渠道/核心/通道/下游接口链接卡片）
import TransChannelPanel from './modules/transChannelPanel.vue'
// 业务模型面板（原 PayList.vue tab key=4 moduleTreeData 模块卡片，tab 切换加载）
import TransModelPanel from './modules/transModelPanel.vue'

const treeRef = ref(null)
const addFormRef = ref(null)
const editFormRef = ref(null)
const moduleModalRef = ref(null)

const addForm = {
  transName: '',
  transCode: '',
  parentId: '',
  transCategory: '1',
  msgType: '',
  description: ''
}

const editForm = {
  transName: '',
  transCode: '',
  parentId: '',
  transCategory: '1',
  msgType: '',
  description: ''
}

/** 交易类型渲染：'1'→交易服务 / '2'→交易场景 */
const formatTransCategory = (val) => {
  if (val === '1') return '交易服务'
  if (val === '2') return '交易场景'
  return val || ''
}

const state = reactive({
  // 左侧树
  keyWord: '',
  treeData: [],
  // 树勾选 keys（原批量删除数据源 = 树 checkedKeys，非表格选中行）
  checkedKeys: [],
  // 当前选中节点
  currentNode: null,
  // 树操作下拉项（原 LC0351~LC0356）
  treeOperations: ['父子关联', '取消关联', '全部勾选', '取消全选', '展开所有', '合并所有'],
  // 右侧交易节点列表
  transList: [],
  // 右侧 tabs（默认 key1 基本信息）
  activeTab: '1',
  editForm: { ...editForm },
  // 新增交易弹窗（原 PayInfoModal）
  addDialogVisible: false,
  addTitle: '新增',
  // 原字段 :hidden="seen"：根新增时隐藏上级交易
  parentSeen: true,
  // 上级交易树（原 PayInfoModal loadTreeData → queryIdTree，打开弹窗时加载）
  addTreeData: [],
  addForm: { ...addForm },
  // 批量删除 / 行删除
  batchDelVisible: false,
  delVisible: false,
  deleteId: '',
  // 占位弹窗
  placeholderVisible: false,
  placeholderText: ''
})

/** 加载交易树（原 queryTransTreeList，loadTree 时 $emit('transTree')） */
const loadTree = async () => {
  const res = await queryTransTreeList()
  if (res.returnCode === SUCCESS_STATUS) {
    state.treeData = res.result || []
  }
}

/** 左侧树搜索（原 searchTransByKeywords({keyWord})，placeholder=请输入交易名称） */
const onTreeSearch = async () => {
  if (!state.keyWord) {
    loadTree()
    return
  }
  const res = await searchTransByKeywords({ keyWord: state.keyWord })
  if (res.returnCode === SUCCESS_STATUS) {
    // 原 a-tree 搜索为节点高亮，mock 将命中结果平铺为一级节点展示
    state.treeData = (res.result || []).map((item) => ({
      key: item.key,
      title: item.transName,
      transCode: item.transCode,
      transCategory: item.transCategory,
      msgType: item.msgType,
      description: item.description,
      children: []
    }))
  }
}

/** 树节点点击（原 onSelect：$emit update:currentSelectFunctionCodeProp / switchData） */
const onNodeClick = (data) => {
  state.currentNode = data
  // 原点击节点后回显 tab1 基本信息表单（含 parentId，上级交易名称由 TreeSelect 按 key 回显节点 title）
  state.editForm = {
    transName: data.title,
    transCode: data.transCode || '',
    parentId: data.parentId || '',
    transCategory: data.transCategory || '1',
    msgType: data.msgType || '',
    description: data.description || ''
  }
}

/** 树勾选（原 checkStrictly 默认 true，checkedKeys 为批量删除数据源） */
const onTreeCheck = (data, { checkedKeys }) => {
  state.checkedKeys = checkedKeys || []
}

/** 树操作下拉（原 switchCheckStrictly(1/2)、全部勾选/取消全选/展开所有/合并所有） */
const onTreeOperation = (item) => {
  EPMessageTips('info', `原树操作「${item}」，待迁移`)
}

/** 取消选择（原 LC0334 取消选择） */
const onClearSelect = () => {
  state.currentNode = null
  state.editForm = { ...editForm }
}

/** 加载交易节点列表 */
const loadTransList = async () => {
  const res = await getPaymentTransList({ keyWord: '' })
  if (res.returnCode === SUCCESS_STATUS) {
    state.transList = res.result || []
  }
}

/** 列表行点击（同步当前选择） */
const onRowClick = (row) => {
  onNodeClick({ ...row, title: row.transName })
}

/** 加载上级交易树（原 PayInfoModal loadTreeData：queryIdTree，add/edit 打开弹窗时调用） */
const loadAddTree = async () => {
  const res = await queryIdTree()
  if (res.returnCode === SUCCESS_STATUS) {
    state.addTreeData = res.result || []
  }
}

/** 添加交易 / 添加子交易（原 handleAdd(1)/handleAdd(2) 打开 PayInfoModal） */
const onAddTrans = async (type) => {
  if (type === 2 && !state.currentNode) {
    // 原 LC0378 请先选中一条记录!
    EPMessageTips('warning', '请先选中一条记录!')
    return
  }
  addFormRef.value && addFormRef.value.resetFields()
  state.addForm = { ...addForm }
  // 原 PayInfoModal.edit 打开时 loadTreeData() 加载上级交易树
  loadAddTree()
  if (type === 2) {
    // 原 add(record) 传了 key 则 seen=false（显示上级交易），并预填 parentId
    state.parentSeen = false
    state.addForm.parentId = state.currentNode.key
    state.addTitle = '添加子交易'
  } else {
    state.parentSeen = true
    state.addTitle = '添加交易'
  }
  state.addDialogVisible = true
}

/** 编辑交易（原编辑走 tab1 表单 submitCurrForm，此处打开弹窗回显并 PUT /product/payment/edit） */
const onEditTrans = (row) => {
  addFormRef.value && addFormRef.value.resetFields()
  state.addForm = {
    transName: row.transName,
    transCode: row.transCode || '',
    parentId: row.parentId || '',
    transCategory: row.transCategory || '1',
    msgType: row.msgType || '',
    description: row.description || ''
  }
  loadAddTree()
  state.parentSeen = false
  state.addTitle = '编辑交易'
  state.addDialogVisible = true
}

/** 新增/编辑弹窗提交（原 PayInfoModal 恒 POST /product/payment/add；编辑回显走 PUT，mock 中按 title 区分） */
const onAddSubmit = debounce(async () => {
  const { isValid } = await addFormRef.value.validate()
  if (isValid) {
    if (state.addTitle === '编辑交易') {
      const res = await getPaymentEdit(state.addForm)
      if (res.returnCode === SUCCESS_STATUS) {
        EPMessageTips('success', '修改成功')
        state.addDialogVisible = false
        loadTree()
        loadTransList()
      }
    } else {
      const res = await getPaymentAdd(state.addForm)
      if (res.returnCode === SUCCESS_STATUS) {
        EPMessageTips('success', '新增成功')
        state.addDialogVisible = false
        loadTree()
        loadTransList()
      }
    }
  }
})

/** tab1 修改并保存（原 LC0346 submitCurrForm，未选中行时 warning LC0383） */
const onSubmitCurrForm = debounce(async () => {
  if (!state.currentNode) {
    EPMessageTips('warning', '请点击选择要修改交易!')
    return
  }
  const { isValid } = await editFormRef.value.validate()
  if (isValid) {
    const param = { id: state.currentNode.key, ...state.editForm }
    const res = await getPaymentEdit(param)
    if (res.returnCode === SUCCESS_STATUS) {
      EPMessageTips('success', '修改成功')
      loadTree()
      loadTransList()
    }
  }
})

/** 批量删除入口（原 batchDel：deleteAction {ids: checkedKeys 拼接}） */
const onBatchDelete = () => {
  if (!state.checkedKeys.length) {
    EPMessageTips('warning', '请先在左侧树勾选要删除的节点!')
    return
  }
  state.batchDelVisible = true
}

/** 确认 批量删除（原 /product/payment/deleteBatch） */
const handleBatchDelete = debounce(async () => {
  const param = { ids: state.checkedKeys.join(',') }
  const res = await getPaymentDeleteBatch(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '删除成功!')
    state.batchDelVisible = false
    state.checkedKeys = []
    loadTree()
    loadTransList()
  }
})

/** 行删除入口（原树右键删除 handleDelete → deleteByTransId({id: rightClickSelectedKey})） */
const onDeleteTrans = (row) => {
  state.deleteId = row.key
  state.delVisible = true
}

/** 确认 删除（原 deleteByTransId({id})，成功 LC0379 删除成功! / 失败 LC0380 删除失败!） */
const handleDelete = debounce(async () => {
  const res = await deleteByTransId({ id: state.deleteId })
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '删除成功!')
    state.delVisible = false
    if (state.currentNode && state.currentNode.key === state.deleteId) {
      state.currentNode = null
    }
    loadTree()
    loadTransList()
  } else {
    EPMessageTips('error', '删除失败!')
  }
})

/** 占位弹窗（导出/导入等） */
const onPlaceholder = (text) => {
  state.placeholderText = text
  state.placeholderVisible = true
}

/** 模块管理入口（原独立页 PayModel.vue → 迁移为 ModuleInfoModal 弹窗）：
 *  对照源消费方打开时机/传参——原 PayModel 内 handleAdd(2) 打开 ModuleInfoModal.add(selectedKeys) 传本页树选中 key，
 *  此处入口按钮打开弹窗并通过 check-info 传当前选中业务节点（state.currentNode），映射关系见组件 props 注释 */
const onOpenModuleManage = () => {
  moduleModalRef.value?.showModal()
}

/** 模块保存回调（原消费方 @ok="loadTree" 刷新模块树，模块树在弹窗内已自刷新；此处按接线要求刷新交易列表） */
const onModuleManageOk = () => {
  loadTransList()
}

// 页面加载时
onMounted(() => {
  // 原 PayInfoModal 内 queryIdTree 已改为打开新增/编辑弹窗时由 loadAddTree 加载
  loadTree()
  loadTransList()
})
</script>

<style scoped>
.pay-biz-page {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.tree-search {
  display: flex;
  gap: 8px;
  align-items: center;
}
.left-tree-panel {
  flex: 0 0 280px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}
.tree-wrap {
  max-height: 480px;
  margin-top: 12px;
  overflow: auto;
}
.tree-operation {
  margin-top: 12px;
  text-align: center;
}
.tree-operation-item {
  padding: 6px 12px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
}
.tree-operation-item:hover {
  color: #262aff;
}
.right-content-panel {
  flex: 1;
  min-width: 0;
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
.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.right-tabs {
  margin-top: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}
.placeholder-block {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #999;
  background: #f7f9fd;
}
/* 源空面板占位（tab3 业务流程 / tab5 智能路由 / tab6 系统适配：源 PayList.vue 无对应内容面板） */
.empty-tab-pane {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #bbb;
  background: #fbfcfe;
}
.button-text {
  padding: 0;
}
</style>
