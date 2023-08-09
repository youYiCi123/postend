import request from '@/utils/request'
export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })
}
export function getStsToken() {
  return request({
    url:'/aliyun/oss/getStsToken',
    method:'get',
  })
}

