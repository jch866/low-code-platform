<template>
  <ep-upload
    :action="url"
    :show-file-list="false"
    :multiple="false"
    :before-upload="beforeAvatarUpload"
    :on-progress="handleAvatarProgress"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
  >
    <div class="avatar-uploader">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <div class="upload-placeholder">
        <ep-icon icon="ep-i-plus"></ep-icon>
        <span>上传</span>
      </div>
    </div>
  </ep-upload>
</template>
<script setup>
import { ref } from 'vue'

const imageUrl = ref('')

const url = ref('https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15')

const handleAvatarSuccess = (response, uploadFile) => {
  console.log('response: ', response)
  console.log('uploadFile: ', uploadFile)

  let binaryData = []
  binaryData.push(uploadFile.raw)
  imageUrl.value = window.URL.createObjectURL(new Blob(binaryData))
}

const handleAvatarError = (error, uploadFile) => {
  console.log('error: ', error)
  console.log('uploadFile: ', uploadFile)
}

const handleAvatarProgress = (event, uploadFile) => {
  console.log('event: ', event)
  console.log('uploadFile: ', uploadFile)
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    console.log('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    console.log('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>
<script>
export default {
  name: 'BasicDemo'
}
</script>

<style scoped lang="scss">
.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #e5e6eb;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #f2f3f5;
  &:hover {
    border-color: #0163ca;
  }
  .avatar {
    display: block;
    width: 100%;
    height: 100%;
  }
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
  }
}

.upload-placeholder {
  span {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #666666;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
    margin-top: 2px;
  }
}

.ep-icon.eigpay-iconplus {
  font-size: 13px;
  color: #666666;
  padding-top: 34px;
}
</style>
