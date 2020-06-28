  import request from '@/utils/request'

  export function login(data) {
  return request({
    url: '/account/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/account/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getRouterList() {
  return request({
    url:'/account/findAccountPower',
    method:'get'
  })
}
export function file(data) {
  return request.post('/upload',data)
}
