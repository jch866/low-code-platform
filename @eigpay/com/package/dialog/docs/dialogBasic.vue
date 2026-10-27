<template>
  <div>
    <ep-button @click="dialogVisible = true">
      click to open the Dialog
    </ep-button>

    <ep-dialog
      v-model="dialogVisible"
      title="我是标题"
      width="30%"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="true"
      :fullscreen="isFullscreen"
      :modal="isModal"
      :lock-scroll="isLockScroll"
      :show-close="true"
      :before-close="beforeMethod"
      :center="isCenter"
      :align-center="isAlignCenter"
      @open="openMethod"
      @close="closeMethod"
    >
      <!-- <span>This is a message</span> -->
      <ep-form ref="formRef" :model="formModel">
        <ep-form-item
          label="商户名称"
          :rules="{
            required: true,
            trigger: ['blur', 'change']
          }"
          prop="selectValue1"
        >
          <ep-select
            v-model="formModel.selectValue1"
            placeholder="请选择"
            filterable
            @change="selectOneChange"
          >
            <ep-option
              v-for="item in options"
              :key="item.merchId"
              :label="item.merchNm"
              :value="item.merchId"
            />
          </ep-select>
        </ep-form-item>
        <ep-form-item
          label="商户MID"
          :rules="{
            required: true,
            trigger: ['blur', 'change']
          }"
          prop="selectValue2"
        >
          <ep-select
            v-model="formModel.selectValue2"
            placeholder="请选择"
            filterable
            @change="selectTwoChange"
          >
            <ep-option
              v-for="item in options"
              :key="item.merchId"
              :label="item.merchId"
              :value="item.merchId"
            />
          </ep-select>
        </ep-form-item>
      </ep-form>
      <template #footer>
        <span class="dialog-footer">
          <ep-button @click="dialogVisible = false">Cancel</ep-button>
          <ep-button type="primary" @click="onFromSubmit">Confirm</ep-button>
        </span>
      </template>
    </ep-dialog>

    <div style="margin-top: 20px">
      <ep-button @click="isModal = !isModal">modal : {{ isModal }}</ep-button>
      <ep-button @click="isFullscreen = !isFullscreen">
        fullScreen : {{ isFullscreen }}
      </ep-button>
      <ep-button @click="isLockScroll = !isLockScroll">
        lockScroll : {{ isLockScroll }}
      </ep-button>
      <ep-button @click="isCenter = !isCenter">
        center : {{ isCenter }}
      </ep-button>
      <ep-button @click="isAlignCenter = !isAlignCenter">
        alignCenter : {{ isAlignCenter }}
      </ep-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const dialogVisible = ref(false)
const isFullscreen = ref(false)
const closeOnClickModal = ref(true)
const isModal = ref(true)
const isLockScroll = ref(true)
const isCenter = ref(false)
const isAlignCenter = ref(false)

function beforeMethod(done) {
  console.log('-----before close----')
  onResetForm()
  done()
}

function openMethod() {
  console.log('---open---', dialogVisible.value)
}

function closeMethod() {
  console.log('---close---', dialogVisible.value)
  onResetForm()
}

const formRef = ref(null)
const formModel = reactive({
  selectValue1: '',
  selectValue2: ''
})

const onFromSubmit = async () => {
  const { isValid } = await formRef.value.validate()
  if (isValid) {
    dialogVisible.value = false
  }
}
const onResetForm = () => {
  formRef.value.resetFields()
}

const selectOneChange = (val) => {
  const findItem = options.value.find((item) => item.merchId === val)
  formModel.selectValue2 = findItem && findItem.merchId
}

const selectTwoChange = (val) => {
  const findItem = options.value.find((item) => item.merchId === val)
  formModel.selectValue1 = findItem && findItem.merchId
}

const options = ref([
  {
    merchId: '',
    merchNm: '',
    merchSts: '1'
  },
  {
    merchId: '1',
    merchNm: '1',
    merchSts: '1'
  },
  {
    merchId: '100320230221398',
    merchNm: '美丽女士服装',
    merchantConsolidation: 'merid022',
    merchantAddress: 'U县',
    merchSts: '001'
  },
  {
    merchId: '12',
    merchNm: '12',
    merchSts: '1'
  },
  {
    merchId: '15870930600',
    merchNm: 'URBAN ABODE LTD',
    merchantConsolidation: 'Merid025',
    merchantAddress: '台北市敦化南路1段108號13樓 ',
    merchSts: '001'
  },
  {
    merchId: '2',
    merchNm: '2',
    merchSts: '1'
  },
  {
    merchId: '23',
    merchNm: '2',
    merchSts: '1'
  },
  {
    merchId: '3',
    merchNm: '2',
    merchSts: '1'
  },
  {
    merchId: '323',
    merchNm: '323',
    merchSts: '1'
  },
  {
    merchId: '56',
    merchNm: '44',
    merchSts: '1'
  },
  {
    merchId: 'asd',
    merchNm: '天才大酒店',
    merchSts: '1'
  },
  {
    merchId: 'mer001',
    merchNm: '龙虾专卖店01',
    merchantConsolidation: 'merid001',
    merchantAddress: 'A县',
    merchSts: '001'
  },
  {
    merchId: 'mer002',
    merchNm: '龙虾专卖店02',
    merchantConsolidation: 'merid002',
    merchantAddress: 'B县',
    merchSts: '002'
  },
  {
    merchId: 'mer003',
    merchNm: '龙虾专卖店03',
    merchantConsolidation: 'merid003',
    merchantAddress: 'C县',
    merchSts: '003'
  },
  {
    merchId: 'mer004',
    merchNm: '龙虾专卖店04',
    merchantConsolidation: 'merid004',
    merchantAddress: 'D县',
    merchSts: '004'
  },
  {
    merchId: 'mer005',
    merchNm: '龙虾专卖店05',
    merchantConsolidation: 'merid005',
    merchantAddress: 'E县',
    merchSts: '005'
  },
  {
    merchId: 'mer006',
    merchNm: '日常用品店',
    merchantConsolidation: 'merid006',
    merchantAddress: 'F县',
    merchSts: '006'
  },
  {
    merchId: 'mer007',
    merchNm: '大运摩托店',
    merchantConsolidation: 'merid007',
    merchantAddress: 'G县',
    merchSts: '001'
  },
  {
    merchId: 'mer008',
    merchNm: '雅迪电动车',
    merchantConsolidation: 'merid008',
    merchantAddress: 'H县',
    merchSts: '002'
  },
  {
    merchId: 'mer009',
    merchNm: '老昌烧烤',
    merchantConsolidation: 'merid009',
    merchantAddress: 'I县',
    merchSts: '003'
  },
  {
    merchId: 'mer010',
    merchNm: '大四季酒店',
    merchantConsolidation: 'merid010',
    merchantAddress: 'J县',
    merchSts: '004'
  },
  {
    merchId: 'mer011',
    merchNm: '常来饭馆',
    merchantConsolidation: 'merid011',
    merchantAddress: 'K县',
    merchSts: '005'
  },
  {
    merchId: 'mer012',
    merchNm: '新鲜水果',
    merchantConsolidation: 'merid012',
    merchantAddress: 'L县',
    merchSts: '006'
  },
  {
    merchId: 'mer013',
    merchNm: '电脑维修店',
    merchantConsolidation: 'merid014',
    merchantAddress: 'M县',
    merchSts: '002'
  },
  {
    merchId: 'mer014',
    merchNm: '干洗店',
    merchantConsolidation: 'merid015',
    merchantAddress: 'N县',
    merchSts: '003'
  },
  {
    merchId: 'mer015',
    merchNm: '达美超市',
    merchantConsolidation: 'merid016',
    merchantAddress: 'O县',
    merchSts: '004'
  },
  {
    merchId: 'mer016',
    merchNm: '可爱服饰',
    merchantConsolidation: 'merid017',
    merchantAddress: 'P县',
    merchSts: '005'
  },
  {
    merchId: 'mer017',
    merchNm: '电子商城',
    merchantConsolidation: 'merid018',
    merchantAddress: 'Q县',
    merchSts: '006'
  },
  {
    merchId: 'mer018',
    merchNm: '微微服饰',
    merchantConsolidation: 'merid019',
    merchantAddress: 'R县',
    merchSts: '001'
  },
  {
    merchId: 'mer019',
    merchNm: '贼拉快出行',
    merchantConsolidation: 'merid020',
    merchantAddress: 'S县',
    merchSts: '002'
  },
  {
    merchId: 'mer020',
    merchNm: '风来民宿',
    merchantConsolidation: 'merid021',
    merchantAddress: 'T县',
    merchSts: '003'
  },
  {
    merchId: 'mer021',
    merchNm: '美丽女士服装',
    merchantConsolidation: 'merid022',
    merchantAddress: 'U县',
    merchSts: '001'
  },
  {
    merchId: 'mer02266881',
    merchNm: '財務專用1誤刪',
    merchantConsolidation: 'Merid023',
    merchantAddress: '台北市敦化南路1段108號13樓 ',
    merchSts: '001'
  },
  {
    merchId: 'mer02266882',
    merchNm: '財務專用1誤刪2',
    merchantConsolidation: 'Merid024',
    merchantAddress: '台北市敦化南路1段108號13樓 ',
    merchSts: '001'
  },
  {
    merchId: 'mer02266883',
    merchNm: '財務專用1誤刪3',
    merchantConsolidation: 'Merid024',
    merchantAddress: '台北市敦化南路1段108號13樓 ',
    merchSts: '001'
  },
  {
    merchId: 'mer02266884',
    merchNm: '財務專用1誤刪4',
    merchantConsolidation: 'Merid024',
    merchantAddress: '台北市敦化南路1段108號13樓 ',
    merchSts: '001'
  },
  {
    merchId: '可乐',
    merchNm: '雷碧',
    merchSts: '1'
  },
  {
    merchId: '测试',
    merchSts: '1'
  },
  {
    merchId: '测试222',
    merchNm: '',
    merchSts: '1'
  },
  {
    merchId: '测试333',
    merchSts: '1'
  }
])
</script>
