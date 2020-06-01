<template>
  <div class="mine-report-container">
    <el-row type="flex" justify="space-between" class="mine-report-header">
      <el-col>
        <h4>我的报表</h4>
      </el-col>
      <el-col>
        <div class="header-icon tr">
          <img src="./../img/icon_edit.png" @click="editReport">
          <img src="./../img/icon_add.png" @click="addReport">
          <img src="./../img/icon_folder.png" @click="addFolder">
          <img src="./../img/icon_trash.png" @click="delReport">
          <i class="el-icon-s-help" @click="urlAlert" />
        </div>
      </el-col>
    </el-row>
    <el-row class="m-r-main">
      <div class="report-tree-wrap">
        <el-tree
          ref="tree"
          node-key="id"
          :data="mineReportData"
          :props="defaultProps"
          :default-expanded-keys="defaultExpandKeys"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          get-checked-nodes="getCh"
          :highlight-current="true"
          @node-click="getDataListFun"
        >
          <span
            slot-scope="{node,data}"
            class="custom-tree-node"
            :class="{'tree-node-active': data=== treeNodeActive}"
          >
            <span>
              <img
                :src="data.type===1
                  ?require('./../img/icon_folder_s.png'):
                    require('./../img/icon_listA.png')"
                alt=""
              >
              {{ data.report_name }}
            </span>
          </span>
        </el-tree>
      </div>
    </el-row>
    <el-dialog title="填写报表信息" :visible.sync="dialogFormVisible" class="report-dialog">
      <el-form :model="reportForm">
        <el-form-item label="报表名称" :label-width="formLabelWidth">
          <el-input v-model="reportForm.reportname" autocomplete="off" />
        </el-form-item>
        <el-form-item v-show="false" label="" :label-width="formLabelWidth">
          <el-input v-model="reportForm.reportname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="报表类型" :label-width="formLabelWidth">
          <el-select v-model="reportForm.reporttype">
            <el-option label="列表管理型" :value="1" />
            <el-option label="填报表单型" :value="2" />
            <el-option label="综合性报表" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="填写文件夹" :visible.sync="dialogFolderVisible" class="report-dialog">
      <el-form :model="reportFolderForm">
        <el-form-item label="文件夹名称" :label-width="formLabelWidth">
          <el-input v-model="reportFolderForm.folderName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFolderVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFolderConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="报表链接"
      :visible.sync="dialogUrlVisible"
      :close-on-click-modal="false"
    >
      <span>{{ reportUrl }}</span>
    </el-dialog>
  </div>
</template>
<script>
// const maxid = 1000
import { addReportDirectory, saveReportMainInfo, delReport } from '@/api/customreport.js'
import { mapState } from 'vuex'
export default {
  props: {
    mineReportData: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      dialogUrlVisible: false,
      reportUrl: '',

      treeNodeActive: '',
      defaultProps: {
        // label: 'type',
        children: 'child'
        // label: (data, node) => {
        // //   // console.log(node)
        // //   // console.log(data)
        //   return data.report_name
        // }
        // children: 'child'
      },
      activeTreeNode: {},
      defaultExpandKeys: [], // 默认展开的节点

      dialogFormVisible: false,
      reportForm: {
        reportname: '',
        reporttype: ''
      },
      reportFolderForm: { folderName: '' },
      dialogFolderVisible: false,

      formLabelWidth: '120px',
      editReportInfo: false
    }
  },
  computed: {
    ...mapState({ // 获取layout数据
      layoutdata: state => state.reportDesign.layoutdata,
      reportType: state => state.reportDesign.reportType, // 默认form // 预览及设计区域报表类型（目前分表单型form、填报型excel） // 在选中左侧报表时 或者 添加时改变其值
      reportId: state => state.reportDesign.reportId, // 报表id
      dataId: state => state.reportDesign.dataId // 数据集id
    })
  },
  watch: {
    mineReportData(newval) {
      // console.log(newval)
    }
  },

  methods: {
    urlAlert() {
      //  dialogUrlVisible: false,
      // reportUrl: '111111111111111',
      const nodeData = this.activeTreeNode
      if (!nodeData.report_id) {
        this.$message.error('请先选择一个报表')
        return
      }
      if (nodeData.type === 1) {
        this.$message.error('请先选择一个报表')
        return
      }
      console.log(nodeData)
      // 2-填报；1-列表；3-综合（本期未做）
      // reportType 1 填报型
      if (nodeData.reportType === 2) {
        this.reportUrl = 'report/ReportDetail/fillReport?reportId=' + nodeData.report_id
      }
      // reportType 2 列表型
      // is_fullScreen  1 全屏
      //
      if (nodeData.reportType === 1) {
        if (nodeData.is_full_screen === 1) {
          this.reportUrl = 'report/ReportDetail/fullScreenReport/reportId/' + nodeData.report_id
        } else {
          this.reportUrl = 'report/ReportDetail/listReport/reportId/' + nodeData.report_id
        }
      }

      this.dialogUrlVisible = true
    },

    editReport() {
      // 编辑报表
      const reportInfo = this.activeTreeNode
      this.editReportInfo = true
      if (!reportInfo.report_id) {
        this.$message.warning('请选择一个文件')
        return
      }
      if (reportInfo.type === 1) {
        // 选中的文件夹
        this.dialogFolderVisible = true
        this.reportFolderForm.folderName = reportInfo.report_name
      } else {
        this.reportForm = {
          reportname: this.activeTreeNode.report_name,
          reporttype: this.activeTreeNode.reportType
        }
        this.dialogFormVisible = true
      }
    },
    handleNodeClick(data) {
      // console.log(data)
    },
    renderContent(h, { node, date, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      )
    },
    getDataListFun(data, node) { // 点击我的报表，获取传递的数据
      this.treeNodeActive = data
      this.activeTreeNode = data
      // data.reportType = 1 // 当前写死填报型。 2-填报；1-列表；3-综合（本期未做）
      //
      if (data.type === 1) { return } // type为1时是选中的文件夹
      const reportId = data.report_id
      let reportType = ''
      if (data.reportType === 2) { // 通过后台返的字段，判断选中的报表类型
        reportType = 'form'
      } else if (data.reportType === 1) {
        reportType = 'excel'
      } else if (data.reportType === 3) { // 综合
        reportType = 'together'
      }
      this.$store.commit('reportDesign/REPORTTYPE', reportType) // 存储报表类型
      this.$store.commit('reportDesign/REPORTID', reportId) // 存储我的报表id
      this.$emit('getDataListByReportId', data)
    },
    addFolder() {
      this.editReportInfo = false
      this.dialogFolderVisible = true
    },
    // 删除报表
    delReport() {
      const nodeData = this.activeTreeNode
      if (!nodeData.report_id) {
        this.$message.error('请先选择一个报表')
        return
      }
      delReport({
        reportId: nodeData.report_id
      }).then(res => {
        if (res.state === 2000) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
        this.$emit('getReportListNew')
      })
    },
    dialogFolderConfirm() {
      // console.log(this.activeTreeNode)
      const reportName = this.reportFolderForm.folderName
      let parentId = ''
      let reportId = ''
      if (!reportName) {
        this.$message.error('请输入目录名称')
        return
      }
      if (this.editReportInfo) {
        parentId = this.activeTreeNode.parent_id || 0
        reportId = this.activeTreeNode.report_id || ''
      } else {
        if (!this.activeTreeNode.report_id) {
        // 没有选任何文件夹
        }
        if (this.activeTreeNode.type === 2) {
          parentId = this.activeTreeNode.parent_id
        // 没有选任何文件夹
        }
        if (this.activeTreeNode.type === 1) {
          parentId = this.activeTreeNode.report_id || 0
        }
        addReportDirectory({
          reportName, parentId, reportId,
          type: this.editReportInfo ? 'edit' : 'add'
        }).then(res => {
          if (res.state === 2000) {
            this.dialogFolderVisible = false
            this.editReportInfo = false
            this.$message.success(res.message)
            this.$emit('getReportListNew')
          } else {
            this.$message.error(res.message)
          }
        })
      }
      // 点击了文件夹

      // if(this.activeTreeNode)
    },
    addReport() {
      const nodeData = this.activeTreeNode
      // console.log(nodeData.type)
      // if (!nodeData.type) {
      //   this.dialogFormVisible = true
      //   this.reportForm = {
      //     reportname: '',
      //     reporttype: ''
      //   }
      // }
      if (nodeData.type === 1) {
        this.dialogFormVisible = true
        this.reportForm = {
          reportname: '',
          reporttype: ''
        }
      } else if (nodeData.type === 2) {
        this.dialogFormVisible = true
        this.reportForm = {
          // reportname: this.activeTreeNode.report_name,
          // reporttype: this.activeTreeNode.reportType
          reportname: '',
          reporttype: ''
        }
      } else {
        this.$message.error('请先选择一个文件夹吧')
      }
    },
    dialogFormConfirm() {
      console.log(this.activeTreeNode)
      let foldtype
      if (this.activeTreeNode.type === 1) {
        foldtype = 1
      } else {
        foldtype = 2
      }
      const type = this.editReportInfo ? 'edit' : 'add'
      const reportId = this.editReportInfo ? this.activeTreeNode.report_id : ''
      saveReportMainInfo(
        {
          reportId,
          type,
          reportName: this.reportForm.reportname,
          parentId: foldtype === 1 ? this.activeTreeNode.report_id : this.activeTreeNode.parent_id,
          reportCategory: this.reportForm.reporttype
        }
      ).then(res => {
        if (res.state === 2000) {
          this.dialogFormVisible = false
          this.editReportInfo = false
          this.$message.success(res.message)
          this.$emit('getReportListNew')
        } else {
          this.$message.error(res.message)
        }
      })

      // const newChild = { id: maxid++, label: this.reportForm.reportname, type: 'report' }
      // const data = this.activeTreeNode

      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
      // this.defaultExpandKeys = [data.id]

      // this.$refs.tree.setCheckedNodes(
      //   [newChild]
      // )
      // this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss">
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background: #35B9F9;
    .custom-tree-node{
      color:#fff;
      .tree-node-parent{

          background-image:url('./../img/icon_dsl02.png');
          // background-size:100% 100%;

        }
    }

  }

</style>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
  .mine-report-container{
    @include scrollBar;
    background:#fff;
    padding:0px 36px;
    padding-bottom:40px;
    box-shadow:0px 0px  5px 0px #ccc;
    height: 450px;
    min-height: 200px;
    overflow: auto;
  }

  .report-tree-wrap{
    width:100%;
    overflow:auto;
    @include scrollBar;
  }
  .mine-report-header{
    margin-bottom:5px;
    padding-top:35px;
    padding-bottom:24px;
    border-bottom:1px solid #F0F0F0;
    h4{
      font-size:16px;
      font-weight:600;
      height:24px;
      line-height:24px;
    }
    .header-icon{
      height:24px ;
      line-height:24px;
      display: flex;
      align-items: center;
      justify-content:flex-end;
      img{
        margin-left:5px;
        margin-right:5px;
        width:16px;
        height:16px;
        cursor:pointer;
        &:last-child{
          margin-right:0;
        }
      }
      i{
        font-size: 20px;
        cursor:pointer;
        color: #409EFF;
      }
    }

  }

  .mine{}
  .m-r-main{
    overflow:auto;
    background:#fff;
    // height:300px;
  }
  .report-dialog{
    // width:560px;
    .el-input{
      width:100%
    }
    .el-select{
      width:100%;
    }
  }
  .custom-tree-node{

    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #666666;
  }

  .el-tree /deep/ {
    .el-tree-node__content{
      &:hover{
        background: #35B9F9;
        .custom-tree-node{
          color:#fff;
        }
      }

    }
    .el-tree-node:focus>.el-tree-node__content{
      background: #35B9F9;
      .custom-tree-node{
        color:#fff;
      }

    }
    .tree-node-active{
      color:#fff;
      background: #35B9F9;
    }
  }
</style>
