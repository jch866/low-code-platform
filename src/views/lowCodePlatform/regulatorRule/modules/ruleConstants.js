/**
 * 规则子组件（B 组）共用常量与工具
 * 与源差异：源经 j-dict-select-tag 按后端字典动态渲染选项，此处为 mock 模式硬编码（dictCode 见各注释），
 * label 为示意文案，联调后替换为 getMultiDictsMore 字典渲染
 */

// 字典 regulator_field_type：数据集字段类型（源 SingleRule / DataAssign / DecisionRule / SubListRegulatorList / ValidateResult 使用）
export const REGULATOR_FIELD_TYPE_OPTIONS = [
  { value: 'FIXED', label: '固定数据' },
  { value: 'MSG', label: '报文数据' },
  { value: 'TRANS', label: '透传数据' },
  { value: 'CTX', label: '上下文数据' },
  { value: 'REDIS', label: 'Redis数据' },
  { value: 'REF_MSG', label: '引用报文数据' },
  { value: 'OUT_MSG', label: '输出报文数据' },
  { value: 'DICT', label: '数据字典' },
  { value: 'TABLE', label: '数据表' },
  { value: 'DYNAMIC', label: '动态模型' }
]

// 字典 rule_conditions：合并规则运算符（源 DecisionRule operator 字段使用；选项值/文案为示意，联调后由字典提供）
export const RULE_CONDITION_OPTIONS = [
  { value: '==', label: '等于(==)' },
  { value: '!=', label: '不等于(!=)' },
  { value: '>', label: '大于(>)' },
  { value: '>=', label: '大于等于(>=)' },
  { value: '<', label: '小于(<)' },
  { value: '<=', label: '小于等于(<=)' },
  { value: 'LIKE', label: '包含(LIKE)' },
  { value: 'IN', label: '属于(IN)' }
]

// 处理参数扩展类型（源 SingleRule extendParams / SubListRegulatorList regulatorParam 的 fieldType 仅支持两种）
export const EXT_PARAM_TYPE_OPTIONS = [
  { value: 'FIXED', label: '固定数据' },
  { value: 'DICT', label: '数据字典' }
]

/**
 * 各字段类型对应的深层选择器占位说明（原组件名 + 主要绑定字段名）
 * 与源差异：MsgData/TransData/CTXData/RedisData/RefMsgData/OutMsgData/DictData/TableData/DynamicModelData
 * 等数据集/字段选择器不在本次迁移范围，以只读输入框 + 选择器待迁移 占位
 */
export const SELECTOR_PLACEHOLDER_MAP = {
  MSG: 'MsgData（logicalName，字典 logical_fields_xpath）',
  TRANS: 'TransData（transType/sourceType/transDataType/fieldName）',
  CTX: 'CTXData（ctxName/ctxType）',
  REDIS: 'RedisData（redisOperType/item/key/time）',
  REF_MSG: 'RefMsgData（referType/logicalName）',
  OUT_MSG: 'OutMsgData（fieldPath/paramName）',
  DICT: 'DictData（fetchType/dictType/dictValue，j-select-dict）',
  TABLE: 'TableData（j-select-data-base-tables/j-select-table-field）',
  DYNAMIC: 'DynamicModelData（j-select-dynamic-model）'
}

/** 生成占位文案：选择器待迁移：原组件名（字段） */
export const selectorPlaceholder = (fieldType) =>
  '选择器待迁移：' + (SELECTOR_PLACEHOLDER_MAP[fieldType] || '数据集/字段选择器')

/** 生成行 id（源使用 flow 设计器 ZFSN.getId()，子应用不引入 flow 依赖，改为时间戳+随机串，与源差异） */
export const nextRowId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

/** 切换字段类型时保证 params 对象存在（源依赖后端回显数据自带 params 结构，新增/切换时补齐，与源差异） */
export const ensureParams = (data) => {
  if (data && !data.params) data.params = {}
  return data
}

/** 按 key 升序排序（源 sortByKey 原样迁移，assignSeq 交换后重排用） */
export const sortByKey = (array, key) =>
  array.sort((a, b) => {
    const x = a[key]
    const y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
