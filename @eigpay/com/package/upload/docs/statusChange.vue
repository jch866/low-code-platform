<template>
  <ep-upload
    v-model:file-list="fileList"
    class="upload-list"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :on-change="handleChange"
  >
    <ep-button type="primary">Click to upload</ep-button>
    <template #tip>
      <div class="ep-upload__tip">
        jpg/png files with a size less than 500KB.
      </div>
    </template>
  </ep-upload>
</template>
<script setup>
import { ref } from 'vue'

const fileList = ref([
  {
    name: 'log.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  },
  {
    name: 'logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  }
])

const handleChange = () => {
  fileList.value = fileList.value.slice(-3)
}
</script>

<script>
export default {
  name: 'StatusChange'
}
</script>
