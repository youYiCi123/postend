import request from '@/utils/request'

export function exportUserExcel(data:any) {
    return request({
      url: '/ExportUserExcel',
      method: 'post',
      data: data
    })
  }

