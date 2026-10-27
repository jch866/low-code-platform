<script setup>
import paginationNormal from './paginationNormal.vue'
import paginationBackground from './paginationBackground.vue'
import paginationDisable from './paginationDisable.vue'
import paginationDisableNormal from './paginationDisableNormal.vue'
import paginationHideonpage from './paginationHideonpage.vue'
</script>

# Pagination 说明文档

<div style="margin-top:20px"></div>

## 基础用法

<div class="demo-area">
<pagination-normal />
<preview-code comp-name="pagination" demo-name="paginationNormal"/>
</div>

<div style="margin-top:20px"></div>

## 带有背景色的分页

<div class="demo-area">
<pagination-background />
<preview-code comp-name="pagination" demo-name="paginationBackground"/>
</div>
<div style="margin-top:20px"></div>

## 禁用分页

<div class="demo-area">
<pagination-disable />
<preview-code comp-name="pagination" demo-name="paginationDisable"/>
<div style="margin-top:20px"></div>
<pagination-disable-normal/>
<preview-code comp-name="pagination" demo-name="paginationDisableNormal"/>
</div>
<div style="margin-top:20px"></div>

## 只有一页时是否隐藏

<div class="demo-area">
<pagination-hideonpage/>
<preview-code comp-name="pagination" demo-name="paginationHideonpage"/>
</div>
<div style="margin-top:20px"></div>

## Pagination 属性

| 属性名              | 说明                                    | 类型     | 可选值 | 默认值                    |
| ------------------- | --------------------------------------- | -------- | ------ | ------------------------- |
| background          | 是否为分页按钮添加背景色                | boolean  | —      | false                     |
| page-size           | 每页显示条目个数，支持 v-model 双向绑定 | number   | —      | 10                        |
| total               | 总条目数                                | number   | —      | —                         |
| current-page        | 当前页数，支持 v-model 双向绑定         | number   | —      | 1                         |
| page-sizes          | 每页显示个数选择器的选项设置            | number[] | —      | [10, 20, 30, 40, 50, 100] |
| disabled            | 是否禁用分页                            | boolean  | —      | false                     |
| hide-on-single-page | 只有一页时是否隐藏                      | boolean  | —      | false                     |
| totalDescribe       | 总条数描述                              | string   | —      | 共${total}条数据          |

---

## Pagination 事件

| 事件名         | 说明                               | 参数       |
| -------------- | ---------------------------------- | ---------- |
| size-change    | page-size 改变时触发               | 新每页条数 |
| current-change | current-page 改变时触发            | 新当前页   |
| prev-click     | 用户点击上一页按钮改变当前页时触发 | 新当前页   |
| next-click     | 用户点击下一页按钮改变当前页时触发 | 新当前页   |

---

<div style="margin-bottom:80px"></div>
