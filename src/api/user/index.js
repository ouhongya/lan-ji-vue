import axios from "@/utils/request"

export function fetchData(page, search, size, sortField, sortWay) {
  return axios.get(`/user/findAllUser?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function findCommentByUid(id,page, size, sortField, sortWay) {
  return axios.get(`/user/findCommentByUid?id=${id}&page=${page}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}
export function findInAssembleByUid(id,page, size, sortField, sortWay) {
  return axios.get(`/user/findInAssembleByUid?id=${id}&page=${page}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findAssembleByUid(id,page, size, sortField, sortWay) {
  return axios.get(`/user/findAssembleByUid?id=${id}&page=${page}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function findSUserById(id) {
  return axios.get(`/user/findSUserById?id=${id}`)
}
