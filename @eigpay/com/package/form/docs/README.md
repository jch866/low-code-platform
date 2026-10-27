
<script setup>
import demo from './demo.vue'
import RulesOnForm from './rulesOnForm.vue'
import RulesOnItem from './rulesOnItem.vue'
import RulesOnCustom from './rulesOnCustom.vue'
import Valiation from './demo_validation.vue'
</script>

# From 说明文档

<div class="demo-area">
  <demo />
</div>

<preview-code comp-name="form" demo-name="demo"/>

## 表单校验

表单校验支持在 Form组件上定义rules属性，和在FormItem组件上定义rules属性。rule的定义完全支持[async-validator](https://github.com/yiminghe/async-validator), 在此基础上为了简化验证的编写，我们封装了简单的rule生成机制 $r

### 在Form上定义的rules对象

这个对象中包含的key，一定要model对象的key能对应起来，并且也要和FormItem组件定义的prop能对应起来。

<div class="demo-area">
  <RulesOnForm />
</div>

<preview-code comp-name="form" demo-name="rulesOnForm"/>

### 在FormItem上定义的rules对象

仅仅应用在该FormItem上的规则，支持定义多个规则，只要一个规则不通过，后面的规则就不会再进行验证。

<div class="demo-area">
  <RulesOnItem />
</div>

<preview-code comp-name="form" demo-name="rulesOnItem"/>







## Form API
---
### Form props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| model | 表单数据对象 | Object |  -  |
| rules | 表单验证规则 | Object  | - |
| label-position | 表单域标签的位置，可选值为 left、right、top | String  | right |
| hide-required-asterisk | 是否隐藏所有表单项的必填标记  | Boolean | false |
| label-colon | 是否自动在 label 名称后添加冒号  | Boolean | false |
| disabled | 是否禁用该表单内的所有组件（适用于具有 disabled 属性的表单类组件）| Boolean  | false |

---
### Form events
| 事件名 | 说明 | 回调参数 |
| ----------- | ----------- | ----------- |
| validate | 表单项被校验后触发 | prop, isValid, message <p> (校验的字段, 校验是否通过, 错误信息) </p>|

---
### Form methods

| 函数名 | 说明 | 参数 | 返回值|
| ----------- | ----------- | ----------- | ----------- |
| validate | 对整个表单验证, 接受一个回调函数，或返回Promise | callback? : (isValid:Boolean, invalidFields?: validateFieldErrors) | Promise  |
| validateField | 校验给定的字段, 第一个参数是字段数组,，第二个参数是callback(非必须)，没有callback返回Promise, 如果没有给参数数组，就会校验整个表单 | props[]?, callback? : (isValid:Boolean, invalidFields?: validateFieldErrors) | Promise  |
| resetFields | 重置表单项, 参数是字段数组, 如果没有给参数，就重置所有字段 | props[]?  |
| clearValidate | 清除给定字段的检验信息, 参数是字段数组, 如果没有给参数，就清除所有字段的校验信息 | props[]?  |

---
### Form slots

| 插槽名 | 说明 | 子标签 |
| ----------- | ----------- | ----------- |
| - | form 内容 | FormItem |


### FormItem props

| 属性 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| prop | 对应表单域 model 里的字段 | String |  -  |
| label | 标签文本 | String  | - |
| label-width | 标签宽度 | Number  | - |
| has-label | 是否显示标签 | Boolean  | true |
| required | 是否为必填项，如不设置，则会根据校验规则确认 | Boolean  | false |
| rules | 表单验证规则  | Object | - |
| error | 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息。  | String | - |
| show-message | 是否显示校验错误信息| Boolean  | true |


---
### FormItem methods

| 函数名 | 说明 | 参数 | 返回值|
| ----------- | ----------- | ----------- | ----------- |
| resetField | 重置该表单项 | -  |
| clearValidate | 移除该表单项的校验结果 | -  |

---
### FormItem slots

| 插槽名 | 说明 | 子标签 |
| ----------- | ----------- | ----------- |
| - | 表单的内容 |  |
| label | 标签位置显示的内容 |  |
| error | 验证错误信息的显示内容 |  |





----------------------------------------------------------


### $r.xxx的链式调用
通用的链式调用关键字包含了`trigger` 和 `message`

`$r.rule.triger(arg)`, 验证触发时机, 参数支持，`blur`, `change`

`$r.rule.message(arg)`, 自定义要显示的错误信息，参数支持string 和 function， 当为function时，function 返回值为string

如要同时设置触发时机和自定义错误信息，支持链式调用例如 `$r.required.trigger('blur').message('这是一个必填项')`


### $r 可用的属性. 

`$r.required`, 必填. 增加的链式调用关键字有`is`

```javascript
 $r.required // 默认为必填
 $r.required.is(false) // 表示为非必填
 $r.required.is(true) // 表示为必填

```

`$r.email` // 验证是否是email

`$r.range`, 设置长度范围, 增加的链式调用关键字有`max`, `min`, `len`

```javascript

$r.range.max(10) // 最大长度为10 
$r.range.min(5) // 最小长度为5 
$r.range.min(5).message('最少5个字符').max(15).message('最多15个字符') // 同时设置最小和最大长度，并分别设置他们对应的提示信息 
$r.range.len(5).message('字符长度必须为5') // 固定长度5 

```

`$r.fn`, 自定义校验函数，增加的链式调用关键字有`sync`, `async`

```javascript

$r.fn.sync(validator)

// 这个验证函数，返回true表示验证通过，返回false 或是一个Error对象，表示验证失败, 也可以调用callback函数，
// 调用callback不加参数表示验证成功，有参数表示验证失败
const validator = (rule, value, callback) => {
  
}

```

```javascript

$r.fn.async(validator)

// 这个验证函数返回Promis.reject()对象表示验证失败, 也可以调用callback函数，调用callback不加参数表示验证成功，有参数表示验证失败
const validator = async(rule, value, callback) => {
  
}

```

`$r.pattern`, 校验是否符合某个正则表达式，增加的链式调用关键字有`pattern`

```javascript

$r.pattern.pattern(/^[A-Z]/).message(()=> '请以大写字母开头')

```

`$r.number`, 数值校验, $r.number接受三个参数，$r.number(整数部分的最大长度，小数部分的最大长度，是否允许负数), 小数部分的最大长度 这个参数是可以忽略的，忽略后表示没有小数位, 是否允许负数 这个参数也是可以忽略的，忽略后默认为只允许输入正数;, $.number 支持的链式关键字有max(最大值)，min(最小值)

```javascript

$r.number(3) // 表示允许输入最大长度为3位的正整数
$r.number(3, 2) // 表示允许输入整数部分最大长度为3位, 小数部分为2位的正数
$r.number(3, 2, true) // 表示允许输入整数部分最大长度为3位, 小数部分为2位的正数和负数
$r.number(3, 2, true).max(300) // 表示允许输入整数部分最大长度为3位, 小数部分为2位的正数和负数, 最大值不可以大于300
$r.number(3, 2, true).max(300).min(-400) // 表示允许输入整数部分最大长度为3位, 小数部分为2位的正数和负数, 最大值不可以大于300, 最小值不可小于-400

```

`$r.char`, 有效字符的校验，支持链式写法， 链式关键字有 Chinese，digit，letter， letterLowercase， letterUppercase， whitespace， specific， 这些关键字可以链式组合，

```javascript

$r.char.Chinese // 表示允许输入中文
$r.char.Chinese.digit // 表示允许输入中文、数字
$r.char.Chinese.digit.letterUppercase。 // 表示允许输入中文、数字、大写字母
$r.char.Chinese.digit.letter // 表示允许输入中文、数字、大小写字母
$r.char.letterLowercase.digit // 表示允许数字、小写字母
$r.char.letterLowercase.digit.whitespace // 表示允许数字、小写字母、空白符
$r.char.letterLowercase.digit.whitespace.specific // 表示允许数字、小写字母、空白符、以及特殊字符 ?&;`\'"|*?~<>^()\[]{}$\n\r

```

`$r.twId`, 首位1个大写英文字母与连续的9个数字

```javascript

$r.twId // 首位1个大写英文字母与连续的9个数字


```
`$r.url`, 合法的url

```javascript

$r.url // 合法的url


```
#### 根据地区当地的特色提供的校验规则

`$r.local`, 根据地区当地的特色提供的校验规则，比如电话号码的规则，会有不同长度要求和规则，我们可以通过$r.local.xxx来使用地区特色的校验。

如果要使用$r.local 首先要在要在组件注册时，使用方言`dialect`配置, 当前dialect的可选值只有 'zh_TW' 和 'common'， 默认值是'common'。


```javascript

const app = createApp(App)
app.use(ui, {
  locale: {
    name: 'zh_CN'
  },
  dialect: 'zh_TW' // 当前校验规则使用的地区方言
})

```

`$r.local` 目前支持的校验规则有, 传真: `$r.local.fax`; 电话: `$r.local.phone`, 身份证: `$r.local.id`

```html
<ep-form-item prop="phone" :rules="[$r.local.phone]" label="电话">
  <ep-input v-model="formModel.phone" type="text" />
</ep-form-item>

```






<div class="demo-area">
  <RulesOnCustom />
</div>

<preview-code comp-name="form" demo-name="rulesOnCustom"/>

<div class="demo-area">
  <Valiation />
</div>

<preview-code comp-name="form" demo-name="demo_validation"/>





### 默认的提示信息的修改

在use组件库时，利用option可以覆盖默认的提示信息
```javascript

app.use(ui, {
  locale: {
    name: 'zh_CN',
    messages: {
      en: {
        validation: {
          required: 'required',
          chinese: 'Must be Chinese!',
          email: 'Email illegal',
          pattern: 'Not match pattern',
          maxLength: 'Length cannot greater than {max}',
          minLength: 'Length cannot less than {min}',
          exactLength: 'Length should be {exactLength}',
          rangeLength: 'Length length should be from {min} to {max}'
        }
      },
      zh_CN: {
        validation: {
          required: '必填',
          chinese: '请输入中文',
          email: 'Email不合法',
          pattern: '格式错误',
          maxLength: '长度不能大于{max}',
          minLength: '长度不能小于{min}',
          exactLength: '长度必须是{exactLength}',
          rangeLength: '长度范围 {min} ~ {max}'
        }
      }
    }
  }
})

```
