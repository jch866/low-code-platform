<template>
  <!-- 原 a-modal：title=LC0656「选择{name}」(name=LC0291 业务名称)、width=modalWidth、cancelText=关闭(common.close) -->
  <ep-dialog
    v-model="visible"
    title="选择业务名称"
    :width="modalWidth"
    :close-on-click-modal="false"
    append-to-body
    @close="handleCancel"
  >
    <!-- 原 a-input-search @search=onSearch：ep 无搜索输入框，组合为输入框 + 搜索按钮（回车亦可触发）；
         与源差异：原搜索为命中节点高亮 + 展开父节点，ep-tree 无 scoped 高亮插槽，改用 filter 过滤显示命中节点 -->
    <div class="service-search">
      <ep-input
        v-model="searchValue"
        placeholder="请输入关键字搜索"
        @keyup.enter="onSearch"
      />
      <ep-button plain type="primary" @click="onSearch">搜索</ep-button>
    </div>
    <!-- 原 a-tree checkable :checkStrictly=true @check/@select：ep-tree 以 nodeKey=key、label=title 渲染 -->
    <div class="service-tree-wrap">
      <ep-tree
        ref="treeRef"
        :data="treeData"
        node-key="key"
        :props="{ label: 'title', children: 'children' }"
        show-checkbox
        check-strictly
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="onNodeClick"
        @check="onCheck"
      />
    </div>
    <template #footer>
      <!-- 原弹窗取消按钮文案为「关闭」而非「取消」 -->
      <ep-button plain @click="handleCancel">关闭</ep-button>
      <ep-button type="primary" @click="handleSubmit">确定</ep-button>
    </template>
  </ep-dialog>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import {
  queryTransTreeList,
  queryChildDepartTreeList,
  flattenServiceTree
} from '@/api/lowCodePlatform/biz'

const props = defineProps({
  // 弹窗宽度（原 a-modal width，默认 500）
  modalWidth: {
    type: Number,
    default: 500
  },
  // 是否多选（true→checkbox 累加勾选 / false→单选后勾覆盖，原 multi）
  multi: {
    type: Boolean,
    default: false
  },
  // 是否默认展开根节点（原 rootOpened，true 时 default-expand-all）
  rootOpened: {
    type: Boolean,
    default: true
  },
  // 外部回显值（原 transCode：逗号拼接节点 key）
  transCode: {
    type: String,
    default: ''
  },
  // 是否仅查询当前用户有权限的部门（决定走 queryChildDepartTreeList 还是 queryTransTreeList）
  userOwn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['ok', 'initComp'])

const visible = ref(false)
// 树数据（原 treeData）
const treeData = ref([])
// 平铺节点列表（原 dataList：reWriterWithSlot 收集全部节点，供回显匹配名称）
const dataList = ref([])
// 已勾选节点 key（原 checkedKeys，逗号拼接后即 v-model 值）
const checkedKeys = ref([])
// 已勾选节点行数据（原 checkedRows，ok 回调给 shell 拼 transName）
const checkedRows = ref([])
// 搜索关键字（原 searchValue）
const searchValue = ref('')
const treeRef = ref(null)

/** 加载业务树（原 loadService：userOwn 走子部门树接口，否则走业务树；加载后按 transCode 回显名称） */
const loadService = async () => {
  const res = props.userOwn ? await queryChildDepartTreeList() : await queryTransTreeList()
  if (res.returnCode === '0000' && res.result != null) {
    treeData.value = res.result || []
    dataList.value = flattenServiceTree(treeData.value)
    initServiceComponent()
  }
}

/** 回显名称（原 initServiceComponent：按 dataList 节点 key 在 transCode 中命中即拼 transName，emit initComp 给 shell） */
const initServiceComponent = () => {
  let names = ''
  if (props.transCode) {
    const currtransCode = props.transCode
    for (const item of dataList.value) {
      // 与源一致：indexOf 子串匹配（源实现即如此，key 存在前缀包含时可能误命中）
      if (currtransCode.indexOf(item.key) >= 0) {
        names += ',' + item.transName
      }
    }
    if (names) {
      names = names.substring(1)
    }
  }
  emit('initComp', names)
}

/** 打开弹窗（原 show：清空勾选后按 transCode 恢复勾选） */
const showModal = () => {
  visible.value = true
  checkedRows.value = []
  checkedKeys.value = []
}

// 原 watch visible：打开时按 transCode 恢复 checkedKeys
watch(visible, (val) => {
  if (val) {
    checkedKeys.value = props.transCode ? props.transCode.split(',') : []
    syncChecked()
  }
})

// 原 watch transCode：外部值变化时重新回显名称
watch(
  () => props.transCode,
  () => {
    initServiceComponent()
  }
)

/** 将 checkedKeys 同步回树勾选状态并重算 checkedRows（与源差异：源 checkedRows 在取消勾选时仍 push 节点，此处按 checkedKeys 重算避免脏数据；
     弹窗内容懒渲染，setCheckedKeys 需等树挂载后再执行） */
const syncChecked = () => {
  nextTick(() => {
    treeRef.value?.setCheckedKeys(checkedKeys.value)
  })
  checkedRows.value = dataList.value.filter((i) => checkedKeys.value.includes(i.key))
}

/** 勾选回调（原 onCheck：!multi 时仅保留新勾选的节点；multi 时累加） */
const onCheck = (data, info) => {
  const keys = info.checkedKeys || []
  if (!props.multi) {
    const added = keys.filter((k) => !checkedKeys.value.includes(k))
    checkedKeys.value = added.length ? [added[added.length - 1]] : []
  } else {
    checkedKeys.value = [...keys]
  }
  syncChecked()
}

/** 点击节点切换勾选（原 onSelect：单选时替换，多选时切换勾/取消） */
const onNodeClick = (data) => {
  const currKey = data.key
  if (checkedKeys.value.includes(currKey)) {
    checkedKeys.value = checkedKeys.value.filter((k) => k !== currKey)
  } else if (!props.multi) {
    checkedKeys.value = [currKey]
  } else {
    checkedKeys.value = [...checkedKeys.value, currKey]
  }
  syncChecked()
}

/** 搜索（原 onSearch：命中节点高亮+展开父节点；此处改为 filter 过滤显示，清空关键字恢复全量） */
const onSearch = () => {
  treeRef.value?.filter(searchValue.value)
}

/** 树过滤方法（配合 filter：空关键字显示全部，否则按 title 模糊命中） */
const filterNode = (value, data) => {
  if (!value) return true
  return data.title.indexOf(value) > -1
}

/** 确定（原 handleSubmit：无勾选 emit ok('')，否则 emit ok(checkedRows, checkedKeys 拼接)） */
const handleSubmit = () => {
  if (!checkedKeys.value || checkedKeys.value.length === 0) {
    emit('ok', '')
  } else {
    emit('ok', checkedRows.value, checkedKeys.value.join(','))
  }
  handleCancel()
}

/** 关闭（原 handleCancel/handleClear） */
const handleCancel = () => {
  visible.value = false
  checkedKeys.value = []
}

defineExpose({
  showModal,
  loadService,
  initServiceComponent
})

// 原 created(){ this.loadService() }：挂载即加载业务树并按 transCode 回显
loadService()
</script>

<style scoped>
.service-search {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.service-tree-wrap {
  max-height: 320px;
  overflow: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px;
}
</style>
