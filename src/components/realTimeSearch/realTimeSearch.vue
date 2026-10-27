<template>
  <div v-if="parameter.type === 'A'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 特约商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('common.businessField.C0235')"
          :rules="[
            !parameter.disabledType[0] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchantCode"
              :label="item.merchantCode"
              :value="item.merchantCode"
            />
          </ep-select>
        </ep-form-item>
        <!-- 商店统一编号 -->
        <ep-form-item
          prop="licenseCertNo"
          :label="$t('common.businessField.C0240')"
          :rules="[
            !parameter.disabledType[1] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.licenseCertNo"
            filterable
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="extMethodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchantCode"
              :label="item.licenseCertNo"
              :value="item.merchantCode"
            />
          </ep-select>
        </ep-form-item>
        <!-- 特约商店名称 -->
        <ep-form-item
          prop="merchNm"
          :label="$t('common.businessField.C0237')"
          :rules="[
            !parameter.disabledType[2] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchNm"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            filterable
            :filter-method="methodMerchNm"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchantCode"
              :label="item.merchantName"
              :value="item.merchantCode"
            />
          </ep-select>
        </ep-form-item>
        <slot name="content"></slot>
      </div>
    </ep-form>
  </div>
  <div v-if="parameter.type === 'B'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 特约商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('common.businessField.C0235')"
          :rules="[
            !parameter.disabledType[0] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :disabled="parameter.disabledType[0]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchantCode"
              :label="item.merchantCode"
              :value="item.merchantCode"
            />
          </ep-select>
        </ep-form-item>
        <!-- 特约商店名称 -->
        <ep-form-item
          prop="merchNm"
          :label="$t('common.businessField.C0237')"
          :rules="[
            !parameter.disabledType[1] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchNm"
            :disabled="parameter.disabledType[1]"
            :placeholder="
              !parameter.disabledType[1]
                ? $t('common.oprationField.pleaseSelect')
                : ''
            "
            filterable
            :filter-method="methodMerchNm"
            @change="handleMerchantName"
            @visible-change="visibleChange"
          >
            <div v-if="props.parameter.interfaceType === 'B2'">
              <ep-option
                v-for="item in state.merchantList"
                :key="item.merchantCode"
                :label="item.merchZhName"
                :value="item.merchantCode"
              />
            </div>
            <div v-else>
              <ep-option
                v-for="item in state.merchantList"
                :key="item.merchantName"
                :label="item.merchantName"
                :value="item.merchantName"
              />
            </div>
          </ep-select>
        </ep-form-item>
        <slot name="content"></slot>
      </div>
    </ep-form>
  </div>
  <div v-if="parameter.type === 'D'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 渠道商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('common.businessField.C0236')"
          :rules="[
            !parameter.disabledType[0] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :disabled="parameter.disabledType[0]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchantCode"
              :label="item.merchantCode"
              :value="item.merchantCode"
            />
          </ep-select>
        </ep-form-item>
        <!-- 特约商店名称 -->
        <ep-form-item
          prop="merchNm"
          :label="$t('common.businessField.C0237')"
          :rules="[
            !parameter.disabledType[1] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchNm"
            :disabled="parameter.disabledType[1]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            filterable
            :filter-method="methodMerchNm"
            @change="handleMerchantName"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchantName"
              :label="item.merchantName"
              :value="item.merchantName"
            />
          </ep-select>
        </ep-form-item>
      </div>
    </ep-form>
  </div>
  <div v-if="parameter.type === 'C'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 渠道商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('发卡行名称')"
          :rules="[
            !parameter.disabledType[0] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :disabled="parameter.disabledType[0]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.bankId"
              :label="item.bankName"
              :value="item.bankId"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item
          prop="cooperateBankCode"
          :label="$t('merchantPortal.J0320')"
        >
          <ep-input
            v-model="state.formModel.merchId"
            :placeholder="$t('merchantPortal.BC1480')"
            type="text"
            disabled
          />
        </ep-form-item>
      </div>
    </ep-form>
  </div>
  <div v-if="parameter.type === 'F'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 渠道商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('银行选择')"
          :rules="[
            !parameter.disabledType[1] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :disabled="parameter.disabledType[0]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.bankId"
              :label="item.bankName"
              :value="item.bankId"
            />
          </ep-select>
          <slot name="content"></slot>
        </ep-form-item>
      </div>
    </ep-form>
  </div>
  <div v-if="parameter.type === 'H'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 渠道商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('common.businessField.C0236')"
          :rules="[
            !parameter.disabledType[1] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :disabled="parameter.disabledType[1]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchId"
              :label="item.merchId"
              :value="item.merchId"
            />
          </ep-select>
        </ep-form-item>
      </div>
    </ep-form>
  </div>
  <div v-if="parameter.type === 'I'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 销售方名称 -->
        <ep-form-item
          prop="merchNm"
          :label="$t('销售方名称')"
          :rules="[
            !parameter.disabledType[0] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchNm"
            :disabled="parameter.disabledType[0]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            filterable
            :filter-method="methodMerchNm"
            @change="handleMerchantName"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.newMerchId"
              :label="item.merchNmCn"
              :value="item.merchNmCn"
            />
          </ep-select>
        </ep-form-item>
        <!-- 特约商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('common.businessField.C0235')"
          :rules="[
            !parameter.disabledType[1] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :disabled="parameter.disabledType[1]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.newMerchId"
              :label="item.newMerchId"
              :value="item.newMerchId"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item
          prop="unifiedNo"
          :label="$t('common.businessField.C0240')"
        >
          <ep-input
            v-model="state.formModel.unifiedNo"
            type="text"
            :placeholder="state.formModel.unifiedNo"
            :disabled="parameter.disabledType[2]"
          ></ep-input>
        </ep-form-item>
      </div>
    </ep-form>
  </div>
  <div v-if="parameter.type === 'L'">
    <ep-form
      ref="formRef"
      :model="state.formModel"
      :label-position="labelPosition"
      :label-width="props.labelWidth"
    >
      <div :class="['grid', `grid-cols-${cols}`]">
        <!-- 特约商店名称 -->
        <ep-form-item
          prop="merchNm"
          :label="$t('common.businessField.C0237')"
          :rules="[$r.required.trigger('change')]"
        >
          <ep-select
            v-model="state.formModel.merchNm"
            :disabled="parameter.disabledType[0]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            filterable
            :filter-method="methodMerchNm"
            @change="handleMerchantName"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchNmCn"
              :label="item.merchNmCn"
              :value="item.merchNmCn"
            />
          </ep-select>
        </ep-form-item>
        <!-- 特约商店MID -->
        <ep-form-item
          prop="merchId"
          :label="$t('common.businessField.C0235')"
          :rules="[
            !parameter.disabledType[1] ? $r.required.trigger('change') : ''
          ]"
        >
          <ep-select
            v-model="state.formModel.merchId"
            filterable
            :disabled="parameter.disabledType[1]"
            :placeholder="$t('common.oprationField.pleaseSelect')"
            :filter-method="methodMerchId"
            @change="handleMerchantId"
            @visible-change="visibleChange"
          >
            <ep-option
              v-for="item in state.merchantList"
              :key="item.merchId"
              :label="item.merchId"
              :value="item.merchId"
            />
          </ep-select>
        </ep-form-item>
        <!-- 商店统一编号 -->
        <ep-form-item
          prop="unifiedNo"
          :label="$t('common.businessField.C0240')"
        >
          <ep-input
            v-model="state.formModel.unifiedNo"
            type="text"
            :placeholder="state.formModel.unifiedNo"
            :disabled="parameter.disabledType[2]"
          ></ep-input>
        </ep-form-item>
        <!-- 地址 -->
        <ep-form-item
          prop="address"
          :label="$t('common.oprationField.address')"
        >
          <ep-input
            v-model="state.formModel.address"
            type="text"
            :placeholder="state.formModel.address"
            :disabled="parameter.disabledType[3]"
          ></ep-input>
        </ep-form-item>
      </div>
    </ep-form>
  </div>
</template>

<script setup>
/**
 * 记录：关于关联下拉框的placeholder值要统一改为 “请输入关键字查询” 【先开发功能后面统一进行更改】
 */

import _ from 'lodash'
import { onMounted, ref, reactive, watch } from 'vue'
import { SUCCESS_STATUS } from '@/config/config'

const formRef = ref(null)
const emits = defineEmits(['changeForm'])
const props = defineProps({
  formModel: {
    type: Object,
    default: () => {}
  },
  labelWidth: {
    type: [String, Number],
    default: '200px'
  },
  labelPosition: {
    type: String,
    default: 'right'
  },
  cols: {
    type: Number,
    default: 2
  },
  /** 是否需要表单校验 */
  isValidate: {
    type: Boolean,
    default: false
  },
  /**
   * 组件传值
   *  type: 'D', 组件类型 A,B,C,D,E,F,G,H,I,J,K（必传）
      disabledType: [false, false], 是否禁用默认 false（根据类型判断数组传递位数，必传）
      operationType: getMerchantList, 数据接口（必传）
      数据接口入参（如果不需要，则不用传递）
      param: {
        merType: '01,02,03,04',
        status: '002,003,004'
      },
      formModel: {
        merchId: '',
        merchNm: ''
      } 编辑反显值，默认不传
   */
  parameter: {
    type: Object,
    default: () => {}
  }
})
const state = reactive({
  merchantList: [],
  formModel: {
    merchId: '',
    merchNm: '',
    licenseCertNo: ''
  }
})

// 筛选MID
const methodMerchId = (v) => {
  if (v) {
    if (
      props.parameter.type === 'D' ||
      props.parameter.type === 'B' ||
      props.parameter.type === 'A'
    ) {
      if (v.length >= 4) {
        const requestData = {
          merchantCode: v
        }
        setTimeout(() => {
          merchIdChange(requestData)
        }, 1000)
      }
    } else if (
      props.parameter.type === 'I' ||
      props.parameter.type === 'L' ||
      props.parameter.type === 'H'
    ) {
      if (v.length >= 4) {
        const requestData = {
          merchId: v
        }
        setTimeout(() => {
          merchIdChange(requestData)
        }, 1000)
      }
    } else if (props.parameter.type === 'C' || props.parameter.type === 'F') {
      if (v.length >= 1) {
        const requestData = {
          bankName: v
        }
        setTimeout(() => {
          merchIdChange(requestData)
        }, 1000)
      }
    }
  }
}
// 筛选名称
const methodMerchNm = (v) => {
  if (v) {
    if (
      props.parameter.type === 'D' ||
      props.parameter.type === 'B' ||
      props.parameter.type === 'A'
    ) {
      if (v.length >= 1) {
        const requestData = {
          merchantName: v
        }
        setTimeout(() => {
          merchIdChange(requestData)
        }, 1000)
      }
    } else if (props.parameter.type === 'I' || props.parameter.type === 'L') {
      if (v.length >= 1) {
        const requestData = {
          merchNm: v
        }
        setTimeout(() => {
          merchIdChange(requestData)
        }, 1000)
      }
    }
  }
}
// 获取接口数据
const merchIdChange = async (val) => {
  const param = {
    ...props.parameter.param,
    ...val
  }
  const res = await props.parameter.operationType(param)
  if (res.returnCode === SUCCESS_STATUS) {
    if (props.parameter.type === 'C' || props.parameter.type === 'F') {
      state.merchantList = res.result
    } else {
      state.merchantList = res.data
    }
  }
}
// ID映射名称
const handleMerchantId = (v) => {
  if (props.parameter.type === 'D' || props.parameter.type === 'B') {
    if (props.parameter.interfaceType === 'B2') {
      const list = _.find(state.merchantList, { merchantCode: v })
      state.formModel.merchNm = list.merchZhName
    } else {
      const list = _.find(state.merchantList, { merchantCode: v })
      state.formModel.merchNm = list?.merchantName || list.merchZhName
    }
  } else if (props.parameter.type === 'I') {
    const list = _.find(state.merchantList, { merchId: v })
    state.formModel.merchNm = list?.merchNmCn
    state.formModel.unifiedNo = list?.merchantConsolidation
  } else if (props.parameter.type === 'L') {
    const list = _.find(state.merchantList, { merchId: v })
    state.formModel.merchNm = list?.merchNmCn
    state.formModel.unifiedNo = list?.merchantConsolidation
    state.formModel.address = list?.merchantAddress
  } else if (props.parameter.type === 'H') {
    const list = _.find(state.merchantList, { merchId: v })
    state.formModel.merchNm = list?.merchNmCn
    state.formModel.merchantType = list?.merchantType
  } else if (props.parameter.type === 'A') {
    const list = _.find(state.merchantList, { merchantCode: v })
    state.formModel.licenseCertNo = list?.licenseCertNo
    state.formModel.merchId = list?.merchantCode
    state.formModel.merchNm = list?.merchantName
  } else if (props.parameter.type === 'C' || props.parameter.type === 'F') {
    const list = _.find(state.merchantList, { bankId: v })
    state.formModel.merchId = list?.bankId
    state.formModel.merchNm = list?.bankName
  }
}
// 组件
const extMethodMerchId = (v) => {
  if (v) {
    if (props.parameter.type === 'A') {
      if (v.length >= 1) {
        const requestData = {
          licenseCertNo: v
        }
        setTimeout(() => {
          merchIdChange(requestData)
        }, 1000)
      }
    }
  }
}
// 名称映射ID
const handleMerchantName = async (v) => {
  if (props.parameter.type === 'D' || props.parameter.type === 'B') {
    if (props.parameter.interfaceType === 'B2') {
      const list = _.find(state.merchantList, { merchantCode: v })
      state.formModel.merchNm = list.merchZhName
      state.formModel.merchId = list?.merchantCode
    } else {
      const list = _.find(state.merchantList, { merchantName: v })
      state.formModel.merchId = list?.merchantCode
    }
  } else if (props.parameter.type === 'I') {
    const list = _.find(state.merchantList, { merchNmCn: v })
    state.formModel.merchId = list?.merchId
    state.formModel.unifiedNo = list?.merchantConsolidation
  } else if (props.parameter.type === 'L') {
    const list = _.find(state.merchantList, { merchNmCn: v })
    state.formModel.merchId = list?.merchId
    state.formModel.unifiedNo = list?.merchantConsolidation
    state.formModel.address = list?.merchantAddress
  }
}
// 下拉框出现/隐藏时触发
const visibleChange = (v) => {
  if (!v) {
    if (
      state.merchantList === undefined ||
      state.merchantList.length === 0 ||
      state.formModel.merchId === '' ||
      state.formModel.merchNm === ''
    ) {
      resetFields()
    } else if (
      state.merchantList &&
      state.formModel.merchId !== '' &&
      state.formModel.merchNm !== ''
    ) {
      if (
        props.parameter.type === 'I' ||
        props.parameter.type === 'L' ||
        props.parameter.type === 'H'
      ) {
        const requestData = {
          merchId: state.formModel.merchId
        }
        merchIdChange(requestData)
      } else if (props.parameter.type === 'C' || props.parameter.type === 'F') {
        const requestData = {
          bankId: state.formModel.merchId
        }
        merchIdChange(requestData)
      } else {
        const requestData = {
          merchantCode: state.formModel.merchId
        }
        merchIdChange(requestData)
      }
    }
  }
}

const handleValidate = async () => {
  const { isValid } = await formRef.value.validate()
  return isValid
}
const resetFields = () => {
  formRef.value.resetFields()
  state.merchantList = []
}
defineExpose({
  handleValidate,
  resetFields
})
// 监听父组件传值，反显数据（适用于编辑功能）
watch(
  () => props.parameter,
  (newV) => {
    if (newV && JSON.stringify(newV.formModel) !== '{}') {
      merchIdChange()
      state.formModel = newV.formModel
    }
  },
  { deep: true }
)
// 监听表单数据，实时返回
watch(
  () => state.formModel,
  (newV) => {
    emits('changeForm', newV)
  },
  { deep: true }
)
onMounted(() => {
  // 获取数据
  // merchIdChange()
})
</script>

<script>
export default {
  name: 'RealTimeSearch'
}
</script>

<style lang="scss" scoped></style>
