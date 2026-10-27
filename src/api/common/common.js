import Axios from '@/utils/axios'
import { BASE_URL_DATA } from '@/config/config'

// mock接口
const getMultiDicts = (data) =>
  Axios.post(BASE_URL_DATA, {
    operationType: 'eigpay.sp.optm.Channel.insertChannel',
    requestData: {
      dictGroups: data
    }
  })

// 批量查询数据字典
const getMultiDictsMore = (data) =>
  Axios.post(BASE_URL_DATA, {
    operationType: 'com.eigpay.esp.shared.queryDictByGroup',
    requestData: {
      dictGroups: data
    }
  })

// mock接口
const getList = (data) =>
  Axios.post(BASE_URL_DATA, {
    operationType: 'eigpay.scp.approvemng.ListAIIBSolutionTask',
    requestData: {
      ...data
    }
  })

// 列表数据
const getMockList = (data) =>
  Axios.post(BASE_URL_DATA, {
    operationType: '/list',
    requestData: {
      ...data
    }
  })
  
// 获取国家
const getCountryList = (data) =>
  Axios.post('/gateway', {
    operationType: 'com.eigpay.esp.shared.getTransNationality',
    requestData: {
      ...data
    }
  })

// 获取省
const getProvinceList = (data) =>
  Axios.post('/gateway', {
    operationType: 'com.eigpay.esp.shared.getProvinceList',
    requestData: {
      ...data
    }
  })

// 获取市
const getCityList = (data) =>
  Axios.post('/gateway', {
    operationType: 'com.eigpay.esp.shared.getCityList',
    requestData: {
      ...data
    }
  })

// 获取区
const getAreaList = (data) =>
  Axios.post('/gateway', {
    operationType: 'com.eigpay.esp.shared.getAreaList',
    requestData: {
      ...data
    }
  })

// 搜索商户MID
const getMerchantList = (data) =>
  Axios.post(BASE_URL_DATA, {
    operationType: 'eigpay.scp.customer.merchantInfoProvider.list',
    requestData: {
      ...data
    }
  })
export {
  getMultiDicts, 
  getMultiDictsMore, 
  getList, 
  getMockList, 
  getCountryList,
  getProvinceList,
  getCityList,
  getAreaList,
  getMerchantList
}
