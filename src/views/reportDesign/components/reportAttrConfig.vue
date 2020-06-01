<template>
  <div class="report-config">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="字段属性" name="field">
        <div v-if="JSON.stringify(formConfig) === '{}' || deleteFlag" class="text-content">
          请添加/选择字段
        </div>
        <div v-else>
          <div v-if="reportType === 'form'">
            <el-form label-position="top" label-width="80px">
              <!-- <el-form-item label="字段标识">
                <el-input :value="formConfig.dataColFieldId" @input="updateConfig($event,'dataColFieldId')" />加上.native是为了解决element-ui input无法捕捉input事件的问题
              </el-form-item>
              <hr> -->
              <el-form-item label="逻辑">
                <el-checkbox v-model="formConfig.is_show"> 可见 </el-checkbox>
                <el-checkbox v-model="formConfig.is_only"> 验证唯一字段 </el-checkbox>
              </el-form-item>
              <hr>
              <el-form-item label="校验">
                <el-checkbox v-model="formConfig.is_empty"> 允许为空 </el-checkbox>
              </el-form-item>
              <hr>
              <el-form-item label="字段类型">
                <el-select v-model="formConfig.col_type" placeholder="请选择" @change="fieldTypeChange($event)">
                  <el-option
                    v-for="item in fieldTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <hr>
              <!-- 根据字段类型来判断是否显示 start -->
              <div v-if="need_extra === 1">
                <template v-if="formConfig.col_type !== 'radio' && formConfig.col_type !== 'checkbox'">
                  <el-form-item label="标准控件">
                    <el-select v-model="formConfig.standard_control" placeholder="请选择" @change="controlChange">
                      <el-option value=""> 无 </el-option>
                      <el-option
                        v-for="item in controlsOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <hr>
                </template>
                <el-form-item label="下拉选项">
                  <!-- <el-input v-model="formConfig.extra" type="textarea" placeholder="下拉选项 请按 key:value 然后折行的格式输入" /> -->
                  <template v-if="formConfig.col_type === 'radio' || formConfig.col_type === 'select' || formConfig.col_type === 'filterable'">
                    <el-radio-group v-model="formConfig.extraValue">
                      <el-radio v-for="(item, ind) in formConfig.extra" :key="ind" :label="item.id" class="block">
                        <el-input
                          v-model="item.id"
                          size="mini"
                          placeholder="请输入key"
                          style="width: 45%"
                        />
                        <span style="width:5%;">-</span>
                        <el-input
                          v-model="item.name"
                          size="mini"
                          placeholder="请输入label"
                          style="width: 45%"
                        />
                        <i class="el-icon-remove-outline" @click="delRadioOrCheckbox(ind, 'radio')" />
                      </el-radio>
                    </el-radio-group>
                    <p class="addText" @click="addRadioOrCheckbox('radio')">添加选项</p>
                  </template>
                  <template v-if="formConfig.col_type === 'checkbox' || formConfig.col_type === 'multiple' || formConfig.col_type === 'filterables'">
                    <el-checkbox-group v-model="formConfig.checkboxExtraValue">
                      <el-checkbox v-for="(item, ind) in formConfig.extra" :key="ind" :label="item.id" class="block">
                        <el-input
                          v-model="item.id"
                          size="mini"
                          placeholder="请输入key"
                          style="width: 45%"
                        />
                        <span style="width:5%;">-</span>
                        <el-input
                          v-model="item.name"
                          size="mini"
                          placeholder="请输入label"
                          style="width: 45%"
                        />
                        <i class="el-icon-remove-outline" @click="delRadioOrCheckbox(ind, 'checkbox')" />
                      </el-checkbox>
                    </el-checkbox-group>
                    <p class="addText" @click="addRadioOrCheckbox('checkbox')">添加选项</p>
                  </template>
                </el-form-item>
                <hr>
                <template v-if="formConfig.col_type === 'radio' || formConfig.col_type === 'checkbox'">
                  <el-form-item label="布局方式">
                    <el-radio-group v-model="formConfig.radioOrcheckboxView" size="mini" @change="radioOrcheckboxChange($event)">
                      <el-radio-button label="block"> 块级 </el-radio-button>
                      <el-radio-button label="inlineBlock"> 行内 </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <hr>
                </template>
              </div>
              <!-- 根据字段类型来判断是否显示 end -->
              <template v-if="reportType === 'form'">
                <el-form-item label="标题">
                  <el-input v-model="formConfig.title" />
                </el-form-item>
                <hr>
                <el-form-item label="宽度">
                  <el-input v-model="formConfig.width" />
                </el-form-item>
                <hr>
                <el-form-item label="标签宽度">
                  <el-checkbox v-model="checkedWidth">自定义</el-checkbox>
                  <el-input-number v-model="formConfig.labelWidth" :disabled="!checkedWidth" size="small" :step="10" :min="100" :max="500" step-strictly />
                </el-form-item>
                <hr>
              </template>
              <template v-if="formConfig.col_type !== 'radio' && formConfig.col_type !== 'checkbox' && formConfig.col_type !== 'number'">
                <el-form-item label="默认值">
                  <el-input v-model="formConfig.default_value" placeholder="请输入默认值" />
                </el-form-item>
                <hr>
              </template>
              <template v-if="formConfig.col_type !== 'radio' && formConfig.col_type !== 'checkbox' && formConfig.col_type !== 'number'">
                <el-form-item label="占位字符">
                  <el-input v-model="formConfig.placeholder" />
                </el-form-item>
                <hr>
              </template>
              <div class="type-content">
                <template v-if="formConfig.col_type === 'input'">
                  <el-form-item label="填写规则">
                    <el-select v-model="formConfig.fill_rule" placeholder="请选择">
                      <el-option
                        v-for="item in fillRuleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <hr>
                  <el-form-item label="正则表达式">
                    <el-input v-model="formConfig.regular_expression" />
                  </el-form-item>
                  <hr>
                </template>
                <!-- <template v-if="fieldType === 'date'">
                  <el-form-item label="显示类型">
                    <el-select v-model="dateType" placeholder="请选择" @change="dateTypeChange">
                      <el-option
                        v-for="item in dateTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <hr>
                </template> -->
                <template v-if="formConfig.col_type === 'textarea'">
                  <el-form-item label="最大长度">
                    <el-input-number v-model="formConfig.max_len" size="small" step-strictly />
                  </el-form-item>
                  <hr>
                  <el-form-item label="最小长度">
                    <el-input-number v-model="formConfig.min_len" size="small" step-strictly />
                  </el-form-item>
                  <hr>
                </template>
                <template v-if="formConfig.col_type === 'number'">
                  <el-form-item label="最小值">
                    <el-input-number v-model="formConfig.numberMin" size="small" step-strictly />
                  </el-form-item>
                  <hr>
                  <el-form-item label="最大值">
                    <el-input-number v-model="formConfig.numberMax" size="small" step-strictly />
                  </el-form-item>
                  <hr>
                  <el-form-item label="步长">
                    <el-input-number v-model="formConfig.numberStep" size="small" step-strictly />
                  </el-form-item>
                  <hr>
                  <el-form-item label="默认值">
                    <el-input-number v-model="formConfig.numberValue" size="small" step-strictly />
                  </el-form-item>
                  <hr>
                </template>
                <template v-if="formConfig.col_type !== 'radio' && formConfig.col_type !== 'checkbox' && formConfig.col_type !== 'number'">
                  <el-form-item label="错误提示">
                    <el-input v-model="formConfig.error_prompt" placeholder="请填写错误提示" />
                  </el-form-item>
                  <hr>
                </template>
              </div>
            </el-form>
          </div>
          <!-- reportType 为excel时 -->
          <div v-else class="fieldExcel">
            <el-form id="filterForm" label-position="top" label-width="80px" :model="formConfig">
              <template v-if="layoutType === 'tableFilter'">
                <h3>搜索</h3>
                <hr>
                <el-form-item label="逻辑">
                  <el-checkbox v-model="formConfig.is_show"> 可见 </el-checkbox>
                  <el-checkbox v-model="formConfig.is_empty"> 是否必填 </el-checkbox>
                </el-form-item>
                <hr>
                <template v-if="formConfig.col_type !== 'radio' && formConfig.col_type !== 'checkbox' && formConfig.col_type !== 'number'">
                  <el-form-item
                    label="默认值"
                    prop="default_value"
                    :rules="[
                      { required: !formConfig.is_show, message: '请输入默认值', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model="formConfig.default_value" placeholder="请输入默认值" />
                  </el-form-item>
                  <hr>
                </template>
                <el-form-item label="字段类型">
                  <el-select v-model="formConfig.col_type" placeholder="请选择" @change="fieldTypeChange($event)">
                    <el-option
                      v-for="item in filterFieldTypeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <hr>
                <template v-if="is_timestamp">
                  <el-form-item label="是否时间戳">
                    <el-select v-model="formConfig.is_timestamp" placeholder="请选择">
                      <el-option label="否" :value="0" />
                      <el-option label="是" :value="1" />
                    </el-select>
                  </el-form-item>
                  <hr>
                </template>
                <!-- 根据字段类型来判断是否显示 start -->
                <div v-if="need_extra === 1">
                  <template v-if="formConfig.col_type !== 'radio' && formConfig.col_type !== 'checkbox'">
                    <el-form-item label="标准控件">
                      <el-select v-model="formConfig.standard_control" placeholder="请选择" @change="controlChange">
                        <el-option value=""> 无 </el-option>
                        <el-option
                          v-for="item in controlsOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <hr>
                  </template>
                  <el-form-item label="下拉选项">
                    <!-- <el-input v-model="formConfig.extra" type="textarea" placeholder="下拉选项 请按 key:value 然后折行的格式输入" /> -->
                    <template v-if="formConfig.col_type === 'radio' || formConfig.col_type === 'select' || formConfig.col_type === 'filterable'">
                      <el-radio-group v-model="formConfig.extraValue">
                        <el-radio v-for="(item, ind) in formConfig.extra" :key="ind" :label="item.id" class="block">
                          <el-input
                            v-model="item.id"
                            size="mini"
                            placeholder="请输入key"
                            style="width: 45%"
                          />
                          <span style="width:5%;">-</span>
                          <el-input
                            v-model="item.name"
                            size="mini"
                            placeholder="请输入label"
                            style="width: 45%"
                          />
                          <i class="el-icon-remove-outline" @click="delRadioOrCheckbox(ind, 'radio')" />
                        </el-radio>
                      </el-radio-group>
                      <p class="addText" @click="addRadioOrCheckbox('radio')">添加选项</p>
                    </template>
                    <template v-if="formConfig.col_type === 'checkbox' || formConfig.col_type === 'multiple' || formConfig.col_type === 'filterables'">
                      <el-checkbox-group v-model="formConfig.checkboxExtraValue">
                        <el-checkbox v-for="(item, ind) in formConfig.extra" :key="ind" :label="item.id" class="block">
                          <el-input
                            v-model="item.id"
                            size="mini"
                            placeholder="请输入key"
                            style="width: 45%"
                          />
                          <span style="width:5%;">-</span>
                          <el-input
                            v-model="item.name"
                            size="mini"
                            placeholder="请输入label"
                            style="width: 45%"
                          />
                          <i class="el-icon-remove-outline" @click="delRadioOrCheckbox(ind, 'checkbox')" />
                        </el-checkbox>
                      </el-checkbox-group>
                      <p class="addText" @click="addRadioOrCheckbox('checkbox')">添加选项</p>
                    </template>
                  </el-form-item>
                  <hr>
                  <template v-if="formConfig.col_type === 'radio' || formConfig.col_type === 'checkbox'">
                    <el-form-item label="布局方式">
                      <el-radio-group v-model="formConfig.radioOrcheckboxView" size="mini" @change="radioOrcheckboxChange($event)">
                        <el-radio-button label="block"> 块级 </el-radio-button>
                        <el-radio-button label="inlineBlock"> 行内 </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <hr>
                  </template>
                </div>
              </template>

              <template v-if="layoutType === 'check'">
                <h3>按钮</h3>
                <hr>
                <template v-if="formConfig.label === 'add' || formConfig.label === 'edit'">
                  <el-form-item label="地址">
                    <el-input v-model="formConfig.address" />
                  </el-form-item>
                  <hr>
                </template>
                <el-form-item>
                  <el-checkbox v-model="formConfig.permissions"> 是否控制权限 </el-checkbox>
                </el-form-item>
                <hr>
              </template>

              <template v-if="layoutType === 'table'">
                <h3>列表</h3>
                <hr>
                <el-form-item label="标签">
                  <el-input v-model="formConfig.title" />
                </el-form-item>
                <hr>
                <el-form-item label="统计方式">
                  <el-radio-group v-model="formConfig.total_way" size="mini">
                    <el-radio label="totaltr"> 是否统计行/类别 </el-radio>
                    <el-radio label="totaltd"> 是否统计列/系列 </el-radio>
                    <el-radio label="totalz"> 是否统计值 </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
                <el-form-item label="取值类型">
                  <el-select v-model="formConfig.value_type" placeholder="请选择取值类型">
                    <el-option
                      v-for="item in valuesTypeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <hr>
                <el-form-item label="公式值">
                  <el-input :value="formConfig.formula" placeholder="公式值" />
                </el-form-item>
                <hr>
              </template>
            </el-form>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="表单属性" name="form">
        <div v-if="JSON.stringify(formConfig) === '{}'" class="text-content">
          请添加/选择字段
        </div>
        <div v-else>
          <div v-if="reportType === 'form'">
            <el-form label-position="top" label-width="80px">
              <el-form-item label="标签宽度">
                <el-input v-model="allTiltWidth" placeholder="全局标签宽度配置" />
              </el-form-item>
              <hr>
            </el-form>
          </div>
          <div v-else>
            <el-form label-position="top" label-width="80px">
              <el-form-item label="是否全屏">
                <el-checkbox v-model="requeryView">全屏</el-checkbox>
              </el-form-item>
              <hr>
              <template v-if="formConfig.label === 'delete' || formConfig.label === 'edit'">
                <el-form-item label="主键">
                  <el-select v-model="pk" placeholder="请选择取值类型">
                    <el-option
                      v-for="item in primaryKey"
                      :key="item.data_col_id"
                      :label="item.col_name"
                      :value="item.data_col_id"
                    />
                  </el-select>
                </el-form-item>
                <hr>
              </template>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapState } from 'vuex'
import { getColType, getStandardControl, getStrandardControlInfo, getStatistics } from '@/api/api'

export default {
  name: 'ReportAttrConfig',
  props: {
    reportType: {
      default: () => '',
      type: String
    },
    primaryKey: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      activeName: 'field', // tab切换
      labelWidth: 100, // 标签宽度
      checkedWidth: false, // 自定义标签宽度
      valuesType: '', // excel情况下的取值类型
      fieldType: '', // 字段类型； 通过此变化切换配置
      is_show: true, // 是否可见，1-是；0-否。 默认是
      is_only: false, // 是否验证唯一，1-是；0-否； 默认否
      is_empty: false, // 是否允许为空， 1是；0否；默认否

      fieldTypeOptions:
      [
        /* {
          value: 'input',
          label: '文本框'
        }, {
          value: 'textarea',
          label: '多行文本'
        }, {
          value: 'select',
          label: '下拉框'
        }, {
          value: 'multiple',
          label: '下拉多选框'
        }, {
          value: 'filterable',
          label: '可搜索单选下拉框'
        }, {
          value: 'filterables',
          label: '可搜索多选选下拉框'
        }, {
          value: 'dateTime',
          label: '日期时间选择器'
        }, {
          value: 'date',
          label: '日期选择器'
        }, {
          value: 'daterange',
          label: '范围日期选择器'
        }, {
          value: 'time',
          label: '时间选择器'
        }, {
          value: 'radio',
          label: '单选框'
        }, {
          value: 'checkbox',
          label: '多选框'
        }, {
          value: 'number',
          label: '计数器'
        } */
      ],
      need_extra: 0, // 标准控件是否显示
      is_timestamp: 0, // 是否时间戳是否显示
      controls: '', // 标准控件选中
      controlsOptions: [], // 标准控件选项
      // textareaOptions: '', // 下拉选项textarea框
      radioModel: 3, // radio默认选项
      checkboxModel: [], // checkbox默认选项
      radioOrcheckboxView: 'inline-block', // radio和checkbox布局方式
      dateType: 'date', // 日期框类型
      fillRuleOptions:
      [
        {
          value: '',
          label: '无'
        }, {
          value: 'email',
          label: '邮箱'
        }, {
          value: 'idCard',
          label: '身份证'
        }, {
          value: 'phone',
          label: '电话'
        }, {
          value: 'mobile',
          label: '手机'
        }, {
          value: 'custom',
          label: '自定义'
        }],
      dateTypeOptions:
      [
        {
          value: 'date',
          label: '年月日'
        }, {
          value: 'year',
          label: '年'
        }, {
          value: 'month',
          label: '月'
        }, {
          value: 'week',
          label: '周'
        }
      ],
      valuesTypeOptions: [],
      numberMin: 0,
      numberMax: 9,
      numberStep: 1,
      numberValue: 0,
      allTiltWidth: 100, // 全局标签宽度
      requeryView: false, // 别表型 全局 是否全屏
      pk: '', // 主键
      radioView: ''
      /* formConfig: {
        code: '',
        region: '',
        type: ''
      } */
      // formConfig: {}
    }
  },
  computed: {
    ...mapState({
      deleteFlag: state => state.reportDesign.deleteFlag, // 删除标识
      layoutdata: state => state.reportDesign.layoutdata, // 整体所有数据
      formConfig: state => state.reportDesign.reportItem, // 单个选中数据
      layoutType: state => state.reportDesign.layoutType, // 用来区分是form、 tableFilter、table
      itemIndex: state => state.reportDesign.itemIndex, // 选中项标识
      dataId: state => state.reportDesign.dataId, // 数据集id
      dataList: state => state.reportDesign.dataList // 数据集
    }),
    filterFieldTypeOptions: function() { // 列表型 配置 字段类型 字段筛选
      return this.fieldTypeOptions.filter((ele, index, arr) => ele.use_search) // 过滤出为0的数据留下为1的
    }
  },
  watch: {
    allTiltWidth: {
      handler(n, o) {
        const data = JSON.parse(JSON.stringify(this.layoutdata))
        if (n) {
          data.layoutForm.map((list, ind) => {
            list.labelWidth = +n
          })
        } else {
          data.layoutForm.map((list, ind) => {
            list.labelWidth = 100
          })
        }
        this.$store.commit('reportDesign/LAYOUT_DATA', data)
      }
    },
    requeryView: { // 监听列表型 全局 是否全屏属性
      handler(n, o) {
        console.log(',l,l,l,l,l,l,l')
        if (n !== o) { // 是否全屏属性只有非表单型才有
          const data = JSON.parse(JSON.stringify(this.layoutdata))
          data.requeryView = this.requeryView
          this.$store.commit('reportDesign/LAYOUT_DATA', data) // 在改变配置属性之后将其存入store
        }
      }
    },
    formConfig: {
      handler(newData, oldData) {
        console.log('1233333333')
        console.log(oldData)
        console.log(newData)
        if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
          if (this.layoutType === 'form') {
            if (newData.col_type === 'select' || newData.col_type === 'multiple' || newData.col_type === 'filterable' || newData.col_type === 'filterables' || newData.col_type === 'radio' || newData.col_type === 'checkbox') {
              if (newData.col_type !== oldData.col_type) { // 有变化则处理need_extra显示
                this.fieldTypeChange(this.formConfig.col_type) // 每次选中的模块变化时，都更新标准控件的显示标示
              }
            } else {
              this.need_extra = 0 // need_extra就是不显示的意思
            }
            this.layoutdata.layoutForm.splice(this.itemIndex, 1, this.formConfig)
            // this.$store.commit('reportDesign/LAYOUT_DATA', this.layout) // 在改变配置属性之后将其存入store
          } else if (this.layoutType === 'tableFilter') {
            console.log(newData)
            if (newData.col_type !== oldData.col_type) { // 有变化则处理need_extra显示
              this.fieldTypeChange(this.formConfig.col_type) // 每次选中的模块变化时，都更新标准控件的显示标示
            }
            /* if (newData.col_type === 'select' || newData.col_type === 'multiple' || newData.col_type === 'filterable' || newData.col_type === 'filterables' || newData.col_type === 'radio' || newData.col_type === 'checkbox') {
              if (newData.col_type !== oldData.col_type) { // 有变化则处理need_extra显示
                this.fieldTypeChange(this.formConfig.col_type) // 每次选中的模块变化时，都更新标准控件的显示标示
              }
            } else {
              this.need_extra = 0 // need_extra就是不显示的意思
            } */
            this.layoutdata.layoutFilter.splice(this.itemIndex, 1, this.formConfig)
          } else if (this.layoutType === 'table') {
            this.layoutdata.layoutTable.splice(this.itemIndex, 1, this.formConfig)
          } else if (this.layoutType === 'check') {
            console.log('jincheck')
            console.log(this.formConfig)
            this.layoutdata.checkList.splice(this.itemIndex, 1, this.formConfig)
          }
          // this.$store.commit('reportDesign/LAYOUT_DATA', this.layoutdata) // 在改变配置属性之后将其存入store
        }
      },
      immediate: true,
      deep: true
    },
    pk: { // 监控全局主键是否变化，
      handler(n, o) {
        if (n !== o) {
          const data = JSON.parse(JSON.stringify(this.layoutdata))
          data.pk = this.pk
          this.$store.commit('reportDesign/LAYOUT_DATA', data) // 在改变配置属性之后将其存入store
        }
      }
    }
  },
  created() {
    this.requeryView = this.layoutdata.requeryView
    this.pk = this.layoutdata.pk
    this.getColType()
    this.getStatisticsFunc()
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    updateConfig(e, type) { // 修改code；  e值，type类型
      const item = JSON.parse(JSON.stringify(this.formConfig)) // Object.assign({}, this.formConfig)
      /* if (type === 'dataColFieldId') { // 标识
        item.dataColFieldId = e
      } else if (type === 'title') { // 标签名
        item.title = e
      } else if (type === 'width') { // 框宽度
        item.width = e
      } else if (type === 'labelWidth') { // 标签宽度
        item.labelWidth = e
      } else if (type === 'placeholder') { // 占位符
        item.placeholder = e
      } else if (type === 'col_type') { // 切换字段类型
        item.col_type = e
      } else */
      if (type === 'datatype') { // 当type为date时，选择的年or月or年月日格式
        item.datatype = e
      } else if (type === 'options') { // 下拉框内容
        item.options = e
      }
      console.log(item)
      this.$store.commit('reportDesign/EDIT_REPORT_ITEM', item)
    },
    getColType() { // 获取字段类型方法
      getColType().then(res => {
        if (res.state === 2000) {
          this.fieldTypeOptions = res.data
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('请求字段类型失败')
      })
    },
    getStatisticsFunc() { // 获取取值类型方法
      getStatistics().then(res => {
        if (res.state === 2000) {
          this.valuesTypeOptions = res.data
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('请求取值类型失败')
      })
    },
    fieldTypeChange(event) { // 字段类型切换方法，当选中的字段中need_extra字段为1时请求标准控件选项接口
      this.fieldType = event // 赋值字段类型，
      this.fieldTypeOptions.map((e, i) => {
        if (event === e.id) {
          this.is_timestamp = e.is_time // 判断控制显示 是否时间戳
          this.need_extra = e.need_extra // 由该字段控制判断 标准控件模块是否显示
        }
      })
      if (this.need_extra === 1) {
        this.getControlData() // 请求标准控件信息内容
      }
      // this.updateConfig(this.fieldType, 'col_type')
    },
    getControlData() { // 请求标准控件信息内容
      getStandardControl().then(res => { // { standard: this.fieldType }
        console.log(res)
        if (res.state === 2000) {
          this.controlsOptions = res.data
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('获取标准控件信息失败')
      })
    },
    controlChange() { // 标准控件切换方法，
      if (this.formConfig.standard_control === '') { // 选择为空时直接置为空，减少请求
        this.formConfig.options = []
        return false
      }
      getStrandardControlInfo({ standard: this.formConfig.standard_control }).then(res => {
        console.log(res)
        if (res.state === 2000) {
          this.updateConfig(res.data, 'options')
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('获取控件options失败')
      })
    },
    dateTypeChange() { // 日期显示类型切换
      console.log(this.dateType)
      this.updateConfig(this.dateType, 'datatype')
    },
    radioOrcheckboxChange(e) { // 当col_type为radio和checkbox时，布局方式改变事件
      console.log(this.formConfig.radioOrcheckboxView)
      console.log(e)
      if (this.formConfig.radioOrcheckboxView === 'block' && this.formConfig.extra.length) { // 判断是布局方式计算模块高度
        this.formConfig.h = this.formConfig.extra.length * 2
      } else {
        this.formConfig.h = 2
      }
      if (this.layoutType === 'form') {
        this.layoutdata.layoutForm.splice(this.itemIndex, 1, this.formConfig) // 更新布局状态
      } else if (this.layoutType === 'tableFilter') {
        this.layoutdata.layoutFilter.splice(this.itemIndex, 1, this.formConfig) // 更新布局状态
      }
      if (document.createEvent) { // 么得办法，一时想不到怎样才能触发vue-grid-layout数据布局的刷新，只能出此下策，通过触发resize变动来更新；望后来者解决此沙雕方法
        var event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, true)
        window.dispatchEvent(event)
      } else if (document.createEventObject) {
        window.fireEvent('onresize')
      }
    },
    /* 添加/删除选项 start*/
    addRadioOrCheckbox(type) {
      console.log(this.formConfig)
      const id = this.formConfig.extra.length + 1
      const name = 'options' + id
      this.formConfig.extra.push({ id, name })
      if (this.layoutType === 'form') {
        this.layoutdata.layoutForm.splice(this.itemIndex, 1, this.formConfig) // 更新布局状态
      } else if (this.layoutType === 'tableFilter') {
        this.layoutdata.layoutFilter.splice(this.itemIndex, 1, this.formConfig) // 更新布局状态
      }
    },
    delRadioOrCheckbox(ind, type) {
      console.log(this.formConfig.extraValue)
      if (type === 'radio') {
        if (this.formConfig.extra[ind].id === this.formConfig.extraValue) { // 判断当前要删除的选项的id是否等于以选中的默认的值，如果相同则清空
          this.formConfig.extraValue = ''
        }
      } else { // checkbox
        if (this.formConfig.checkboxExtraValue.length) {
          this.formConfig.checkboxExtraValue.map((list, index) => {
            if (list.id === this.formConfig.extra[ind].id) { // 如果要删除的选项在checkbox默认选项中，则删除
              // this.formConfig.extraValue.splice(index, 1)
              this.formConfig.checkboxExtraValue.remove(this.formConfig.extra[ind].id) // 删除当前数组中元素
            }
          })
        }
      }
      this.formConfig.extra.splice(ind, 1)
      console.log(this.formConfig)
    }
    /* 添加/删除选项 end*/
  }
}
</script>
<style scoped>
.fieldExcel >>> .el-radio {
  margin: 10px 0;
}
</style>
<style scoped lang='scss'>
@import '@/styles/mixin.scss';
.report-config {
      @include scrollBar;
  background:#fff;
  height: calc(100vh - 150px);
  padding:0px 36px;
  padding-bottom:40px;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0px 0px  5px 0px #ccc;
  .text-content {
    height: calc(100vh - 208px);
    line-height: calc(100vh - 208px);
    text-align: center;
    font-size: 18px;
    color: #bdbbbb;
  }
  hr {
    color: #e0dcdc;
    border: .5px solid;
  }
  .el-radio-group .block {
    display: block;
    height: 36px;
  }
  .el-radio {
    margin-right: 40px;
  }
  .el-radio:last-child {
    margin-right: 40px;
  }
  .el-checkbox:last-of-type {
    margin-right: 30px;
  }
  .addText {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    color: #409eff;
    font-weight: 500;
  }
}
</style>
