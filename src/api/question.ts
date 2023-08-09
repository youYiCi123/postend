import request from "@/utils/request";

export function fetchList(params: any) {
  return request({
    url: "/question/list",
    method: "get",
    params: params,
  });
}

//查询某部门信息信息
export function getQuestion(id:number) {
  return request({
    url: "/question/getQuestion/" + id,
    method: "get",
  });
}

export function addQuestion(data: any) {
  return request({
    url: "/question/create",
    method: "post",
    data: data,
  });
}

export function updateQuestion(data: any) {
  return request({
    url: "/question/update",
    method: "post",
    data: data,
  });
}

export function delQuestion(id: number) {
  return request({
    url: "/question/delete/" + id,
    method: "post",
  });
}
