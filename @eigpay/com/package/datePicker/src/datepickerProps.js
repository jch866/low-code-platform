const props = {
  type: {
    type: String,
    default: 'date'
  },
  placeholder: {
    type: String,
    default: undefined
  },
  modelValue: {
    type: [String, Array],
    default: undefined
  },
  clearable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: true
  },
  format: {
    type: String,
    default: undefined
  },
  valueFormat: {
    type: String,
    default: undefined
  },
  dateFormat: {
    type: String,
    default: undefined
  },
  timeFormat: {
    type: String,
    default: undefined
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  unlinkPanels: {
    type: Boolean,
    default: false
  },
  rangeSeparator: {
    type: String,
    default: '-'
  },
  startPlaceholder: {
    type: String,
    default: '开始日期'
  },
  endPlaceholder: {
    type: String,
    default: '结束日期'
  },
  teleported: {
    type: Boolean,
    default: true
  },
  disabledDate: Function
}

export default props
