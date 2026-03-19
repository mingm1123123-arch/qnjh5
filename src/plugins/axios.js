'use strict'

import Vue from 'vue'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import JSONbig from 'json-bigint'

// axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.tenant_id = 1

let config = {
  //  baseURL:'/api/',
  // baseURL: 'http://localhost:12083/jeecg-boot/'
  // baseURL: "http://49.232.170.124:9999"

  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}
// console.log(vue.$store.state.s)
const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前执行某些操作
    if (config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('multipart/form-data') >= 0) {
    } else {
      if (config.data) {
        config.data = encryptByDES(JSON.stringify(config.data))
      }
    }
    // let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDk4MTAxNDcsInVzZXJuYW1lIjoiYWRtaW4ifQ.Vvli8jlT3s9faV8UHFFsbLW20PXUmXRyCC4f_En1x_E'
    let token = sessionStorage.getItem('token')
    if (token) {
      // config.headers.Authorization = 'Bearer ' + token
      config.headers['X-Access-Token'] = token
    }
    // 请求头携带的信息
    return config
  },
  function (error) {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    if (!response) {
      // 处理响应错误
      return Promise.reject(response)
    } else {
      const resultData = response.data.result
      if (resultData) {
        const result = decryptByDES(resultData)
        if (result.startsWith('{') && result.endsWith('}')) {
          response.data.result = JSONbig.parse(result)
        } else if (result.startsWith('[') && result.endsWith(']')) {
          response.data.result = JSONbig.parse(result)
        } else {
          response.data.result = result
        }
      }
      // 对响应数据做些什么
      return response
    }
  },
  function (error) {
    // 处理响应错误
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

const _key = 'K35Pjw3Nbh3AmhmPJQXuuHiJ'

// DES加密 Pkcs7填充方式
export function encryptByDES (message) {
  const keyHex = CryptoJS.enc.Utf8.parse(_key)
  const encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
// DES解密
export function decryptByDES (ciphertext) {
  const keyHex = CryptoJS.enc.Utf8.parse(_key)

  const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    // 偏移量
    // iv: CryptoJS.enc.Utf8.parse(ivstr)
    iv: ''
  })

  return decrypted.toString(CryptoJS.enc.Utf8)
}

Vue.use(Plugin)

export default { Plugin, config }
