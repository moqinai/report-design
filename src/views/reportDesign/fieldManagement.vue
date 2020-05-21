<template>
  <div class="fieldManagement">
    <h3 class="pageTitle">字段管理</h3>
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
              <el-input v-model="fieldName" placeholder="字段名称" />
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
                :loading="editBtnLoading"
                @click.native.prevent="editRow(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="mini"
                :loading="delBtnLoading"
                @click.native.prevent="delField(scope.row)"
              >
                删除
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
        <el-form-item label="字段名" prop="field_name">
          <el-input v-model="ruleForm.field_name" placeholder="请输入字段名" />
        </el-form-item>
        <el-form-item label="字段标题" prop="field_title">
          <el-input v-model="ruleForm.field_title" placeholder="请输入字段标题" />
        </el-form-item>
        <el-form-item label="字段类型" prop="field_type">
          <el-select v-model="ruleForm.field_type" placeholder="请选择字段类型" style="width: 100%;">
            <el-option v-for="(list, ind) in filedTypeData" :key="ind" :label="list.field_type" :value="list.filed_type_value" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数">
          <el-input v-model="ruleForm.extra" placeholder="请输入参数" type="textarea" />
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
import { getFiledsList, addOrEditField, getFieldType, delField } from '@/api/api'

export default {
  name: 'DataOriginManagement',
  components: { pagination },
  props: {},
  data() {
    return {
      btnLoading: false,
      editBtnLoading: false,
      delBtnLoading: false,
      dialogVisible: false, // 模态框
      editShowFormFlag: true, // 新增or编辑区分标识
      modelTitle: '新增字段',
      tableHeight: 'calc(100vh - 380px)',
      fieldName: '',
      filedTypeData: [],
      model_id: '',
      listQuery: {
        nowpage: 1,
        pageSize: 10
      },
      listLoading: false,
      total: 0,
      listdata: [], // 表格数据
      showTableList: [ // 表头
        { title: '编号', dataIndex: 'id', key: '' }, // fixed: 'left' 设置是否固定
        { title: '字段', dataIndex: 'field_title', key: '' },
        { title: '名称', dataIndex: 'field_name', key: '' },
        { title: '数据类型', dataIndex: 'field_type', key: '' }
      ],
      ruleForm: {
        field_name: '',
        field_title: '',
        field_type: '',
        extra: '',
        model_id: ''
      },
      rules: {
        field_name: [
          { required: true, message: '请输入字段名', trigger: 'blur' }
        ],
        field_title: [
          { required: true, message: '请输入字段标题', trigger: 'blur' }
        ],
        field_type: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.model_id = this.$route.query.modelId
    this.ruleForm.model_id = this.model_id
    this.createdViewFun()
    this.getReportData()
    this.getFieldType()
  },
  methods: {
    createdViewFun() {
      this.tempRoute = Object.assign({}, this.$route)
      const route = Object.assign({}, this.tempRoute, { title: '字段管理' })
      this.$store.dispatch('tagsView/addView', route)
    },
    getReportData() { // 列表数据请求方法
      this.listLoading = true
      this.listQuery.model_id = this.model_id
      this.listQuery.filed_name = this.fieldName
      getFiledsList(this.listQuery).then(res => {
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
    getFieldType() {
      getFieldType().then(res => {
        if (res.state === 2000) {
          this.filedTypeData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleFilter() {
      this.listQuery = {
        nowpage: 1,
        pageSize: 10,
        fieldName: this.fieldName // 搜索条件
      }
      this.getReportData() // 请求表格数据方法
    },
    clickAddFun() { // 新增
      this.modelTitle = '新增字段'
      this.btnLoading = true // 点击新增即将其置为disabled
      this.dialogVisible = true
      this.editShowFormFlag = true
      this.ruleForm = {
        field_name: '',
        field_title: '',
        field_type: '',
        extra: '',
        model_id: this.model_id
      }
    },
    editRow(index, row) { // 编辑
      this.modelTitle = '编辑字段'
      this.editShowFormFlag = false
      this.dialogVisible = true
      this.ruleForm = { ...row }
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
          addOrEditField(this.ruleForm).then((res) => { // 新增or编辑提交方法
            if (res.state === 2000) {
              this.editShowFormFlag ? this.btnLoading = false : this.editBtnLoading = false
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
    },
    delField(row) { // 删除
      this.delBtnLoading = true
      const that = this
      this.$confirm(`确定要删除该字段么?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delField({ field_id: row.id }).then(res => {
          if (res.state === 2000) {
            that.getReportData() // 修改后重新请求表格
            that.$message.success(res.message)
          } else {
            that.$message.error(res.message)
          }
        })
      }).catch(() => {
        console.log('点击了取消')
      }).finally(() => {
        this.delBtnLoading = false
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.fieldManagement {
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
