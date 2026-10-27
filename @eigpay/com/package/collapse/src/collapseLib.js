export const collapseKey = Symbol('collapse')
export const UPDATE_MODEL_EVENT = 'update:modelValue'
export const CHANGE_EVENT = 'change'
export const generateId = () => Math.floor(Math.random() * 10000)

export const ensureArray = (arr) => {
  if (!arr) return []
  return Array.isArray(arr) ? arr : [arr]
}
