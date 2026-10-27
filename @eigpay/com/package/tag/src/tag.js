export const tagProps = {
  closable: Boolean,
  type: {
    type: String,
    values: ['success', 'info', 'warning', 'danger', ''],
    default: ''
  },
  hit: Boolean,
  disableTransitions: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  effect: {
    type: String,
    values: ['dark', 'light', 'plain'],
    default: 'light'
  },
  round: Boolean
}

export const tagEmits = ['close', 'click']
