import { shallowReactive } from 'vue'

export const instances = shallowReactive([])

export const getInstance = (uid) => {
  const idx = instances.findIndex((item) => item.uid === uid)
  const current = instances[idx]
  let prev
  if (idx > 0) {
    prev = instances[idx - 1]
  }
  return { current, prev }
}

export const getLastOffset = (uid) => {
  const { prev } = getInstance(uid)
  if (!prev) {
    return 0
  }
  return prev.vm.exposed.bottom.value
}
