<script setup>
import adressReflect from './adressReflect.vue'
</script>

# adress 说明文档

## 基本用法

<div class="demo-area">
  <div style="margin-top:20px"></div>
  <adress-reflect />
  <preview-code comp-name="adress" demo-name="adressReflect"/>
</div>
<div style="margin-top:20px"></div>

---

## Adress 属性

| 属性名                | 说明                                                                                            | 类型     | 默认值 |
| --------------------- | ----------------------------------------------------------------------------------------------- | -------- | ------ |
| modelValue            | 绑定的值，可使用 v-model 双向绑定 `{levelOne:'',levelTwo:'',levelThree:'',detail:'',result:""}` | object   | -      |
| queryLevelOne         | 获取第一级地区函数                                                                              | function | -      |
| queryLevelTwo         | 获取第二级地区函数                                                                              | function | -      |
| queryLevelThree       | 获取第三级地区函数                                                                              | function | -      |
| showAdressResult      | 是否显示最下面的地址反显                                                                        | boolean  | true   |
| format                | 地址反显格式化                                                                                  | function | -      |
| levelOnePlaceholder   | 第一级 placeholder                                                                              | string   | -      |
| levelTwoPlaceholder   | 第二级 placeholder                                                                              | string   | -      |
| levelThreePlaceholder | 第三级 placeholder                                                                              | string   | -      |
| detailPlaceholder     | 输入的详细地址 placeholder                                                                      | string   | -      |
| disabled              | 是否禁用                                                                                        | boolean  | false  |
| cache                 | 是否缓存城市数据                                                                                | boolean  | false  |
| filterable            | 是否开启下拉选项筛选功能，现有的下拉选项中进行关键字筛选                                           | boolean  | true   |

<div style="margin-bottom:50px"></div>

## Adress 事件

| 事件名 | 说明                          | 回调参数 |
| ------ | ----------------------------- | -------- |
| change | modelValue 数据发生变化时触发 | -        |

<div style="margin-bottom:50px"></div>
