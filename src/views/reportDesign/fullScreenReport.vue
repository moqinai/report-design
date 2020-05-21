<template>
  <div class="lpc-lookDialog">
    <div class="look-header">
      <h2>{{ layoutdata.formTitle }}</h2>
    </div>
    <template>
      <div class="filter-container">
        <template v-if="JSON.stringify(lookForm) !== '{}'">
          <el-form ref="form" class="manage-class-form" :model="lookForm">
            <el-row :gutter="10">
              <el-col
                v-for="(item, index) in layoutdata.layoutFilter"
                :key="index"
                :xs="8"
                :sm="6"
                :md="4"
                :lg="3"
                :xl="3"
              >
                <template v-if="item.col_type === 'input'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-input v-model="lookForm[item.report_sf_id]" :placeholder="item.placeholder" />
                  </el-form-item>
                </template>
                <!-- <template v-if="item.col_type === 'textarea'">
                  <el-input type="textarea" :placeholder="item.placeholder" :maxlength="item.max_len" :style="'width:' + item.width" />
                </template> -->
                <template v-if="item.col_type === 'select'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'multiple'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" multiple :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'filterable'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" filterable :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'filterables'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" multiple filterable remote :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'dateTime'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-date-picker
                      v-model="lookForm[item.report_sf_id]"
                      type="datetime"
                      :placeholder="item.placeholder"
                      default-time="12:00:00"
                      style="width:100%"
                    />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'date'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-date-picker
                      v-model="lookForm[item.report_sf_id]"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :placeholder="item.placeholder"
                      style="width:100%"
                    />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'daterange'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-date-picker
                      v-model="lookForm[item.report_sf_id]"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      :start-placeholder="item.placeholder + '开始日期'"
                      :end-placeholder="item.placeholder + '结束日期'"
                      style="width:100%"
                    />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'time'">
                  <el-form-item :prop="item.report_sf_id.toString()" :rules="rules[item.report_sf_id]">
                    <el-time-select
                      v-model="lookForm[item.report_sf_id]"
                      :placeholder="item.placeholder"
                      style="width:100%"
                    />
                  </el-form-item>
                </template>
                <!-- <template v-if="item.col_type === 'radio'">
                  <el-radio-group v-model="lookForm[item.report_sf_id]">
                    <el-radio v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-radio>
                  </el-radio-group>
                </template>
                <template v-if="item.col_type === 'checkbox'">
                  <el-checkbox-group v-model="lookForm[item.report_sf_id]">
                    <el-checkbox v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-checkbox>
                  </el-checkbox-group>
                </template>
                <template v-if="item.type === 'number'">
                  <el-input-number v-model="lookForm[item.report_sf_id]" controls-position="right" :step="item.step" :min="item.min" :max="item.max" :style="'width:' + item.width" />
                </template> -->
              </el-col>
              <el-col :sm="2" :md="2" :lg="2" :xl="2">
                <el-form-item>
                  <el-button type="primary" @click="handleFilter">
                    搜索
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </div>
      <div class="operation-wrap">
        <el-row>
          <template v-for="(item, index) in checkListBtn">
            <template v-if="item.label === 'export'">
              <el-button :key="index" :loading="exportLoadingStatus" plain type="primary" @click="exportTable">
                {{ item.name }}
              </el-button>
              <span v-if="exportLoadingStatus" :key="item.name" class="export-tips">短时间内不可重复操作,请您耐心等待。</span>
            </template>
            <template v-else>
              <el-button :key="index" plain :type="item.label === 'add' ? 'primary' : item.label === 'edit' ? 'success' : 'primary'">
                {{ item.name }}
              </el-button>
            </template>
          </template>
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
            style="width: 100%;"
          >
            <template v-for="(item, index) in showTableList">
              <listTable v-if="item.child && item.child.length" :key="index" :coloumn-header="item" />
              <el-table-column v-else :key="index" :label="item.title" :prop="item.dataColFieldId" align="center" />
            </template>
          </el-table>
        </template>
        <pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.pageSize"
          @pagination="getReportData"
        />
      </div>
    </template>
  </div>
</template>

<script type='text/ecmascript-6'>
import pagination from '@/components/Pagination'
import { getReportDetailInfoNew, getListReportData } from '@/api/api'
import { reportDesignExportTable } from '@/utils/export-file.js'
import listTable from './components/listTable.vue'
export default {
  name: 'ListReport',
  components: { pagination, listTable },
  props: {},
  data() {
    return {
      lookForm: {}, // form表单
      layoutdata: {
        layoutFilter: [],
        layoutTable: [],
        checkList: [],
        tableCols: [],
        formTitle: ''
      },
      reportId: '',
      rules: {},
      listQuery: {
        page: 1,
        pageSize: 10
      },
      listLoading: true,
      showTableList: [],
      listdata: [],
      total: 0,
      exportLoadingStatus: false // 导出间隔标识
    }
  },
  computed: {
    checkListBtn: function() {
      return this.layoutdata.checkList.filter(item => item.checked)
    }
  },
  watch: {},
  created() {
    this.reportId = this.$route.query.reportId // 获取路径中的参数
    this.initData()
  },
  mounted() {},
  methods: {
    initData() {
      const rLoading = this.openLoading() // 打开loading
      getReportDetailInfoNew({ reportId: this.reportId }).then(res => { // 获取搜索条件及表头等数据
        console.log(res)
        this.layoutdata.layoutFilter = res.data.layoutFilter // 搜索条件数据
        this.layoutdata.checkList = res.data.checkList // 操作按钮数据
        // this.layoutdata.tableCols = res.data.tableCols // 表头数据
        this.showTableList = res.data.tableCols // 表头数据
        this.lookFormFun() // 处理form Model表单数据方法
        this.layoutdata.formTitle = res.data.formTitle // 获取设置报表名称
        this.getReportData() // 请求表格数据方法
        rLoading.close() // 关闭loading
      }).catch((err) => {
        console.log(err)
        rLoading.close() // 关闭loading
        this.$message.error({
          title: '失败',
          message: '页面数据加载失败'
        })
      })
    },
    lookFormFun() {
      console.log(this.layoutdata.layoutFilter)
      const form = {}
      const rules = {}
      this.layoutdata.layoutFilter.map((list, index) => {
        // 根据不同的表单类型 赋值不同的model数据类型 以reportColId作为表单标识，因为不同
        if (list.col_type === 'select' || list.col_type === 'multiple' || list.col_type === 'filterable' || list.col_type === 'filterables') {
          if (list.extra.length) { // 如果有下拉选项值，则用下拉选项值替换options
            list.options = list.extra
          }
        }
        /* if (list.col_type === 'select' || list.col_type === 'filterable') { // || list.col_type === 'multiple' || list.col_type === 'filterables'
          form[list.reportColId] = list.default_value || ''
        } else */
        if (list.col_type === 'multiple' || list.col_type === 'filterables') {
          form[list.report_sf_id] = list.checkboxExtraValue || []
        } else if (list.col_type === 'radio') {
          form[list.report_sf_id] = list.extraValue || ''
        } else if (list.col_type === 'checkbox') {
          form[list.report_sf_id] = list.checkboxExtraValue || []
        } else if (list.col_type === 'number') {
          form[list.report_sf_id] = list.numberValue
        } else {
          form[list.report_sf_id] = list.default_value
          /* if (list.default_value) { // 判断是否有默认值，
            form[list.report_sf_id] = list.default_value
          } else {
            form[list.report_sf_id] = ''
          } */
        }
        if (list.col_type === 'dateTime' || list.col_type === 'date' || list.col_type === 'daterange' || list.col_type === 'time') { // 时间类型
          rules[list.report_sf_id] = [{ type: 'date', required: list.is_empty, message: '请输入' + list.placeholder, trigger: 'change' }]
        } else if (list.col_type === 'checkbox' || list.col_type === 'multiple' || list.col_type === 'filterables') { // 多选类型
          rules[list.report_sf_id] = [{ type: 'array', required: list.is_empty, message: '请输入' + list.placeholder, trigger: 'change' }]
        } else if (list.col_type === 'filterable' || list.col_type === 'select') { // 下拉搜索单选
          rules[list.report_sf_id] = [{ required: list.is_empty, message: '请输入' + list.placeholder, trigger: 'change' }]
        } else { // 其他类型
          if (list.max_len && list.min_len) {
            rules[list.report_sf_id] = [{ required: list.is_empty, message: '请输入' + list.placeholder, trigger: 'blur' }, { min: list.min_len, max: list.max_len, message: `长度在${list.min_len}至${list.max_len}之间`, trigger: 'blur' }]
          }
          rules[list.report_sf_id] = [{ required: list.is_empty, message: '请输入' + list.placeholder, trigger: 'blur' }]
        }
      })
      this.lookForm = JSON.parse(JSON.stringify(form))
      console.log(this.lookForm)
      this.rules = JSON.parse(JSON.stringify(rules))
    },
    handleFilter() { // 搜索
      this.$refs.form.validate((valid) => { // 校验
        if (valid) {
          this.listQuery = {
            page: 1,
            pageSize: 10,
            reportId: this.reportId,
            searchParam: this.lookForm // 搜索条件
          }
          this.getReportData() // 请求表格数据方法
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getReportData() { // 列表数据请求方法
      this.listLoading = true

      this.listQuery.reportId = this.reportId
      this.listQuery.searchParam = this.lookForm // 搜索条件

      getListReportData(this.listQuery).then(res => {
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
    exportTable() { // 导出
      this.exportLoadingStatus = true
      const url = '/custom/Report/exportReport'
      reportDesignExportTable(this.reportId, this.lookForm, url)
      setTimeout(() => {
        this.exportLoadingStatus = false
      }, 30 * 1000)
    }
  }
}
</script>

<style scoped lang='scss'>
.lpc-lookDialog {
  padding: 20px;
  .look-header {
    padding: 18px 0;
    /* border-bottom: 1px solid #ebeef5; */
    box-sizing: border-box;
  }
  .operation-wrap {
    margin: 20px 0;
    .export-tips {
      font-size: 12px;
      color: red;
    }
  }
}
</style>
