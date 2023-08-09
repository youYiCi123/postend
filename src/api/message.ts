import request from '@/utils/request'

export function getAllMessage(params: any) {
  return request({
    url: "/message/getAllMessage",
    method: "get",
    params: params,
  });
}

export function deleteMessage(id: any) {
  return request({
    url: "/message/delete/" + id,
    method: "post",
  });
}

export function handleBatchDelete(data: any) {
  return request({
    url: "/message/handleBatchDelete",
    method: "post",
    data: data,
  });
}
