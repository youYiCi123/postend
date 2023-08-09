import request from "@/utils/request";
import { SeriesMode } from "@/mode/SeriesMode";


export function listAll() {
  return request({
    url: "/newsSeries/listAll",
    method: "get"
  });
}

export function fetchList(params: any) {
  return request({
    url: "/newsSeries/list",
    method: "get",
    params: params,
  });
}

export function addNewsSeries(data: any) {
  return request({
    url: "/newsSeries/create",
    method: "post",
    data: data,
  });
}

export function updateNewsSeries(id: number, data: any) {
  return request({
    url: "/newsSeries/update/" + id,
    method: "post",
    data: data,
  });
}

export function delNewsSeries(id:number) {
  return request({
    url: '/newsSeries/delete/' + id,
    method: "post"
  });
}
