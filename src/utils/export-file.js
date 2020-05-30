/**
 *
 * @param {Object} params
 * @param {Array} showData
 * @param {String} url
 */

export function commonExportTable(params, showData, url) { // 数据表导出
  showData.map((item) => {
    params.exportColumns.push({ 'id': item.field, 'title': item.name }) // 取其code值
    // if( item.value instanceof Array) {
    //   let temp = item.value.map(item=>{return "'"+item+"'"})
    //   params.searchParam[item.field] = temp.toString()
    // } else {
    params.searchParam[item.field] = item.value
    // }
  })
  params.searchParam = JSON.stringify(params.searchParam)
  params.exportColumns = JSON.stringify(params.exportColumns)
  // console.log(params)
  // 'http://t.report.pxjy.com/report/importData/importData';
  const form = document.createElement('form')
  form.id = 'downloadform'
  form.style.display = 'none' // 将表单隐藏
  form.target = ''
  form.method = 'post'
  form.action = url
  for (var key in params) {
    var input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = params[key]
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export function reportDesignExportTable(reportId, searchParam, url) { // 报表设计器导出方法
  const params = {
    reportId,
    searchParam: JSON.stringify(searchParam)
  }
  const form = document.createElement('form')
  form.id = 'downloadform'
  form.style.display = 'none' // 将表单隐藏
  form.target = ''
  form.method = 'post'
  form.action = url // 'http://test.bi.pxjy.com/custom/Report/exportReport' // url
  for (var key in params) {
    var input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = params[key]
    form.appendChild(input)
  }
  document.body.appendChild(form)
  console.log(form)
  form.submit()
  document.body.removeChild(form)
}
