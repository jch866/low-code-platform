<template>
  <div :class="ns.b()" @click="handleChooseFile">
    <slot />
    <input :data-type="dataType" :data-name="props.dataName" ref="inputRef" :class="cssName('upload__input')" :name="name"
      :multiple="multiple" :accept="accept" :disabled="disabled" type="file" @change="handleChange" @click.stop />
  </div>
</template>
<script setup>
import { cssName } from '@package/constant'
import { ref, computed, shallowRef, inject } from 'vue'
import { uploadContextKey } from './upload.js'
import { genFileId } from './upload.js'
import { buildCssNamespace } from '../../util'

const props = defineProps({
  dataName: {
    type: String,
    //gp项目中通用上传按钮文字，用于埋点
    default: '选择文件'
  },
})
const inputRef = ref()

//请求列表
const requests = shallowRef({})

const uploadContext = inject(uploadContextKey, undefined)

const ns = buildCssNamespace('upload-basic')

// 读取本地文件
const handleChooseFile = () => {
  inputRef.value.click()
}

// 选择文件
const handleChange = (e) => {
  const files = e.target.files
  if (!files) return
  uploadFiles(Array.from(files))
}

// 文件的限制以及编号
const uploadFiles = (files) => {
  if (files.length === 0) return

  if (
    uploadContext.limit &&
    uploadContext.fileList.length + files.length > uploadContext.limit
  ) {
    uploadContext.onExceed(files, uploadContext.fileList)
    return
  }

  if (!uploadContext.multiple) {
    files = files.slice(0, 1)
  }

  for (const file of files) {
    // 给给每个文件编号
    const rawFile = file
    rawFile.uid = genFileId()
    uploadContext.onStart(rawFile)
    if (uploadContext.autoUpload) upload(rawFile)
  }
}
const dataType = computed(() => {
  let elName = 'upload';
  if (inputRef.value?.closest('tr,.ep-div-table'))
    elName = 'table##' + elName
  else if (inputRef.value?.closest('.ep-dialog,.ep-popper'))
    elName = 'dialog##' + elName
  return elName;
})

//上传前的准备
const upload = async (rawFile) => {
  inputRef.value.value = ''

  //如果beforeUpload不存在，则直接上传
  if (!uploadContext.beforeUpload) {
    return doUpload(rawFile)
  }

  //如果返回的为真值，则往下执行，如果假值，则移除文件停止上传并调用移除文件的钩子函数
  let hookResult
  try {
    hookResult = await uploadContext.beforeUpload(rawFile)
  } catch {
    hookResult = false
  }

  if (hookResult === false) {
    uploadContext.onRemove(rawFile)
    return
  }

  //如果返回的为一个Blob则实例化为一个文件，如果是一个File，则赋值给file
  let file = rawFile
  if (hookResult instanceof Blob) {
    if (hookResult instanceof File) {
      file = hookResult
    } else {
      file = new File([hookResult], rawFile.name, {
        type: rawFile.type
      })
    }
  }

  //上传文件
  doUpload(
    Object.assign(file, {
      uid: rawFile.uid
    })
  )
}

//上传的网络配置
const doUpload = (rawFile) => {
  const {
    headers,
    data,
    method,
    withCredentials,
    name: filename,
    action,
    onProgress,
    onSuccess,
    onError,
    httpRequest
  } = uploadContext

  const { uid } = rawFile
  const options = {
    headers: headers || {},
    withCredentials,
    file: rawFile,
    data,
    method,
    filename,
    action,
    onProgress: (evt) => {
      onProgress(evt, rawFile)
    },
    onSuccess: (res) => {
      onSuccess(res, rawFile)
      delete requests.value[uid]
    },
    onError: (err) => {
      onError(err, rawFile)
      delete requests.value[uid]
    }
  }
  const request = httpRequest(options)
  requests.value[uid] = request
  if (request instanceof Promise) {
    request.then(options.onSuccess, options.onError)
  }
}
</script>
