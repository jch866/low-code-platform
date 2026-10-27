<template>
  <div>
    <ep-dialog
      :model-value="props.dialogVisible"
      :title="$t(props.dialogValue.title)"
      :width="props.width"
      @close="handleClose"
    >
      <div v-if="props.type === 'singleStrip'" class="dialog-div">
        <div class="dialog-text">
          <ep-icon
            icon="ep-i-cycle-solid-exclamation-mark-inverted"
            size="25"
            color="#FF7D00"
          ></ep-icon>
          <span>{{ $t(props.dialogValue.prompt) }}</span>
        </div>
      </div>
      <div v-if="props.type === 'multiple'" class="dialog-div">
        <div class="dialog-text">
          <ep-icon
            icon="ep-i-cycle-solid-exclamation-mark-inverted"
            size="25"
            color="#FF7D00"
          ></ep-icon>
          <span>{{ $t(props.dialogValue.prompt) }}</span>
        </div>
        <div class="content">
          {{ $t(props.dialogValue.content) }}
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <ep-button plain type="primary" @click="handleClose">
            {{ $t('common.oprationField.cancel') }}
          </ep-button>
          <ep-button type="primary" @click="handleDelete">
            {{ $t('common.oprationField.config') }}
          </ep-button>
        </span>
      </template>
    </ep-dialog>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { debounce } from '@/utils/utils'

const props = defineProps({
  /**
   * type: 类型，默认不传
   * singleStrip: 默认只有一条提示语
   * multiple: 两条提示语
   */
  type: {
    type: String,
    default: 'singleStrip'
  },
  /**
   * dialogValue: {
   *  title: 标题头,
   *  prompt: 提示语一,
   *  content: 提示语二
   * }
   */
  dialogValue: {
    type: Object,
    default: () => {
      return {
        title: 'common.oprationField.tips',
        prompt: '',
        content: ''
      }
    }
  },
  /**
   * dialogVisible: 弹窗类型，是否展示
   */
  dialogVisible: {
    type: Boolean,
    default: false
  },
  /**
   * 弹窗宽度，默认460px
   */
  width: {
    type: String,
    default: '460px'
  },
  /**
   * 确认按钮，回调函数
   */
  onClick: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['update:dialogVisible', 'dialogClose'])

// 弹窗确认
const handleDelete = debounce(async () => {
  props.onClick()
})

// 弹窗取消
const handleClose = () => {
  emit('update:dialogVisible', false)
  emit('dialogClose')
}

// 页面加载时
onMounted(() => {})
</script>

<style lang="scss" scoped>
.dialog-div {
  font-size: 16px;
}
.content {
  margin-left: 30px;
  font-size: 13px;
  color: #666666;
}
.dialog-text {
  display: flex;
  align-items: center;
  :deep(.ep-icon) {
    @apply mt-[2px];
    @apply mr-[5px];
  }
}
</style>
