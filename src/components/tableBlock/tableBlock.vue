<template>
  <div :class="tableClass" class="table-block">
    <!-- 操作区 -->
    <div v-if="showOperation" class="operation-bar">
      <slot name="operationCustom">
        <template v-for="item in buttonGroups">
          <ep-button
            v-if="item.isShow === false ? false : true"
            :key="item.index"
            :type="item.type || 'primary'"
            :class="item.className"
            :disabled="item.disabled"
            :plain="item.plain || false"
            @click="item.methods"
          >
            {{ $t(item.text) }}
          </ep-button>
        </template>
      </slot>
    </div>
    <!-- 表格 -->
    <ep-table
      ref="epTable"
      :data="state.dataList"
      :empty-text="props.emptyText"
      @row-click="rowClick"
    >
      <!-- 多层级 折叠 -->
      <ep-table-column v-if="showExpandColumn" width="40" type="expand">
        <template #default="{ expanded }">
          <ep-icon
            icon="ep-i-arrow-to-right"
            :class="{ anim: true, 'expanded-icon': expanded }"
          ></ep-icon>
        </template>
        <template #expand="{ row }">
          <slot name="expandContent" :expand-config="row" />
        </template>
      </ep-table-column>
      <!-- 当前行 单选 -->
      <ep-table-column v-if="showSingleSelectColumn" width="55">
        <template #default="rowScope">
          <ep-radio
            v-model="state.currentRow"
            :value="rowScope.rowIndex"
            @change="handleRadioChange(rowScope.row, rowScope.rowIndex)"
          >
            <span />
          </ep-radio>
        </template>
      </ep-table-column>
      <!-- 多选 -->
      <ep-table-column v-if="showMultiSelectColumn" width="80" label="">
        <template #header>
          <ep-checkbox
            ref="selectAll"
            v-model="state.isAll"
            :indeterminate="indeterminate"
            @change="handleSelectAll"
          />
        </template>
        <template #default="{ row }">
          <ep-checkbox
            v-model="row.checked"
            @change="handlecheckboxChange(row)"
          />
        </template>
      </ep-table-column>
      <!-- 序列号 -->
      <ep-table-column
        v-if="showIndexColumn"
        :label="$t('common.businessField.C0104')"
        align="center"
        width="60"
      >
        <template #default="rowScope">
          <span>
            {{
              (state.paging.pageNo - 1) * state.paging.pageSize +
              rowScope.rowIndex +
              1
            }}
          </span>
        </template>
      </ep-table-column>
      <!-- 表格内容 -->
      <template v-for="(colConfig, index) in props.tableColumns">
        <!-- 表格插槽 -->
        <slot
          v-if="colConfig.slot && colConfig.isShow"
          :name="colConfig.slot"
          :col-config="colConfig"
        />
        <template v-else-if="colConfig.component">
          <component
            :is="colConfig.component"
            v-if="colConfig.isShow"
            :key="index"
            :col-config="colConfig"
          />
        </template>
        <!-- 表格数据 -->
        <ep-table-column
          v-else-if="colConfig.isShow"
          :key="index"
          :width="colConfig.width"
          :min-width="colConfig.minWidth"
          :prop="colConfig.prop"
          :label="$t(colConfig.label) || colConfig.label"
          :align="colConfig.align"
          :header-align="colConfig.headerAlign"
          :formatter="colConfig.formatter"
          :show-overflow-tooltip="colConfig.overflowTooltip"
        />
      </template>
    </ep-table>
    <!-- 分页 -->
    <div v-if="showPaging" class="pagination">
      <ep-pagination
        v-if="state.paging.total"
        v-model:current-page="state.paging.pageNo"
        v-model:page-size="state.paging.pageSize"
        :page-sizes="PAGE_SIZES"
        background
        :total="state.paging.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch, computed, reactive, watchEffect } from 'vue'
import { PAGE_SIZE, PAGE_NO, PAGE_SIZES } from '@/config/config'

const emit = defineEmits([
  'rowClick',
  'selectionChange',
  'pageSizeChange',
  'handleCurrentChange'
])
const selectAll = ref(null)
const props = defineProps({
  tableClass: {
    type: [String, Array],
    required: false,
    default: null
  },
  // 是否显示 table顶部的操作栏
  showOperation: {
    type: Boolean,
    required: false,
    default: false
  },
  // 按钮操作
  buttonGroups: {
    type: Array,
    default: () => []
  },
  // 是否显示分页
  showPaging: {
    type: Boolean,
    required: false,
    default: true
  },
  // 分页配置
  pageObj: {
    type: Object,
    required: false,
    default: () => ({
      total: 0,
      pageSize: PAGE_SIZE,
      pageNo: PAGE_NO
    })
  },
  // 行数据
  tableData: {
    type: Array,
    required: false,
    default() {
      return []
    }
  },
  // 列配置信息
  tableColumns: {
    type: Array,
    required: false,
    default() {
      return []
    }
  },
  // 是否显示多选框，第一列显示
  showMultiSelectColumn: {
    type: Boolean,
    required: false,
    default: false
  },
  // 是否显示单选框，第一列显示
  showSingleSelectColumn: {
    type: Boolean,
    required: false,
    default: false
  },
  // 是否显示expand，第一列显示
  showExpandColumn: {
    type: Boolean,
    required: false,
    default: false
  },
  showIndexColumn: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: ''
  },
  // 自动查询
  autoRequest: {
    type: Boolean,
    required: false,
    default: false
  },
  // 查询列表数据的方法，需要返回一个数组。 比如分页，刷新，每页数据大小变化，希望本组件能自动处理查询，请传入查询函数
  queryDataFun: {
    type: Function,
    required: false,
    default: () => []
  },
  // 查询列表数据的参数，比如分页，刷新，每页数据大小变化，希望本组件能自动处理查询，希望本组件能自动处理查询，请传入参数
  searchParams: {
    type: Object,
    required: false,
    default: () => ({})
  }
})
const state = reactive({
  dataList: [],
  paging: {
    total: 0,
    pageSize: PAGE_SIZE,
    pageNo: PAGE_NO
  },
  currentRow: null,
  isAll: false,
  search: null
})

const params = computed(() => {
  return {
    ...state.search
  }
})

watchEffect(() => {
  const checkedItems = state.dataList.filter((item) => item.checked)
  state.isAll =
    checkedItems.length > 0 && checkedItems.length === state.dataList.length
})
const indeterminate = computed(() => {
  const checkedItems = state.dataList.filter((item) => item.checked)
  return (
    checkedItems.length > 0 && checkedItems.length !== state.dataList.length
  )
})

const queryData = async () => {
  if (props.autoRequest) {
    state.dataList = await props.queryDataFun(params)
  }
}

// 行单击
const rowClick = (currentRow, rowIndex) => {
  if (props.showSingleSelectColumn) {
    state.currentRow = rowIndex
  }
  handleRadioChange(currentRow, rowIndex)
}

// 单选逻辑
const handleRadioChange = (currentRow, rowIndex) => {
  const row = _.cloneDeep(currentRow)
  'checked' in row && delete row.checked
  emit('rowClick', { row, rowIndex })
}

// 多选逻辑
const handlecheckboxChange = () => {
  const checkedList = _.cloneDeep(state.dataList).filter((item) => item.checked)
  checkedList.forEach((item) => 'checked' in item && delete item.checked)
  emit('selectionChange', checkedList)
}

const handleSelectAll = (event) => {
  var checked = event.target.checked
  state.dataList.forEach((item) => (item.checked = checked))
  handlecheckboxChange()
}

const handleSizeChange = (val) => {
  emit('pageSizeChange', val)
  queryData()
}
const handleCurrentChange = (val) => {
  emit('handleCurrentChange', val)
  queryData()
}

watch(
  () => props.tableData,
  (newV) => {
    state.dataList = newV
  },
  { immediate: true, deep: true }
)
watch(
  () => props.pageObj,
  (newV) => {
    state.paging = { ...newV }
  },
  { immediate: true, deep: true }
)
watch(
  () => props.searchParams,
  (newV) => {
    if (JSON.stringify(newV).length > 2) {
      // 确保传进来有参数
      state.search = newV
      queryData()
    }
  },
  { deep: true }
)
</script>

<script>
export default {
  name: 'TableBlock'
}
</script>

<style lang="scss" scoped>
.table-block {
  background: #fff;
  border-radius: 4px;
  padding: unit-convertor(15) unit-convertor(20) 0;
  .operation-bar {
    @apply flex;
    margin-bottom: unit-convertor(15);
  }
  :deep(.ep-table) {
    .ep-table__header-wrapper {
      .ep-table__cell {
        background-color: #f5f9ff;
        color: #000;
      }
    }
    .ep-table__body-wrapper {
      .ep-table__cell {
        color: #666;
      }
    }
  }
  .table-operation {
    display: flex;
    font-size: 14px;
    color: #262AFF;
    line-height: 2rem;
    .button {
      white-space: nowrap;
    }
    .split {
      margin: 0 10px;
      color: #bfcae2;
    }
  }
  .table-operation-more {
    width: 100%;
    .table-operation-item {
      white-space: nowrap;
      height: 37px;
      line-height: 37px;
      .text {
        color: #666;
      }
    }
  }
  .pagination {
    height: 64px;
    line-height: 64px;
    .ep-pagination {
      @apply justify-end;
    }
  }
}
:deep(.ep-table-popper) {
  padding: 8px 10px !important;
}
</style>
