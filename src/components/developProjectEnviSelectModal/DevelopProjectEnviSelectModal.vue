<template>
  <!-- 迁移自 Vue2 工程 frog-payadmin-vue的副本/src/views/develop/modules/DevelopProjectEnviSelectModal.vue -->
  <!-- 原 a-modal：title=操作(common.operation，页面接入时改写为 LC0730「比对数据环境选择」)、width=600、
       confirmLoading、maskClosable=false、okText 默认「确定」、cancelText=关闭(common.close) -->
  <ep-dialog
    :model-value="visible"
    title="比对数据环境选择"
    width="600px"
    :close-on-click-modal="false"
    append-to-body
    @close="handleCancel"
  >
    <!-- 原 a-spin :spinning=confirmLoading + a-radio-group @change=handleInput（单选目标比对环境） -->
    <div v-loading="confirmLoading" class="envi-body">
      <ep-radio-group v-model="value">
        <div class="envi-list">
          <ep-radio
            v-for="item in envis"
            :key="item.enviCode"
            :value="item.enviCode"
          >{{ item.enviName }}</ep-radio>
        </div>
      </ep-radio-group>
      <div v-if="!envis.length && !confirmLoading" class="envi-empty">暂无可选比对环境</div>
    </div>
    <!-- 原 IssueJobsProcessDetailDisplay（比对结果展示，ref=modalForm）属 B 组组件未迁移，
         确定后暂以 EPMessageTips 提示替代，见 handleCheck 注释 -->
    <template #footer>
      <span>
        <ep-button plain @click="handleCancel">关闭</ep-button>
        <ep-button type="primary" :disabled="confirmLoading" @click="handleOk">确定</ep-button>
      </span>
    </template>
  </ep-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { EPMessageTips } from '@/utils/utils'
import { getDevelopAllEnvis, getDynamicTableFetchByIdWithEnvi } from '@/api/lowCodePlatform/develop'

const emit = defineEmits(['close'])

// 弹窗显隐（原 visible）
const visible = ref(false)
const confirmLoading = ref(false)
// 当前比对源记录（原 model，页面 edit(record) 传入，需含 id/tableName）
const model = ref({})
// 可选比对环境列表（原 envis，字段 enviCode/enviName）
const envis = ref([])
// 选中的目标环境编码（原 value）
const value = ref('')

// 原 url 配置：
// list:   GET /develop/environment/getAllEnvis            （查询全部比对环境）
// detail: GET /dynamic/table/data/fetchByIdWithEnvi       （按目标环境取记录详情）

/**
 * 打开弹窗（原 edit(record)：清空选中 → 查询环境列表 → 过滤当前开发环境 → 显示）
 * record 需含 id（数据标识）与 tableName（模型表名），父页面接入方式与源一致：ref.edit(row)
 */
const edit = (record) => {
  value.value = ''
  model.value = record || {}
  confirmLoading.value = true
  getDevelopAllEnvis()
    .then((res) => {
      if (res.returnCode === SUCCESS_STATUS) {
        envis.value = res.result || []
        // 与源差异：原按 vuex developEnvi getter 过滤掉当前开发环境（子应用无该 vuex 模块），不再过滤
      }
    })
    .finally(() => {
      confirmLoading.value = false
      visible.value = true
    })
}

/** 关闭（原 close：emit close 并清空状态） */
const close = () => {
  emit('close')
  envis.value = []
  value.value = ''
  visible.value = false
}

/** 确定（原 handleOk：按选中环境查询目标数据 → handleCheck 组装比对参数） */
const handleOk = () => {
  confirmLoading.value = true
  const params = { id: model.value.id, envi: value.value }
  getDynamicTableFetchByIdWithEnvi(params)
    .then((res) => {
      if (res.returnCode === SUCCESS_STATUS) {
        const refData = res.result !== undefined && res.result !== null ? res.result : null
        handleCheck(value.value, model.value, refData)
      }
    })
    .finally(() => {
      confirmLoading.value = false
    })
}

/** 关闭回调（原 handleCancel → close） */
const handleCancel = () => {
  close()
}

/**
 * 组装比对参数（原 handleCheck 逻辑照搬）：
 * obj = {
 *   changeJobProjectCode: 源记录表名(model.tableName)
 *   changeSheetJobReferContentObject: 源记录（pkValue 缺省取 id）
 *   changeSheetJobContentObject: 目标环境记录（pkValue 取 dataValueObject.id；无目标数据时置空结构）
 * }
 * 与源差异：原随后打开 IssueJobsProcessDetailDisplay（edit(obj)、diffType='cross'、
 * title=LC0742「跨环境数据对比」），该展示组件属 B 组未迁移，
 * 此处暂以提示告知，obj 组装逻辑与真实接口保留，待 B 组迁移后接回展示组件
 */
const handleCheck = (targetEnvi, sourceRecord, targetRecord) => {
  const obj = {
    changeJobProjectCode: sourceRecord.tableName,
    changeSheetJobReferContentObject: sourceRecord,
    changeSheetJobContentObject: targetRecord
  }
  if (obj.changeSheetJobReferContentObject.pkValue === undefined || obj.changeSheetJobReferContentObject.pkValue === '') {
    obj.changeSheetJobReferContentObject.pkValue = obj.changeSheetJobReferContentObject.id
  }
  if (obj.changeSheetJobContentObject !== null && obj.changeSheetJobContentObject.pkValue === undefined) {
    obj.changeSheetJobContentObject.pkValue = obj.changeSheetJobContentObject.dataValueObject.id
  } else if (obj.changeSheetJobContentObject === undefined || obj.changeSheetJobContentObject === null) {
    obj.changeSheetJobContentObject = { pkValue: '', dataValueObject: {} }
  } else {
    obj.changeSheetJobContentObject.pkValue = ''
  }
  // 原逻辑（B 组展示组件迁移后接回）：modalForm.srcPk='pkValue'、tarPk='pkValue'、
  // targetEvni=targetEnvi、diffType='cross'、edit(obj)、title=LC0742「跨环境数据对比」
  EPMessageTips('warning', '比对结果展示组件待迁移')
  close()
}

defineExpose({
  edit
})
</script>

<style scoped>
.envi-body {
  min-height: 80px;
}
/* 原 a-radio-group 纵向排列单选项 */
.envi-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}
.envi-empty {
  color: #999;
}
</style>
