const getDataSourceListData = []

export default [
  { // 获取数据库
    url: '/custom/Datasmanage/getDataSourceList',
    type: 'post',
    response: config => {
      return {
        state: 2000,
        data: getDataSourceListData
      }
    }
  },
  { // 获取字段类型
    url: '/custom/report_manage/getColType',
    type: 'post',
    response: config => {
      return {
        code: 2000,
        data: getDataSourceListData
      }
    }
  },
  { // 获取取值类型方法
    url: '/custom/reportListManage/getStatisticsFunc',
    type: 'post',
    response: config => {
      return {
        code: 2000,
        data: getDataSourceListData
      }
    }
  },
  {
    url: '/custom/report_manage/getReportListNew',
    type: 'get',
    response: config => {
      return {
        state: 2000,
        data: getDataSourceListData
      }
    }
  }
]
