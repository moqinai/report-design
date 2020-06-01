import request from '@/utils/request'

export function addReportDirectory(data) {
  return request({
    url: '/custom/report_manage/addReportDirectory',
    method: 'get',
    params: data
  })
}
export function saveReportMainInfo(data) {
  return request({
    url: '/custom/report_manage/saveReportMainInfo',
    method: 'get',
    params: data
  })
}

// 数据model

export function getModelList(data) {
  return request({
    url: '/custom/Modelcon/modelList',
    method: 'get',
    params: data
  })
}

export function getAllFields(data) {
  return request({
    url: '/custom/report_data_manage/getAllFields',
    method: 'get',
    params: data
  })
}

export function getModelField(data) {
  return request({
    url: '/custom/Attribute/filedsListNew',
    method: 'get',
    params: data
  })
}

export function addDataInfo(data) {
  return request({
    url: '/custom/report_data_manage/addDataInfo',
    method: 'get',
    params: data
  })
}

export function addDataInfoSql(data) {
  return request({
    url: '/custom/report_data_manage/addDataInfoSql',
    method: 'post',
    data
  })
}

export function getDataDetail(data) {
  return request({
    url: '/custom/report_data_manage/getDataDetail',
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

// delReport /
// custom / report_manage / delReportNew

export function delReport(data) {
  return request({
    url: '/custom/report_manage/delReportNew',
    method: 'get',
    params: data
  })
}

export function runSql(data) {
  return request({
    url: '/custom/report_data_manage/runSql',
    method: 'post',
    data
  })
}

export function getDataListFun(data) {
  return request({
    url: '/custom/ReportDataManage/getDataSql',
    method: 'post',
    data
  })
}

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
    method: 'post',
    params: data
  })
}
// 获取字段类型
export function getColType(data) {
  console.log('进了getColTYpe')
  return request({
    url: '/custom/report_manage/getColType',
    method: 'post',
    params: data
  })
}
// 获取取值类型
export function getStatistics(data) {
  return request({
    url: '/custom/reportListManage/getStatisticsFunc',
    method: 'post',
    params: data
  })
}
