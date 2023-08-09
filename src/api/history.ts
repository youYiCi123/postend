import request from '@/utils/request'
import { History } from "@/mode/History";

export function fetchList(params:any) {
  return request({
    url: '/history/list',
    method: 'get',
    params: params
  })
}

export function createHistory(data:History) {
  return request({
    url: '/history/create',
    method: 'post',
    data: data
  })
}

export function updateHistory(id:number, data:History) {
  return request({
    url: '/history/update/' + id,
    method: 'post',
    data: data
  })
}

//删除
export function deleteHistory(id:any) {
    return request({
      url: '/history/delete/' + id,
      method: 'post'
    })
  }
