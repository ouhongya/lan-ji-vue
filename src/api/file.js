import request from '@/utils/request'

export function postFile(data) {
  return request.post('/upload',data)
}
