import axios from 'axios'
import { API_PARAMETER, COMMON_API_LIST } from '@/config/config'
import { EPMessage } from '../../@eigpay/com/package/message/index'
import { forceDispatch, dispatchEvent } from '@/lib/appCommunicate'
import { uuidGenerator, showLoading, hideLoading } from '@/utils/utils'
import i18n from '@/language/index'
let _counter = 0
// 请求计数器
let activeRequests = 0
import dayjs from 'dayjs'
const service = axios.create({
  method: 'post',
  baseURL: '/optg/',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  responseType: 'json', // 默认的 服务器响应的数据类型
  isShowLoading: false
})
axios.defaults.withCredentials = true // withCredentials 表示跨域请求时是否需要使用凭证

window.axiosPromiseArr = [] // 记录当前的网络请求

let saveAuthorization
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    //请求开始前
    if (window.requestListener) {
      //该值默认为0
      window.requestListener.pendingCount++
    }
    // 每次请求前递增计数器
    if (activeRequests === 0) {
      showLoading()
    }
    activeRequests += 1

    // 再发送请求之前在请求头中中赋值Token
    saveAuthorization = localStorage.getItem('authorization')
    const systemType = sessionStorage.getItem('systemType')
    if (systemType) {
      const authorizationData = JSON.parse(
        localStorage.getItem('authorization')
      )
      const systemTypeObj = {
        '01': {
          title: i18n.global.t('common.businessField.C2118'),
          Authorization: authorizationData.adminPortal
        },
        '02': {
          title: i18n.global.t('common.businessField.C2119'),
          Authorization: authorizationData.acquiringPortal
        },
        '03': {
          title: i18n.global.t('common.businessField.C2120'),
          Authorization: authorizationData.merchantPortal
        }
      }
      document.title = systemTypeObj[systemType].title
      config.headers['Authorization'] = systemTypeObj[systemType].Authorization
    }
    // 在发送请求之前做处理 区登录返回appid
    config.data.appId = sessionStorage.getItem('currentAppCode')

    if (config.data.operationType === 'tnasApi.searchPageTermRecycleByMcht') {
      config.baseURL = 'http://107.167.190.94/optg'
    }
    if (COMMON_API_LIST.includes(config.data.operationType)) {
      config.data.requestData = JSON.stringify(config.data.requestData)
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = {
        ...API_PARAMETER,
        nonceStr: uuidGenerator(),
        ...config.data
      }
      const formDataList = new FormData()
      for (const key in config.data) {
        if (Object.hasOwnProperty.call(config.data, key)) {
          const element = config.data[key]
          formDataList.append(key, element)
        }
      }
      config.data = formDataList
    } else {
      config.data.requestData.sendTime = dayjs(new Date()).format(
        'YYYYMMDDHHmmss'
      )
      config.data.requestData.tntInstId = JSON.parse(
        sessionStorage.getItem('msgData')
      ).tntInstId
      config.data.requestData.appTp = '01'
      config.data = {
        ...API_PARAMETER,
        nonceStr: uuidGenerator(),
        ...config.data
      }
    }
    if (RegExp(/mock/).test(config.baseURL)) {
      const BaseURL = JSON.parse(JSON.stringify(config.data))
      config.url = `28/${BaseURL.operationType}`
    }
    return config
  },
  ({ config }) => {
    // 对请求错误做些什么
    activeRequests -= 1
    if (activeRequests === 0) {
      hideLoading()
    }
    return Promise.reject(config)
  }
)

// 响应拦截器
const enterType = sessionStorage.getItem('systemType')
service.interceptors.response.use(
  (response) => {
    if (!response.headers.authorization) {
      localStorage.setItem('authorization', saveAuthorization)
      activeRequests -= 1
      if (activeRequests === 0) {
        hideLoading()
      }
    } else {
      // 每次响应后递减计数器
      activeRequests -= 1
      if (activeRequests === 0) {
        hideLoading()
      }
      // 在响应数据时做处理
      const authorizationType = localStorage.getItem('authorization')
        ? JSON.parse(localStorage.getItem('authorization'))
        : ''
      let authorization = {
        acquiringPortal: authorizationType.acquiringPortal || '',
        merchantPortal: authorizationType.merchantPortal || '',
        adminPortal: authorizationType.adminPortal || ''
      }
      if (enterType === '02') {
        authorization.acquiringPortal = response.headers.authorization
        localStorage.setItem('authorization', {
          acquiringPortal: JSON.stringify(authorization)
        })
      } else if (enterType === '03') {
        authorization.merchantPortal = response.headers.authorization
        localStorage.setItem('authorization', {
          merchantPortal: JSON.stringify(authorization)
        })
      } else if (enterType === '01') {
        authorization.adminPortal = response.headers.authorization
        localStorage.setItem('authorization', {
          adminPortal: JSON.stringify(authorization)
        })
      }
      localStorage.setItem('authorization', JSON.stringify(authorization))
    }
    const { status, data } = response
    if (window.requestListener) {
      window.requestListener.pendingCount--
      const configData =
        Object.prototype.toString.call(response.config.data) ==
        '[object FormData]'
          ? '{"data":"FormData"}'
          : response.config.data
      if (JSON.parse(configData)) {
        window.requestListener.requestData.push({
          status: status === 200, //请求成功还是失败
          reqData: data.resultData, //请求上送的数据
          resData: JSON.parse(configData)
        })
      }
    }
    if (status === 200) {
      if (data.resultData !== undefined) {
        if (data.resultData.subCode === 'OG0004') {
          // token失效，需要重新登录
          return forceDispatch({
            type: 'returnLogin'
          })
        }
        let randomNum = Math.random()
        // 登陆未超时
        dispatchEvent({ type: 'resetTimeout', resRandom: randomNum })
        if (data.resultData.returnCode !== '0000') {
          if (
            [
              '1000',
              '1001',
              '1002',
              '1004',
              '1007',
              '1008',
              '1009',
              '1010'
            ].includes(data.resultData.returnCode)
          ) {
            // 网络异常
            if (_counter < 1) {
              EPMessage.error(data.resultData.returnMsg)
              _counter = _counter + 1
              setTimeout(() => {
                _counter = _counter - 1
              }, 3000)
            }
          } else {
            // 正常接口异常
            EPMessage.error(data.resultData.returnMsg)
          }
        }
        return data.resultData
      }
      return data
    }
    return {
      status
    }
  },
  () => {
    // 同样处理计数器
    activeRequests -= 1
    if (activeRequests === 0) {
      hideLoading()
    }
    Promise.reject()
  }
)

export default service
