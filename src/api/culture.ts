import request from '@/utils/request'
import { Culture } from "@/mode/Culture";

export function fetchList(params:any) {
  return request({
    url: '/culture/list',
    method: 'get',
    params: params
  })
}

export function createCulture(data:Culture) {
  return request({
    url: '/culture/create',
    method: 'post',
    data: data
  })
}

export function updateCulture(id:number, data:Culture) {
  return request({
    url: '/culture/update/' + id,
    method: 'post',
    data: data
  })
}

//删除
export function deleteCulture(id:any) {
    return request({
      url: '/culture/delete/' + id,
      method: 'post'
    })
  }
