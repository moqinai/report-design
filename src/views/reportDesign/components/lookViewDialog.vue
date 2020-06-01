<template>
  <div class="lpc-lookDialog">
    <div class="look-header">
      <h2>{{ layoutdata.formTitle }}</h2>
    </div>
    <template v-if="reportType === 'form'">
      <div v-if="JSON.stringify(lookForm) !== '{}'" class="form-container"><!-- v-if="JSON.stringify(lookForm) !== '{}'"  -->
        <el-form ref="form" class="manage-class-form" :model="lookForm">
          <el-row :gutter="10">
            <el-col v-for="(item, index) in layoutdata.layoutForm" v-show="item.is_show" :key="index" :xs="item.w * 2" :sm="item.w * 2" :md="item.w * 2" :lg="item.w * 2" :xl="item.w * 2">
              <div class="grid-content bg-purple">
                <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'">
                  <template v-if="item.col_type === 'input'">
                    <el-input v-model="lookForm[item.dataColFieldId]" :placeholder="item.placeholder" :style="'width:' + item.width" />
                  </template>
                  <template v-if="item.col_type === 'textarea'">
                    <el-input type="textarea" :placeholder="item.placeholder" :maxlength="item.max_len" :style="'width:' + item.width" />
                  </template>
                  <template v-if="item.col_type === 'select'">
                    <el-select v-model="lookForm[item.dataColFieldId]" clearable :placeholder="item.placeholder" :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </template>
                  <template v-if="item.col_type === 'multiple'">
                    <el-select v-model="lookForm[item.dataColFieldId]" clearable :placeholder="item.placeholder" multiple :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </template>
                  <template v-if="item.col_type === 'filterable'">
                    <el-select v-model="lookForm[item.dataColFieldId]" clearable :placeholder="item.placeholder" filterable :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </template>
                  <template v-if="item.col_type === 'filterables'">
                    <el-select v-model="lookForm[item.dataColFieldId]" clearable :placeholder="item.placeholder" multiple filterable remote :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </template>
                  <template v-if="item.col_type === 'dateTime'">
                    <el-date-picker
                      v-model="lookForm[item.dataColFieldId]"
                      type="datetime"
                      :placeholder="item.placeholder"
                      default-time="12:00:00"
                      :style="'width:' + item.width"
                    />
                  </template>
                  <template v-if="item.col_type === 'date'">
                    <el-date-picker
                      v-model="lookForm[item.dataColFieldId]"
                      type="date"
                      :placeholder="item.placeholder"
                      :style="'width:' + item.width"
                    />
                  </template>
                  <template v-if="item.col_type === 'daterange'">
                    <el-date-picker
                      v-model="lookForm[item.dataColFieldId]"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </template>
                  <template v-if="item.col_type === 'time'">
                    <el-time-select
                      v-model="lookForm[item.dataColFieldId]"
                      :placeholder="item.placeholder"
                      :style="'width:' + item.width"
                    />
                  </template>
                  <template v-if="item.col_type === 'radio'">
                    <el-radio-group v-model="lookForm[item.dataColFieldId]">
                      <el-radio v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-if="item.col_type === 'checkbox'">
                    <el-checkbox-group v-model="lookForm[item.dataColFieldId]">
                      <el-checkbox v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-checkbox>
                    </el-checkbox-group>
                  </template>
                  <template v-if="item.col_type === 'number'">
                    <el-input-number v-model="lookForm[item.dataColFieldId]" controls-position="right" :step="item.numberStep" :min="item.numberMin" :max="item.numberMax" :style="'width:' + item.width" />
                  </template>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
    <template v-if="reportType === 'excel'">
      <div class="filter-container">
        <!-- <div class="view-title">
        </div> -->
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
              <el-form-item>
                <template v-if="item.col_type === 'input'">
                  <el-input v-model="lookForm[item.report_sf_id]" :placeholder="item.placeholder" :style="'width:' + item.width" />
                </template>
                <template v-if="item.col_type === 'textarea'">
                  <el-input type="textarea" :placeholder="item.placeholder" :maxlength="item.max_len" :style="'width:' + item.width" />
                </template>
                <template v-if="item.col_type === 'select'">
                  <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" :style="'width:' + item.width">
                    <el-option
                      v-for="list in item.options"
                      :key="list.id"
                      :label="list.name"
                      :value="list.id"
                    />
                  </el-select>
                </template>
                <template v-if="item.col_type === 'multiple'">
                  <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" multiple :style="'width:' + item.width">
                    <el-option
                      v-for="list in item.options"
                      :key="list.id"
                      :label="list.name"
                      :value="list.id"
                    />
                  </el-select>
                </template>
                <template v-if="item.col_type === 'filterable'">
                  <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" filterable :style="'width:' + item.width">
                    <el-option
                      v-for="list in item.options"
                      :key="list.id"
                      :label="list.name"
                      :value="list.id"
                    />
                  </el-select>
                </template>
                <template v-if="item.col_type === 'filterables'">
                  <el-select v-model="lookForm[item.report_sf_id]" clearable :placeholder="item.placeholder" multiple filterable remote :style="'width:' + item.width">
                    <el-option
                      v-for="list in item.options"
                      :key="list.id"
                      :label="list.name"
                      :value="list.id"
                    />
                  </el-select>
                </template>
                <template v-if="item.col_type === 'dateTime'">
                  <el-date-picker
                    v-model="lookForm[item.report_sf_id]"
                    type="datetime"
                    :placeholder="item.placeholder"
                    default-time="12:00:00"
                    style="width:100%"
                  />
                </template>
                <template v-if="item.col_type === 'date'">
                  <el-date-picker
                    v-model="lookForm[item.report_sf_id]"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :placeholder="item.placeholder"
                    style="width:100%"
                  />
                </template>
                <template v-if="item.col_type === 'daterange'">
                  <el-date-picker
                    v-model="lookForm[item.report_sf_id]"
                    type="daterange"
                    range-separator="至"
                    :start-placeholder="item.placeholder + '开始日期'"
                    :end-placeholder="item.placeholder + '结束日期'"
                    style="width:100%"
                    value-format="yyyy-MM-dd"
                  />
                </template>
                <template v-if="item.col_type === 'time'">
                  <el-time-select
                    v-model="lookForm[item.report_sf_id]"
                    :placeholder="item.placeholder"
                    style="width:100%"
                  />
                </template>
                <template v-if="item.col_type === 'radio'">
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
                </template>
              </el-form-item>
            </el-col>
            <el-col v-if="layoutdata.layoutFilter.length" :sm="2" :md="2" :lg="2" :xl="2">
              <el-form-item>
                <el-button type="primary" @click="handleFilter">
                  搜索
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="operation-wrap">
        <el-row>
          <!-- <el-button v-for="(item, index) in layoutdata.checkList" v-show="item.checked" :key="index" plain :type="item.label === 'add' ? 'primary' : item.label === 'edit' ? 'success' : 'primary'">
            {{ item.name }}
          </el-button> -->
          <template v-for="(item, index) in checkListBtn">
            <el-button :key="index" plain :type="item.label === 'add' ? 'primary' : item.label === 'edit' ? 'success' : 'primary'">
              {{ item.name }}
            </el-button>
          </template>
        </el-row>
      </div>
      <div class="table-container">
        <template v-if="updateTable">
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
          ><!-- :height="tableHeight" -->
            <el-table-column
              v-if="editOrDelBtnFlag.length"
              type="selection"
              width="55"
              align="center"
            />
            <template v-for="(item, index) in tablecols">
              <listTable v-if="item.child && item.child.length" :key="index" :coloumn-header="item" />
              <el-table-column v-else :key="index" :label="item.title" :prop="item.dataColFieldId" align="center" />
            </template>
            <!-- <el-table-column
              v-for="(item, index) in showTableList"
              :key="index"
              :label="item.title"
              :prop="item.dataColFieldId"
            >
              <template v-if="item.child.length && item.child">
                <el-table-column
                  v-for="(list, ind) in item.child"
                  :key="ind"
                  :label="list.title"
                  :prop="list.dataColFieldId"
                />
              </template>
            </el-table-column> -->
          </el-table>
        </template>
        <pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.pageSize"
          :not-page="notPage"
          :page-count="pageCount"
          @pagination="getLookViewTableData"
        />
      </div>
    </template>
  </div>
</template>

<script type='text/ecmascript-6'>
import pagination from '@/components/Pagination'
import { getListReportData } from '@/api/api'
import listTable from './listTable.vue'
import { mapState } from 'vuex'
export default {
  name: 'Lookviewdialog',
  components: { pagination, listTable },
  props: {
    layoutdata: {
      default: () => {},
      type: Object
    },
    reportType: { // form excel 判断是填报型或者列表型
      default: () => '',
      type: String
    },
    form: { // form表单
      default: () => {},
      type: Object
    },
    tablecols: { // 表头数据
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      lookForm: {}, // form表单
      listLoading: true,
      tableHeight: 'calc(100vh - 380px)',
      listQuery: {
        page: 1,
        pageSize: 10
      },
      listdata: [],
      total: 0,
      notPage: false,
      pageCount: 1,
      updateTable: true
    }
  },
  computed: {
    ...mapState({ // 获取layout数据
      reportId: state => state.reportDesign.reportId // 报表id
    }),
    checkListBtn: function() { // 渲染按钮
      return this.layoutdata.checkList.filter(item => item.checked)
    },
    editOrDelBtnFlag: function() { // 筛选出是否有编辑和删除按钮， 用来控制显示表格复选框列
      return this.checkListBtn.filter(item => item.label === 'edit' || item.label === 'delete')
    }
  },
  watch: {
    tablecols: {
      handler(n, o) {
        console.log('123')
        console.log(n)
        if (this.reportType === 'excel' && JSON.stringify(n) !== JSON.stringify(o)) { // 如果是列表型
          console.log('进请求')
          this.getLookViewTableData() // 列表型 请求表格数据
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    console.log('Lookviewdialog')
    console.log(this.tablecols)
    this.lookForm = JSON.parse(JSON.stringify(this.form)) // 简易深拷贝
  },
  mounted() {
    /* [
      { "x": 0, "y": 0, "w": 12, "h": 2, "i": "0", "col_type": "input", "placeholder": "此内容由拖拽值传递过来", "title": "二狗子0", "code": "编码标识", "labelWidth": 100, "width": "50%", "addClass": false, "moved": false },
      { "x": 0, "y": 2, "w": 12, "h": 3, "i": "1", "col_type": "select", "placeholder": "此内容由拖拽值传递过来", "title": "二狗子1", "code": "编码标识123", "labelWidth": 100, "width": "30%", "addClass": true, "moved": false },
      { "x": 0, "y": 5, "w": 12, "h": 2, "i": "2", "col_type": "number", "placeholder": "此内容由拖拽值传递过来", "title": "二狗子2", "code": "编码标识", "labelWidth": 100, "width": "30%", "addClass": false, "max": 9, "min": 1, "step": 1, "value": 1, "moved": false }
    ] */
    console.log(this.layoutdata)
  },
  methods: {
    handleFilter() { // 搜索
      this.listQuery = {
        page: 1,
        pageSize: 10,
        reportId: this.reportId,
        searchParam: this.lookForm // 搜索条件
      }
      console.log(this.lookForm)
      this.getLookViewTableData() // 请求表格数据方法
    },
    getLookViewTableData() { // 请求预览table表格数据
      this.listLoading = true
      this.listQuery.reportId = +this.reportId
      this.listQuery.searchParam = this.lookForm // 搜索条件

      getListReportData(this.listQuery).then(res => {
        if (res.state === 2000) {
          this.listdata = res.data.data
          this.total = res.data.count // 总数量
          this.pageCount = res.data.totalPage // 总页数
          this.notPage = res.data.notPage // 是否是单页表格数据
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
    }
  }
}
</script>

<style scoped>
/* 切换布局方式时改变start */
.manage-class-form  >>> .el-radio-group .block {
  line-height: 52px;
}
.manage-class-form  >>> .el-checkbox-group .block {
  line-height: 52px;
}
/* 切换布局方式时改变end */
</style>
<style scoped lang='scss'>
.lpc-lookDialog {
  .look-header {
    padding: 18px 0;
    /* border-bottom: 1px solid #ebeef5; */
    box-sizing: border-box;
  }
  .operation-wrap {
    margin: 20px 0;
  }
}
</style>
