import { watch } from 'vue'
import isNil from 'lodash/isNil'
import { useVModel } from '@vueuse/core'

export const uploadContextKey = Symbol('upload')

let fileId = 1
export const genFileId = () => Date.now() + fileId++

const revokeObjectURL = (file) => {
  if (file.url?.startsWith('blob:')) {
    URL.revokeObjectURL(file.url)
  }
}

export const useHandlers = (props) => {
  // useVModel 相当于属性绑定 :fileList 和 触发事件 update:fileList
  const uploadFiles = useVModel(props, 'fileList', undefined, { passive: true })

  const getFile = (rawFile) =>
    uploadFiles.value.find((file) => file.uid === rawFile.uid)

  const handleError = (err, rawFile) => {
    const file = getFile(rawFile)
    if (!file) return

    console.log(err)
    file.status = 'fail'
    uploadFiles.value.splice(uploadFiles.value.indexOf(file), 1)
    props.onError(err, file, uploadFiles.value)
    props.onChange(file, uploadFiles.value)
  }

  const handleProgress = (evt, rawFile) => {
    const file = getFile(rawFile)
    if (!file) return

    props.onProgress(evt, file, uploadFiles.value)
    file.status = 'uploading'
    file.percentage = Math.round(evt.percent)
  }

  const handleSuccess = (response, rawFile) => {
    const file = getFile(rawFile)
    if (!file) return

    file.status = 'success'
    file.response = response
    props.onSuccess(response, file, uploadFiles.value)
    props.onChange(file, uploadFiles.value)
  }

  const handleStart = (file) => {
    if (isNil(file.uid)) file.uid = genFileId()
    const uploadFile = {
      name: file.name,
      percentage: 0,
      status: 'ready',
      size: file.size,
      raw: file,
      uid: file.uid
    }
    if (props.listType === 'picture') {
      try {
        let binaryData = []
        binaryData.push(file)
        uploadFile.url = window.URL.createObjectURL(new Blob(binaryData))
      } catch (err) {
        console.log(err.message)
        props.onError(err, uploadFile, uploadFiles.value)
      }
    }
    uploadFiles.value = [...uploadFiles.value, uploadFile]
    props.onChange(uploadFile, uploadFiles.value)
  }

  const handleRemove = async (file) => {
    const uploadFile = file instanceof File ? getFile(file) : file
    if (!uploadFile) console.log('file to be removed not found')

    const doRemove = (file) => {
      // 终止网络请求
      // abort(file)
      const fileList = uploadFiles.value
      fileList.splice(fileList.indexOf(file), 1)
      props.onRemove(file, fileList)
      revokeObjectURL(file)
    }

    if (props.beforeRemove) {
      const before = await props.beforeRemove(uploadFile, uploadFiles.value)
      if (before !== false) doRemove(uploadFile)
    } else {
      doRemove(uploadFile)
    }
  }

  watch(
    () => props.listType,
    (val) => {
      if (val !== 'picture') {
        return
      }

      uploadFiles.value = uploadFiles.value.map((file) => {
        const { raw, url } = file
        if (!url && raw) {
          try {
            let binaryData = []
            binaryData.push(raw)
            file.url = window.URL.createObjectURL(new Blob(binaryData))
          } catch (err) {
            props.onError(err, file, uploadFiles.value)
          }
        }
        return file
      })
    }
  )

  watch(
    uploadFiles,
    (files) => {
      for (const file of files) {
        file.uid ||= genFileId()
        file.status ||= 'success'
      }
    },
    { immediate: true, deep: true }
  )

  return {
    uploadFiles,
    handleError,
    handleProgress,
    handleStart,
    handleSuccess,
    handleRemove
  }
}
