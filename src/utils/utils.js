import _ from 'lodash'
import { EPMessage } from '../../@eigpay/com/package/message/index'
import { EPLoading } from '../../@eigpay/com/package/loading/index'
import {
  getCountryList,
  getProvinceList,
  getCityList,
  getAreaList
} from '@/api/common/common'
import { SUCCESS_STATUS } from '@/config/config'
import Encrypt from 'encryptlong'
import sm2 from 'sm-crypto'
let loadingInstanceAnother = ''
/**
 * 回显数据字典
 *
 * datas - 数据字典（必传）
 * val   - 映射码值（必传）
 * value - 码值字段名（选传 默认dictValue）
 * label - 文字字段名（选传 默认dictLabel）
 */
function selectDictLabel(datas, val, value, label) {
  if (!datas) return ''
  const actions = []
  const v = value ? `${value}` : 'lemmaItem'
  const l = label ? `${label}` : 'itemName'
  Object.keys(datas).map((key) => {
    if (datas[key][v] === val) {
      actions.push(datas[key][l])
      return false
    }
    return true
  })
  return actions.join('')
}
/** str 以 ',' 隔开的字符串 */
function commaSeparated(str, dict, array) {
  if (!str) return ''
  if (!str.length) return ''
  let arrList = str.split(',')
  const arrStr = []
  _.forEach(arrList, (item, index) => {
    arrStr[index] = selectDictLabel(dict, item)
  })
  if (array) {
    return arrStr
  } else {
    return arrStr.join(',')
  }
}
/**
 * String类型的多个字典值回显数据字典
 *
 * datas - 数据字典（必传）
 * val   - 映射码值（必传）
 * value - 码值字段名（选传 默认dictValue）
 * label - 文字字段名（选传 默认dictLabel）
 */
function selectDictListLabel(datas, val, value, label) {
  const actions = []
  const v = value ? `${value}` : 'lemmaItem'
  const l = label ? `${label}` : 'itemName'
  Object.keys(datas).map((key) => {
    val.split(',').forEach((i) => {
      if (datas[key][v] === i) {
        actions.push(datas[key][l])
        return false
      }
    })
    return true
  })
  return actions.join('， ')
}

/**
 * 处理数据字典
 *
 * dict - 数据字典
 * value - 待替换字段值
 * label  - 待替换字段值
 * text - 替换字段名
 * id - 替换字段值
 */
function dictLabel(dict, label, value, text, id) {
  const list = JSON.parse(
    JSON.stringify(dict)
      .replace(new RegExp(label, 'g'), text)
      .replace(new RegExp(value, 'g'), id)
  )
  return list
}
/**
 * 防抖动函数
 * @param fun function(){}
 */
function debounce(fun) {
  return _.debounce(fun, 3000, {
    leading: true,
    trailing: false,
    maxWait: 3000
  })
}
/** 随机数生成 */
function uuidGenerator() {
  const array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  const str = array.reduce(
    (acc, byte) => acc + byte.toString(16).padStart(2, '0'),
    ''
  )
  return str.toUpperCase()
}
/**
 * 提示语
 * @param {*} type 提示类型 必传
 * @param {*} message 提示文本 必传
 * @param {*} icon 提示图标 选传
 */
// Message提示语
function EPMessageTips(type, message, icon) {
  if (message === '请完成表单填写') {
    window.ValidityStatus = false
  }
  if (type === 'success') {
    EPMessage.success(`${message}`)
  } else if (type === 'error') {
    EPMessage.error(`${message}`)
  } else if (type === 'warning') {
    EPMessage.warning(`${message}`)
  } else if (type === 'customIcon') {
    EPMessage({
      message: message,
      icon: icon
    })
  } else {
    EPMessage(`${message}`)
  }
}
/**
 * 调用国家 queryCountry
 * 调用省 queryProvince
 * 调用市 queryCity
 * 调用区 queryStreet
 */
const queryCountry = async () => {
  const res = await getCountryList()
  if (res.returnCode === SUCCESS_STATUS) {
    return _.map(res.result, (item) => {
      return {
        id: `${item.id}`,
        label: item.name
      }
    })
  }
}
const queryProvince = async (id) => {
  const res = await getProvinceList({ countryId: id || '156' })
  if (res.returnCode === SUCCESS_STATUS) {
    const list = _.map(res.result, (item) => {
      return {
        id: `${item.id}`,
        label: item.name
      }
    })
    return list
  }
}
const queryCity = async (id) => {
  const res = await getCityList({ translateProvinceId: id })
  if (res.returnCode === SUCCESS_STATUS) {
    return _.map(res.result, (item) => {
      return {
        id: item.id,
        label: item.name
      }
    })
  }
}
const queryStreet = async (id) => {
  const res = await getAreaList({ cityId: id })
  if (res.returnCode === SUCCESS_STATUS) {
    return _.map(res.result, (item) => {
      return {
        id: item.id,
        label: item.name
      }
    })
  }
}
//获取当前日期函数
const getNowFormatDate = (type) => {
  let date = new Date()
  let obj = {
    year: date.getFullYear(), //获取完整的年份(4位)
    month: date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate: date.getDate(), // 获取当前日(1-31)
    hour: date.getHours(), //获取当前小时(0 ~ 23)
    minute: date.getMinutes(), //获取当前分钟(0 ~ 59)
    second: date.getSeconds() //获取当前秒数(0 ~ 59)
  }
  Object.keys(obj).forEach((key) => {
    if (obj[key] < 10) obj[key] = `0${obj[key]}`
  })
  if (type == 'YYYY-MM-DD') {
    return `${obj.year}-${obj.month}-${obj.strDate}`
  } else {
    return `${obj.year}${obj.month}${obj.strDate}${obj.hour}${obj.minute}${obj.second}`
  }
}
// 默认公钥
const PUBLIC_KEY =
  '30820122300D06092A864886F70D01010105000382010F003082010A0282010100A0FA35344F962AA76C6C30255D0F2CDB3B69FE20157F2AEB5C992ED2AEF2E9D86C769170C533EF5835271A9D9767778D63D12DCDC6438BA940ED7CEDAE846A817428D0B62D3A54E6FDBF3349AC9BCDC17A0E24C090273B0C4B5C355BC5B2DED7AFDBDBCBFB36055F57B6E807936F551E679E22346A265EE020B4F127BD4F6FA26BEDF30FD82EB9A48B3E5DF1A103C740A3595F044EFC7AEDA175957E2F0E8376A1DBAB6420F9DE1C866AD505F7FE10F0425F47C7D413A8DB470906F507B4EB65AB539D7476E8B19BD49F4F2ABC374AA5FC9F8CFDBB5D0F1558C73F2E2EBE75D852B0DABE1662FEF7E05C03DCDB58C5A0964E518BB011CCAC3B7425C17E2FF1AB0203010001'
/* rsa/sm2加密 */
function encrypt(data) {
  let result = ''
  const publicKey = sessionStorage.getItem('PUBLIC_KEY') || PUBLIC_KEY
  const keySpec = sessionStorage.getItem('KEY_SPEC')
  if (keySpec === 'ECC_SM2') {
    const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
    result = sm2.doEncrypt(data, publicKey, cipherMode)
  } else {
    const encryptor = new Encrypt()
    encryptor.setPublicKey(publicKey)
    result = encryptor.encryptLong(data)
  }
  return result
}
function timestampFormat(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2) // 月份是从0开始的
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}
function showLoading() {
  loadingInstanceAnother = EPLoading({
    target: 'body',
    text: 'loading...',
    textColor: '#fff',
    zIndex: 9999
  })
}
function hideLoading() {
  loadingInstanceAnother.close()
}
export {
  selectDictLabel,
  selectDictListLabel,
  dictLabel,
  debounce,
  uuidGenerator,
  commaSeparated,
  EPMessageTips,
  queryCountry,
  queryProvince,
  queryCity,
  queryStreet,
  getNowFormatDate,
  timestampFormat,
  showLoading,
  hideLoading,
  encrypt
}
