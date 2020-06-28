import axios from "@/utils/request"

export function giveIntegral(data) {
  return axios.post("/integral/giveIntegral",data)
}
export function findIntegral(page,search,size,sortField,sortWay) {
  return axios.get(`integral/findIntegral?page=${page}&search=${search}&size=${size}&sortField=${sortField}&sortWay=${sortWay}`)

}
