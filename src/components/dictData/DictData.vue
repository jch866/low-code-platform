<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/param/DictData.vue（数据字典数据源）
       三字段交互与联动：fetchType（字典 dict_fetch_type 取值方式）→ dictType（j-select-dict 选择字典，值为 dictCode）
       → dictValue（j-dict-select-tag :dictCode=dictType 加载字典项，仅 fetchType=ONE 且已选字典时展示）
       绑定对象结构（源 dictDataParam）：{fetchType, dictType, dictName, dictValue, dictValues} -->
  <!-- 原 a-card style=width:100%，改为纵向三行表单块 -->
  <div class="dict-data-card">
    <!-- 原 j-dict-select-tag dictCode=dict_fetch_type，placeholder=LC0879 全量数据 -->
    <ep-select v-model="local.fetchType" placeholder="全量数据" :disabled="disabled" class="dict-row">
      <ep-option v-for="opt in DICT_FETCH_TYPE_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
    </ep-select>

    <!-- 原 j-select-dict（JSelectBizComponent 字典选择器，listUrl=/sys/dict/config/list，displayKey=dictName，
         returnKeys=[id,dictCode] → v-model 值为 dictCode，:multiple="false" 单选）；
         与源差异：源为双表弹窗，此处行内编辑场景改为 readonly 输入框 + ep-popover 单选字典列表（参考 treeSelect 迁移模式） -->
    <!-- ep-popover 无 width 属性（与 element-plus 不同），弹层宽度由内容容器 .dict-picker 定宽 -->
    <ep-popover v-model="dictPopoverVisible" effect="light" trigger="click" class="dict-popover">
      <template #reference>
        <ep-input
          :model-value="local.dictName || local.dictType || ''"
          readonly
          :disabled="disabled"
          placeholder="数据字典名称"
          class="dict-row"
        />
      </template>
      <div class="dict-picker">
        <div class="dict-picker-search">
          <ep-input v-model="dictSearchName" placeholder="请输入字典名称" @keyup.enter="loadDictList(true)" />
          <ep-button type="primary" size="small" @click="loadDictList(true)">查询</ep-button>
        </div>
        <!-- 原待选表 rowKey=id 列：dictCode 字典编码 / dictName 字典名称，radio 单选 + 行点击选中 -->
        <ep-table
          :data="dictList"
          row-key="id"
          empty-text="暂无数据"
          max-height="200"
          size="small"
          @row-click="onDictRowClick"
        >
          <ep-table-column width="40" align="center">
            <template #default="{ row }">
              <ep-radio
                :model-value="pendingDictId === row.id ? row.id : ''"
                :value="row.id"
                @change="onDictRowClick(row)"
              />
            </template>
          </ep-table-column>
          <ep-table-column label="字典编码" prop="dictCode" align="center" min-width="140" />
          <ep-table-column label="字典名称" prop="dictName" align="center" min-width="120" />
        </ep-table>
        <div class="dict-picker-footer">
          <ep-button size="small" plain @click="dictPopoverVisible = false">取消</ep-button>
          <ep-button type="primary" size="small" @click="confirmDict">确定</ep-button>
        </div>
      </div>
    </ep-popover>

    <!-- 原 j-dict-select-tag :dictCode="dictDataParam.dictType"，placeholder=LC0881 数据字典值；
         仅 fetchType=ONE 且已选字典时展示（源 v-if 原样照搬）；字典项联调后走 /sys/dict/getDictItems/{dictType} -->
    <ep-select
      v-if="local.fetchType === 'ONE' && local.dictType != null && local.dictType !== ''"
      v-model="local.dictValue"
      placeholder="数据字典值"
      :disabled="disabled"
      class="dict-row"
    >
      <ep-option v-for="opt in dictValueOptions" :key="opt.value" :label="opt.text" :value="opt.value" />
    </ep-select>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { queryDictConfigPage, getDictItems } from '@/api/lowCodePlatform/biz'

// 原字典 dict_fetch_type（取值方式）；源仅判 ONE=全量数据（选值），其余值走全量不选值，选项为示意，联调后由字典渲染
const DICT_FETCH_TYPE_OPTIONS = [
  { label: '全量数据', value: 'ONE' },
  { label: '指定数据', value: 'MANY' }
]

const props = defineProps({
  // 绑定对象（源 dictDataParamProps，.sync 等价 v-model:dictDataParamProps）：
  // {fetchType, dictType(字典编码), dictName(字典名称), dictValue(字典值), dictValues(多值预留)}
  dictDataParamProps: {
    type: Object,
    required: true,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dictDataParamProps'])

// 本地副本（源 created 将 props 对象引用赋给 dictDataParam，watch 变更后 emit；此处拷贝为本地对象并回写，与源差异：浅拷贝防外部对象被意外篡改）
const local = reactive({
  fetchType: 'ONE',
  dictType: '',
  dictName: '',
  dictValue: '',
  dictValues: []
})

// 字典选择弹层状态
const dictPopoverVisible = ref(false)
const dictSearchName = ref('')
const dictList = ref([])
const pendingDictId = ref('')
const pendingDictRow = ref(null)
// 数据字典值下拉（原 j-dict-select-tag dictOptions）
const dictValueOptions = ref([])

/** 回显 prop → 本地副本（补齐缺失字段，与源 data() 默认结构一致） */
watch(
  () => props.dictDataParamProps,
  (val) => {
    const src = val || {}
    local.fetchType = src.fetchType || 'ONE'
    local.dictType = src.dictType || ''
    local.dictName = src.dictName || ''
    local.dictValue = src.dictValue || ''
    local.dictValues = src.dictValues || []
  },
  { immediate: true }
)

/** 本地副本变更 → 回写父级（源 watch dictDataParam → $emit('update:dictDataParamProps')；JSON 判重防循环） */
watch(local, () => {
  const next = {
    fetchType: local.fetchType,
    dictType: local.dictType,
    dictName: local.dictName,
    dictValue: local.dictValue,
    dictValues: local.dictValues
  }
  const prev = props.dictDataParamProps || {}
  if (JSON.stringify(next) === JSON.stringify({ ...prev })) return
  emit('update:dictDataParamProps', next)
})

/** 加载字典列表（原 JSelectDict listUrl GET /sys/dict/config/list，selectParam dictName 查询） */
const loadDictList = async () => {
  const res = await queryDictConfigPage({ dictName: dictSearchName.value || undefined, pageNo: 1, pageSize: 50 })
  if (res.returnCode === SUCCESS_STATUS) {
    dictList.value = res.result || []
  }
}

/** 打开弹层：先加载列表再按已选 dictType 恢复勾选行（popover 无 open 钩子，watch visible 实现） */
watch(dictPopoverVisible, async (val) => {
  if (!val) return
  pendingDictId.value = ''
  pendingDictRow.value = null
  await loadDictList()
  const current = dictList.value.find((i) => i.dictCode === local.dictType)
  if (current) {
    pendingDictId.value = current.id
    pendingDictRow.value = current
  }
})

/** 行点击/单选（原 customRowFn multiple=false 行点击选中） */
const onDictRowClick = (row) => {
  pendingDictId.value = row.id
  pendingDictRow.value = row
}

/** 确定（原 modal handleOk：提交所选行，v-model 写 dictCode = returnKeys[1]）
 * 顾问修复：字典值重置从 dictType watch 移入此唯一写入点——原立即 watch 在回显时会先清空已存 dictValue */
const confirmDict = () => {
  if (!pendingDictRow.value) return
  const nextCode = pendingDictRow.value.dictCode
  if (local.dictType !== nextCode) {
    // 切换了字典才重置字典值（源 watch dictType → dictValue=null 语义，仅在实际变更时生效）
    local.dictValue = ''
  }
  local.dictType = nextCode
  // 与源差异：源 dictDataParam.dictName 未回写（回显展示缺失），此处同步写 dictName 供输入框回显
  local.dictName = pendingDictRow.value.dictName
  dictPopoverVisible.value = false
}

/** 字典项加载（源 watch dictType 触发；重置动作已移入 confirmDict，此处只负责按 dictType 加载选项，回显时也能加载已存字典的选项） */
watch(
  () => local.dictType,
  async (dictType) => {
    dictValueOptions.value = []
    if (!dictType) return
    const res = await getDictItems(dictType)
    if (res.returnCode === SUCCESS_STATUS) {
      dictValueOptions.value = res.result || []
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* 原 a-card 纵向三行（j-dict-select-tag / j-select-dict / j-dict-select-tag 均 width:100%） */
.dict-data-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}
.dict-row {
  width: 100%;
}
/* ep-popover 无 width 属性，弹层宽度由内容容器定宽 */
.dict-picker {
  width: 360px;
}
.dict-picker-search {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.dict-picker-search .ep-input {
  flex: 1;
}
.dict-picker-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>
