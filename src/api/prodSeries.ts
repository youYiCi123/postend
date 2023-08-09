import request from "@/utils/request";
import { SeriesMode } from "@/mode/SeriesMode";


export function listAll() {
  return request({
    url: "/prodSeries/listAll",
    method: "get"
  });
}

export function fetchList(params: any) {
  return request({
    url: "/prodSeries/list",
    method: "get",
    params: params,
  });
}

export function addProdSeries(data: SeriesMode) {
  return request({
    url: "/prodSeries/create",
    method: "post",
    data: data,
  });
}

export function updateProdSeries(id: number, data: SeriesMode) {
  return request({
    url: "/prodSeries/update/" + id,
    method: "post",
    data: data,
  });
}

export function delProdSeries(id:number) {
  return request({
    url: '/prodSeries/delete/' + id,
    method: "post"
  });
}
