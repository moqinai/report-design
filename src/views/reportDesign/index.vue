<template>
  <div class="app-container">
    <el-container>
      <el-header class="container-header">
        <span>报表设计器</span>
        <p class="header-icon">
          <span @click="lookView"><i class="el-icon-view" /> 预览</span>
          <span v-loading.fullscreen.lock="fullscreenLoading" @click="saveView"><i class="el-icon-collection" /> 保存</span><!-- v-loading.fullscreen.lock="fullscreenLoading" -->
        </p>
      </el-header>
      <el-container>
        <el-aside class="left-el-aside">
          <div class="aside-container">
            <div class="left-top-content">
              <mineReport
                :mine-report-data="mineReportData"
                @getReportListNew="getReportListNew"
                @getDataListByReportId="getDataListByReportId"
              />
            </div>
            <div class="left-bottom-aside">
              <reportDataSet
                :data-list="dataList"
                @addDataSet="addDataSet"
                @editDataSet="editDataSet"
                @delDataSet="delDataSet"
              /><!-- @dragDrop="dragDropResponse" -->
            </div>
            <div class="" />
          </div>
        </el-aside>
        <el-main>
          <contentReport
            :add-design="addDesign"
            :report-type="reportType"
          />
        </el-main>
        <el-aside class="right-el-aside">
          <reportAttrConfig :report-type="reportType" :primary-key="primaryKey" />
        </el-aside>
      </el-container>

      <dataSetDialog
        v-if="dataSetDialogShow"
        :data-source-list="dataSourceList"
        class="data-set-dialog"
        :type="dataSetType"
        :dataset-info="datasetInfo"
        @closeDialog="closeDataSetDialog"
      />
    </el-container>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="100%"
      fullscreen
      center
      custom-class="lookView"
      :before-close="handleClose"
    >
      <lookViewDialog :layoutdata="layoutdata" :tablecols="tableCols" :form="form" :report-type="reportType" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>

  </div>
<!--
  </div>
      -->
</template>

<script type='text/ecmascript-6'>
// import { getReportListNew, getDataListByReportId, getDataSourceList, delDataSet } from '@/api/customreport.js' // getDataListByReportId
import { getReportListNew, getDataListByReportId, getDataSourceList, delDataSet, saveReportCols, saveReport, getReportDetailInfoNew } from '@/api/api'
import mineReport from './components/mineReport'
import contentReport from './components/contentReport'
import reportDataSet from './components/reportDataSet'
import reportAttrConfig from './components/reportAttrConfig'
import lookViewDialog from './components/lookViewDialog'
import { mapState } from 'vuex'

import dataSetDialog from './components/dataSetDialog'
export default {
  name: 'ReportDesign',
  components: {
    mineReport,
    contentReport,
    reportDataSet,
    reportAttrConfig,
    lookViewDialog,
    dataSetDialog
  },
  data() {
    return {
      dataSetDialogShow: false,
      mineReportData: [],
      dataList: [],
      addDesign: 0, // 左侧拖拽到设计区域后
      editItemReport: {}, // 赋值传入单条数据至右侧
      dialogVisible: false, // 预览模态框
      // reportType: 'form', // 默认form // 预览及设计区域报表类型（目前分表单型form、填报型excel） // 在选中左侧报表时 或者 添加时改变其值
      form: {}, // 预览表单v-model字段
      dataSourceList: [], // 弹窗数据库
      dataSetType: 'add',
      datasetInfo: {},
      activeDataReport: {},
      fullscreenLoading: false, // 保存加载动画
      tableCols: [], // 表头数据
      primaryKey: [] // 主键数据
    }
  },
  computed: {
    ...mapState({ // 获取layout数据
      layoutdata: state => state.reportDesign.layoutdata,
      reportType: state => state.reportDesign.reportType, // 默认form // 预览及设计区域报表类型（目前分表单型form、填报型excel） // 在选中左侧报表时 或者 添加时改变其值
      reportId: state => state.reportDesign.reportId, // 报表id
      dataId: state => state.reportDesign.dataId, // 数据集id
      reportDataList: state => state.reportDesign.dataList // 数据集
      // tableCols: state => state.reportDesign.tableCols
    })
  },
  watch: {
    reportDataList: {
      handler(n, o) {
        console.log('进dataList监控' + this.dataId)
        // if (this.dataId) { // 前提是dataId存在的情况下
        if (JSON.stringify(n) !== JSON.stringify(o)) {
          n.map((list, index) => {
            if (list.data_info.data_id === this.dataId) {
              this.primaryKey = list.child // 当前主键
            }
          })
        }
        // }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getReportListNew()
    this.getDataSourceList()
  },
  mounted() {
    console.log(this.layoutdata)
    // this.$store.commit('reportDesign/LAYOUT_DATA', this.layout) // 查看请求数据后传入到store
  },
  methods: {
    closeDataSetDialog() {
      this.dataSetDialogShow = false
      this.getDataListByReportId(this.activeDataReport)
    },
    getReportListNew() {
      getReportListNew({ pageSize: 1000 }).then(res => {
        console.log(res)
        this.mineReportData = res.data.data
      })
    },
    getDataListByReportId(data) { // 接收点击 我的报表 传递过来参数
      this.activeDataReport = data
      const reportId = this.$store.state.reportDesign.reportId
      getDataListByReportId({ reportId: reportId }).then(res => { // 获取数据集接口
        if (res.state === 2000) {
          this.dataList = res.data
        } else {
          this.dataList = []
          this.$message.error('数据集获取失败')
        }
        this.$store.commit('reportDesign/DATALIST', this.dataList) // 存储数据集
      })
    },
    dragDropResponse() {
      this.addDesign += 1 // 为了每次传递进去都触发子组件的watch
      console.log('放置鼠标，父组件接受到')
    },
    lookView() { // 预览
      // 处理预览时的表单的v-model的相关内容
      let formData = ''
      if (this.reportType === 'form') { // 填报型
        formData = JSON.parse(JSON.stringify(this.layoutdata.layoutForm))
      } else if (this.reportType === 'excel') { // 列表型
        this.saveView('', true) // 执行预览前先执行保存
        formData = JSON.parse(JSON.stringify(this.layoutdata.layoutFilter))
      }
      let colId = ''
      formData.map((list, index) => {
        if (this.reportType === 'form') {
          colId = list.dataColFieldId
        } else if (this.reportType === 'excel') {
          colId = list.report_sf_id
        }
        /*
          if (list.col_type === 'select' || list.col_type === 'filterable') {
            if (list.extra.length) { // 如果有下拉选项值，则用下拉选项值替换options
              list.options = list.extra // 赋给options
              // list.extra = [] // 将extra置空
            }
          }
        */
        // 根据不同的表单类型 赋值不同的model数据类型 以dataColFieldId作为表单标识，因为不同
        if (list.col_type === 'select' || list.col_type === 'multiple' || list.col_type === 'filterable' || list.col_type === 'filterables') {
          if (list.extra.length) { // 如果有下拉选项值，则用下拉选项值替换options
            list.options = list.extra
            // list.options.unshift({ id: '', name: list.placeholder })
          }
        }
        if (list.col_type === 'select' || list.col_type === 'filterable' || list.col_type === 'multiple' || list.col_type === 'filterables') { // || list.col_type === 'multiple' || list.col_type === 'filterables'
          this.form[colId] = list.default_value || ''
        } else if (list.col_type === 'radio') {
          this.form[colId] = list.extraValue
        } else if (list.col_type === 'checkbox') {
          this.form[colId] = list.checkboxExtraValue
        } else if (list.col_type === 'number') {
          this.form[colId] = list.numberValue
        } else {
          if (list.default_value) { // 判断是否有默认值，
            this.form[colId] = list.default_value
          } else {
            this.form[colId] = ''
          }
        }
      })
      if (this.reportType === 'form') { // 填报型直接显示预览框
        this.dialogVisible = true // 显示弹框
      }
    },
    handleClose() { // 关闭预览框
      this.dialogVisible = false
    },
    saveView(e, viewFlag) { // 保存
      if (this.reportId === '') {
        this.$message.error('请先选择报表')
        return false
      }
      if (!this.layoutdata.formTitle) {
        this.$message.warning('请先输入报表名称')
        return false
      }
      this.fullscreenLoading = true
      console.log(this.layoutdata)
      const data = {}
      const data1 = {}
      if (this.reportType === 'form') {
        data.mainInfo = {
          dataId: this.dataId, // 数据集id 242
          reportId: this.reportId, // 报表id
          formTitle: this.layoutdata.formTitle
        }
        data.pageLayout = this.layoutdata.layoutForm
        data.pageLayout.map((list, ind) => { // 选中状态置为false
          list.addClass = false
          // 根据不同的表单类型 赋值不同的model数据类型 以dataColFieldId作为表单标识，因为不同
          if (list.col_type === 'select' || list.col_type === 'multiple' || list.col_type === 'filterable' || list.col_type === 'filterables') {
            if (list.extra.length) { // 如果有下拉选项值，则用下拉选项值替换options
              list.options = list.extra // 赋给options
              // list.extra = [] // 将extra置空
            }
          }
        })
        this.saveReportColsFun(data)
      } else if (this.reportType === 'excel') {
        data1.dataId = this.dataId // 数据集id 242
        data1.reportId = this.reportId // 报表id
        data1.formTitle = this.layoutdata.formTitle
        data1.requeryView = this.layoutdata.requeryView
        data1.checkList = this.layoutdata.checkList // 操作按钮
        data1.layoutFilter = this.layoutdata.layoutFilter // 筛选项
        data1.layoutTable = this.layoutdata.layoutTable // 数据表格
        data1.layoutFilter.map((list, ind) => { // 选中状态置为false
          list.addClass = false
          // 根据不同的表单类型 赋值不同的model数据类型 以dataColFieldId作为表单标识，因为不同"formConfig.col_type === 'radio' || formConfig.col_type === 'select' || formConfig.col_type === 'filterable'"

          if (list.col_type === 'select' || list.col_type === 'multiple' || list.col_type === 'filterable' || list.col_type === 'filterables') {
            if (list.extra.length) { // 如果有下拉选项值，则用下拉选项值替换options
              list.options = list.extra // 赋给options
              // list.extra = [] // 将extra置空
            }
            // list.options.unshift({ id: '', name: '请选择' + list.placeholder })
          }
        })
        console.log(data1)
        let isResetPk = 0
        this.layoutdata.checkList.map((item, index) => {
          if (item.label === 'edit' || item.label === 'delete') {
            if (!item.checked) {
              isResetPk++
            }
            /* if (item.checked) {
              if (!this.layoutdata.pk) {
                this.$notify.error({
                  title: '失败',
                  message: '请选择全局属性填写主键选项',
                  duration: 3000
                })
                validFlag = true
                return false
              }
            } else {
              console.log(1)
              isResetPk++
            } */
          }
        })
        console.log(isResetPk)
        if (isResetPk === 2) { // 当它为2时表示删除和编辑都没勾选
          data1.pk = '' // 则清空
        } else { // 否则表示选了
          if (!this.layoutdata.pk) { // 则判断是否填了全局主键
            this.fullscreenLoading = false // 同时将请求动画关闭
            this.$notify.error({ // 没填警告
              title: '失败',
              message: '请选择全局属性填写主键选项',
              duration: 3000
            })
            return false
          } else { // 填了赋值
            data1.pk = this.layoutdata.pk
          }
        }
        this.saveReportFun(data1, viewFlag)
      }
    },
    saveReportColsFun(data) { // 填报型保存
      saveReportCols(data).then(res => {
        if (res.state === 2000) {
          this.$message.success('保存成功')
          setTimeout(() => { // 刷新页面
            this.$router.go(0)
          }, 1500)
        } else {
          this.$message.error(res.message)
        }
        this.fullscreenLoading = false
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '失败',
          message: '保存报表失败',
          duration: 2000
        })
      })
    },
    saveReportFun(data, lookViewBeforeFlag) { // 列表型保存
      /* console.log(document.querySelector('#filterForm'))
      document.querySelector('#filterForm').validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      }) */
      saveReport(data).then(res => {
        if (res.state === 2000) {
          if (lookViewBeforeFlag) {
            getReportDetailInfoNew({ reportId: this.reportId }).then(res => { // 获取表头数据
              if (res.state === 2000) {
                this.tableCols = res.data.tableCols
              } else {
                this.$message.error(res.message)
              }
              this.dialogVisible = true // 显示弹框
            })
          } else {
            this.$message.success('保存成功')
            setTimeout(() => { // 刷新页面
              this.$router.go(0)
            }, 1500)
          }
        } else {
          this.$message.error(res.message)
        }
        this.fullscreenLoading = false
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '失败',
          message: '保存报表失败',
          duration: 2000
        })
      })
    },
    getDataSourceList() {
      getDataSourceList().then(res => {
        console.log(res)
        if (res.state === 2000) {
          this.dataSourceList = res.data.data
        }
      })
    },
    addDataSet(obj) {
      if (this.activeDataReport && this.activeDataReport.type !== 1) {
        this.dataSetType = 'add'
        this.datasetInfo = obj instanceof Object ? obj : {}
        this.dataSetDialogShow = true
        return
      }
      this.$message.warning('请选中一个报表')
      return
    },
    editDataSet(obj) {
      this.dataSetType = 'edit'
      this.dataSetDialogShow = true
      console.log(obj)
      this.datasetInfo = obj instanceof Object ? obj : {}
    },
    delDataSet(obj) {
      const index = this.dataList.indexOf(obj)

      const dataId = obj.data_info.data_id
      delDataSet({ dataId }).then(res => {
        console.log(res)
        if (res.state === 2000) {
          this.dataList.splice(index, 1)
          this.$message({
            type: 'sucess',
            message: '删除成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除成功'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.app-container .el-dialog__wrapper >>> .el-dialog .el-dialog__header {
  background: #f5f4f46e;
}
</style>
<style scoped lang='scss'>
@import '@/styles/mixin.scss';
.el-container{
  position:relative;
}
.el-aside {
  background:#f8f8f8;
  padding:0;
  line-height:1;
}
.left-el-aside {
  padding-right:15px;
  padding-left:5px;
}
.right-el-aside {
  padding-left: 15px;
  padding-right: 5px;
}
.app-container {
  background:#f8f8f8;
  .el-main {
    padding: 0;
    background: #FFF;
      @include scrollBar;
  }
  aside {
    margin-bottom: 0;
  }
  .container-header {
    height: 54px!important;
    background: #FFF;
    line-height: 54px;
    margin: 0 5px;
    margin-bottom: 6px;
    box-shadow: 0px 0px 5px 0px #ccc;
    .header-icon {
      float: right;
      font-family: 'PingFangSC-Medium';
      font-size: 14px;
      color: #333333;
      font-weight: bolder;
      span:nth-child(1) {
        margin-right: 20px;
      }
      span {
        cursor: pointer;
      }
    }
  }

}

.design {
  background:#F8F8F8;
  min-width: 1200px;
  height: 100vh;
  .design-header {
    height: 60px;
    background: #FFF;
  }
  .design-container {
    margin: 10px;
    height: calc(100vh - 80px); // 100vh - header60 - 20margin
    display: flex;
    .container-left {
      flex: 0 0 200px;
      border: 1px solid red;
      .left-top {
        height: 200px;
        background: #FFF;
        // border: 1px solid yellow;
      }
      .left-bottom {
        margin-top: 10px;
        height: calc(100vh - 290px);
        background: #FFF;
        // border: 1px solid black;
      }
    }
    .container-content {
      flex: 1;
      margin: 0 10px;
      background: #FFF;
      border: 1px solid blue;
    }
    .container-right {
      flex: 0 0 200px;
      background: #FFF;
      border: 1px solid black;
    }
  }

}

.data-set-dialog{
  position:fixed;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  z-index:11;
  background:#fff;

}
</style>
