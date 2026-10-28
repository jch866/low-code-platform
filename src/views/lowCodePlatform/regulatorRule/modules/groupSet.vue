<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/group/GroupSet.vue（规则分组设置） -->
  <div class="j-regulator-group-set">
    <div class="group-toolbar">
      <!-- 原 a-checkbox :checked + @change，与源差异：改为 v-model computed 双向（emit update:isGroupProp） -->
      <ep-checkbox v-model="isGroup" :disabled="disabled" />
      <span class="toolbar-label">是否需要分组</span>
      <ep-button
        v-if="isGroup && !disabled"
        plain
        type="primary"
        class="button-text"
        @click="handleGroupAdd"
      >增加分组</ep-button>
    </div>
    <ep-table
      v-if="isGroup"
      ref="tableRef"
      :data="groupSets"
      row-key="id"
      empty-text="暂无数据"
      class="group-table"
    >
      <ep-table-column label="#" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </ep-table-column>
      <ep-table-column label="分组标识" width="200" align="center">
        <template #default="{ row }">
          <ep-input v-model="row.groupId" :disabled="disabled" placeholder="请输入分组标识" type="text" />
        </template>
      </ep-table-column>
      <ep-table-column label="分组名称" width="200" align="center">
        <template #default="{ row }">
          <ep-input v-model="row.groupName" :disabled="disabled" placeholder="请输入分组名称" type="text" />
        </template>
      </ep-table-column>
      <ep-table-column label="分组规则" min-width="300" align="center">
        <template #default="{ row }">
          <!-- 与源差异：原 JSelectRegulator（JSelectBizComponent 规则选择器）为深层选择器，以只读输入框占位 -->
          <ep-input
            :model-value="row.groupIdentifyRegulator || ''"
            readonly
            :disabled="disabled"
            placeholder="选择器待迁移：JSelectRegulator（字段 groupIdentifyRegulator）"
            type="text"
          />
        </template>
      </ep-table-column>
      <ep-table-column v-if="!disabled" label="操作" width="150" align="center">
        <template #default="{ $index }">
          <ep-button plain type="primary" class="button-text" @click="handleGroupAdd">添加行</ep-button>
          <ep-button plain type="danger" class="button-text" @click="handleGroupSetDel($index)">删除</ep-button>
        </template>
      </ep-table-column>
    </ep-table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { nextRowId } from './ruleConstants'

const props = defineProps({
  // 分组行数据（源 groupSetsParam，modal groupSets）
  groupSetsParam: { type: Array, required: true, default: () => [] },
  // 是否分组（源 isGroupProp，modal model.hasGroup）
  isGroupProp: { type: Boolean, required: true, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:isGroupProp', 'call'])

const tableRef = ref(null)
const groupSets = ref([])

// 是否分组：computed 双向（get 读 prop，set 发 update:isGroupProp，等价源 .sync）
const isGroup = computed({
  get: () => props.isGroupProp,
  set: (val) => emit('update:isGroupProp', val)
})

// 行数据本地副本（prop 引用），深变更 emit call（源 watch deep → $emit('call') 由 modal setGroupSet 接收）
watch(() => props.groupSetsParam, (v) => { groupSets.value = v }, { immediate: true })
watch(groupSets, (v) => emit('call', v), { deep: true })

/** 增加分组（源 handleGroupAdd：ZFSN.getId 改 nextRowId，与源差异） */
const handleGroupAdd = () => {
  groupSets.value.push({
    id: nextRowId(),
    groupName: '',
    groupDesc: ''
  })
}

/** 删除分组行（源 handleGroupSetDel） */
const handleGroupSetDel = (index) => {
  groupSets.value.splice(index, 1)
}
</script>

<style scoped>
.j-regulator-group-set {
  width: 100%;
  min-height: 50px;
}
.group-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.toolbar-label {
  color: rgba(0, 0, 0, 0.85);
}
.group-table {
  width: 90%;
  margin: 0 auto;
}
</style>
