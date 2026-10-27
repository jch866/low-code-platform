<script setup>
import fileList from './fileList.vue'
import demo from './demo.vue'
import statusChange from './statusChange.vue'
</script>

# Upload 说明文档

## 基本用法

通过 slot 你可以传入自定义的上传按钮类型和文字提示。 可通过设置 limit 和 on-exceed 来限制上传文件的个数和定义超出限制时的行为。
可通过设置 before-remove 来阻止文件移除操作。

<div class="demo-area">
  <file-list />
</div>

<preview-code comp-name="upload" demo-name="fileList"/>

## 上传头像

在 before-upload 钩子中限制用户上传文件的格式和大小。

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="upload" demo-name="demo"/>

## 上传文件列表控制

通过 on-change 钩子函数来对上传文件的列表进行控制。

<div class="demo-area">
  <status-change />
</div>

<preview-code comp-name="upload" demo-name="statusChange"/>

## Upload API

---

### Upload props

| 属性                          | 说明                                                           | 类型                               | 默认值   | 必填 |
| ----------------------------- | -------------------------------------------------------------- | ---------------------------------- | -------- | ---- |
| action                        | 请求 URL                                                       | string                             | —        | 是   |
| headers                       | 设置上传的请求头部                                             | object                             | -        |
| method                        | 设置上传请求方法                                               | string                             | 'post'   |
| multiple                      | 是否支持多选文件                                               | string                             | false    |
| data                          | 上传时附带的额外参数                                           | object                             | false    |
| name                          | 上传的文件字段名                                               | string                             | 'file'   |
| with-credentials              | 支持发送 cookie 凭证信息                                       | boolean                            | false    |
| accept                        | 接受上传的文件类型                                             | string                             | -        |
| on-success                    | 文件上传成功时的钩子                                           | function(response, file, fileList) |
| on-error                      | 文件上传失败时的钩子                                           | function(err, file, fileList)      |
| on-progress                   | 文件上传时的钩子                                               | function(event, file, fileList)    |
| on-exceed                     | 当超出限制时，执行的钩子函数                                   | function(file, fileList)           |
| on-change                     | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 | function(file, fileList)           |
| on-remove                     | 文件列表移除文件时的钩子                                       | function(file, fileList)           |
| before-upload                 | 上传文件之前的钩子，若返回 false，则停止上传。                 | function(file)                     |
| before-remove                 | 删除文件之前的钩子，参数为上传的文件和文件列表                 | function(file, fileList)           |
| disabled                      | 是否禁用上传                                                   | boolean                            | false    |
| limit                         | 允许上传文件的最大数量                                         | number                             | -        |
| file-list / v-model:file-list | 默认上传文件                                                   | array                              | []       |
| list-type                     | 文件列表的类型                                                 | 'text' 或 'picture'                | 'text'   |
| auto-upload                   | 是否自动上传文件                                               | boolean                            | true     |
| http-request                  | 覆盖默认的 Xhr 行为，允许自行实现上传文件的请求                | function(options)                  |
| show-file-list                | 是否显示已上传文件列表                                         | boolean                            | true     |
| show-progresss                | 是否显示已进度条                                               | boolean                            | true     |
| progress-type                 | 进度条类型                                                     | string                             | 'circle' |

---

### Upload slots

| 插槽名  | 说明                 | 子标签 |
| ------- | -------------------- | ------ |
| default | 自定义默认内容       |
| trigger | 触发文件选择框的内容 |
| tip     | 提示说明文字         |
