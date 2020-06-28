import account from '@/views/system/account/index'
import role from '@/views/system/role/index'
import city from '@/views/system/city/index'
import label from '@/views/system/label/index'
import pavilion from '@/views/gather/pavilion'
import exhibition from '@/views/gather/exhibition'
import recommendation from '@/views/gather/recommendation'
import information from '@/views/celebrity/information'
import bigStarShopLabel from '@/views/celebrity/bigStarShopLabel'
import commodity from '@/views/celebrity/commodity'
import Convocation from '@/views/convene/Convocation/index'
import Report from "@/views/CommentCenter/Report/index";
import PointsList from "@/views/Points/Pointslist/index";
import userList from '@/views/user/UserList/index'
import activityIndex  from '@/views/activity/indexTable'
export function map() {
  const map = new Map()
  map.set('account', account)
  map.set('role', role)
  map.set('areaAndCity', city)
  map.set('label', label)
  map.set('Convocation', Convocation)
  map.set('pavilion', pavilion)
  map.set('exhibition', exhibition)
  map.set('recommendation', recommendation)
  map.set('information', information)
  map.set('bigStarShopLabel', bigStarShopLabel)
  map.set('commodity', commodity)
  map.set('activityIndex', activityIndex)
  map.set('userList', userList)
  map.set('Report', Report)
  map.set('PointsList', PointsList)
  return map
}

export function iconMap() {
  const arr = new map()
  arr.set('/system', 'example')
  arr.set('/convene', 'convene')
  arr.set('/gather', 'gather')
  arr.set('/celebrity', 'celebrity')
  arr.set('/activity', 'activity')
  arr.set('/user', 'user')
  arr.set('/CommentCenter', 'CommentCenter')
  arr.set('/Points', 'Points')
  return arr
}
