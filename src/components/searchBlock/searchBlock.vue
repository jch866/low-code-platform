<template>
  <ep-form
    ref="formRef"
    :model="formModel"
    :label-position="labelPosition"
    :label-width="labelWidth"
    class="search-block"
  >
    <div :class="['search-layout', `grid-cols-3`, { isExpand: !expand }]">
      <slot />
    </div>
    <div v-show="expandShow" class="dividing-opt" @click="expand = !expand">
      <span class="line" />
      <svg class="icon-svg dividing-icon" aria-hidden="true">
        <use
          :xlink:href="
            expand
              ? '#eigpay_pro-a-icon-table-shouqi-24'
              : '#eigpay_pro-a-icon-table-zhankai-24'
          "
        ></use>
      </svg>
    </div>
    <div class="search-operation">
      <ep-button
        type="primary"
        native-type="submit"
        @click.prevent="onFromSubmit"
      >
        {{ $t('common.oprationField.query') }}
      </ep-button>
      <ep-button plain type="primary" @click="onResetForm"
        >{{ $t('common.oprationField.Reset') }}
      </ep-button>
    </div>
  </ep-form>
</template>

<script setup>
import { onMounted, ref, nextTick, getCurrentInstance, watch} from 'vue'

const props = defineProps({
  formModel: {
    type: Object,
    default: () => {}
  },
  labelWidth: {
    type: [String, Number],
    default: undefined
  },
  labelPosition: {
    type: String,
    default: 'right'
  },
  cols: {
    type: Number,
    default: 3
  },
  searchFunc: {
    type: Function,
    default: () => {}
  },
  /** 是否需要表单校验 */
  isValidate: {
    type: Boolean,
    default: false
  },
  /** 动态formitem监听 */
  showMore: {
    type: Boolean,
    default: false
  }
})
const formRef = ref(null)
const expand = ref(false)
const expandShow = ref(true)
const instance = getCurrentInstance()

/** 查询 */
const onFromSubmit = async () => {
  if (props.isValidate) {
    // 需要表单校验校验
    const { isValid } = await formRef.value.validate()
    if (isValid) {
      // 校验通过
      props.searchFunc()
    }
  } else {
    props.searchFunc()
  }
}
/** 重置 */
const onResetForm = () => {
  formRef.value.resetFields()
  // 若查询区数据有默认数据 父组件的方法根据 searchFunc 传出的参数区分
  props.searchFunc('reset')
}
/** 根据元素个数判断是否展示展开收起 */
const countElementswithClass = () => {
  nextTick(() => {
    let listNum = 0
    const el = instance?.proxy.$el
    const childNodesList = el.querySelector('.search-layout').children
    Array.from(childNodesList).forEach((item) => {
      if (item.classList.contains('ep-form-item')) {
        listNum++
      }
    })
    expandShow.value = listNum > 3
  })
}
watch(
  () => props.showMore,
  (val) => {
      countElementswithClass()
  }
)
onMounted(() => {
  countElementswithClass()
})
</script>

<script>
export default {
  name: 'SearchBlock'
}
</script>


<style lang="scss" scoped>
.search-block {
  background: #fff;
  border-radius: unit-convertor(4);
  margin-bottom: unit-convertor(16);
  .search-layout {
    @apply grid;
    padding: unit-convertor(20) unit-convertor(20) 0 unit-convertor(20);
    :deep(.ep-form-item) {
      .ep-form-item_label {
        margin-right: unit-convertor(15);
      }
    }
  }
  .isExpand {
    height: unit-convertor(76);
    overflow: hidden;
  }
  .dividing-opt {
    position: relative;
    cursor: pointer;
    height: unit-convertor(1);
    background: #f0f3fa;
    padding-left: unit-convertor(20);
    .line {
      position: absolute;
      display: inline-block;
      height: unit-convertor(1);
      width: unit-convertor(130);
      margin-left: unit-convertor(3);
      background: linear-gradient(90deg, #1c6bff 0%, #f0f3fa 100%);
    }
    .icon-svg {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
    .dividing-icon {
      position: absolute;
      font-size: unit-convertor(20);
      margin-top: unit-convertor(-10);
    }
  }
  .search-operation {
    height: unit-convertor(72);
    @apply text-center;
    @apply flex;
    @apply items-center;
    @apply justify-center;
  }
  .button-plain {
    border: #1c6bff 1px solid;
  }
}
</style>
