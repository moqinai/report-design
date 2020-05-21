<template>
  <div class="dataOriginManagement">
    <h3 class="pageTitle">数据源管理</h3>
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
              <el-input v-model="searchLinkName" placeholder="链接名" />
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
        <el-button type="primary" :loading="btnLoading" @click="clickAddFun"> 新增 </el-button>
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
        >
          <template v-for="(item, index) in showTableList">
            <el-table-column :key="index" :label="item.title" :prop="item.dataIndex" align="center" />
          </template>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click.native.prevent="editRow(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click.native.prevent="modelManagement(scope.row)"
              >
                模型管理
              </el-button>
              <!-- <router-link :to="'/report/ReportDesign/modelManagement?reportId='+scope.row.report_source_id">
                <el-button
                  type="primary"
                  size="mini"
                  @click.native.prevent="modelManagement(scope.row)"
                >
                  模型管理
                </el-button>
              </router-link> -->
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
        <el-form-item label="连接名" prop="link_name">
          <el-input v-model="ruleForm.link_name" placeholder="请输入连接名" />
        </el-form-item>
        <el-form-item label="数据库名" prop="db_name">
          <el-input v-model="ruleForm.db_name" placeholder="请输入数据库名" />
        </el-form-item>
        <div v-if="editShowFormFlag">
          <el-form-item label="数据库地址" prop="db_host">
            <el-input v-model="ruleForm.db_host" placeholder="请输入数据库地址" />
          </el-form-item>
          <el-form-item label="端口号" prop="db_port">
            <el-input v-model="ruleForm.db_port" placeholder="请输入端口号" />
          </el-form-item>
          <el-form-item label="数据库账号" prop="db_user">
            <el-input v-model="ruleForm.db_user" placeholder="请输入数据库账号" />
          </el-form-item>
          <el-form-item label="密码" prop="db_password">
            <el-input v-model="ruleForm.db_password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="testLink('ruleForm')"> 测试链接 </el-button>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :disabled="!submitLoading" @click="handleEnter('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import pagination from '@/components/Pagination'
import { getDataOriginData, testConnectDatas, subDataSource } from '@/api/api'

export default {
  name: 'DataOriginManagement',
  components: { pagination },
  props: {},
  data() {
    return {
      btnLoading: false,
      dialogVisible: false, // 模态框
      editShowFormFlag: true, // 新增or编辑区分标识
      modelTitle: '新增数据源',
      tableHeight: 'calc(100vh - 380px)',
      searchLinkName: '',
      submitLoading: false, // 新增or编辑提交按钮
      editIndex: 0,
      listQuery: {
        nowpage: 1,
        pageSize: 10
      },
      listLoading: false,
      total: 0,
      listdata: [], // 表格数据
      showTableList: [ // 表头
        { title: '连接名', dataIndex: 'link_name', key: '' },
        { title: '数据库名', dataIndex: 'db_name', key: '' }
      ],
      ruleForm: {
        link_name: '',
        db_name: '',
        db_host: '',
        db_port: '',
        db_user: '',
        db_password: ''
      },
      rules: {
        link_name: [
          { required: true, message: '请输入连接名', trigger: 'blur' }
        ],
        db_name: [
          { required: true, message: '请输入数据库名', trigger: 'blur' }
        ],
        db_host: [
          { required: true, message: '请输入数据库地址', trigger: 'blur' }
        ],
        db_port: [
          { required: true, message: '请输入端口号', trigger: 'blur' }
        ],
        db_user: [
          { required: true, message: '请输入数据库账号', trigger: 'blur' }
        ],
        db_password: [
          { required: true, message: '请输入数据库密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getReportData()
  },
  methods: {
    getReportData() { // 列表数据请求方法
      this.listLoading = true
      getDataOriginData(this.listQuery).then(res => {
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
    handleFilter() {
      this.listQuery = {
        nowpage: 1,
        pageSize: 10,
        linkName: this.searchLinkName // 搜索条件
      }
      this.getReportData() // 请求表格数据方法
    },
    clickAddFun() { // 新增
      this.modelTitle = '新增数据源'
      this.$refs['ruleForm'].resetFields()
      this.btnLoading = true // 点击新增即将其置为disabled
      this.dialogVisible = true
      this.editShowFormFlag = true
      this.ruleForm.type = 'add'
      this.submitLoading = false // 提交按钮置为false
      this.ruleForm = {
        link_name: '',
        db_name: '',
        db_host: '',
        db_port: '',
        db_user: '',
        db_password: ''
      }
    },
    editRow(index, row) { // 编辑
      this.modelTitle = '编辑数据源'
      this.editShowFormFlag = false
      this.dialogVisible = true
      this.editIndex = index // 编辑第几条下标
      this.ruleForm = { ...row }
      this.ruleForm.type = 'update'
      this.submitLoading = true // 提交按钮置为true
    },
    modelManagement(row) { // 点击模型管理
      /* this.$router.push({ // 此方法传参需配置路由 /:reportId
        path: `/report/ReportDesign/modelManagement/${row.report_source_id}`
      }) */

      this.$router.push({
        path: '/report/ReportDesign/modelManagement',
        query: {
          reportId: row.report_source_id
        }
      })
    },
    testLink(formName) { // 测试链接按钮
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          delete this.ruleForm.report_source_id // 删除id
          testConnectDatas(this.ruleForm).then(res => { // 测试链接方法
            if (res.state === 2000) {
              this.submitLoading = true // 启用确认按钮
            } else {
              this.$message.error(res.message)
              this.submitLoading = true // 启用确认按钮
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose() { // 关闭弹框
      this.dialogVisible = false
      this.editShowFormFlag ? this.btnLoading = false : ''
      this.$refs['ruleForm'].resetFields()
      // this.editShowFormFlag = true
    },
    handleEnter(formName) { // 弹框确认按钮
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          subDataSource(this.ruleForm).then((res) => { // 新增or编辑提交方法
            if (res.state === 2000) {
              this.btnLoading = false
              this.dialogVisible = false
              this.getReportData() // 重新请求表格数据
              this.$message.success(res.message)
              this.$refs[formName].resetFields()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.dataOriginManagement {
  background: white;
  padding: 0 20px;
  .marginB20 {
    margin-bottom: 20px;
  }
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
