import request from "@/utils/request";

export function fetchList(parentId:any,params:any) {
  return request({
    url: "/solutionSeries/list/"+parentId,
    method: "get",
    params: params,
  });
}

export function fetchListWithChild() {
  return request({
    url: "/solutionSeries/list/withChildren",
    method: "get"
  });
}

export function addSolutionSeries(parentId:number,data: any) {
  return request({
    url: "/solutionSeries/create/"+parentId,
    method: "post",
    data: data,
  });
}

export function updateSolutionSeries(data: any) {
  return request({
    url: "/solutionSeries/update",
    method: "post",
    data: data,
  });
}

export function delSolutionSeries(id: number) {
  return request({
    url: "/solutionSeries/delete/" + id,
    method: "post",
  });
}
