import request from "@/utils/request";

//添加
export function addContent(data: any) {
  return request({
    url: "/intro/addContent",
    method: "post",
    data: data,
  });
}

export function updateContent(data: any) {
  return request({
    url: "/intro/updateContent",
    method: "post",
    data: data,
  });
}

//查询
export function queryContent() {
  return request({
    url: "/intro/queryContent",
    method: "get",
  });
}
