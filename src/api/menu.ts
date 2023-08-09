import request from '@/utils/request'
import MenuMode from "@/mode/UserInfo/MenuMode";

export function fetchList(parentId:number, params:any) {
  return request({
    url: '/menu/list/' + parentId,
    method: 'get',
    params: params
  })
}

export function deleteMenu(id:number) {
  return request({
    url: '/menu/delete/' + id,
    method: 'post'
  })
}

export function createMenu(data:MenuMode) {
  return request({
    url: '/menu/create',
    method: 'post',
    data: data
  })
}

export function updateMenu(id:number, data:MenuMode) {
  return request({
    url: '/menu/update/' + id,
    method: 'post',
    data: data
  })
}

export function getMenu(id:number) {
  return request({
    url: '/menu/' + id,
    method: 'get',
  })
}

export function updateHidden(id:number, params:number) {
  return request({
    url: '/menu/updateHidden/' + id,
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/menu/treeList',
    method: 'get'
  })
}

