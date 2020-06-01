const getDataSourceListData = {
  state: 2000,
  message: '获取数据成功',
  data: {
    nowpage: 1,
    totalPage: 1,
    count: 7,
    'data|10': [
      {
        'report_source_id': '@increment',
        'link_name|1': 'xxx数据表' + '@increment',
        'db_name': '@string(5)'
      }
    ]
  }
}

const getReportListNew = {
  state: 2000,
  message: '获取数据成功',
  data: {
    count: 45,
    nowpage: 1,
    totalPage: 1,
    data: [
      {
        'report_id': 178,
        'report_nickname': null,
        'report_name': 'Newtest',
        'report_resource_name': null,
        'main_table_name': null,
        'parent_id': 0,
        'type': 1,
        'reportType': 1,
        'is_full_screen': 0,
        'child': [
          {
            'report_id': 180,
            'report_nickname': "what'syourname",
            'report_name': "what'syourname",
            'report_resource_name': '朴新ERP系统2',
            'main_table_name': 'param',
            'parent_id': 178,
            'type': 2,
            'reportType': 2,
            'is_full_screen': 0,
            'child': [

            ]
          },
          {
            'report_id': 185,
            'report_nickname': 'yaoyao',
            'report_name': 'yaoyao',
            'report_resource_name': '朴新ERP系统2',
            'main_table_name': '班级模型表',
            'parent_id': 178,
            'type': 2,
            'reportType': 2,
            'is_full_screen': 0,
            'child': [

            ]
          }
        ]
      },
      {
        'report_id': 198,
        'report_nickname': null,
        'report_name': '测试列表填报',
        'report_resource_name': null,
        'main_table_name': null,
        'parent_id': 0,
        'type': 1,
        'reportType': 1,
        'is_full_screen': 0,
        'child': [
          {
            'report_id': 199,
            'report_nickname': 'asdfasdf',
            'report_name': '列表test',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 198,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': [

            ]
          },
          {
            'report_id': 200,
            'report_nickname': null,
            'report_name': 'test dataid',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 198,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 214,
            'report_nickname': 'gasdgasdgasdga',
            'report_name': 'empty',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 198,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 215,
            'report_nickname': '4444',
            'report_name': '2222',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 198,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 202,
            'report_nickname': '12312qwe',
            'report_name': '测试列表1',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 201,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 218,
            'report_nickname': '班级详情分析',
            'report_name': '班级详情分析',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 201,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 237,
            'report_nickname': '通联支付占比',
            'report_name': '测试列表真的可以了吗',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 201,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 238,
            'report_nickname': '通联支付占比测试',
            'report_name': '测试报表333',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 201,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 239,
            'report_nickname': '统计支付情况',
            'report_name': '支付情况统计',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 201,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          }
        ]
      },
      {
        'report_id': 205,
        'report_nickname': null,
        'report_name': '测试填报型',
        'report_resource_name': null,
        'main_table_name': null,
        'parent_id': 0,
        'type': 1,
        'reportType': 1,
        'is_full_screen': 0,
        'child': [
          {
            'report_id': 219,
            'report_nickname': null,
            'report_name': '测试填报1',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 205,
            'type': 2,
            'reportType': 2,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 233,
            'report_nickname': '测试填报报表',
            'report_name': '测试填报111',
            'report_resource_name': '报表中间表',
            'main_table_name': '校区测试表',
            'parent_id': 205,
            'type': 2,
            'reportType': 2,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 234,
            'report_nickname': '通联支付占比',
            'report_name': '测试列表0530',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 205,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 235,
            'report_nickname': '通联占比',
            'report_name': '测试表2',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 205,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          },
          {
            'report_id': 236,
            'report_nickname': null,
            'report_name': '测试列表3',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 205,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          }
        ]
      },
      {
        'report_id': 226,
        'report_nickname': null,
        'report_name': '测试填报型报表',
        'report_resource_name': null,
        'main_table_name': null,
        'parent_id': 0,
        'type': 1,
        'reportType': 1,
        'is_full_screen': 0,
        'child': [
          {
            'report_id': 227,
            'report_nickname': null,
            'report_name': '测试填报111',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 226,
            'type': 2,
            'reportType': 2,
            'is_full_screen': 0,
            'child': []
          }
        ]
      },
      {
        'report_id': 229,
        'report_nickname': null,
        'report_name': '测试列表型报表',
        'report_resource_name': null,
        'main_table_name': null,
        'parent_id': 228,
        'type': 1,
        'reportType': 1,
        'is_full_screen': 0,
        'child': [
          {
            'report_id': 230,
            'report_nickname': 'test',
            'report_name': '测试列表型报表',
            'report_resource_name': null,
            'main_table_name': null,
            'parent_id': 229,
            'type': 2,
            'reportType': 1,
            'is_full_screen': 0,
            'child': []
          }
        ]
      }
    ]
  }
}

const getColType = {
  state: 2000,
  message: 'SUCCESS',
  data: [
    { 'id': 'input', 'name': '文本框', 'need_extra': 0, 'use_search': 1, 'common_search_logic': '=', 'is_time': 0 },
    { 'id': 'textarea', 'name': '多行文本', 'need_extra': 0, 'use_search': 0, 'common_search_logic': '=', 'is_time': 0 },
    { 'id': 'select', 'name': '下拉框', 'need_extra': 1, 'use_search': 1, 'common_search_logic': '=', 'is_time': 1 },
    { 'id': 'multiple', 'name': '下拉多选框', 'need_extra': 1, 'use_search': 1, 'common_search_logic': 'IN', 'is_time': 0 },
    { 'id': 'filterable', 'name': '可搜索单选下拉框', 'need_extra': 1, 'use_search': 1, 'common_search_logic': '=', 'is_time': 0 },
    { 'id': 'filterables', 'name': '可搜索多选下拉框', 'need_extra': 1, 'use_search': 1, 'common_search_logic': 'IN', 'is_time': 0 },
    { 'id': 'dateTime', 'name': '日期时间选择器', 'need_extra': 0, 'use_search': 1, 'common_search_logic': '=', 'is_time': 1 },
    { 'id': 'date', 'name': '日期选择器', 'need_extra': 0, 'use_search': 1, 'common_search_logic': '=', 'is_time': 1 },
    { 'id': 'daterange', 'name': '范围日期选择器', 'need_extra': 0, 'use_search': 1, 'common_search_logic': 'between', 'is_time': 1 },
    { 'id': 'radio', 'name': '单选框', 'need_extra': 1, 'use_search': 0, 'common_search_logic': '=', 'is_time': 0 },
    { 'id': 'checkbox', 'name': '多选框', 'need_extra': 1, 'use_search': 0, 'common_search_logic': 'IN', 'is_time': 0 },
    { 'id': 'number', 'name': '计数器', 'need_extra': 0, 'use_search': 0, 'common_search_logic': '=', 'is_time': 0 }
  ]
}

export default [
  { // 获取数据库
    url: '/custom/Datasmanage/getDataSourceList',
    type: 'post',
    response: config => {
      return getDataSourceListData
    }
  },
  { // 获取字段类型
    url: '/custom/report_manage/getColType',
    type: 'post',
    response: config => {
      return getColType
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
      return getReportListNew
    }
  }
]
