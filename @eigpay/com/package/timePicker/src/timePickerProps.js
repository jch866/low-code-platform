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
  format: {
    type: String,
    default: undefined
  },
  valueFormat: {
    type: String,
    default: undefined
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  teleported: {
    type: Boolean,
    default: true
  },
  disabledDate: Function
}

export default props
