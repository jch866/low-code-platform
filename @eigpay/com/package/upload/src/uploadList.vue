<template>
  <div :class="ns.b()">
    <div
      v-for="file in uploadContext.fileList"
      :key="file.uid || file.name"
      :class="ns.e('item-info')"
    >
      <div
        :class="ns.e('item-info-content')"
        @mouseenter="handleMouseenter(file)"
        @mouseleave="handelMouseleave(file)"
      >
        <img v-if="uploadContext.listType === 'picture'" :src="file.url" />
        <ep-icon
          v-if="uploadContext.listType !== 'picture'"
          icon="ep-i-clip"
          size="16"
        ></ep-icon>
        <span :class="ns.e('item-info-content-name')">
          {{ file.name }}
        </span>
        <ep-icon
          v-if="file.status === 'success' && !file.isShowRemoveIcon"
          :class="ns.e('item-info-content-status')"
          icon="ep-i-cycle-solid-tick"
          size="16"
          color="#00B42A"
        ></ep-icon>
        <ep-icon
          v-if="file.status === 'fail' && !file.isShowRemoveIcon"
          :class="ns.e('item-info-content-status')"
          icon="ep-i-solid-cycle-cross"
          size="16"
          color="#F53F3F"
        ></ep-icon>
        <ep-progress
          v-if="
            file.status === 'uploading' &&
            uploadContext.showProgress &&
            uploadContext.progressType === 'circle'
          "
          :class="ns.e('item-info-content-status')"
          style="position: absolute"
          :show-text="false"
          :width="20"
          type="circle"
          :stroke-width="4"
          :percentage="Number(file.percentage)"
        />
        <ep-icon
          v-if="file.status === 'success' && file.isShowRemoveIcon"
          :class="ns.e('item-info-content-delete')"
          icon="ep-i-delete"
          size="16"
          color="#0163CA"
          @click="handleRemove(file)"
        ></ep-icon>
      </div>
      <ep-progress
        v-if="
          file.status === 'uploading' &&
          uploadContext.showProgress &&
          uploadContext.progressType === 'line'
        "
        :class="ns.e('item-info-progress')"
        type="line"
        :stroke-width="4"
        :percentage="Number(file.percentage)"
      />
    </div>
  </div>
</template>
<script setup>
import { inject, watch } from 'vue'
import { uploadContextKey } from './upload.js'
import { buildCssNamespace } from '../../util'

const uploadContext = inject(uploadContextKey, undefined)

const ns = buildCssNamespace('upload-list')

const emit = defineEmits('remove')

watch(
  () => uploadContext.fileList,
  (val) => {
    console.log('val', val)
  }
)

const handleRemove = (file) => {
  emit('remove', file)
}

const handleMouseenter = (file) => {
  file.isShowRemoveIcon = true
}

const handelMouseleave = (file) => {
  file.isShowRemoveIcon = false
}
</script>
