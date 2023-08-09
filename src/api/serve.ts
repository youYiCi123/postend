import request from '@/utils/request'
import { ServiceIdea } from "@/mode/Service";

export function listAll() {
    return request({
      url: "/serviceIdea/listAll",
      method: "get"
    });
  }
  
  export function fetchList(params: any) {
    return request({
      url: "/serviceIdea/list",
      method: "get",
      params: params,
    });
  }
  
  export function addServiceIdea(data: ServiceIdea) {
    return request({
      url: "/serviceIdea/create",
      method: "post",
      data: data,
    });
  }
  
  export function updateServiceIdea(id: number, data: ServiceIdea) {
    return request({
      url: "/serviceIdea/update/" + id,
      method: "post",
      data: data,
    });
  }
  
  export function delServiceIdea(id:number) {
    return request({
      url: '/serviceIdea/delete/' + id,
      method: "post"
    });
  }
  