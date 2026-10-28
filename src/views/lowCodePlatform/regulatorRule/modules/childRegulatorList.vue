<template>
  <!-- 迁移自 frog-payadmin-vue的副本/src/views/modules/configuration/modules/child/ChildRegulatorList.vue（多决策/多渲染 子规则列表） -->
  <div class="j-child-regulator-list">
    <div class="section-title">业务处理规则列表</div>

    <!-- 空态（原 a-empty + 新增链接） -->
    <div v-if="regulatorChilds.length === 0" class="empty-row">
      <span>没有配置子节点处理器</span>
      <span class="empty-divider">|</span>
      <ep-button
        v-if="!disabled"
        plain
        type="primary"
        class="text-button"
        @click="handleChildAdd"
      >新增</ep-button>
    </div>

    <template v-else>
      <ep-card
        v-for="(item, index) in regulatorChilds"
        :key="index"
        class="child-card"
      >
        <div class="card-row">
          <!-- 分组多选（源 a-select mode=multiple，选项来自 GroupSet groupSets） -->
          <ep-select
            v-model="item.groups"
            multiple
            placeholder="请选择分组"
            :disabled="disabled"
            class="group-select"
          >
            <ep-option
              v-for="(subGroup, idx) in groupSets"
              :key="'group' + idx"
              :label="subGroup.groupName"
              :value="subGroup.groupId"
            />
          </ep-select>
          <span class="index-tag">{{ index }}</span>
          <!-- 与源差异：原 JSelectRegulator（JSelectBizComponent 规则选择器）为深层选择器，以只读输入框占位 -->
          <ep-input
            :model-value="item.regulatorName || ''"
            readonly
            :disabled="disabled"
            placeholder="选择器待迁移：JSelectRegulator（字段 regulatorName）"
            class="rule-input"
            type="text"
          />
          <div class="card-actions">
            <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleChildUp(index)">上移</ep-button>
            <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleChildDown(index)">下移</ep-button>
            <ep-button plain type="primary" class="button-text" :disabled="disabled" @click="handleChildAdd">新增</ep-button>
            <ep-button plain type="danger" class="button-text" :disabled="disabled" @click="handleChildDel(index)">删除</ep-button>
          </div>
        </div>
      </ep-card>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { sortByKey } from './ruleConstants'

const props = defineProps({
  // 分组行数据（源 groupSetsParam，与 GroupSet 共享 modal groupSets）
  groupSetsParam: { type: Array, required: true, default: () => [] },
  // 子规则行数据（源 regulatorChildsParam，modal regulatorChilds）
  regulatorChildsParam: { type: Array, required: true, default: () => [] },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:regulatorChildsParam'])

const groupSets = ref([])
const regulatorChilds = ref([])

// 本地副本 + 双向 watch（与源 created/mounted 拷贝 + watch 回写一致）；与源差异：回显行补齐 groups 空数组，适配 ep-select multiple
watch(() => props.groupSetsParam, (v) => { groupSets.value = v }, { immediate: true })
watch(
  () => props.regulatorChildsParam,
  (v) => {
    ;(v || []).forEach((item) => {
      if (!item.groups) item.groups = []
    })
    regulatorChilds.value = v
  },
  { immediate: true }
)
watch(regulatorChilds, (v) => emit('update:regulatorChildsParam', v), { deep: true })

/** 新增子节点（源 handleChildAdd；groups 初始化为空数组以适配 ep-select multiple，与源差异） */
const handleChildAdd = () => {
  regulatorChilds.value.push({
    childType: 'CHILD',
    groups: [],
    assignSeq: regulatorChilds.value.length
  })
  sort('dsc')
}

/** 删除（源 handleChildDel） */
const handleChildDel = (index) => {
  regulatorChilds.value.splice(index, 1)
}

/** 上移（源 handleChildUp：交换 assignSeq 后按 assignSeq 重排） */
const handleChildUp = (index) => {
  const currentObj = regulatorChilds.value.find((p) => p.assignSeq === index)
  if (currentObj == null) return
  const changeObj = regulatorChilds.value[index - 1]
  if (changeObj == null) return
  const currentSeq = currentObj.assignSeq
  const changeSeq = changeObj.assignSeq
  currentObj.assignSeq = changeSeq
  changeObj.assignSeq = currentSeq
  sortByKey(regulatorChilds.value, 'assignSeq')
}

/** 下移（源 handleChildDown） */
const handleChildDown = (index) => {
  const currentObj = regulatorChilds.value.find((p) => p.assignSeq === index)
  if (currentObj == null) return
  const changeObj = regulatorChilds.value[index + 1]
  if (changeObj == null) return
  const currentSeq = currentObj.assignSeq
  const changeSeq = changeObj.assignSeq
  currentObj.assignSeq = changeSeq
  changeObj.assignSeq = currentSeq
  sortByKey(regulatorChilds.value, 'assignSeq')
}

/** 排序（源 sort：asc/dsc） */
const sort = (type) => {
  if (type === 'asc') {
    regulatorChilds.value.sort((a, b) => a.assignSeq > b.assignSeq)
  } else if (type === 'dsc') {
    regulatorChilds.value.sort((a, b) => a.assignSeq < b.assignSeq)
  }
}
</script>

<style scoped>
.j-child-regulator-list {
  width: 100%;
  min-height: 50px;
}
.section-title {
  width: 100%;
  background-color: #ebebeb;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-size: 14px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}
.empty-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #909399;
  padding: 12px 0;
}
.empty-divider {
  color: #dcdfe6;
}
.child-card {
  margin-bottom: 8px;
}
.card-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.group-select {
  width: 220px;
  flex-shrink: 0;
}
.rule-input {
  flex: 1;
  min-width: 0;
}
.card-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.index-tag {
  flex-shrink: 0;
  min-width: 28px;
  text-align: center;
  padding: 5px 6px;
  background: #f0f2f5;
  border-radius: 2px;
  font-size: 12px;
  color: #606266;
}
</style>
