<template>
  <div :class="ns.b()">
    <div :class="ns.e('top')">
      <ep-select
        v-model="city"
        :placeholder="
          props.levelOnePlaceholder || t('adress.levelOnePlaceholder')
        "
        :disabled="itemDisabled"
        :validate-event="false"
        :filterable="filterable"
      >
        <ep-option
          v-for="item in cityOptions"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </ep-select>
      <ep-select
        v-model="county"
        :placeholder="
          props.levelTwoPlaceholder || t('adress.levelTwoPlaceholder')
        "
        :disabled="itemDisabled"
        :validate-event="false"
        :filterable="filterable"
      >
        <ep-option
          v-for="item in countyOptions"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </ep-select>
      <ep-select
        v-model="street"
        :placeholder="
          props.levelThreePlaceholder || t('adress.levelThreePlaceholder')
        "
        :disabled="itemDisabled"
        :validate-event="false"
        :filterable="filterable"
      >
        <ep-option
          v-for="item in streetOptions"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </ep-select>
    </div>
    <div :class="ns.e('bottom')">
      <ep-input
        v-model="detailAdress"
        type="text"
        :placeholder="props.detailPlaceholder || t('adress.detailPlaceholder')"
        :validate-event="false"
        :disabled="itemDisabled"
      />
      <ep-input
        v-if="showAdressResult"
        v-model="resultAdress"
        type="text"
        :validate-event="false"
        disabled
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  inject,
  onMounted,
  watchEffect,
  nextTick
} from 'vue'
import { buildCssNamespace } from '@package/util'
import { useLocale } from '../../hooks/locale'
import { formContextKey, formItemContextKey } from '../../form/src/formLib'
import get from 'lodash/get'
import noop from 'lodash/noop'

import {
  savelevelOneList,
  getLevelOneCache,
  saveLevelTwoList,
  getLevelTwoCacheById,
  saveLevelThreeList,
  getLevelThreeCacheById
} from './adressLib'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  showAdressResult: {
    type: Boolean,
    default: true
  },
  queryLevelOne: {
    type: Function,
    required: true
  },
  queryLevelTwo: {
    type: Function,
    required: true
  },
  queryLevelThree: {
    type: Function,
    required: true
  },
  modelValue: {
    type: Object,
    default: undefined
  },
  format: {
    type: Function,
    default: undefined
  },
  levelOnePlaceholder: {
    type: String,
    default: ''
  },
  levelTwoPlaceholder: {
    type: String,
    default: ''
  },
  levelThreePlaceholder: {
    type: String,
    default: ''
  },
  detailPlaceholder: {
    type: String,
    default: ''
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  cache: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['update:modelValue', 'change'])
const ns = buildCssNamespace('adress')
const { t } = useLocale()

const city = ref('')
const county = ref('')
const street = ref('')
const detailAdress = ref('')
const resultAdress = ref('')
const cityOptions = ref([])
const countyOptions = ref([])
const streetOptions = ref([])

const formContext = inject(formContextKey, undefined)
const formItemContext = inject(formItemContextKey, undefined)
const itemDisabled = computed(
  () => props.disabled || !!get(formContext, 'disabled')
)

onMounted(async () => {
  cityOptions.value = await getCitys()
})

async function getCitys() {
  if (props.cache) {
    const citysCache = getLevelOneCache()
    if (citysCache) {
      return citysCache
    } else {
      const result = await props.queryLevelOne()
      savelevelOneList(result)
      return result
    }
  } else {
    return await props.queryLevelOne()
  }
}

async function getCountyOptionsById(id) {
  if (props.cache) {
    const cacheCounty = getLevelTwoCacheById(id)
    if (cacheCounty) {
      return cacheCounty
    } else {
      const result = await props.queryLevelTwo(id)
      saveLevelTwoList(id, result)
      return result
    }
  } else {
    return await props.queryLevelTwo(id)
  }
}

async function getStreetOptionsById(id) {
  if (props.cache) {
    const cacheStreet = getLevelThreeCacheById(id)
    if (cacheStreet) {
      return cacheStreet
    } else {
      const result = await props.queryLevelThree(id)
      saveLevelThreeList(id, result)
      return result
    }
  } else {
    return await props.queryLevelThree(id)
  }
}

// 当在外部改变modelValue时，重新赋值
const reflectMethod = async () => {
  const modelCityId = get(props.modelValue, 'levelOne', '')
  const modelCountyId = get(props.modelValue, 'levelTwo', '')
  const modelStreetId = get(props.modelValue, 'levelThree', '')
  const modelInputValue = get(props.modelValue, 'detail', '')
  const modelResultValue = get(props.modelValue, 'result', '')
  if (city.value !== modelCityId) {
    cityOptions.value = await getCitys()
    city.value = modelCityId
    countyOptions.value = await getCountyOptionsById(city.value)
  }
  if (county.value !== modelCountyId) {
    county.value = modelCountyId
    streetOptions.value = await getStreetOptionsById(county.value)
  }
  if (street.value !== modelStreetId) {
    street.value = modelStreetId
  }
  if (detailAdress.value !== modelInputValue) {
    detailAdress.value = modelInputValue
  }
  if (resultAdress.value !== modelResultValue) {
    resultAdress.value = modelResultValue
  }
  if (!city.value || !county.value || !street.value || !detailAdress.value) {
    // emits('update:modelValue', undefined)
  }
}

let stopWatchCityHandler,
  stopWatchCountryHandler,
  stopWatchStreetHandler,
  stopWatchDetailHandler
// 停止对City, Country, Street, Detail的watch监听
const stopWatch = () => {
  stopWatchCityHandler?.()
  stopWatchCountryHandler?.()
  stopWatchStreetHandler?.()
  stopWatchDetailHandler?.()
}

// 启动监听
const startWatch = () => {
  stopWatchCityHandler = watch(city, async () => {
    county.value = ''
    street.value = ''
    countyOptions.value = []
    streetOptions.value = []
    countyOptions.value = await getCountyOptionsById(city.value)
    resultAdress.value = await calcResultAdress()
  })
  stopWatchCountryHandler = watch(county, async () => {
    street.value = ''
    streetOptions.value = []
    streetOptions.value = await getStreetOptionsById(county.value)
    resultAdress.value = await calcResultAdress()
  })
  stopWatchStreetHandler = watch(street, async () => {
    resultAdress.value = await calcResultAdress()
  })
  stopWatchDetailHandler = watch(detailAdress, async () => {
    resultAdress.value = await calcResultAdress()
  })
}
// 加载后，才去根据层级关系去给各组件赋值，并开始监听。
onMounted(async () => {
  await reflectMethod()
  watchEffect(
    () => {
      const levelOne = city.value
      const levelTwo = county.value
      const levelThree = street.value
      const detail = detailAdress.value
      const result = resultAdress.value

      emits('update:modelValue', {
        levelOne,
        levelTwo,
        levelThree,
        detail,
        result
      })
    },
    { flush: 'post' }
  )
  startWatch()
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      // 当v-model的值发生变化时，先停止监听。
      stopWatch()
      // 根据层级关系赋值
      reflectMethod()
      // 下一个渲染周期启动监听
      nextTick(() => {
        startWatch()
      })
    }

    if (props.validateEvent) {
      const validate = get(formItemContext, 'validate')
      validate && validate('change').catch(noop)
    }
  }
)

function queryLabel(arr, id) {
  if (Array.isArray(arr)) {
    const findResult = arr.find((item) => item.id === id)
    return findResult ? findResult['label'] : ''
  } else {
    return ''
  }
}

async function calcResultAdress() {
  const adressFormat = props.format
    ? props.format
    : (city, county, street, house) => `${city}-${county}-${street}-${house}`
  if (!cityOptions.value) {
    cityOptions.value = await getCitys()
  }
  if (city.value && !countyOptions.value) {
    countyOptions.value = await getCountyOptionsById(city.value)
  }
  if (county.value && !streetOptions.value) {
    streetOptions.value = await getStreetOptionsById(county.value)
  }
  const cityText = queryLabel(cityOptions.value, city.value)
  const countyText = queryLabel(countyOptions.value, county.value)
  const streetText = queryLabel(streetOptions.value, street.value)
  const result =
    cityText && countyText && streetText && detailAdress.value
      ? adressFormat(cityText, countyText, streetText, detailAdress.value)
      : ''
  return result
}

watch(resultAdress, async () => {
  resultAdress.value = await calcResultAdress()
  if (city.value && county.value && street.value && detailAdress.value) {
    emits('update:modelValue', {
      levelOne: city.value,
      levelTwo: county.value,
      levelThree: street.value,
      detail: detailAdress.value,
      result: resultAdress.value
    })
    emits('change')
  }
})
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Adress')
}
</script>
