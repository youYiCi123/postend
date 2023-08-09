import request from "@/utils/request";
import { ConceptIdea } from "@/mode/Concept";

export function fetchList(params: any) {
  return request({
    url: "/concept/list",
    method: "get",
    params: params,
  });
}

export function addConceptIdea(data: ConceptIdea) {
  return request({
    url: "/concept/create",
    method: "post",
    data: data,
  });
}

export function updateConceptIdea(id: number, data: ConceptIdea) {
  return request({
    url: "/concept/update/" + id,
    method: "post",
    data: data,
  });
}

export function delConceptIdea(id: number) {
  return request({
    url: "/concept/delete/" + id,
    method: "post",
  });
}
