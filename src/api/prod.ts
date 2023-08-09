import request from "@/utils/request";

//获取所有产品
export function getAllProd(params:any) {
  return request({
    url: '/prod/getAllProd',
    method: 'get',
    params: params
  })
}

//添加
export function addProdContent(data: any) {
  return request({
    url: "/prod/addContent",
    method: "post",
    data: data,
  });
}

//查询
export function queryProdContent(id: any) {
  return request({
    url: "/prod/queryContent/" + id,
    method: "get",
  });
}

//修改
export function updateProdContent(data: any) {
  return request({
    url: "/prod/updateContent",
    method: "post",
    data: data,
  });
}
//删除
export function deleteProd(id:any) {
  return request({
    url: '/prod/delete/' + id,
    method: 'post'
  })
}

//批量删除
export function handleBatchDelete(data:any) {
  return request({
    url: '/prod/handleBatchDelete',
    method: 'post',
    data: data
  })
}


