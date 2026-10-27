import { ref } from 'vue'
const LEVEL_ONE_KEY = 'ep-citys-key'
const levelOneMap = ref(new Map())
const levelTwoMap = ref(new Map())
const levelThreeMap = ref(new Map())

export function savelevelOneList(list) {
  levelOneMap.value.set(LEVEL_ONE_KEY, list)
}

export function getLevelOneCache() {
  return levelOneMap.value.get(LEVEL_ONE_KEY)
}

export function saveLevelTwoList(id, list) {
  levelTwoMap.value.set(id, list)
}

export function getLevelTwoCacheById(id) {
  return levelTwoMap.value.get(id)
}

export function saveLevelThreeList(id, list) {
  levelThreeMap.value.set(id, list)
}

export function getLevelThreeCacheById(id) {
  return levelThreeMap.value.get(id)
}
