<template>
  <div class="data-set-dialog-wrap">
    <el-container>
      <el-main>
        <el-row
          type="flex"
          justify="space-between"
          class="title"
        >
          <el-col :span="18">
            <div class="title-data-set-name">
              数据集名称:
              <el-input v-model="dataSetName" />
            </div>
          </el-col>
          <el-col :span="6" class="title-save-close">
            <el-button @click="saveAll">保存</el-button>
            <img src="./../img/icon_off.png" alt="" @click="closeDialog">
          </el-col>
        </el-row>
        <el-row class="data-set-container" type="flex" :gutter="4">
          <el-col :span="9">
            <div class="data-model-wrap">
              <el-row type="flex" class="database-select-container" justify="space-between" align="middle">
                <div class="database-select-wrap">
                  <el-select
                    v-model="selectedDataSource"
                    filterable
                    @change="databaseSourceIdChange"
                  >
                    <el-option
                      v-for="(item) in dataSourceList"
                      :key="item.report_source_id"
                      :label="item.link_name"
                      :value="item.report_source_id"
                    />
                  </el-select>
                </div>
                <div class="database-set-icon">
                  <img src="./../img/icon_set.png" alt="">
                </div>
              </el-row>
              <el-row class="database-model-search-wrap">
                <el-col>
                  <el-input
                    v-model="inputModelName"
                    placeholder="请输入内容"
                    class="database-model-search_input"
                  >
                    <el-button
                      slot="append"
                      class="database-model-search_btn"
                      icon="el-icon-search"
                      @click="databaseModelSearch"
                    />
                  </el-input>
                </el-col>
              </el-row>
              <el-row class="database-model-list-wrap">
                <el-col>
                  <ul
                    v-infinite-scroll="loadMoreModelList"
                    v-loading="modelListLoading"
                    class="database-model-list-ul"
                    :infinite-scroll-disabled="disabled"
                    style="overflow:auto"
                  >
                    <li
                      v-for="(item,index) in modelList"
                      :key="index"
                      draggable="true"
                      class="model-item"
                      @dragstart="modelDragStart(item,$event)"
                      @dragend="modelDragEnd"
                    >
                      {{ item?item.title:'' }}
                    </li>
                    <p v-if="loading && !modelListLoading" class="tc">加载中...</p>
                    <p v-if="noMore && !modelListLoading" class="tc">没有更多了</p>
                  </ul>

                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="15">
            <el-row class="data-set-nav-title">
              <el-col class="data-set-nav">
                <div
                  v-for="(item,index) in dataSetTabHeadTabList"
                  :key="index"
                  :class="{
                    'tab-active':dataSetTabHeadTabActive === index,
                    'category-index': index === 1 && reportCategory === 2
                  }"

                  @click="dataSetTabHeadClickFun(index)"
                >
                  {{ item }}
                </div>

              </el-col>
            </el-row>
            <div v-show="dataSetTabHeadTabActive === 0" class="table-add-report">
              <el-row class="data-set-main-table">
                <el-col :span="7" class="tc main-table-title">

                  主表区域</el-col>
                <el-col :span="17">
                  <div
                    class="drag-main-table"
                    @dragover="dragOverHandler"
                    @drop="dropHandlder"
                    @dragenter="dragEnterHandler"
                    @dragleave="dragLeaveHandler"
                  >
                    <div
                      v-if="!modelDragIn"
                      class="empty-table"
                    >
                      <img src="./../img/icon_add03.png" alt="">
                      拖拽进行添加
                    </div>
                    <div v-if="modelDragIn" class="full-table-content">
                      {{ dragInTableName }}
                    </div>

                  </div>
                </el-col>

              </el-row>
              <el-row :gutter="12">
                <el-col :span="7" style="padding-right:0px;">
                  <div
                    class="contact-table-container"
                    :class="{'forbidden-childe-pointer-events': forbiddenChildePointerEvents}"
                    @dragenter="relatedDragEnterHandler"
                    @drop="relatedDropHandler"
                    @dragleave="relatedDragLeaveHandler"
                    @dragover="relatedDragOverHandler"
                  >
                    <div class="contact-table-title">
                      关联表区域
                    </div>
                    <div
                      class="contact-table-model"
                    >
                      <div class="model-list-ul">
                        <div
                          v-for="(item,index) in relatedModelList"
                          :key="index"
                          class="model-item"
                          :class="{'moel-item-active':index===contactModelItemActiveIndex}"
                          @click="contactModelItemClickFun(item,index)"
                        >
                          {{ item.title }}
                        </div>
                        <div v-if="unactiveModelItemShow" class="model-item unactive-model-item">
                          {{ unactiveModelItem && unactiveModelItem.title }}
                        </div>

                      </div>
                    </div>

                  </div>
                </el-col>
                <el-col :span="17">
                  <div class="contact-table-main">
                    <div class="contact-table-header-nav">
                      <div
                        v-for="(item,index) in dataSetTabList"
                        :key="index"
                        :class="{'table-active':index === contactTabCompShow}"
                        @click="contactTabFun(index)"
                      >{{ item }}</div>
                    </div>
                    <div class="contact-table-component-wrap">
                      <div
                        v-show="contactTabCompShow === 0"
                        class="data-field-container"

                        @click="contentClick"
                      >
                        <div
                          class="table-filed-list-input-search"
                          :tabindex="1"
                        >
                          <el-input

                            v-model="tableFiledInput"
                            clearable
                            @input="querySearch"
                            @focus.capture="querySearch"
                          />
                          <el-popover
                            v-model="visible"
                            width="345"
                            style="width:100%"
                          >
                            <el-checkbox-group v-if="tableFiledInputList.length>0" v-model="checkedFieldList">
                              <div v-for="(item,index) in tableFiledInputList" :key="index" class="table-field-item">
                                <el-checkbox :label="item.id">{{ item.field_title }}</el-checkbox>
                              </div>

                            </el-checkbox-group>
                            <div v-else>
                              暂无数据
                            </div>

                          </el-popover>

                        </div>

                        <div class="table-field-list">

                          <el-checkbox-group v-model="checkedFieldList">
                            <div v-for="(item,index) in inputFieldListArray" :key="index" class="table-field-item">
                              <el-checkbox :label="item.id">{{ item.field_title }}</el-checkbox>

                            </div>
                          </el-checkbox-group>
                        </div>

                      </div>
                      <div v-show="contactTabCompShow === 1" class="data-related-container">
                        <div class="related-container">
                          <el-row type="flex" justify="" align="middle" :gutter="20">
                            <el-col
                              :span="8"
                              class="tr"
                            >

                              关联字段
                            </el-col>
                            <el-col :span="16">
                              <el-select
                                v-model="relatedFieldSelectedValue"
                                filterable
                                placeholder="请选择"
                              >
                                <el-option
                                  v-for="item in relatedFieldOptions"
                                  :key="item.id"

                                  :label="item.field_title"
                                  :value="item.id"
                                />
                              </el-select>
                            </el-col>
                          </el-row>
                          <el-row type="flex" justify="" align="middle" :gutter="20">
                            <el-col :span="8" class="tr">
                              关联表
                            </el-col>
                            <el-col :span="16">
                              <el-select
                                v-model="relatedTableSelectedValue"
                                filterable
                                placeholder="请选择"
                                @change="relatedTableChange"
                              >
                                <el-option
                                  v-for="item in relatedTableOptions"
                                  :key="item.id"
                                  :label="item.title"
                                  :value="item.id"
                                />
                              </el-select>
                            </el-col>
                          </el-row>
                          <el-row type="flex" justify="" align="middle" :gutter="12">
                            <el-col :span="8" class="tr">
                              关联表字段
                            </el-col>
                            <el-col :span="16">
                              <el-select
                                v-model="relatedTableFieldSelectedValue"
                                filterable
                                placeholder="请选择"
                              >
                                <el-option
                                  v-for="item in relatedTableFieldOptions"
                                  :key="item.id"

                                  :label="item.field_title"
                                  :value="item.id"
                                />
                              </el-select>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col class="tc">
                              <el-button type="primary" @click="saveRelateSetting">保存</el-button>
                            </el-col>
                          </el-row>

                        </div>
                      </div>
                      <div v-show="contactTabCompShow === 2" class="data-filter-container">
                        <div class="filter-container">
                          <el-row style="margin-bottom:10px">
                            <el-col>
                              <img
                                src="./../img/icon_add.png"
                                alt=""
                                style="cursor:pointer"
                                @click="addFilterlistFun"
                              >

                            </el-col>
                          </el-row>
                          <el-row
                            v-for="(item,index) in filterTableArray"
                            :key="index"
                            :gutter="8"
                            type="flex"
                            align="middle"
                            style="margin-bottom:10px;"
                          >
                            <el-col :span="8">
                              <el-select v-model="item.fieldId">
                                <el-option
                                  v-for="(f_item,f_index) in fieldListArray"
                                  :key="f_index"
                                  :label="f_item.field_title"
                                  :value="f_item.id"
                                  filterable
                                />
                              </el-select>
                            </el-col>
                            <el-col :span="8">
                              <el-select v-model="item.search_logic">
                                <el-option
                                  v-for="(f_item,f_index) in filterQueryList"
                                  :key="f_index"
                                  :label="f_item.label"
                                  :value="f_item.value"
                                />
                              </el-select>
                            </el-col>
                            <el-col :span="6">
                              <el-input v-model="item.search_param" />
                            </el-col>
                            <el-col :span="2">
                              <i class="el-icon-circle-close" @click="delFilterlistFun(index,item)" />

                            </el-col>
                          </el-row>

                        </div>
                      </div>
                    </div>

                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-show="dataSetTabHeadTabActive === 1" class="table-sql-report">
              <el-row>
                <el-col style="margin-bottom:10px">
                  <el-input
                    v-model="SQLContent"
                    type="textarea"
                    placeholder="请输入SQL"
                    show-word-limit
                    :autosize="{ minRows: 15,maxRows:15}"
                    resize="none"
                  />

                </el-col>
                <el-col class="tr">
                  <el-button size="mini" type="default" @click="runSql">运行</el-button>
                </el-col>
              </el-row>
            </div>

          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import {
  getModelList,
  getAllFields,
  getModelField,
  addDataInfo,
  addDataInfoSql,
  getDataDetail,
  runSql,
  getDataListFun
} from '@/api/customreport'
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  name: 'DataSetDialog',
  props: {
    dataSourceList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'add'
    },
    datasetInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      state: '',
      tableFiledInput: '',
      tableFiledInputList: '',
      visible: false,

      dialogVisible: false,

      SQLContent: '',

      relatedTableFieldOptions: [],
      relatedTableOptions: [],
      relatedFieldOptions: [],
      relatedFieldSelectedValue: '',
      relatedTableSelectedValue: '',
      relatedTableFieldSelectedValue: '',

      contactModelItemActiveIndex: -1,

      checkedFieldList: [],

      fieldListObjArray: [],

      options: [{ value: '1', label: '2' }],
      value: '',

      filterTableArray: [
        { fieldId: '', search_logic: '', search_param: '' }
      ],

      delFilterTableArray: [],

      filterQueryList: [
        { label: '等于', value: '=' },
        { label: '大于', value: '>' },
        { label: '大于等于', value: '>=' },
        { label: '小于', value: '<' },
        { label: '小于等于', value: '=<' }
      ],

      // dataBaseSetModel
      selectedDataSource: '',
      inputModelName: '',
      databaseSetPage: 1,
      databaseSetPageSize: 10,
      dataSetName: '',
      loading: false,
      noMore: false,
      modelList: [],
      modelListLoading: true,

      moveModelObj: {},
      relatedModelList: [],

      dragInTableName: '',

      dragMainTable: '',

      dataSetTabHeadTabList: ['表关联模式', 'SQL模式'],
      dataSetTabHeadTabActive: 0,
      dataSetTabList: ['显示字段', '关联设置', '过滤条件'],
      contactTabCompShow: 0,
      modelDragIn: false,

      unactiveModelItemShow: false,
      unactiveModelItem: {},

      forbiddenChildePointerEvents: false,

      relatedSettingObj: {},
      searchInfoObj: {},

      editFirstLoading: true

    }
  },
  computed: {
    ...mapState({ // 获取layout数据
      layoutdata: state => state.reportDesign.layoutdata,
      reportType: state => state.reportDesign.reportType, // 默认form // 预览及设计区域报表类型（目前分表单型form、填报型excel） // 在选中左侧报表时 或者 添加时改变其值
      reportId: state => state.reportDesign.reportId, // 报表id
      dataId: state => state.reportDesign.dataId, // 数据集id
      reportCategory: state => state.reportDesign.reportCategory // 类型
    }),

    disabled() {
      return this.loading || this.noMore
    },
    fieldListArray() {
      const arr = []
      _.each(this.fieldListObjArray, (item, index) => {
        _.each(item.field_list, (v, i) => {
          arr.push(v)
        })
      })
      return arr
    },
    inputFieldListArray() {
      const queryString = this.tableFiledInput
      var restaurants = this.fieldListArray
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      return results
    }
  },

  created() {
    if (this.type === 'edit') {
      const info = this.datasetInfo.data_info
      this.dataSetName = info.data_name
      this.selectedDataSource = info.data_resource_id
      if (info.type === 1) {
        // 表管理
        this.modelDragIn = true
        this.dragInTableName = info.main_table_name
        // const id = info.main_table_id
        info.id = info.main_table_id
        info.title = info.main_table_name
        this.dragMainTable = info
        this.getModelField(info)
        this.getDataFilterDetail(info.data_id)
        this.databaseSourceIdChange()
      }
      if (info.type === 2) {
        // sql管理
        this.dataSetTabHeadTabActive = 1
        this.getDataListFun(info.data_id)
      }
    }
    // this.getModelList(24)
  },
  methods: {
    contentClick() {
      // console.log('content')
    },

    handleSelect() {
      return false
    },

    querySearch() {
      const queryString = this.tableFiledInput
      var restaurants = this.fieldListArray
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      this.tableFiledInputList = results

      // this.visible = !!this.tableFiledInput

      // cb(results)
    },
    createFilter(queryString) {
      // console.log(queryString)
      return (restaurant) => {
        // console.log(restaurant)
        return (restaurant.field_title.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },

    getDataListFun(dataId) {
      getDataListFun({
        dataId
      }).then(res => {
        if (res.state === 2000) {
          this.SQLContent = res.data.dataSql
        }
      })
    },
    runSql() {
      if (!this.selectedDataSource) {
        this.$message.error('选择一个数据源吧')
        return
      }
      if (!this.SQLContent) {
        this.$message.error('请输入SQL语句')
        return
      }
      runSql({
        dataResourceId: this.selectedDataSource,
        dataSql: this.SQLContent
      }).then(res => {
        if (res.state === 2000) {
          this.$message.success('运行成功')
          return
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getDataFilterDetail(dataId) {
      // dataId = 156
      getDataDetail({ dataId }).then(res => {
        if (res.state === 2000) {
          this.filterTableArray = []
          _.each(res.data, (item, index) => {
            this.filterTableArray.push({
              dataSfId: item.searchId,
              fieldId: item.fieldId,
              search_logic: item.logic.key,
              search_param: item.search_param })
          })
        }
      })
    },
    edtiGetAllFields(dataId) {
      // dataId = 156
      dataId = this.datasetInfo.data_info.data_id
      getAllFields({
        dataId
      }).then(res => {
        if (res.state === 2000) {
          // this.relatedModelList = res.data
          _.each(res.data, (item, index) => {
            if (item.type === 'join') {
              this.relatedModelList.push(item)
              this.relatedSettingObj[item.id] = {
                'joinTableId': item.jc_table_id,
                'joinFieldId': item.jc_table_field_id,
                'mainTableId': item.jc_main_table_id,
                'mainFieldId': item.jc_main_table_field_id
              }
              item.field_list = item.childre
              this.fieldListObjArray.push(item)
            }
            _.each(item.children, (value, i) => {
              if (value.isShow) {
                this.checkedFieldList.push(value.id)
              }
              if (!value.id) {
                // console.log('1')
              }
              // this.fieldListArray.push(value)
            })
          })
          this.editFirstLoading = false
        }
      })
    },
    contactModelItemClickFun(item, index) {
      this.contactModelItemActiveIndex = index
      this.relatedFieldSelectedValue = ''
      this.relatedTableSelectedValue = ''
      this.relatedTableFieldSelectedValue = ''
      this.relatedTableFieldOptions = []
      this.relatedTableOptions = []
      this.relatedFieldOptions = []
      this.relatedSetting()
    },
    saveRelateSetting() {
      if (this.contactModelItemActiveIndex === -1) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '请选择关联表'
        })
        return
      }
      const relatedMainTableId = this.fieldListObjArray[this.contactModelItemActiveIndex + 1].id
      this.relatedSettingObj[relatedMainTableId] = {
        'joinTableId': relatedMainTableId,
        'joinFieldId': this.relatedFieldSelectedValue,
        'mainTableId': this.relatedTableSelectedValue,
        'mainFieldId': this.relatedTableFieldSelectedValue
      }
      this.$message({
        type: 'success',
        showClose: true,
        message: '关联设置保存成功'
      })
    },
    getModelField(model, type) {
      const obj = {
        modelId: model.id
      }
      getModelField(obj).then(res => {
        if (res.state === 2000) {
          // this.fieldListArray = this.fieldListArray.concat(res.data.data)
          const modelobj = Object.assign({}, model)
          modelobj.field_list = res.data.data
          if (type === 'main_table') {
            if (this.fieldListObjArray.length > 0 && modelobj.id !== this.fieldListObjArray[0].id) {
              this.$set(this.fieldListObjArray, 0, modelobj)
            } else {
              this.fieldListObjArray.push(modelobj)
            }
          } else {
            this.fieldListObjArray.push(modelobj)
          }
          if (this.type === 'edit' && this.editFirstLoading) {
            this.edtiGetAllFields()
          }
        }
      })
    },
    contactTabFun(index) {
      this.contactTabCompShow = index
      if (index === 1) {
        if (this.contactModelItemActiveIndex === -1) {
          return
        } else {
          // this.fieldListObjArray
          this.relatedSetting()
        }
      }
    },
    relatedSetting() {
      // this.fieldListObjArray
      const nowTable = this.fieldListObjArray[this.contactModelItemActiveIndex + 1]
      if (nowTable) {
        this.relatedFieldOptions = nowTable.field_list
        this.relatedTableOptions = this.fieldListObjArray.slice(0, this.contactModelItemActiveIndex + 1)
      }

      // 如果存在的话

      if (this.relatedSettingObj[nowTable.id]) {
        const reletedObj = this.relatedSettingObj[nowTable.id]
        this.relatedFieldSelectedValue = reletedObj['joinFieldId']
        this.relatedTableSelectedValue = reletedObj['mainTableId']
        this.relatedTableChange()
        this.relatedTableFieldSelectedValue = reletedObj['mainFieldId']
      }
    },
    relatedTableChange() {
      const table = this.relatedTableOptions.find((item) => {
        return item.id === this.relatedTableSelectedValue
      })

      this.relatedTableFieldOptions = table.field_list
      // this.relatedTableFieldOptions = item.field_list
    },

    modelDragStart(item, event) {
      // e.dataTransfer.setData('test', '111')

      this.moveModelObj = item
    },
    modelDragEnd() {
      // console.log('end')
    },
    dragOverHandler(e) {
      e.preventDefault()
      // // console.log(2)
    },
    dragEnterHandler(e) {
      this.modelDragIn = true
      e.preventDefault()
      this.dragInTableName = this.moveModelObj.title
    },
    dragLeaveHandler(e) {
      e.preventDefault()
      this.modelDragIn = false
    },
    dropHandlder(e) {
      e.preventDefault()
      this.dragMainTable = this.moveModelObj
      this.getModelField(this.moveModelObj, 'main_table')
      // filedsList
      // this.getAllFields()
      // this.getModelList(24)
    },
    // 关联表相关拖拽
    relatedDragEnterHandler(e) {
      e.preventDefault()
      this.forbiddenChildePointerEvents = true
      this.unactiveModelItemShow = true
      this.unactiveModelItem = this.moveModelObj
    },
    relatedDropHandler(e) {
      e.preventDefault()

      if (!this.modelDragIn) {
        this.$alert('请先拖拽主表', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.forbiddenChildePointerEvents = false
            this.unactiveModelItemShow = false
            this.unactiveModelItem = {}
          }
        })
        return
      }
      if (this.reportCategory === 2) {
        this.$alert('填报型暂不允许关联表', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.forbiddenChildePointerEvents = false
            this.unactiveModelItemShow = false
            this.unactiveModelItem = {}
          }
        })
        return
      }

      if (this.relatedModelList.indexOf(this.moveModelObj) === -1) {
        this.relatedModelList.push(this.moveModelObj)

        this.getModelField(this.moveModelObj)
      }
      this.forbiddenChildePointerEvents = false
      this.unactiveModelItemShow = false
      this.unactiveModelItem = {}
    },
    relatedDragLeaveHandler(e) {
      e.preventDefault()
      this.forbiddenChildePointerEvents = false
      this.unactiveModelItemShow = false
      this.unactiveModelItem = {}
    },
    relatedDragOverHandler(e) {
      e.preventDefault()
    },

    databaseModelSearch() {
      this.noMore = false
      this.loading = true
      const page = 1
      const sourceId = this.selectedDataSource
      const inputModelName = this.inputModelName
      this.modelListLoading = true
      this.modelList = []
      this.getModelList(sourceId, page, 10, inputModelName)
    },
    databaseSourceIdChange() {
      this.noMore = false
      this.loading = true
      const page = 1
      const sourceId = this.selectedDataSource
      const inputModelName = this.inputModelName
      this.modelListLoading = true
      this.modelList = []

      this.relatedTableFieldOptions = []
      this.relatedTableOptions = []
      this.relatedFieldOptions = []

      this.relatedModelList = []
      // this.fieldListArray = []
      this.fieldListObjArray = []
      this.relatedSettingObj = {}
      this.searchInfoObj = {}
      this.getModelList(sourceId, page, 10, inputModelName)
    },

    loadMoreModelList() {
      this.loading = true
      const page = Number(this.databaseSetPage) + 1
      const sourceId = this.selectedDataSource
      const modelName = this.inputModelName
      this.getModelList(sourceId, page, modelName, 10)
    },

    dataSetTabHeadClickFun(index) {
      if (this.reportCategory === 2) {
        return
      }
      this.dataSetTabHeadTabActive = index
    },

    addFilterlistFun() {
      this.filterTableArray.push(
        { filterId: '', search_logic: '', search_param: '' }
      )
    },
    delFilterlistFun(index, item) {
      if (item.dataSfId) {
        this.delFilterTableArray.push(item.dataSfId)
      }
      this.filterTableArray.splice(index, 1)
    },
    // getAllFields() {
    //   const obj = {
    //     dataId: 156
    //   }
    //   getAllFields(obj).then(res => {
    //     // console.log(res)
    //     const tableArray = []

    //     if (res.state === 2000) {
    //       // 参数请求成功
    //       const result = res.data

    //       _.each(result, (value, key) => {
    //         if (result.children) {
    //           _.each(value.children, (item, index) => {
    //             tableArray.push(item)
    //           })
    //         }
    //       })

    //       this.dataReletedTable = result
    //       this.dataReletedFieldArray = tableArray
    //     }
    //   })
    // },
    saveBySql() {},
    saveByTable() {},
    saveAll() {
      const allDataObj = {}
      // // console.log(this.reportId)
      allDataObj.reportId = this.reportId
      // allDataObj.reportId = 156
      allDataObj.type = this.type
      if (this.type === 'edit') {
        allDataObj.dataId = this.datasetInfo.data_info.data_id || ''
      }
      if (this.dataSetTabHeadTabActive === 0) {
        allDataObj.dataName = this.dataSetName
        allDataObj.dataResourceId = this.selectedDataSource
        allDataObj.mainTableId = this.dragMainTable.id
        allDataObj.joinArr = []
        const joinArr = {}
        _.each(this.relatedModelList, (item, index) => {
          if (this.relatedSettingObj[item.id]) {
            joinArr[index] = this.relatedSettingObj[item.id]
          }
        })

        allDataObj.joinArr = joinArr
        const searchInfoObj = {}
        _.each(this.filterTableArray, (item, index) => {
          searchInfoObj[index] = item
        })
        allDataObj.searchInfo = searchInfoObj
        // console.log(this.delFilterTableArray)
        allDataObj.delSearch = this.delFilterTableArray.join()

        allDataObj.fieldIds = this.checkedFieldList.join()
        addDataInfo(allDataObj).then(res => {
          if (res.state !== 2000) {
            this.$alert(res.message, 'tips', {
              confirmButtonText: '确定',
              callback: action => {
                // this.$emit('closeDialog')
                // this.forbiddenChildePointerEvents = false
                // this.unactiveModelItemShow = false
                // this.unactiveModelItem = {}
              }
            })
          }
          if (res.state === 2000) {
            this.$alert(res.message, 'tips', {
              confirmButtonText: '确定',
              callback: action => {
                // console.log()
                this.$emit('closeDialog')
                // this.forbiddenChildePointerEvents = false
                // this.unactiveModelItemShow = false
                // this.unactiveModelItem = {}
              }
            })
          }
        })
      } else {
        allDataObj.dataName = this.dataSetName
        allDataObj.dataResourceId = this.selectedDataSource
        allDataObj.dataSql = this.SQLContent

        addDataInfoSql(allDataObj).then(res => {
          // console.log(res)
          if (res.state !== 2000) {
            this.$alert(res.message, 'tips', {
              confirmButtonText: '确定',
              callback: action => {
                // this.$emit('closeDialog')
                // this.forbiddenChildePointerEvents = false
                // this.unactiveModelItemShow = false
                // this.unactiveModelItem = {}
              }
            })
          }
          if (res.state === 2000) {
            this.$alert(res.message, 'tips', {
              confirmButtonText: '确定',
              callback: action => {
                this.$emit('closeDialog')
                // this.forbiddenChildePointerEvents = false
                // this.unactiveModelItemShow = false
                // this.unactiveModelItem = {}
              }
            })
          }
        })
      }
      // allDataObj.dataId =
    },
    getModelList(sourceId, nowpage, pageSize, modelName) {
      const obj = {
        report_source_id: sourceId,
        nowpage,
        pageSize,
        modelName,
        report_category: this.reportCategory
      }
      getModelList(obj).then(res => {
        if (res.state === 2000) {
          this.loading = false
          const result = res.data
          if (Number(result.nowpage) > result.totalPage || (result.data && result.data.length < nowpage)) {
            this.noMore = true
          }

          this.databaseSetPage = result.nowpage
          if (res.data.data && res.data.data.length > 0) {
            this.modelList = this.modelList.concat(res.data.data)
          }
          this.modelListLoading = false
        }
      })
    },
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.forbidden-childe-pointer-events{
  * {
    pointer-events: none;
  }

}
  .data-set-dialog-wrap{
    background: #FAFBFC;
    box-shadow: 0 2px 10px 0 #CCCCCC;
    border-radius: 4px;
    width:960px;
    height:600px;
  }
  .el-container{
    padding:16px 18px;
  }
  .title{
    padding-bottom:20px;
    border-bottom:1px solid  #F0F0F0;
    .title-data-set-name{
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #333333;
      font-weight:bold;
    }
    .el-input{
      width:480px;
    }
    .title-save-close{
      display:flex;
      align-items:center;
      justify-content:flex-end;
      img{
        margin-left:36px;
        cursor:pointer;
      }
    }
  }
  .data-set-container{

    padding-top:18px;
    .data-model-wrap{
      padding:37px 22px 0 26px;
      background: #FFFFFF;
      border: 1px solid #CCCCCC;
      border-radius: 4px;
      height:451px;
      .database-select-container{
        padding-bottom:20px;
        border-bottom:1px solid #f0f0f0;
      }
      .database-select-wrap{
        flex-grow:1;

        .el-select{
          width:100%;
        }
      }
      .database-set-icon{
        margin-left:14px;
        cursor:pointer;

      }
      .database-model-search-wrap{
        padding:20px 0;
        border-bottom:1px solid #f0f0f0;
        .database-model-search_input{
          /deep/ .el-input__inner{
            border-right-width:0;
            &:focus{
              border-right-width:1px;
            }
          }

        }
        .database-model-search_btn{
          border:none;
          background-color:#fff;
        }
      }
    }
  }
  .data-set-nav-title{
    margin-bottom:16px;
    .data-set-nav{
      display:flex;
      border-bottom:1px solid #F0F0F0;
      >div{
        cursor:pointer;
        padding:16px 0px;
        margin-left:18px ;
        margin-right:18px;
        &.tab-active{
          border-bottom:2px solid #35B9F9;
        }
        &.category-index{
         opacity: 0.3;
        cursor: not-allowed;

        }
      }
    }
  }
  .data-set-main-table{
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    padding:5px 12px;
    box-sizing:border-box;
    margin-bottom:4px;
    .main-table-title{
      text-align:center;
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #333333;
      font-weight:bold;
      height:60px;
      line-height:60px;
    }
    .drag-main-table{
      height:60px;
      border: 1px dashed #CCCCCC;
      box-sizing:border-box;
      text-align:center;
      display:flex;
      justify-content:center;
      align-items:center;
      .empty-table{
        font-size: 12px;
        color: #CCCCCC;
        img{
          vertical-align:middle;
        }
      }
      .full-table-content{
        font-size:12px;
        color:#ccc;
      }

    }

  }

  .database-model-list-wrap{
    .database-model-list-ul{
      @include scrollBar;
      height:252px;
      margin-left:-26px;
      margin-right:-22px;
      .model-item{
        cursor:pointer;
        height:36px;
        line-height:36px;
        // background:#000fff;

        padding-left:50px;
        background-image:url('./../img/icon_model02.png');
        background-repeat:no-repeat;
        background-position: 25px 10px;
        &:hover{
          background-image:url('./../img/icon_model01.png');
          background-color:#35B9F9;
        }
      }
    }
  }
  .contact-table-container{
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    padding:0 7.5px;
    height:304px;
    .contact-table-title{
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #333333;
      font-weight:bold;
      padding-top:15px;
      padding-bottom:18px;
      border-bottom:1px solid #f0f0f0;
      text-align:center;
    }
    .contact-table-model{
      height:250px;
    }
    .model-list-ul{
      @include scrollBar;
      padding:20px 4px;
      height:100%;
      overflow:auto;
      .model-item{
        // background: #35B9F9;
        border-radius: 2px;
        margin-bottom:8px;
        min-height:28px;
        line-height:28px;
        cursor:pointer;
        background-image:url('./../img/icon_model02.png');
        background-repeat:no-repeat;
        background-position:5px 5px;
        padding-left: 28px;
        img{
          vertical-align:middle;
        }
        &:hover,
        &.moel-item-active
        {
          background-color: #35B9F9;
          color:#fff;
          background-image:url('./../img/icon_model01.png');
        }
        &.unactive-model-item{
          color:#ccc;
        }
      }
    }
  }
  .contact-table-main{
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
    border-radius: 6px;
    border-radius: 4px;
    padding:0 16px;
    height:304px;

    .contact-table-header-nav{
      border-bottom:1px solid #f0f0f0;
      display:flex;
      >div{
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #333333;
        font-weight:bold;
        padding:15px 0px;
        flex-grow:1;
        text-align:center;
        cursor:pointer;
        &.table-active{
          border-bottom:2px solid #35B9F9;
        }
      }
    }
  }
  .data-field-container{
    .table-field-list{
      @include scrollBar;
      height:214px;
      box-sizing:border-box;
      overflow:auto;
      padding:12px 12px;

    }
  }
  .table-field-item{
      margin-bottom:16px;
      .el-checkbox{
        color:#666;
      }
  }

  .related-container{
    padding-top:20px;
    .el-row{
      margin-bottom:8px;
    }
  }
  .filter-container{
    padding-top:20px;
  }

</style>
