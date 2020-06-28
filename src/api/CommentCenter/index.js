import request from '@/utils/request'

export function findTipOffComment(page,search,size,sortField,sortWay) {
  return request.get(`/comment/findTipOffComment?&page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}&status=${status}`)
}

export function punish(data,type) {
  return request.get(`/comment/punish?cid=${data}?type=${type}`)
}
