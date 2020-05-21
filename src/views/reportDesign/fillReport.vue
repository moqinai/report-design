<template>
  <div class="lpc-lookDialog">
    <div class="look-header">
      <h2>{{ layoutdata.formTitle }}</h2>
      <!-- {{ lookForm }}
      {{ rules }} -->
    </div>
    <template>
      <div v-if="JSON.stringify(lookForm) !== '{}'" class="form-container"><!-- v-if="JSON.stringify(lookForm) !== '{}'"  -->
        <el-form ref="form" class="manage-class-form" :model="lookForm">
          <el-row :gutter="10">
            <el-col v-for="(item, index) in layoutdata.layoutForm" v-show="item.is_show" :key="index" :xs="item.w * 2" :sm="item.w * 2" :md="item.w * 2" :lg="item.w * 2" :xl="item.w * 2">
              <div class="grid-content bg-purple">
                <template v-if="item.col_type === 'input'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-input v-model="lookForm[item.reportColId]" :placeholder="item.placeholder" :style="'width:' + item.width" />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'select'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-select v-model="lookForm[item.reportColId]" clearable :placeholder="item.placeholder" :style="'width:' + item.width">
                      <el-option
                        v-for="list in item.options"
                        :key="list.id"
                        :label="list.name"
                        :value="list.id"
                      />
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'textarea'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-input v-model="lookForm[item.reportColId]" type="textarea" :placeholder="item.placeholder" :maxlength="item.max_len" :style="'width:' + item.width" />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'multiple'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-select v-model="lookForm[item.reportColId]" clearable :placeholder="item.placeholder" multiple :style="'width:' + item.width">
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
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-select v-model="lookForm[item.reportColId]" clearable :placeholder="item.placeholder" filterable :style="'width:' + item.width">
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
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-select v-model="lookForm[item.reportColId]" clearable :placeholder="item.placeholder" multiple filterable remote :style="'width:' + item.width">
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
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-date-picker
                      v-model="lookForm[item.reportColId]"
                      type="datetime"
                      :placeholder="item.placeholder"
                      default-time="12:00:00"
                      :style="'width:' + item.width"
                    />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'date'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-date-picker
                      v-model="lookForm[item.reportColId]"
                      type="date"
                      :placeholder="item.placeholder"
                      :style="'width:' + item.width"
                    />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'daterange'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-date-picker
                      v-model="lookForm[item.reportColId]"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'time'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-time-select
                      v-model="lookForm[item.reportColId]"
                      :placeholder="item.placeholder"
                      :style="'width:' + item.width"
                    />
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'radio'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-radio-group v-model="lookForm[item.reportColId]">
                      <el-radio v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'checkbox'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-checkbox-group v-model="lookForm[item.reportColId]">
                      <el-checkbox v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </template>
                <template v-if="item.col_type === 'number'">
                  <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'" :prop="item.reportColId.toString()" :rules="rules[item.reportColId]">
                    <el-input-number v-model="lookForm[item.reportColId]" controls-position="right" :step="item.numberStep" :min="item.numberMin" :max="item.numberMax" :style="'width:' + item.width" />
                  </el-form-item>
                </template>
              </div>
            </el-col>
            <el-col class="text-center">
              <el-form-item>
                <el-button @click="resetForm('form')"> 重置 </el-button>
                <el-button type="primary" @click="onSubmit('form')"> 提交 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
  </div>
</template>

<script type='text/ecmascript-6'>
/* import pagination from '@/components/Pagination'
import classTable from './classTable' */
import { getReportFillInfo, submitReport } from '@/api/api'

export default {
  name: 'Lookviewdialog',
  // components: { classTable, pagination },
  data() {
    return {
      lookForm: {}, // form表单
      layoutdata: {
        layoutForm: [],
        formTitle: ''
      },
      reportType: '',
      reportId: '',
      rules: {}
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.reportId = this.$route.query.reportId // 获取路径中的参数
    this.initData()
  },
  mounted() {
    console.log(this.layoutdata)
  },
  methods: {
    initData() {
      const rLoading = this.openLoading() // 打开loading
      getReportFillInfo({ reportId: this.reportId }).then(res => {
        console.log(res)
        this.layoutdata.layoutForm = res.data.reportCols
        this.lookFormFun() // 处理form Model表单数据方法
        this.layoutdata.formTitle = res.data.reportInfo.report_nickname // 获取设置报表名称
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
      console.log(this.layoutdata.layoutForm)
      const form = {}
      const rules = {}
      this.layoutdata.layoutForm.map((list, index) => {
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
          form[list.reportColId] = list.checkboxExtraValue || []
        } else if (list.col_type === 'radio') {
          form[list.reportColId] = list.extraValue || ''
        } else if (list.col_type === 'checkbox') {
          form[list.reportColId] = list.checkboxExtraValue || []
        } else if (list.col_type === 'number') {
          form[list.reportColId] = list.numberValue
        } else {
          form[list.reportColId] = list.default_value
          /* if (list.default_value) { // 判断是否有默认值，
            form[list.reportColId] = list.default_value
          } else {
            form[list.reportColId] = ''
          } */
        }
        let required = true // 是否校验必填标识
        list.is_empty ? required = false : required = true // 根据is_empty字段判断
        if (list.col_type === 'dateTime' || list.col_type === 'date' || list.col_type === 'daterange' || list.col_type === 'time') { // 时间类型
          rules[list.reportColId] = [{ type: 'date', required: required, message: '请输入' + list.title, trigger: 'change' }]
        } else if (list.col_type === 'checkbox' || list.col_type === 'multiple' || list.col_type === 'filterables') { // 多选类型
          rules[list.reportColId] = [{ type: 'array', required: required, message: '请输入' + list.title, trigger: 'change' }]
        } else if (list.col_type === 'filterable' || list.col_type === 'select') { // 下拉搜索单选
          rules[list.reportColId] = [{ required: required, message: '请输入' + list.title, trigger: 'change' }]
        } else { // 其他类型
          if (list.max_len && list.min_len) {
            rules[list.reportColId] = [{ required: required, message: '请输入' + list.title, trigger: 'blur' }, { min: list.min_len, max: list.max_len, message: `长度在${list.min_len}至${list.max_len}之间`, trigger: 'blur' }]
          }
          rules[list.reportColId] = [{ required: required, message: '请输入' + list.title, trigger: 'blur' }]
        }
      })
      this.lookForm = JSON.parse(JSON.stringify(form))
      console.log(this.lookForm)
      this.rules = JSON.parse(JSON.stringify(rules))
    },
    onSubmit(formName) { // 提交
      console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => { // 校验
        if (valid) {
          console.log(this.lookForm)
          const rLoading = this.openLoading() // 打开loading
          submitReport({ reportId: this.reportId, data: this.lookForm }).then(res => {
            console.log(res)
            this.$message.success('提交成功')
            this.$refs[formName].resetFields()
            rLoading.close() // 关闭loading
          }).catch((err) => {
            console.log(err)
            rLoading.close() // 关闭loading
            this.$message.error('提交失败')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) { // 重置
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
/* 切换布局方式时改变start */
.lpc-lookDialog >>> .el-radio-group .block {
  line-height: 36px;
}
.lpc-lookDialog >>> .el-checkbox-group .block {
  line-height: 36px;
}
/* 切换布局方式时改变end */
</style>
<style scoped lang='scss'>
.lpc-lookDialog {
  .look-header {
    padding: 18px 20px;
    /* border-bottom: 1px solid #ebeef5; */
    box-sizing: border-box;
  }
  .form-container {
    padding: 18px 40px;
    width: 80%;
    margin: auto;
  }
}
</style>
