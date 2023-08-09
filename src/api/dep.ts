import request from '@/utils/request'
import { addDep,DepTableInfo } from "@/mode/DepInfoMode";
//添加部门
export function createDep(data:addDep) {
    return request({
      url: '/dep/add',
      method: 'post',
      data: data
    })
  }

//查询所有部门
export function getAllDep(params:any) {
  return request({
    url: '/dep/allInfo',
    method: 'get',
    params: params
  })
}

//部门人员信息
export function depDetails(params:any) {
  return request({
    url: '/dep/details',
    method: 'get',
    params: params
  })
}

//修改部门
export function updateDep(id:string, data:DepTableInfo) {
    return request({
      url: '/dep/update/' + id,
      method: 'post',
      data: data
    })
  }

//删除部门
export function deleteDep(id:string) {
    return request({
      url: '/dep/delete/' + id,
      method: 'post'
    })
  }
  //查询所有部门及人员的级联关系
  export function fetchListWithChildren() {
    return request({
      url: '/dep/selectUserRelation',
      method: 'get'
    })
  }

  export function getDepIdToName() {
    return request({
      url: '/dep/getDepIdToName',
      method: 'get'
    })
  }


