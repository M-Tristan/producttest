import axios from 'axios'
import Config from './config'
class Request {
  constructor(baseURL, timeout) {
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: timeout,
      headers: { clientId: 'client_ZEUNJISQCT' },
    })
    this.interceptors()
  }
  interceptors() {
    // 添加请求拦截器
    this.instance.interceptors.request.use(
      function (config) {
        config.baseURL = Config.httpurl
        // 在发送请求之前做些什么
        return config
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
    // 添加响应拦截器
    this.instance.interceptors.response.use(
      function (response) {
        // 对响应数据做点什么
        if (response.status === 200) {
          return response.data
        } else {
          return Promise.reject(response.data.msg)
        }
      },
      function (error) {
        // 对响应错误做点什么
        return Promise.reject(error)
      }
    )
  }
  get(url, params) {
    return this.instance({
      method: 'get',
      url: url,
      params: params,
    })
  }
  post(url, data) {
    return this.instance({
      method: 'post',
      url: url,
      data: data,
    })
  }
  resetUrl(url, data) {
    if (data != undefined) {
      for (let key in data) {
        console.log(`{{${key}}}`, url.includes(`{{${key}}}`))
        if (url.includes(`{{${key}}}`)) {
          let str = String(data[key])
          let re = new RegExp(`{{${key}}}`, 'g')
          url = url.replace(re, str)
          delete data[key]
        }
      }
    }
    return url
  }
  request(url, param) {
    console.log(param)
    // console.log(url)
    url = this.resetUrl(url, param.data)
    url = this.resetUrl(url, param.params)
    console.log({
      url,
      method: param.method,
      data: param.data,
      params: param.params,
    })
    return this.instance.request({
      url,
      method: param.method,
      data: param.data,
      params: param.params,
    })
  }
}
export { Request }
export default Request
