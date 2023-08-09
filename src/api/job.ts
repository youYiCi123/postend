import request from "@/utils/request";

export function fetchList(params: any) {
  return request({
    url: "/job/list",
    method: "get",
    params: params,
  });
}

export function deleteJob(id:number) {
  return request({
    url: "/job/delete/"+ id,
    method: "post"
  });
}

export function handleBatchDelete(data:any) {
  return request({
    url: '/job/deleteBatch',
    method: 'post',
    data: data
  })
}

//添加职位信息
export function addJobContent(data:any) {
  return request({
    url: '/job/addContent',
    method: 'post',
    data: data
  })
}

//查询职位信息
export function queryJobContent(id:any) {
  return request({
    url: '/job/queryContent/'+id,
    method: 'get',
  })
}

//修改职位信息
export function updateJobContent(data:any) {
  return request({
    url:'/job/updateContent',
    method:'post',
    data:data
  })
}





