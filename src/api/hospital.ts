import request from '@/utils/request'

export function fetchList(params:any) {
    return request({
      url: '/hospital/list',
      method: 'get',
      params: params
    })
  }
  export function fetchHospitalList(params:any) {
    return request({
      url: '/hospital/cityHospitalList',
      method: 'get',
      params: params
    })
  }

  export function createHospital(data:any) {
    return request({
      url: '/hospital/add',
      method: 'post',
      data: data
    })
  }
  
  export function updateHospital(id:any, data:any) {
    return request({
      url: '/hospital/update/' + id,
      method: 'post',
      data: data
    })
  }
  export function deleteHospital(id:any) {
    return request({
      url: '/hospital/delete/' + id,
      method: 'post'
    })
  }