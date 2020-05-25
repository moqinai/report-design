import request from '@/utils/request'

export function getReportListNew(data) {
  return request({
    url: '/custom/report_manage/getReportListNew',
    method: 'get',
    params: data
  })
}
// 获取数据集接口
export function getDataListByReportId(data) {
  return request({
    url: '/custom/report_data_manage/getDataListByReportId',
    method: 'get',
    params: data
  })
}

// 获取数据库
export function getDataSourceList(data) {
  return request({
    url: '/custom/Datasmanage/getDataSourceList',
    method: 'get',
    params: data
  })
}

export function delDataSet(data) {
  return request({
    url: '/custom/report_data_manage/delData',
    method: 'get',
    params: data
  })
}
