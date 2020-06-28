import axios from 'axios'
import { MessageBox, Message,Loading } from 'element-ui'
import store from '@/store'
import {getToken, removeToken, setToken} from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 5000
})
let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中……',
    spinner:'el-icon-loading',
    background: 'rgba(50, 0, 0, 0.1)'
  })
}
function endLoading() {
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

service.interceptors.request.use(
  config => {
    showFullScreenLoading()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if(response.headers.gues!==undefined){
      removeToken()
      setToken(response.headers.guess);
    }
    const res = response.data
    if(response === 555){
      Message({
        message: '这个密码都能敲错，你还能干点啥？',
        type: 'error',
        duration:2 * 1000
      })
      this.$router.push({path:'/login'})
    }else{
      if (res.queue.code !== 1) {
        Message({
          message: res.queue.message,
          type: 'info',
          duration: 2 * 1000
        })
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          MessageBox.confirm('您已注销，可以取消以保留在该页面上，或者再次登录', '确认退出', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        tryHideFullScreenLoading()
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        tryHideFullScreenLoading()
        return res
      }
    }
  },
  error => {
    tryHideFullScreenLoading()
    Message({
      message: '网络连接超时请刷新页面',
      type: 'error',
      duration:2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
