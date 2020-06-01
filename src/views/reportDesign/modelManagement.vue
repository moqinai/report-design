<template>
  <div class="modeManagement">
    <h3 class="pageTitle">模型管理</h3>
    <div class="filter-container">
      <el-form :inline="true" class="manage-class-form">
        <el-row :gutter="10">
          <el-col
            :xs="8"
            :sm="6"
            :md="4"
            :lg="3"
            :xl="3"
          >
            <el-form-item>
              <el-input v-model="modelName" placeholder="模型标识" />
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="3" :md="2" :lg="2" :xl="1">
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                @click="handleFilter()"
              >
                搜索
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="operation-wrap">
      <el-row>
        <el-button type="success" :loading="startBtnLoading" :disabled="!hasSelected" @click="changeState('start')"> 启用 </el-button>
        <el-button type="warning" :loading="stopBtnLoading" :disabled="!hasSelected" @click="changeState('forbiden')"> 禁用 </el-button>
        <el-button type="primary" :loading="btnLoading" @click="clickAddFun"> 生成 </el-button>
      </el-row>
    </div>
    <div class="table-container">
      <template>
        <el-table
          ref="filterTable"
          v-loading="listLoading"
          :header-cell-style="{ background:'#EDF5FF', color:'#333', fontSize: '14px', fontWeight: 'normal' }"
          size="medium"
          :row-style="{'height':'44px'}"
          :cell-style="{'padding':'0px'}"
          :fit="true"
          highlight-current-row
          :data="listdata"
          border
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <template v-for="(item, index) in showTableList">
            <el-table-column v-if="item.dataIndex === 'is_fill'" :key="index" :formatter="formatter" :label="item.title" :prop="item.dataIndex" align="center" />
            <el-table-column v-else :key="index" :label="item.title" :prop="item.dataIndex" align="center" />
          </template>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                :loading="editBtnLoading"
                @click.native.prevent="editRow(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click.native.prevent="fieldManagement(scope.row)"
              >
                字段管理
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <pagination
        :total="total"
        :page.sync="listQuery.nowpage"
        :limit.sync="listQuery.pageSize"
        @pagination="getReportData"
      />
    </div>

    <el-dialog
      :title="modelTitle"
      :visible.sync="dialogVisible"
      width="30%"
      center
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="模型名称" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="是否可填报" prop="is_fill">
          <el-select v-model="ruleForm.is_fill" placeholder="请选择是否可填报" style="width: 100%;">
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据表" prop="table">
          <el-select v-model="ruleForm.table" placeholder="请选择数据表" style="width: 100%;" :disabled="!editShowFormFlag" filterable>
            <el-option v-for="(list, ind) in selectTable" :key="ind" :label="list" :value="list" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleEnter('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import pagination from '@/components/Pagination'
import { getModelList, getTables, generate, doEdit, changeStatus } from '@/api/api'
export default {
  name: 'ModelManagement',
  components: { pagination },
  data() {
    return {
      report_source_id: 0,
      btnLoading: false,
      editBtnLoading: false,
      startBtnLoading: false,
      stopBtnLoading: false,
      modelName: '',
      dialogVisible: false, // 模态框
      editShowFormFlag: true, // 新增or编辑区分标识
      multipleSelection: [], // 选中内容
      modelTitle: '生成模型',
      selectTable: [], // select数据表数据
      listQuery: {
        nowpage: 1,
        pageSize: 10
      },
      listLoading: false,
      total: 0,
      listdata: [], // 表格数据
      showTableList: [ // 表头
        { title: '编号', dataIndex: 'key', key: '' },
        { title: '标识', dataIndex: 'name', key: '' },
        { title: '名称', dataIndex: 'title', key: '' },
        { title: '是否可填报', dataIndex: 'is_fill', key: '' },
        { title: '创建时间', dataIndex: 'create_time', key: '' },
        { title: '状态', dataIndex: 'status', key: '' }
      ],
      ruleForm: {
        title: '',
        table: '',
        is_fill: '0'
      },
      rules: {
        title: [
          { required: true, message: '请输入模型名称', trigger: 'blur' }
        ],
        table: [
          { required: true, message: '请选择数据表', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    hasSelected: function() {
      return this.multipleSelection.length > 0
    }
  },
  created() {
    this.report_source_id = this.$route.query.reportId
    // this.createdViewFun()
    this.getReportData()
    this.getTables()
  },
  methods: {
    createdViewFun() {
      this.tempRoute = Object.assign({}, this.$route)
      const route = Object.assign({}, this.tempRoute, { title: '模型管理' })
      this.$store.dispatch('tagsView/addView', route)
    },
    getTables() { // 获取select框数据表数据
      getTables({ report_source_id: this.report_source_id }).then(res => {
        if (res.state === 2000) {
          this.selectTable = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getReportData() { // 列表数据请求方法
      this.listLoading = true
      this.listQuery.report_source_id = this.report_source_id
      this.listQuery.name = this.modelName
      getModelList(this.listQuery).then(res => {
        if (res.state === 2000) {
          this.listdata = res.data.data
          this.total = res.data.count // 总页数
        } else {
          this.$message.error(res.message)
        }
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      }).catch((err) => {
        console.log(err)
        setTimeout(() => {
          this.listLoading = false
        }, 300)
        this.$notify.error({
          title: '失败',
          message: '列表请求失败',
          duration: 2000
        })
      })
    },
    handleSelectionChange(val) { // 列表复选框选择事件
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleFilter() { // 搜索
      this.listQuery = {
        nowpage: 1,
        pageSize: 10,
        name: this.modelName // 搜索条件
      }
      this.getReportData() // 请求表格数据方法
    },
    clickAddFun() { // 新增
      this.modelTitle = '生成模型'
      this.btnLoading = true // 点击新增即将其置为disabled
      this.dialogVisible = true
      this.editShowFormFlag = true
      this.ruleForm = {
        title: '',
        table: '',
        is_fill: '0',
        report_source_id: this.report_source_id
      }
    },
    editRow(index, row) { // 编辑
      this.modelTitle = '编辑模型'
      this.editShowFormFlag = false
      this.editBtnLoading = true
      this.dialogVisible = true
      this.ruleForm = {
        title: row.title,
        table: row.table,
        model_id: row.id,
        is_fill: row.is_fill.toString()
      }
    },
    fieldManagement(row) { // 点击字段管理
      this.$router.push({
        path: '/report/ReportDesign/fieldManagement',
        query: {
          modelId: row.id
        }
      })
    },
    changeState(type) {
      let typeTitle = ''
      if (type === 'start') {
        typeTitle = '启用'
        this.startBtnLoading = true
      } else {
        typeTitle = '禁用'
        this.stopBtnLoading = true
      }
      let model_id = []
      this.multipleSelection.map((list, index) => {
        model_id.push(list.id)
      })
      model_id = model_id.toString()
      const that = this
      this.$confirm(`确认要${typeTitle}该模型么?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStatus({ type, model_id }).then(res => {
          if (res.state === 2000) {
            this.getReportData() // 修改后重新请求表格
            that.$message.success(res.message)
          } else {
            that.$message.error(res.message)
          }
        })
      }).catch(() => {
        console.log('点击了取消')
      }).finally(() => {
        if (type === 'start') {
          this.startBtnLoading = false
        } else {
          this.stopBtnLoading = false
        }
      })
    },
    handleClose() { // 关闭弹框
      this.dialogVisible = false
      this.editShowFormFlag ? this.btnLoading = false : this.editBtnLoading = false
      this.$refs['ruleForm'].resetFields()
      // this.editShowFormFlag = true
    },
    handleEnter(formName) { // 弹框确认按钮
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.is_fill = +this.ruleForm.is_fill
          if (this.editShowFormFlag) { // 新增
            generate({ ...this.ruleForm }).then(res => {
              if (res.state === 2000) {
                this.btnLoading = false
                this.dialogVisible = false
                this.getReportData() // 重新请求表格数据
                this.$message.success('新增成功')
                this.$refs[formName].resetFields()
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            doEdit({ ...this.ruleForm }).then(res => {
              if (res.state === 2000) {
                this.editBtnLoading = false
                this.dialogVisible = false
                this.getReportData() // 重新请求表格数据
                this.$message.success('编辑成功')
                this.$refs[formName].resetFields()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatter(row, column) {
      const value = { '0': '否', '1': '是' }
      return value[row.is_fill]
    }
  }
}
</script>

<style scoped lang='scss'>
.modeManagement {
  background: white;
  padding: 0 20px;
  h3.pageTitle {
    font-family: 'SourceHanSansCN-Bold';
    font-size: 24px;
    color: #333333;
    padding: 20px 0;
  }
  .operation-wrap {
    margin-bottom: 20px;
  }
  .demo-ruleForm {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
