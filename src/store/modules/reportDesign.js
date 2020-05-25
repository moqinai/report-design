const state = {
  layoutdata: { layoutForm: [], layoutFilter: [], layoutTable: [], checkList: [] }, // 完整layout信息
  reportItem: {}, // 选中的item信息
  deleteFlag: false, // 删除标识
  itemIndex: 0, // 选中的item数据在layout中的位置标示识
  reportType: 'form', // 默认form // 预览及设计区域报表类型（目前分表单型form、填报型excel） // 在选中左侧报表时 或者 添加时改变其值
  reportId: '', // 选中当前报表id
  dataId: '', // 被拖拽的数据集id
  tableId: '', // 因不同tableId不能拖拽，所以存一个tableId，做判断（填报型拖拽规则：dataId相同才能拖，且底下child数据，相同tableId才能拖拽）
  layoutType: '', // 用来区分是form、 tableFilter、table、check; 在右侧属性配置内容渲染 及 变更时使用
  tableCols: [], // 列表型 表头数据
  dataList: [], // 数据集数据
  reportCategory: ''
}

const mutations = {
  DELETEFLAG: (state, log) => { // 是否是删除操作
    state.deleteFlag = log
  },
  EDIT_REPORT_ITEM: (state, log) => { // 获取选中设计区域中某个元素模块
    state.reportItem = log
  },
  EDIT_ITEM_INDEX: (state, ind) => { // 获取选中设计区域中某个元素模块的下标
    state.itemIndex = ind
  },
  REPORTTYPE: (state, ind) => { // 设置报表类型
    state.reportType = ind
  },
  REPORTID: (state, ind) => { // 设置报表id
    state.reportId = ind
  },
  DATAID: (state, ind) => { // 设置数据集id
    state.dataId = ind
  },
  TABLEID: (state, ind) => { // 设置table_id
    state.tableId = ind
  },
  TABLECOLS: (state, data) => { // 设置列表型表头数据 // 来源有1、预览时先执行保存再执行getReportDetailInfoNew接口获取，2、直接查看执行getReportDetailInfoNew接口获取
    state.tableCols = data
  },
  EDIT_ITEM_LAYOUTTYPE: (state, ind) => { // 获取选中那个设计区域
    state.layoutType = ind
  },
  LAYOUT_DATA: (state, data) => { // 获取报表数据
    state.layoutdata = data
    console.log(data)
    console.log('bbbbbbb')
  },
  DATALIST: (state, data) => { // 获取数据集数据
    state.dataList = data
  },
  SETREPORTCATEGORY: (state, data) => {
    state.reportCategory = data
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
