<template>
  <!--
    模块管理弹窗（迁移自 Vue2 支付业务模块管理）：
    - 外层弹窗 = 原 PayModel.vue 独立模块管理页（左模块树 + 右编辑表单，flex 布局，ep 无 row/col）
    - 内层「添加模块/添加子模块」弹窗 = 原 payment/modules/ModuleInfoModal.vue（仅新增，恒 POST /product/module/add）
    i18n（zh_cn/lowCode.json + common.json）已解析为中文硬编码：
    LC0332 批量删除 / LC0333 当前选择： / LC0334 取消选择 / LC0335 添加模块 / LC0336 添加子模块 /
    LC0337 模块编码 / LC0338 模块名称 / LC0339 模块类目 / LC0340 虚拟表名 / LC0341 上级模块名称 /
    LC0342 模块类型 / LC0343 模块描述 / LC0344 业务节点 / LC0345 业务模型 / LC0346 修改并保存 /
    LC0378 请先选中一条记录! / LC0379 删除成功! / LC0380 删除失败! / LC0384 请点击选择要修改模块! /
    LC0386 无 / LC0387 模块信息 / LC0389 上级模块
  -->
  <!-- 原 PayModel.vue 为独立页面，此处按迁移约定收敛为弹窗承载（与源差异） -->
  <ep-dialog
    v-model="state.visible"
    title="模块管理"
    width="960px"
    :close-on-click-modal="false"
    append-to-body
    @close="handleCancel"
  >
    <div class="module-manage">
      <!-- 操作按钮区（原 PayModel.vue 按钮区） -->
      <div class="action-bar">
        <!-- 权限码: product:pay:buss:module:add（原 LC0335 添加模块，根新增） -->
        <ep-button type="primary" @click="onAddModule(1)">添加模块</ep-button>
        <!-- 权限码: product:pay:buss:module:add（原 LC0336 添加子模块，传选中 key 预填上级模块） -->
        <ep-button plain type="primary" @click="onAddModule(2)">添加子模块</ep-button>
        <!-- 权限码: product:pay:buss:module:delete（原 LC0332 批量删除，数据源=树勾选 checkedKeys） -->
        <ep-button type="danger" plain @click="onBatchDelete">批量删除</ep-button>
        <!-- 原 refresh → loadTree -->
        <ep-button plain @click="loadTree">刷新</ep-button>
        <!-- 原 导出/导入 Excel（product/module/exportXls | product/module/importExcel，导出文件名=LC0387 模块信息）：
             非增删改查范畴，与交易导出/导入同样保留待迁移 -->
        <ep-button plain @click="onPendingExportImport('导出')">导出</ep-button>
        <ep-button plain @click="onPendingExportImport('导入')">导入</ep-button>
      </div>

      <!-- 当前选择提示条（原 a-alert：LC0333 当前选择： + 节点 title + LC0334 取消选择） -->
      <div class="selected-tip">
        <template v-if="state.currSelected.title">
          <span>当前选择：{{ state.currSelected.title }}</span>
          <ep-button plain type="primary" class="button-text" @click="onClearSelected">
            取消选择
          </ep-button>
        </template>
        <span v-else>当前选择：暂未选中模块</span>
      </div>

      <!-- 搜索框（原 a-input-search @search=onSearch，placeholder=请输入 + LC0338 模块名称） -->
      <div class="module-search">
        <ep-input
          v-model="state.keyWord"
          placeholder="请输入模块名称"
          type="text"
          @keyup.enter="onSearch"
        />
        <ep-button plain type="primary" @click="onSearch">搜索</ep-button>
      </div>

      <!-- 左模块树 + 右编辑表单（原 a-col md=10/14 → flex 布局） -->
      <div class="module-body">
        <div class="module-tree-panel">
          <!-- 原 a-tree checkable multiple :checkStrictly=true @select=onSelect @check=onCheck：
               ep-tree 以 nodeKey=key、label=title 渲染 -->
          <div class="tree-wrap">
            <ep-tree
              ref="treeRef"
              :data="state.treeData"
              node-key="key"
              show-checkbox
              check-strictly
              :props="{ label: 'title', children: 'children' }"
              default-expand-all
              @node-click="onNodeClick"
              @check="onCheck"
            />
          </div>
          <!-- 与源差异：原树右键菜单（添加/删除/取消）→ ep-tree 无右键菜单；
               「添加」合并至顶部「添加子模块」按钮，「删除」改为选中节点后点击（原 deleteByProductModuleId({id: rightClickSelectedKey})）；
               原 LC0350 树操作下拉（父子关联/勾选模式切换）为辅助功能且主页面已作占位，此处不迁 -->
          <div class="tree-delete-bar">
            <!-- 权限码: product:pay:buss:module:delete -->
            <ep-button plain type="primary" class="button-text" @click="onDeleteModule">删除</ep-button>
          </div>
        </div>

        <div class="module-form-panel">
          <!-- 原 PayModel.vue 右侧编辑表单（submitCurrForm → PUT /product/module/edit） -->
          <ep-form ref="editFormRef" :model="state.editForm" :label-width="110">
            <ep-form-item
              prop="moduleCode"
              label="模块编码"
              :rules="[{ required: true, message: '请输入模块编码!', trigger: 'blur' }]"
            >
              <ep-input v-model="state.editForm.moduleCode" placeholder="请输入模块编码" type="text" />
            </ep-form-item>
            <ep-form-item
              prop="moduleName"
              label="模块名称"
              :rules="[{ required: true, message: '请输入模块名称!', trigger: 'blur' }]"
            >
              <ep-input v-model="state.editForm.moduleName" placeholder="请输入模块名称" type="text" />
            </ep-form-item>
            <!-- 原 j-dict-select-tag(dictCode=module_category) v-model=model.moduleCategory：字典项 mock 见 api 注释 -->
            <ep-form-item label="模块类目">
              <ep-select
                v-model="state.editForm.moduleCategory"
                placeholder="请选择模块类目"
                style="width: 50%"
              >
                <ep-option
                  v-for="item in state.moduleCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ep-select>
            </ep-form-item>
            <ep-form-item label="虚拟表名">
              <ep-input v-model="state.editForm.virtualTableName" placeholder="请输入虚拟表名" type="text" />
            </ep-form-item>
            <!-- 原 LC0341 上级模块名称 a-tree-select :disabled=disable 恒 true，仅回显展示；placeholder=LC0386 无 -->
            <ep-form-item label="上级模块名称">
              <TreeSelect
                v-model="state.editForm.parentId"
                :tree-data="state.treeData"
                disabled
                placeholder="无"
              />
            </ep-form-item>
            <!-- 原 LC0342 模块类型 radio：LC0344 业务节点 / LC0345 业务模型 -->
            <ep-form-item label="模块类型">
              <ep-radio-group v-model="state.editForm.type">
                <ep-radio value="1">业务节点</ep-radio>
                <ep-radio value="2">业务模型</ep-radio>
              </ep-radio-group>
            </ep-form-item>
            <ep-form-item label="模块描述">
              <ep-input
                v-model="state.editForm.description"
                placeholder="请输入模块描述"
                type="textarea"
                :rows="3"
              />
            </ep-form-item>
            <ep-form-item>
              <!-- 原 emptyCurrForm 重置（icon=sync，权限码: product:pay:buss:module:edit） -->
              <ep-button plain @click="onResetEdit">重置</ep-button>
              <!-- 原 LC0346 修改并保存 submitCurrForm（权限码: product:pay:buss:module:edit） -->
              <ep-button type="primary" @click="onSubmitEdit">修改并保存</ep-button>
            </ep-form-item>
          </ep-form>
        </div>
      </div>
    </div>
    <template #footer>
      <ep-button plain @click="handleCancel">关闭</ep-button>
    </template>
  </ep-dialog>

  <!--
    添加模块/添加子模块弹窗（原 payment/modules/ModuleInfoModal.vue 完整迁移）：
    a-modal width=800、cancelText=common.close「关闭」、确认提交恒 POST /product/module/add（仅新增，payload 结构照源）
  -->
  <ep-dialog
    v-model="state.addVisible"
    :title="state.addTitle"
    width="800px"
    :close-on-click-modal="false"
    append-to-body
    @close="onAddCancel"
  >
    <ep-form ref="addFormRef" :model="state.addForm" :label-width="120">
      <ep-form-item
        prop="moduleName"
        label="模块名称"
        :rules="[{ required: true, message: '请输入模块名称!', trigger: 'blur' }]"
      >
        <ep-input v-model="state.addForm.moduleName" placeholder="请输入模块名称" type="text" />
      </ep-form-item>
      <!-- 与源一致：原弹窗 validatorRules 仅校验 moduleName，模块编码/模块类型均非必填 -->
      <ep-form-item label="模块编码">
        <ep-input v-model="state.addForm.moduleCode" placeholder="请输入模块编码" type="text" />
      </ep-form-item>
      <!-- 原 j-dict-select-tag(dictCode=module_category) v-model=model.moduleCategory -->
      <ep-form-item label="模块类目">
        <ep-select
          v-model="state.addForm.moduleCategory"
          placeholder="请选择模块类目"
          style="width: 50%"
        >
          <ep-option
            v-for="item in state.moduleCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ep-select>
      </ep-form-item>
      <ep-form-item label="虚拟表名">
        <ep-input v-model="state.addForm.virtualTableName" placeholder="请输入虚拟表名" type="text" />
      </ep-form-item>
      <!-- 原 :hidden="seen"：根新增（不传 key）隐藏上级模块，子新增显示并预填 parentId；
           原 condition 恒 true → 树选择禁用，仅回显预填值 -->
      <ep-form-item v-if="!state.seen" label="上级模块">
        <TreeSelect
          v-model="state.addForm.parentId"
          :tree-data="state.addTreeData"
          disabled
          placeholder="请选择上级模块"
        />
      </ep-form-item>
      <ep-form-item label="模块类型">
        <ep-radio-group v-model="state.addForm.type">
          <ep-radio value="1">业务节点</ep-radio>
          <ep-radio value="2">业务模型</ep-radio>
        </ep-radio-group>
      </ep-form-item>
      <ep-form-item label="模块描述">
        <ep-input
          v-model="state.addForm.description"
          placeholder="请输入模块描述"
          type="textarea"
          :rows="3"
        />
      </ep-form-item>
    </ep-form>
    <template #footer>
      <!-- 原 modal 取消按钮文案为 common.close「关闭」 -->
      <ep-button plain @click="onAddCancel">关闭</ep-button>
      <ep-button type="primary" @click="onAddSubmit">确定</ep-button>
    </template>
  </ep-dialog>

  <!-- 批量删除确认弹窗（原 batchDel $confirm：LC0381 确认删除 / LC0382 确定要删除所选中的 N 条数据，以及子节点数据吗?） -->
  <ep-dialog v-model="state.batchDelVisible" title="确认删除" width="30%" append-to-body>
    <span>确定要删除所选中的 {{ state.checkedKeys.length }} 条数据，以及子节点数据吗?</span>
    <template #footer>
      <ep-button plain @click="state.batchDelVisible = false">取消</ep-button>
      <ep-button type="primary" @click="handleBatchDelete">确定</ep-button>
    </template>
  </ep-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { EPMessageTips, debounce } from '@/utils/utils'
import {
  getPaymentModuleTreeList,
  getPaymentModuleIdTree,
  searchProductModuleByKeywords,
  getPaymentModuleAdd,
  getPaymentModuleEdit,
  deleteByProductModuleId,
  getPaymentModuleDeleteBatch,
  getModuleCategoryDict
} from '@/api/lowCodePlatform/paymentBiz'
import TreeSelect from '@/components/treeSelect/TreeSelect.vue'

const props = defineProps({
  // 接线映射参数：页面左树当前选中业务节点（对照源消费方 PayModel.vue handleAdd(2) 传本页树 selectedKeys
  // 作上级预填参数；本弹窗由交易页「模块管理」按钮打开，模块树无选中节点时回退用 checkInfo.key 预填上级模块）
  checkInfo: {
    type: Object,
    default: null
  }
})

// 原 PayModel.vue 消费方仅监听 @ok="loadTree"（保存成功后刷新模块树）；close 事件按源保留
const emit = defineEmits(['ok', 'close'])

const treeRef = ref(null)
const editFormRef = ref(null)
const addFormRef = ref(null)

/** 右侧编辑表单初值（原 setValuesToForm pick 字段 + moduleCategory/parentId v-model 字段） */
const editFormShape = {
  moduleCode: '',
  moduleName: '',
  moduleCategory: '',
  virtualTableName: '',
  parentId: '',
  type: '1',
  description: ''
}

/** 添加弹窗表单初值（原 ModuleInfoModal：moduleName/moduleCode/virtualTableName/type/description 走 v-decorator，
 *  moduleCategory/parentId 挂 model 对象；type 无默认值） */
const addFormShape = {
  moduleName: '',
  moduleCode: '',
  moduleCategory: '',
  virtualTableName: '',
  parentId: '',
  type: '',
  description: ''
}

const state = reactive({
  // 模块管理弹窗
  visible: false,
  keyWord: '',
  treeData: [],
  moduleCategoryOptions: [],
  currSelected: {},
  // 模块树选中节点 key（原 selectedKeys，删除/添加子模块取值）
  selectedKey: '',
  // 树勾选 keys（原 checkedKeys，批量删除数据源）
  checkedKeys: [],
  editForm: { ...editFormShape },
  // 添加模块弹窗（原 ModuleInfoModal）
  addVisible: false,
  addTitle: '新增',
  // 原 add(record)：不传 key → seen=true 隐藏上级模块
  seen: true,
  // 上级模块树（原 transTree，打开添加弹窗时 loadTreeData 加载）
  addTreeData: [],
  addForm: { ...addFormShape },
  // 批量删除确认
  batchDelVisible: false
})

/** 加载模块树（原 PayModel.vue loadTree → queryProductModuleTreeList） */
const loadTree = async () => {
  const res = await getPaymentModuleTreeList()
  if (res.returnCode === SUCCESS_STATUS) {
    state.treeData = res.result || []
  }
}

/** 加载上级模块树（原 ModuleInfoModal loadTreeData → queryProductModuleIdTree） */
const loadModuleIdTree = async () => {
  const res = await getPaymentModuleIdTree()
  if (res.returnCode === SUCCESS_STATUS) {
    state.addTreeData = res.result || []
  }
}

/** 加载模块类目字典（原 j-dict-select-tag 内部 ajaxGetDictItems(module_category)） */
const loadDict = async () => {
  if (state.moduleCategoryOptions.length) return
  const res = await getModuleCategoryDict()
  if (res.returnCode === SUCCESS_STATUS) {
    state.moduleCategoryOptions = res.result || []
  }
}

/** 打开模块管理弹窗 */
const showModal = () => {
  state.visible = true
  // 与源差异：原 PayModel.vue created 未自动加载树（源代码已注释），弹窗打开时加载一次便于操作
  loadTree()
  loadDict()
}

/** 关闭模块管理弹窗（原 close：$emit('close') + visible=false） */
const handleCancel = () => {
  emit('close')
  state.visible = false
}

/** 模块树节点点击（原 onSelect：currSelected=record、selectedKeys=[key]、setValuesToForm 回显表单） */
const onNodeClick = (data) => {
  state.currSelected = { ...data }
  state.selectedKey = data.key
  // 原 setValuesToForm：pick(record, 'moduleName','moduleCode','moduleCategory','type','virtualTableName','description')
  state.editForm = {
    moduleCode: data.moduleCode || '',
    moduleName: data.moduleName || data.title || '',
    moduleCategory: data.moduleCategory || '',
    virtualTableName: data.virtualTableName || '',
    parentId: data.parentId || '',
    type: data.type || '1',
    description: data.description || ''
  }
}

/** 树勾选（原 onCheck：checkStrictly=true，checkedKeys 为批量删除数据源） */
const onCheck = (data, { checkedKeys }) => {
  state.checkedKeys = checkedKeys || []
}

/** 模块搜索（原 onSearch → searchProductModuleByKeywords({keyWord})，空关键字恢复全量树） */
const onSearch = async () => {
  if (!state.keyWord) {
    loadTree()
    return
  }
  const res = await searchProductModuleByKeywords({ keyWord: state.keyWord })
  if (res.returnCode === SUCCESS_STATUS) {
    // 原 onSearch 命中结果直接作为树数据展示（mock 平铺返回，见 api 注释）
    state.treeData = res.result || []
  }
}

/** 取消选择（原 onClearSelected：清勾选/选中/表单） */
const onClearSelected = () => {
  state.currSelected = {}
  state.selectedKey = ''
  state.checkedKeys = []
  treeRef.value?.setCheckedKeys([])
  state.editForm = { ...editFormShape }
}

/** 添加模块(1) / 添加子模块(2)（原 PayModel.vue handleAdd(1)/(2) 打开 ModuleInfoModal） */
const onAddModule = (type) => {
  if (type === 2) {
    // 原 handleAdd(2)：取模块树选中 key 预填上级，未选中 warning LC0378 请先选中一条记录!
    let parentKey = state.selectedKey
    // 接线映射：源消费方 PayModel.vue 传本页左树 selectedKeys；此处模块树无选中时
    // 回退用页面当前选中业务节点 key（checkInfo，交易页 state.currentNode）作上级预填参数
    if (!parentKey && props.checkInfo && props.checkInfo.key) {
      parentKey = props.checkInfo.key
    }
    if (!parentKey) {
      EPMessageTips('warning', '请先选中一条记录!')
      return
    }
    openAddDialog(parentKey)
  } else {
    // 原 handleAdd(1)：根新增，不传 key
    openAddDialog('')
  }
}

/** 打开添加弹窗（原 ModuleInfoModal.add(record) + edit(record)：seen 逻辑 + loadTreeData + 预填 parentId） */
const openAddDialog = (parentKey) => {
  addFormRef.value && addFormRef.value.resetFields()
  state.addForm = { ...addFormShape }
  if (parentKey) {
    state.seen = false
    // 原 edit：this.model.parentId = record!=null ? record.toString() : null
    state.addForm.parentId = parentKey
  } else {
    state.seen = true
  }
  state.addTitle = '新增'
  // 原 edit 打开时 loadTreeData() 加载上级模块树
  loadModuleIdTree()
  state.addVisible = true
}

/** 关闭添加弹窗（原 handleCancel → close） */
const onAddCancel = () => {
  state.addVisible = false
}

/** 添加弹窗提交（原 handleOk：validateFields → POST /product/module/add → 成功提示+刷新树+$emit('ok')，finally 恒 close） */
const onAddSubmit = debounce(async () => {
  const { isValid } = await addFormRef.value.validate()
  if (!isValid) return
  // 原 formData = Object.assign(this.model, values)：{parentId, moduleCategory} + 表单字段（payload 结构照源）
  const formData = { ...state.addForm }
  const res = await getPaymentModuleAdd(formData)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '新增成功')
    // 原 success：loadTreeData() 刷新上级模块树 + $emit('ok')（消费方刷新模块树，此处弹窗内自刷新）
    loadModuleIdTree()
    loadTree()
    emit('ok')
  }
  // 原 finally：无论成败 confirmLoading=false 并 close()
  state.addVisible = false
})

/** 重置右侧编辑表单（原 emptyCurrForm → form.resetFields()） */
const onResetEdit = () => {
  state.editForm = { ...editFormShape }
}

/** 修改并保存（原 submitCurrForm：未选中 warning LC0384 → PUT /product/module/edit → 成功提示+loadTree） */
const onSubmitEdit = debounce(async () => {
  if (!state.currSelected.key) {
    // 原 LC0384 请点击选择要修改模块!（以 currSelected.id 判定，mock 树节点以 key 为主键）
    EPMessageTips('warning', '请点击选择要修改模块!')
    return
  }
  const { isValid } = await editFormRef.value.validate()
  if (!isValid) return
  // 原 formData = Object.assign(this.currSelected, values)：节点原始字段(key/parentId/moduleCategory等) + 表单值（payload 结构照源）
  const formData = { ...state.currSelected, ...state.editForm }
  const res = await getPaymentModuleEdit(formData)
  if (res.returnCode === SUCCESS_STATUS) {
    // 原 $message.success(common.success) → 操作成功
    EPMessageTips('success', '操作成功')
    loadTree()
  }
})

/** 删除模块（原树右键菜单 handleDelete → deleteByProductModuleId({id})，成功 LC0379 / 失败 LC0380） */
const onDeleteModule = async () => {
  if (!state.selectedKey) {
    EPMessageTips('warning', '请先选中一条记录!')
    return
  }
  const res = await deleteByProductModuleId({ id: state.selectedKey })
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '删除成功!')
    loadTree()
  } else {
    EPMessageTips('error', '删除失败!')
  }
}

/** 批量删除入口（原 batchDel：checkedKeys 为空 → common.chooseRecord 请选择一条记录） */
const onBatchDelete = () => {
  if (!state.checkedKeys.length) {
    EPMessageTips('warning', '请选择一条记录')
    return
  }
  state.batchDelVisible = true
}

/** 确认 批量删除（原 deleteAction deleteBatch {ids: checkedKeys 拼接} → 成功提示 + loadTree + onClearSelected） */
const handleBatchDelete = debounce(async () => {
  const param = { ids: state.checkedKeys.join(',') }
  const res = await getPaymentModuleDeleteBatch(param)
  if (res.returnCode === SUCCESS_STATUS) {
    EPMessageTips('success', '删除成功')
    state.batchDelVisible = false
    onClearSelected()
    loadTree()
  }
})

/** 原导出/导入 Excel（product/module/exportXls | importExcel，导出文件名=LC0387 模块信息）：待迁移 */
const onPendingExportImport = (type) => {
  EPMessageTips('info', `原模块信息${type}（product/module/${type === '导出' ? 'exportXls' : 'importExcel'}），待迁移`)
}

defineExpose({
  showModal
})
</script>

<style scoped>
.module-manage {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.action-bar {
  display: flex;
  gap: 12px;
}
.selected-tip {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: #f0f3fa;
  border-radius: 4px;
}
.module-search {
  display: flex;
  gap: 8px;
  align-items: center;
}
.module-body {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.module-tree-panel {
  flex: 0 0 300px;
  min-width: 0;
}
.tree-wrap {
  max-height: 360px;
  overflow: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px;
}
.tree-delete-bar {
  margin-top: 8px;
}
.module-form-panel {
  flex: 1;
  min-width: 0;
}
.button-text {
  padding: 0;
}
</style>
