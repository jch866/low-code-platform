<template>
  <div style="width: 500px">
    <ep-upload
      v-model:file-list="fileList"
      class="upload-list"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
      list-type="text"
      progress-type="line"
    >
      <ep-button type="primary">Click to upload</ep-button>
      <template #tip>
        <div class="ep-upload__tip">
          jpg/png files with a size less than 500KB.
        </div>
      </template>
    </ep-upload>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const fileList = ref([
  {
    name: 'log.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svglog.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  },
  {
    name: 'logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  }
])

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed = (files, uploadFiles) => {
  console.log(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const handleSuccess = (response, file, fileList) => {
  console.log('response, file, fileList: ', response, file, fileList)
}

const beforeRemove = () => {
  console.log(`is delted ?`)
}
</script>

<script>
export default {
  name: 'FileList'
}
</script>
