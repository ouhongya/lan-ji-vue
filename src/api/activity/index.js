import axios from "@/utils/request"
export function addActivity(data) {
  return axios.post(`/activity/addActivity`,data)
}
export function findAllActivity(page, search, size, sortField, sortWay) {
  return axios.get(`/activity/findAllActivity?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)
}

export function deleteActivity(data) {
  return axios.get(`/activity/deleteActivity?id=${data}`)
}

export function activityUpDown(data) {
  return axios.get(`/activity/activityUpDown?id=${data}`)
}

export function findActivityById(data) {
  return axios.get(`/activity/findActivityById?id=${data}`)
}

export function updateActivity(data) {
  return axios.post(`/activity/updateActivity`,data)
}
