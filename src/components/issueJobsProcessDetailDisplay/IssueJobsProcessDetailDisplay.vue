<template>
  <!-- 迁移自 Vue2 工程 frog-payadmin-vue的副本/src/views/develop/modules/changejobs/IssueJobsProcessDetailDisplay.vue -->
  <!-- 原 a-modal：title 动态（默认「发布数据详情及对比」，父级改写为 LC0742「跨环境数据对比」/ LC0783「历史数据对比」）、
       width=1600、cancelText=关闭；footer 按 diffType 渲染 恢复（history）/ 发布+同步（cross）+ 固定 取消/确认 -->
  <ep-dialog
    :model-value="visible"
    :title="title"
    width="1600px"
    :close-on-click-modal="false"
    append-to-body
    @close="handleCancel"
  >
    <!-- 原 a-row :gutter=24 三列 a-col :md=8（左 原始数据 / 中 发布数据 / 右 对比数据），ep 无 row/col 改 flex 三等分 -->
    <div class="compare-body">
      <!-- 左列：原始数据（当前开发环境已有数据） -->
      <div class="compare-card">
        <div class="card-title">{{ targetTitle }}</div>
        <!-- 与源差异：原在 changeJobProjectCode==='regulatorRule'/'epfFlow' 且对应内容对象存在时，
             标题区渲染「设计查看」链接（内嵌 RegulatorRuleModal / FlowDesign 查看规则与流程设计），
             两组件均未迁移，此处暂不提供该入口 -->
        <div class="detail-list">
          <template v-if="model.changeSheetJobReferContentObject">
            <div v-for="(item, index) in formItem" :key="index" class="detail-list-item">
              <span class="term">{{ item.columnComments }}</span>
              <span class="content">{{
                defaultIfNull(model.changeSheetJobReferContentObject[item.columnName])
              }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- 中列：发布数据（目标环境取回数据 / 历史记录 / 页面当前数据；存在 dataValueObject 时取其内层） -->
      <div class="compare-card">
        <div class="card-title">{{ srcTitle }}</div>
        <!-- 「设计查看」链接省略说明同左列 -->
        <div class="detail-list">
          <div v-for="(item, index) in formItem" :key="index" class="detail-list-item">
            <span class="term">{{ item.columnComments }}</span>
            <span class="content">{{
              model.changeSheetJobContentObject.dataValueObject === undefined
                ? defaultIfNull(model.changeSheetJobContentObject[item.columnName])
                : defaultIfNull(model.changeSheetJobContentObject.dataValueObject[item.columnName])
            }}</span>
          </div>
        </div>
      </div>

      <!-- 右列：对比数据（diff 片段渲染：added 绿 / removed 红删除线 / 其余灰） -->
      <div class="compare-card">
        <div class="card-title">{{ diffTitle }}</div>
        <div class="detail-list">
          <div v-for="(item, index) in formItem" :key="index" class="detail-list-item">
            <span class="term">{{ item.columnComments }}</span>
            <span class="content">
              <span
                v-for="(part, dIndex) in diffResult[item.columnName] || []"
                :key="dIndex"
                :class="part.added ? 'green' : part.removed ? 'red' : 'grey'"
              >{{ part.value }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <span>
        <!-- 原 a-popconfirm「确定恢复次数据到X环境？」→ handleRecover；ep 无 popconfirm，改为二次确认小弹窗 -->
        <ep-button v-if="diffType === 'history'" @click="openConfirm('recover')">恢复</ep-button>
        <!-- 原 a-popconfirm「确定发布此数据到X环境？」→ handlePublish、「确定同步此数据到X环境？」→ handleSync -->
        <template v-else-if="diffType === 'cross'">
          <ep-button @click="openConfirm('publish')">发布</ep-button>
          <ep-button @click="openConfirm('sync')">同步</ep-button>
        </template>
        <!-- 与源差异：原 恢复/发布/同步 按钮带 rise/fall 图标，ep-button 无图标能力，省略 -->
        <ep-button plain @click="handleOk">取消</ep-button>
        <ep-button type="primary" @click="handleOk">确认</ep-button>
      </span>
    </template>
  </ep-dialog>

  <!-- 底部操作二次确认弹窗（等价原 a-popconfirm，见 openConfirm） -->
  <ep-dialog
    :model-value="confirmVisible"
    title="提示"
    width="420px"
    append-to-body
    @close="confirmVisible = false"
  >
    <div class="confirm-tip">{{ confirmTip }}</div>
    <template #footer>
      <span>
        <ep-button plain @click="confirmVisible = false">取消</ep-button>
        <ep-button type="primary" @click="handleConfirm">确定</ep-button>
      </span>
    </template>
  </ep-dialog>
</template>

<script setup>
/**
 * 发布数据详情及对比（迁移自 Vue2 工程 views/develop/modules/changejobs/IssueJobsProcessDetailDisplay.vue）
 * 三栏对比：原始数据（当前开发环境）| 发布/目标数据 | 逐字段 diff 高亮（行级 diff，绿增红删）
 *
 * 数据流（源组件无 props，全部由父级在打开前注入；迁移后合并为 edit(record, opts)）：
 *   record = {
 *     changeJobProjectCode: 动态表名（决定展示字段集，对应真实接口入参 tableName）
 *     changeSheetJobReferContentObject: 原始数据（可为 undefined，展示「原始数据-无」）
 *     changeSheetJobContentObject: 对比数据（直接为行数据，或 { dataValueObject: 行数据 } 内层结构）
 *   }
 *   opts = { srcPk, tarPk, targetEvni, diffType, title }
 *     - srcPk/tarPk: 标题取值的键（历史比对传 'pkValue'，缺省取 id）
 *     - targetEvni: 目标环境编码（标题「对比X环境数据」及发布/同步报文使用）
 *     - diffType: ''（仅 取消/确认）| 'history'（底部多「恢复」）| 'cross'（底部多「发布」「同步」）
 *
 * 真实接口（联调时替换 mock）：
 *   - 展示字段集: GET /dynamic/table/column/listColumns?tableName={changeJobProjectCode}
 *     （复用 @/api/lowCodePlatform/dynamicHistory 的 getDynamicHistoryListColumns，同址接口）
 *   - 恢复: PUT /dynamic/table/data/handleRecover  body { sourceEnvi, targetEnvi, sourceTableData, targetTableData }
 *   - 发布: PUT /dynamic/table/data/handlePublish  body 同上
 *   - 同步: PUT /dynamic/table/data/handleSync    body 同上（source/target 两侧互换）
 */
import { ref, nextTick } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'
import { EPMessageTips } from '@/utils/utils'
import { getDynamicHistoryListColumns } from '@/api/lowCodePlatform/dynamicHistory'
import {
  handleDynamicTableDataPublish,
  handleDynamicTableDataRecover,
  handleDynamicTableDataSync
} from '@/api/lowCodePlatform/develop'

const props = defineProps({
  // 与源差异：原组件内 mapGetters(['developEnvi']) 取 vuex user.enviCode（当前开发环境编码，
  // 用于标题「当前X环境数据」与发布/同步报文的 sourceEnvi/targetEnvi），子应用无该 vuex 模块，
  // 改为可选 prop（默认空串），由父组件按需传入
  developEnvi: { type: String, default: '' }
})

const emit = defineEmits(['close'])

// 弹窗显隐与标题（原 visible / title）
const visible = ref(false)
const title = ref('发布数据详情及对比')
// 展示字段集（原 formItem：listColumns → result.allColumnsItems）
const formItem = ref([])
// 比对对象（原 model）与逐字段 diff 结果（原 diffResult，键 columnName，值为 diff 片段数组）
const model = ref({})
const diffResult = ref({})
// 原由父级在 edit 前对 ref 逐属性赋值的参数，迁移后改为 edit(record, opts) 一次传入
const srcPk = ref('')
const tarPk = ref('')
const targetEvni = ref('')
const diffType = ref('')
// 三栏标题（原 srcTitle/targetTitle/diffTitle，edit 时按 pk 键与环境名组装）
const srcTitle = ref('发布数据')
const targetTitle = ref('原始数据')
const diffTitle = ref('对比数据')

// 二次确认弹窗（原 a-popconfirm 的等价实现，见 openConfirm/handleConfirm）
const confirmVisible = ref(false)
const confirmTip = ref('')
const confirmAction = ref('')

// 原 defaultIfNull（@/utils/util）：空值统一展示 '-'
const defaultIfNull = (val) => (!val ? '-' : val)

// ===== 行级 diff（替代源 npm 依赖 diff 的 Diff.diffJson，子应用未引入 diff 包，与源差异） =====
// 对齐 diff@3 jsonDiff 行为：非字符串先 JSON.stringify(v, null, '  ')（castInput）→ 按行切分（tokenize）→
// 行内容剥行尾逗号后比较（jsonDiff.equals）→ LCS 行级 diff，输出 [{ value, added?, removed?, count }] 片段
const jsonCastInput = (value) =>
  typeof value === 'string' ? value : JSON.stringify(value ?? null, null, '  ')

// 按行切分（\n 或 \r\n），换行符拼回前一行行尾，末尾空 token 移除（与 diff 行 tokenize 一致）
const tokenizeLines = (value) => {
  const tokens = []
  String(value)
    .split(/(\n|\r\n)/)
    .forEach((seg, i) => {
      if (i % 2 === 1) {
        if (tokens.length) tokens[tokens.length - 1] += seg
      } else {
        tokens.push(seg)
      }
    })
  if (tokens.length && tokens[tokens.length - 1] === '') tokens.pop()
  return tokens
}

// jsonDiff.equals：比对前剥离行尾逗号
const normLine = (line) => line.replace(/,([\r\n])/g, '$1')

const diffJson = (oldVal, newVal) => {
  const a = tokenizeLines(jsonCastInput(oldVal))
  const b = tokenizeLines(jsonCastInput(newVal))
  const n = a.length
  const m = b.length
  // LCS 长度表（行级动态规划）
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        normLine(a[i]) === normLine(b[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const parts = []
  // 连续变更片段合并为「删除块(removed) + 新增块(added)」，与 diff 输出形状一致
  let removed = []
  let added = []
  const flushChanged = () => {
    if (removed.length) parts.push({ value: removed.join(''), removed: true, count: removed.length })
    if (added.length) parts.push({ value: added.join(''), added: true, count: added.length })
    removed = []
    added = []
  }
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (normLine(a[i]) === normLine(b[j])) {
      flushChanged()
      parts.push({ value: a[i], count: 1 })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      removed.push(a[i])
      i += 1
    } else {
      added.push(b[j])
      j += 1
    }
  }
  while (i < n) removed.push(a[i++])
  while (j < m) added.push(b[j++])
  flushChanged()
  return parts
}

/**
 * 打开弹窗（原 edit(record)：父级先对 ref.srcPk/tarPk/targetEvni/diffType 赋值再调 edit(record)，
 * 迁移后合并为 edit(record, opts)；流程：组装三栏标题 → 查 listColumns → 组装逐字段 diff → 显示）
 */
const edit = (record, opts = {}) => {
  diffResult.value = {}
  model.value = record || {}
  srcPk.value = opts.srcPk ?? ''
  tarPk.value = opts.tarPk ?? ''
  targetEvni.value = opts.targetEvni ?? ''
  diffType.value = opts.diffType ?? ''
  title.value = opts.title ?? '发布数据详情及对比'
  nextTick(() => {
    const cur = model.value
    const content = cur.changeSheetJobContentObject || {}
    // 中列标题：对比{目标环境}环境数据-{pk 键值或 id}
    if (tarPk.value !== '') {
      srcTitle.value = '对比' + targetEvni.value + '环境数据-' + content[tarPk.value]
    } else if (content.dataValueObject === undefined) {
      srcTitle.value = '对比' + targetEvni.value + '环境数据-' + content.id
    } else {
      srcTitle.value = '对比' + targetEvni.value + '环境数据-' + content.dataValueObject.id
    }
    // 左列标题：当前{开发环境}环境数据-{pk 键值或 id}；无原始数据时「原始数据-无」
    if (cur.changeSheetJobReferContentObject !== undefined) {
      const refer = cur.changeSheetJobReferContentObject
      targetTitle.value =
        srcPk.value !== ''
          ? '当前' + props.developEnvi + '环境数据-' + refer[srcPk.value]
          : '当前' + props.developEnvi + '环境数据-' + refer.id
    } else {
      targetTitle.value = '原始数据-无'
    }
    // 原接口：GET /dynamic/table/column/listColumns?tableName={changeJobProjectCode}
    // （复用 dynamicHistory.js 同址接口的 mock，联调时替换）
    getDynamicHistoryListColumns({ tableName: cur.changeJobProjectCode }).then((res) => {
      if (res.returnCode === SUCCESS_STATUS) {
        formItem.value = res.result.allColumnsItems || []
        visible.value = true
        // 逐字段 diff（原 Diff.diffJson：两侧取值 falsy 时以 '-' 兜底；对比侧 dataValueObject 存在时取内层）
        const refer = cur.changeSheetJobReferContentObject
        formItem.value.forEach((item) => {
          const newPart = content.dataValueObject === undefined ? content : content.dataValueObject
          diffResult.value[item.columnName] = diffJson(
            refer ? (refer[item.columnName] ? refer[item.columnName] : '-') : '',
            newPart[item.columnName] ? newPart[item.columnName] : '-'
          )
        })
      }
    })
  })
}

/** 关闭（原 close：emit close、清空 diff 结果、隐藏） */
const close = () => {
  emit('close')
  diffResult.value = {}
  visible.value = false
}

/** 取消/确认（原 handleOk：两个按钮均直接关闭） */
const handleOk = () => close()

/** 右上角关闭（原 handleCancel → close） */
const handleCancel = () => close()

/** 底部操作 → 二次确认（原 a-popconfirm 文案，ep 无 popconfirm 以小弹窗等价实现） */
const openConfirm = (action) => {
  const enviText = targetEvni.value
  const tips = {
    recover: `确定恢复次数据到${enviText}环境？`,
    publish: `确定发布此数据到${enviText}环境？`,
    sync: `确定同步此数据到${enviText}环境？`
  }
  confirmAction.value = action
  confirmTip.value = tips[action]
  confirmVisible.value = true
}

/**
 * 确认执行（原 handleRecover / handlePublish / handleSync，均 PUT，body：
 * { sourceEnvi, targetEnvi, sourceTableData, targetTableData }，同步接口两侧互换，成功后关闭弹窗）
 */
const handleConfirm = () => {
  const envi = props.developEnvi
  const cur = model.value
  const apis = {
    recover: {
      fn: handleDynamicTableDataRecover,
      body: {
        sourceEnvi: envi,
        targetEnvi: targetEvni.value,
        sourceTableData: cur.changeSheetJobReferContentObject,
        targetTableData: cur.changeSheetJobContentObject
      }
    },
    publish: {
      fn: handleDynamicTableDataPublish,
      body: {
        sourceEnvi: envi,
        targetEnvi: targetEvni.value,
        sourceTableData: cur.changeSheetJobReferContentObject,
        targetTableData: cur.changeSheetJobContentObject
      }
    },
    sync: {
      fn: handleDynamicTableDataSync,
      body: {
        sourceEnvi: targetEvni.value,
        targetEnvi: envi,
        sourceTableData: cur.changeSheetJobContentObject,
        targetTableData: cur.changeSheetJobReferContentObject
      }
    }
  }
  const { fn, body } = apis[confirmAction.value]
  fn(body)
    .then((res) => {
      if (res.returnCode === SUCCESS_STATUS) {
        EPMessageTips('success', res.returnMsg)
      } else {
        EPMessageTips('warning', res.returnMsg)
      }
    })
    .finally(() => {
      confirmVisible.value = false
      close()
    })
}

defineExpose({ edit })
</script>

<style scoped>
/* 原 a-row 三列 a-col :md=8 改 flex 三等分 */
.compare-body {
  display: flex;
  gap: 16px;
}
/* 原 a-card（head-title font-weight 600）改轻量卡片 */
.compare-card {
  flex: 1;
  min-width: 0;
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}
.card-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  word-break: break-all;
}
/* 原 DetailList col=1（term 加粗、content 独占一行） */
.detail-list-item {
  display: flex;
  padding: 6px 0;
  font-size: 14px;
  line-height: 1.6;
}
.detail-list-item .term {
  flex-shrink: 0;
  font-weight: bold;
  color: #333;
}
.detail-list-item .term::after {
  content: '：';
}
.detail-list-item .content {
  flex: 1;
  display: block;
  color: #666;
  word-break: break-all;
}
/* diff 片段配色（原 .green darkgreen / .red red+删除线；.grey 源样式即无规则，保持默认色） */
.green {
  color: darkgreen;
}
.red {
  color: red;
  text-decoration: line-through;
}
.confirm-tip {
  padding: 8px 0;
  font-size: 14px;
  color: #333;
}
</style>
