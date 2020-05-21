<template>
  <div class="design-content" @dragover.prevent>
    <div class="reportTitle">
      <el-input v-model="formTitle" :placeholder="titlePlaceholder" />
      <hr>
    </div>
    <div v-if="reportType === 'form'" ref="layout" class="layout-container">
      <div class="gutter-example">
        <table>
          <tr v-for="(item, index) in row" :key="'gutter' + index">
            <td v-for="(list, i) in 12" :key="'row' + i" :class="['gutter-box', {'lpc-gutter-bg': viewType !== 'look'}]" />
          </tr>
        </table>
      </div>
      <div class="lpc-canvas" @drop="drop($event, 'form')">
        <template>
          <el-form>
            <grid-layout
              :layout.sync="layout.layoutForm"
              :col-num="layoutColNum"
              :row-height="25"
              :is-draggable="draggableOrResize"
              :is-resizable="draggableOrResize"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[2, 2]"
              :use-css-transforms="true"
              @layout-updated="layoutUpdatedEvent"
              @layout-ready="layoutReadyEvent"
            >
              <grid-item
                v-for="(item, index) in layout.layoutForm"
                :key="'grid' + index"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :min-h="2"
                :min-w="4"
                class="grid-item"
                @resize="resizeEvent"
                @moved="movedEvent"
              >
                <div class="item-content" :class="item.addClass ? 'item-addClass' : ''" @click="onclickGridItem($event, index, 'form')">
                  <span class="delectIcon" @click.stop="onclickDelete($event, index, 'form')"><i class="el-icon-close" /></span>
                  <div class="item-form">
                    <el-form-item :label="item.title" :label-width="item.labelWidth + 'px'">
                      <template v-if="item.col_type === 'input'">
                        <el-input :placeholder="item.placeholder" :style="'width:' + item.width" />
                      </template>
                      <template v-if="item.col_type === 'textarea'">
                        <el-input type="textarea" :placeholder="item.placeholder" :style="'width:' + item.width" />
                      </template>
                      <template v-if="item.col_type === 'select' || item.col_type === 'multiple' || item.col_type === 'filterable' || item.col_type === 'filterables'">
                        <el-select value="" :placeholder="item.placeholder" :style="'width:' + item.width">
                          <el-option value="0" label="请选择" />
                        </el-select>
                      </template>
                      <template v-if="item.col_type === 'dateTime'">
                        <el-date-picker
                          value=""
                          type="datetime"
                          :placeholder="item.placeholder"
                          default-time="12:00:00"
                          :style="'width:' + item.width"
                        />
                      </template>
                      <template v-if="item.col_type === 'date'">
                        <el-date-picker
                          value=""
                          type="date"
                          :placeholder="item.placeholder"
                          :style="'width:' + item.width"
                        />
                      </template>
                      <template v-if="item.col_type === 'daterange'">
                        <el-date-picker
                          value=""
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                        />
                      </template>
                      <template v-if="item.col_type === 'time'">
                        <el-time-select
                          value=""
                          :placeholder="item.placeholder"
                          :style="'width:' + item.width"
                        />
                      </template>
                      <template v-if="item.col_type === 'radio'">
                        <el-radio-group v-model="item.extraValue">
                          <el-radio v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-radio>
                        </el-radio-group>
                      </template>
                      <template v-if="item.col_type === 'checkbox'">
                        <el-checkbox-group v-model="item.checkboxExtraValue">
                          <el-checkbox v-for="(list, ind) in item.extra" :key="ind" :label="list.id" :class="item.radioOrcheckboxView !== 'inlineBlock' ? 'block' : ''">{{ list.name }}</el-checkbox>
                        </el-checkbox-group>
                      </template>
                      <template v-if="item.col_type === 'number'">
                        <el-input-number v-model="item.numberValue" controls-position="right" :step="item.numberStep" :min="item.numberMin" :max="item.numberMax" :style="'width:' + item.width" />
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </grid-item>
            </grid-layout>
          </el-form>
        </template>
      </div>
    </div>
    <!-- 列表型 -->
    <div v-if="reportType === 'excel'" class="table-layout-container">
      <!-- 列表型 头部筛选start -->
      <div class="table-content-header">
        <div class="table-gutter-example-header">
          <table class="filter-header-example">
            <tr v-for="(item, index) in filterRow" :key="'gutter' + index">
              <td v-for="(list, i) in 12" :key="'row' + i" :class="['gutter-box', {'lpc-gutter-bg': viewType !== 'look'}]" />
            </tr>
          </table>
        </div>
        <div class="table-header-lpc-canvas" @drop="drop($event, 'filter')">
          <el-form :label-position="labelPosition">
            <grid-layout
              :layout.sync="layoutdata.layoutFilter"
              :col-num="layoutColNum"
              :row-height="25"
              :is-draggable="draggableOrResize"
              :is-resizable="draggableOrResize"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[2, 2]"
              :use-css-transforms="true"
              @layout-updated="layoutFilterUpdatedEvent"
              @layout-ready="layoutFilterReadyEvent"
            >
              <grid-item
                v-for="(item, index) in layoutdata.layoutFilter"
                :key="'grid' + index"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :min-h="2"
                :min-w="2"
                class="grid-item"
              >
                <div class="item-content" :class="item.addClass ? 'item-addClass' : ''" @click="onclickGridItem($event, index, 'tableFilter')">
                  <span class="delectIcon" @click.stop="onclickDelete($event, index, 'tableFilter')"><i class="el-icon-close" /></span>
                  <div class="item-form">
                    <el-form-item>
                      <template v-if="item.col_type === 'input'">
                        <el-input :placeholder="item.placeholder" :style="'width:' + item.width" />
                      </template>
                      <template v-if="item.col_type === 'textarea'">
                        <el-input type="textarea" :placeholder="item.placeholder" :style="'width:' + item.width" />
                      </template>
                      <template v-if="item.col_type === 'select' || item.col_type === 'multiple' || item.col_type === 'filterable' || item.col_type === 'filterables'">
                        <el-select value="" :placeholder="item.placeholder" :style="'width:' + item.width">
                          <el-option value="0" label="请选择" />
                        </el-select>
                      </template>
                      <template v-if="item.col_type === 'dateTime'">
                        <el-date-picker
                          value=""
                          type="datetime"
                          :placeholder="item.placeholder"
                          default-time="12:00:00"
                          :style="'width:' + item.width"
                        />
                      </template>
                      <template v-if="item.col_type === 'date'">
                        <el-date-picker
                          value=""
                          type="date"
                          :placeholder="item.placeholder"
                          :style="'width:' + item.width"
                        />
                      </template>
                      <template v-if="item.col_type === 'daterange'">
                        <el-date-picker
                          value=""
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                        />
                      </template>
                      <template v-if="item.col_type === 'time'">
                        <el-time-select
                          value=""
                          :placeholder="item.placeholder"
                          :style="'width:' + item.width"
                        />
                      </template>
                      <template v-if="item.col_type === 'radio'" />
                      <template v-if="item.col_type === 'checkbox'" />
                      <template v-if="item.col_type === 'number'">
                        <el-input-number controls-position="right" :step="item.step" :min="item.min" :max="item.max" :value="item.value" :style="'width:' + item.width" />
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </grid-item>
            </grid-layout>
          </el-form>
        </div>
      </div>
      <!-- 列表型 头部筛选end -->
      <!-- 中间操作按钮模块 -->
      <div class="footer-button-container">
        <template>
          <el-checkbox v-for="(item, ind) in layoutdata.checkList" :key="ind" v-model="item.checked" :label="item.label" @change="checkListChange($event, ind)">{{ item.name }}</el-checkbox>
        </template>
      </div>
      <!-- 列表型 列表表格start -->
      <div class="table-content">
        <div class="table-content-example">
          <table>
            <tr v-for="(item, index) in tableRow" :key="'gutter' + index">
              <td v-for="(list, i) in 12" :key="'row' + i" :class="['gutter-box', {'lpc-gutter-bg': viewType !== 'look'}]" />
            </tr>
          </table>
        </div>
        <div class="table-lpc-canvas" @drop="drop($event, 'table')">
          <grid-layout
            :layout.sync="layoutdata.layoutTable"
            :col-num="layoutColNum"
            :row-height="25"
            :is-draggable="draggableOrResize"
            :is-resizable="false"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[2, 2]"
            :use-css-transforms="true"
            @layout-updated="layoutTableUpdatedEvent"
            @layout-ready="layoutTableReadyEvent"
          >
            <grid-item
              v-for="(item, index) in layoutdata.layoutTable"
              :key="'grid' + index"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :min-h="2"
              :min-w="2"
              class="grid-item"
            >
              <div class="item-content" :class="item.addClass ? 'item-addClass' : ''" @click="onclickGridItem($event, index, 'table')">
                <span class="delectIcon" @click.stop="onclickDelete($event, index, 'table')"><i class="el-icon-close" /></span>
                <div class="item-form">
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </grid-item>
          </grid-layout>
        </div>
      </div>
      <!-- 列表型 列表表格end -->
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import VueGridLayout from 'vue-grid-layout'
import { mapState } from 'vuex'
import { getReportDetailInfoNew } from '@/api/api'
export default {
  name: 'Designcontent',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {
    /* layoutdata: {
      default: () => {},
      type: Object
    }, */
    addDesign: {
      type: Number,
      default: 0
    }
    /* reportType: {
      type: String,
      default: ''
    } */
  },
  data() {
    return {
      formTitle: '', // 标题
      titlePlaceholder: '请填写表单标题', // 标题框placeholder,根据填报型，列表型切换
      row: 0, // 多少行
      rowFlag: 0, // 行标识
      x: 0,
      y: 0, // 新增时的起始坐标
      moduleId: '0', // 每个模块的id，必须值且要求唯一
      viewType: 'add', // 区分新增编辑or查看
      layout: {
        layoutForm: []
      },
      layoutdata: {
        layoutFilter: [],
        layoutTable: [],
        checkList: [
          { name: '新增', label: 'add', checked: false, permissions: false, address: '' },
          { name: '编辑', label: 'edit', checked: false, permissions: false, address: '' },
          { name: '删除', label: 'delete', checked: false, permissions: false, address: '' },
          { name: '导出', label: 'export', checked: false, permissions: false, address: '' }
        ]
      },
      layoutMap: [], // 布局二维数组地图
      layoutFilterMap: [], // 布局二维数组地图
      layoutTableMap: [], // 布局二维数组地图
      // 布局列数
      layoutColNum: 12,
      draggableOrResize: true, // 配置是否可拖拽，放大缩小
      labelPosition: 'right' // 表单标签对其方式，可通过右侧配置栏修改
    }
  },
  computed: {
    ...mapState({ // 获取实时变化的选中项及标识
      designLayoutdata: state => state.reportDesign.layoutdata, // 整体所有数据，虽请求，但新增模块或编辑时需要实时更新
      formConfig: state => state.reportDesign.reportItem, // 选中项
      itemIndex: state => state.reportDesign.itemIndex, // 选中项标识
      layoutType: state => state.reportDesign.layoutType, // 用来区分是form、 tableFilter、table
      reportType: state => state.reportDesign.reportType, // 默认form // 预览及设计区域报表类型（目前分表单型form、填报型excel） // 在选中左侧报表时 或者 添加时改变其值
      reportId: state => state.reportDesign.reportId,
      dataId: state => state.reportDesign.dataId, // 数据集id
      tableId: state => state.reportDesign.tableId // table_id
    }),
    filterRow: function() {
      return Math.ceil(this.row / 2)
    },
    tableRow: function() {
      return Math.ceil(this.row / 2)
    }
  },
  watch: {
    designLayoutdata: {
      handler(n, o) {
        console.log('jinjinjinjinjindesignLayoutdata')
        console.log(this.designLayoutdata)
        /* 根据不同类型赋值 */
        if (this.reportType === 'form') {
          this.layout = JSON.parse(JSON.stringify(this.designLayoutdata))
        } else if (this.reportType === 'excel') {
          this.layoutdata = JSON.parse(JSON.stringify(this.designLayoutdata))
        }
      }
      /* deep: true,
      immediate: true */
    },
    formTitle: { // 监听标题变化，区分 赋值列表型和填报型标题
      handler(n, o) {
        if (n !== o) {
          if (this.reportType === 'form') {
            this.layout.formTitle = this.formTitle
            this.$store.commit('reportDesign/LAYOUT_DATA', this.layout) // 在改变配置属性之后将其存入store
          } else if (this.reportType === 'excel') {
            this.layoutdata.formTitle = this.formTitle
            this.$store.commit('reportDesign/LAYOUT_DATA', this.layoutdata) // 在改变配置属性之后将其存入store
          }
        }
      }
    },
    reportType: {
      handler(n, o) {
        this.reportType === 'form' ? this.titlePlaceholder = '请填写表单标题' : this.titlePlaceholder = '请填写报表标题' // 判断标题框placeholder内容
      }
    },
    reportId: { // 监听state中的reportId，当这个ID变化时才重新请求设计区域数据
      handler(n, o) {
        this.getReportData(this.reportId)
      }
    }
  },
  created() {},
  mounted() {
    const clientHeight = document.body.offsetHeight - 266 // 286
    this.row = Math.ceil(clientHeight / 27) // 多少行
    this.rowFlag = this.row // 行标识
    window.onresize = () => { // 窗口变化时
      const clientHeight = document.body.offsetHeight - 266
      this.row = Math.ceil(clientHeight / 27) // 向上取整
      this.rowFlag = this.row
    }
  },
  methods: {
    drop(e, type) { // 填报型拖拽结束事件捕获
      console.log('jinru' + this.dataId)
      const dataSetInfo = JSON.parse(e.dataTransfer.getData('data-set-info'))
      const nodeInfo = JSON.parse(e.dataTransfer.getData('node-info'))
      console.log(dataSetInfo)
      let layoutLength = []
      console.log(this.dataId + 'mmmmmm' + dataSetInfo.data_info.data_id)
      console.log(this.tableId + 'kkkkkk' + nodeInfo.table_id)
      if (this.dataId === '' || +this.dataId === dataSetInfo.data_info.data_id) { // this.dataId为空就是新拖拽。this.dataId 比较就是 新拖拽与以往对比，相同才可往下执行
        // if (this.tableId === '' || +this.tableId === nodeInfo.table_id) {
        let flag = false
        if (type === 'form') { // 根据传入的不同类型，赋值不同数据，及不同模块大小
          layoutLength = JSON.parse(JSON.stringify(this.layout.layoutForm))
        } else if (type === 'filter') {
          layoutLength = JSON.parse(JSON.stringify(this.layoutdata.layoutFilter))
        } else if (type === 'table') {
          layoutLength = JSON.parse(JSON.stringify(this.layoutdata.layoutTable))
        }
        layoutLength.map((list, ind) => { // 遍历不同模块内容，判断是否是同一个字段
          if (nodeInfo.data_col_id === list.dataColFieldId) {
            flag = true
          }
        })
        if (flag) {
          this.$message.error('同一个数据表不能拖拽两次')
          return false
        }
        this.$store.commit('reportDesign/DATAID', dataSetInfo.data_info.data_id) // 存储最新当前的数据集id
        this.$store.commit('reportDesign/TABLEID', nodeInfo.table_id) // 存储最新table_id
        this.calculateData(nodeInfo, type)
        /* } else {
          this.$message.error('数据表不同不能添加，请添加相同数据表')
        } */
      } else {
        this.$message.error('只能拖拽同一数据集下数据表')
      }
    },
    getMakingDataFun() {
      // 调用此方法验证表单数据和获取表单数据
      this.$refs.makingform.getData().then(data => {
        // 数据校验成功
        // data 为获取的表单数据
      }).catch(e => {
        // 数据校验失败
      })
    },
    /* 拖拽等事件start */
    layoutUpdatedEvent(newLayout) { // form 拖拽后更新
      console.log('整体布局更新Updated layout: ', newLayout)
      this.howMany(newLayout, 'form') // 传递当前剩下的所有数据
      this.dataNewSortingFun(newLayout, 'form') // 重新排序数据顺序
      // 当插件内容布局发生变化后  获取现在的二维地图树
      // this.layoutMap = this.genereatePlaneArr(this.layout.layoutForm)
    },
    layoutFilterUpdatedEvent(newLayout) { // excel列表型filter拖拽后更新
      this.howMany(newLayout, 'tableFilter') // 传递当前剩下的所有数据
      this.dataNewSortingFun(newLayout, 'tableFilter') // 重新排序数据顺序
      // 当插件内容布局发生变化后  获取现在的二维地图树
      // this.layoutFilterMap = this.genereatePlaneArr(this.layoutdata.layoutFilter)
    },
    layoutTableUpdatedEvent(newLayout) { // excel列表型table拖拽后更新
      this.howMany(newLayout, 'table') // 传递当前剩下的所有数据
      this.dataNewSortingFun(newLayout, 'table') // 重新排序数据顺序
      // 当插件内容布局发生变化后  获取现在的二维地图树
      // this.layoutFilterMap = this.genereatePlaneArr(this.layoutdata.layoutTable)
    },
    resizeEvent(i, newH, newW, newHPx, newWPx) { // 改变大小结束
      console.log('123')
    },
    movedEvent: function(i, newX, newY) {
      console.log('单个模块拖拽结束后')
    },
    /* 拖拽事件end */

    dataNewSortingFun(newData, type) { // 因拖拽完，布局会变，数据顺序不变，所以每次拖拽完都更新数据的排序
      if (!newData.length) return
      if (type === 'form') {
        newData.sort(function(a, b) {
          return a.y - b.y
        })
        this.layout.layoutForm = newData
        this.$store.commit('reportDesign/LAYOUT_DATA', this.layout) // 在数据更新顺序后保存
      } else {
        newData.sort(function(a, b) { // 排序，先根据y的大小排序，如果y相同就按x的大小排序
          if (a['y'] === b['y']) {
            if (a['x'] > b['x']) {
              return 1
            } else if (a['x'] < b['x']) {
              return -1
            } else {
              return 0
            }
          } else {
            if (a['y'] > b['y']) {
              return 1
            } else {
              return -1
            }
          }
        })
        if (type === 'tableFilter') {
          console.log('tableFilter')
          this.layoutdata.layoutFilter = newData
        } else if (type === 'table') {
          console.log('table')
          this.layoutdata.layoutTable = newData
        }
        this.$store.commit('reportDesign/LAYOUT_DATA', this.layoutdata) // 在数据更新顺序后保存
      }
    },
    howMany(newData, type) { // 每次拖拽后计算页面及设计区域高度渲染行等
      console.log('jintuozhuai')
      let maxy = 0
      let maxh = 0
      let w = 0 // 宽度，用来计算几行
      if (newData.length) {
        newData.map((v, i) => {
          v.y > maxy ? maxy = v.y : ''
          v.h > maxh ? maxh = v.h : ''
          w += v.w
        })
      }
      console.log('123', maxy, maxh, w)
      if ((maxy + maxh) > this.rowFlag) { // 判断最大的y+最大的h是否大于当前行
        this.row = maxy + maxh
        this.rowFlag = maxy + maxh
      }
      /* const rowHeight = this.layout[this.layout.length - 1].y + this.layout[this.layout.length - 1].h // row的数量
      console.log(rowHeight)
      this.$nextTick(() => {
        rowHeight + 1 > this.rowFlag ? this.row = rowHeight + 1 : '' // 如果大于当前body的计算所得row则替代，小于则不变
      }) */
    },
    calculateData(data, type) { // 添加新模块前计算方法，此处应传值区分拖拽至那个模块是form、 tableFilter、table，用来区分默认配置
      let newAddId = '0'
      let yMap = 0
      let xMap = 0
      let wTotal = 0
      let layoutLength = []
      let itemW = 12 // this.layoutColNum // 默认宽
      let itemH = 2 // 默认高
      if (type === 'form') { // 根据传入的不同类型，赋值不同数据，及不同模块大小
        xMap = 0
        layoutLength = JSON.parse(JSON.stringify(this.layout.layoutForm))
      } else if (type === 'filter') {
        itemW = 2
        layoutLength = JSON.parse(JSON.stringify(this.layoutdata.layoutFilter))
      } else if (type === 'table') {
        itemW = 1
        itemH = 1
        layoutLength = JSON.parse(JSON.stringify(this.layoutdata.layoutTable))
      }
      console.log(this.layoutdata.layoutFilter)
      if (layoutLength.length) { // 计算i，y
        layoutLength.map((v, i) => {
          +v.i > +newAddId ? newAddId = v.i : '' // 获取当前最大的id值，新增则id累加确保id不重复
          yMap += v.h // 计算新增模块所需的y值
          wTotal += v.w // 累加宽度
        })
        xMap = wTotal % 12 // 计算下一条数据的x值， 累计取余
        newAddId = (+newAddId + 1).toString()
      }
      console.log('this.layoutMap.length', this.layoutMap)
      console.log(this.layoutFilterMap)
      console.log(this.layoutTableMap)
      let addItem = { 'x': xMap, 'y': yMap, 'w': itemW, 'h': itemH, 'i': newAddId, addClass: false }
      // var addItem = { 'x': xMap, 'y': yMap, 'w': itemW, 'h': itemH, 'i': newAddId, default_value: '', regular_expression: '', error_prompt: '', max_len: '', min_len: '', numberMin: 0, numberMax: 1, numberStep: 1, numberValue: 0, extra: [], checkboxExtraValue: [], extraValue: '', radioOrcheckboxView: 'inlineBlock', fill_rule: '', is_show: true, is_only: false, is_empty: false, 'col_type': 'input', 'placeholder': '请填写' + data.col_name, 'title': data.col_name, 'dataColFieldId': data.data_col_id, 'labelWidth': 100, 'width': '100%', addClass: false }
      console.log(addItem)
      if (type === 'form') {
        addItem = Object.assign(addItem, { default_value: '', regular_expression: '', error_prompt: '', max_len: '', min_len: '', numberMin: 0, numberMax: 1, numberStep: 1, numberValue: 0, extra: [], checkboxExtraValue: [], extraValue: '', radioOrcheckboxView: 'inlineBlock', fill_rule: '', is_show: true, is_only: false, is_empty: false, 'col_type': 'input', 'placeholder': data.col_name, 'title': data.col_name, 'dataColFieldId': data.data_col_id, 'labelWidth': 100, 'width': '100%' })
      } else if (type === 'filter') {
        addItem = Object.assign(addItem, { is_show: true, 'col_type': 'input', 'placeholder': data.col_name, 'dataColFieldId': data.data_col_id, default_value: '', 'width': '100%', regular_expression: '', error_prompt: '', max_len: '', min_len: '', numberMin: 0, numberMax: 1, numberStep: 1, numberValue: 0, extra: [], checkboxExtraValue: [], extraValue: '', radioOrcheckboxView: 'inlineBlock', is_empty: false })
      } else if (type === 'table') {
        addItem = Object.assign(addItem, { total_way: '', value_type: '', formula: '', 'title': data.col_name, 'width': '100%', 'dataColFieldId': data.data_col_id })
      }
      console.log(addItem)
      /* if (this.layoutMap.length) { // 此方法判断是否有空白，有责填补，注释此方法则
        // console.log(this.layoutMap.length);
        for (let r = 0, rLen = this.layoutMap.length; r < rLen; r++) {
          for (let c = 0; c <= (this.layoutColNum - itemW); c++) {
            const res = this.regionalTest(
              c,
              r,
              itemW,
              rLen > (r + itemH) ? itemH : rLen - r
            )
            if (res.result) {
              // 更新添加数据内容
              addItem = {
                'x': res.x,
                'y': res.y,
                'w': itemW,
                'h': itemH,
                'i': newAddId
              }
              c = this.layoutColNum + 1
              r = rLen + 1
            } else {
              c = res.offsetX
            }
          }
        }
      } */
      // 更新二维数组地图
      /* for (let itemR = 0; itemR < itemH; itemR++) { // 此代码有问题tmd
        for (let itemC = 0; itemC < itemW; itemC++) {
          if (type === 'form') {
            if (!this.layoutMap[addItem.y + itemR]) { // 如果没有该行，初始化
              this.layoutMap[addItem.y + itemR] = new Array(this.layoutColNum)
              for (let i = 0; i < this.layoutColNum; i++) {
                this.layoutMap[addItem.y + itemR][i] = 0
              }
            }
            this.layoutMap[addItem.y + itemR][addItem.x + itemC] = 1// 标记点
          } else if (type === 'filter') {
            if (!this.layoutFilterMap[addItem.y + itemR]) { // 如果没有该行，初始化
              this.layoutFilterMap[addItem.y + itemR] = new Array(this.layoutColNum)
              for (let i = 0; i < this.layoutColNum; i++) {
                this.layoutFilterMap[addItem.y + itemR][i] = 0
              }
            }
            this.layoutFilterMap[addItem.y + itemR][addItem.x + itemC] = 1// 标记点
          } else if (type === 'table') {
            if (!this.layoutTableMap[addItem.y + itemR]) { // 如果没有该行，初始化
              this.layoutTableMap[addItem.y + itemR] = new Array(this.layoutColNum)
              for (let i = 0; i < this.layoutColNum; i++) {
                this.layoutTableMap[addItem.y + itemR][i] = 0
              }
            }
            this.layoutTableMap[addItem.y + itemR][addItem.x + itemC] = 1// 标记点
          }
        }
      } */
      if (type === 'form') { // 根据传入的不同类型，赋值不同数据，及不同模块大小
        this.layout.layoutForm.push(addItem)
        this.$store.commit('reportDesign/LAYOUT_DATA', this.layout) // 在改变配置属性之后将其存入store
        console.log(this.layout) // 计算后的布局
        this.howMany(this.layout) // 新增后重新计算高度
      } else if (type === 'filter') {
        this.layoutdata.layoutFilter.push(addItem)
        this.$store.commit('reportDesign/LAYOUT_DATA', this.layoutdata) // 在改变配置属性之后将其存入store
        console.log(this.layoutdata) // 计算后的布局
        this.howMany(this.layoutdata) // 新增后重新计算高度
      } else if (type === 'table') {
        this.layoutdata.layoutTable.push(addItem)
        this.$store.commit('reportDesign/LAYOUT_DATA', this.layoutdata) // 在改变配置属性之后将其存入store
        console.log(this.layoutdata) // 计算后的布局
        this.howMany(this.layoutdata) // 新增后重新计算高度
      }
    },
    // 生成二维数组地图
    genereatePlaneArr(data) {
      var map = []
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var one = data[i]
          // 循环行
          for (var r = one.y; r < (one.y + one.h); r++) {
            // 循环列
            for (var c = one.x; c < (one.x + one.w); c++) {
              // 检修当前行是否存在
              if (!map[r]) {
                map[r] = new Array(this.layoutColNum)
                for (let i = 0; i < this.layoutColNum; i++) {
                  map[r][i] = 0
                }
              }
              // 占据为1
              map[r][c] = 1
            }
          }
        }
      }
      return map
    },
    // 区域检测 x,y 二维数据地图起始坐标点  w,h 检测区域宽高
    regionalTest(x, y, w, h) {
      // 定义返回 x,y 偏移 及 是否有空位置
      let offsetX = 0; let offsetY = 0; let res = true
      // 按区域循环检测 二维数组地图
      for (let r = 0; r < w; r++) {
        for (let c = 0; c <= h; c++) {
          const point = this.layoutMap[y + r] ? this.layoutMap[y + r][x + c] : 0
          // 如该点被占据 记录偏移值
          if (point === 1) {
            res = false
            offsetX = offsetX > (x + c) ? offsetX : x + c
            offsetY = offsetY > (y + r) ? offsetY : y + r
          }
        }
      }
      return {
        result: res,
        offsetX: offsetX,
        x: x,
        y: y
      }
    },
    // 组件更新完成生命周期
    layoutReadyEvent(newLayout) {
      // 当插件加载完成后  获取现在的二维地图树
      // this.layoutMap = this.genereatePlaneArr(this.layout.layoutForm)
    },
    // 组件更新完成生命周期
    layoutFilterReadyEvent(newLayout) {
      // 当插件加载完成后  获取现在的二维地图树
      // this.layoutFilterMap = this.genereatePlaneArr(this.layoutdata.layoutFilter)
    },
    // 组件更新完成生命周期
    layoutTableReadyEvent(newLayout) {
      // 当插件加载完成后  获取现在的二维地图树
      // this.layoutTableMap = this.genereatePlaneArr(this.layoutdata.layoutTable)
    },
    /* layoutUpdatedEvent(newLayout) {},
    rnd: function(m, n) {
      return (Math.random() * (m - n + 1) + n) | 0
    },*/
    onclickGridItem(e, i, type) { // 选中设计区域某个模块方法
      if (type === 'form') {
        this.layout.layoutForm.map((list, index) => { // 先将其它选项清空
          list.addClass = false
        })
        this.layout.layoutForm[i].addClass = true // 再给点击的项添加
        /* this.$store.commit('reportDesign/EDIT_ITEM_INDEX', i)
        this.$store.commit('reportDesign/EDIT_ITEM_LAYOUTTYPE', 'form') */
        this.$store.commit('reportDesign/EDIT_REPORT_ITEM', this.layout.layoutForm[i])
      } else if (type === 'tableFilter') {
        this.layoutdata.layoutFilter.map((list, index) => { // 先将列表型Filter其它选项清空
          list.addClass = false
        })
        this.layoutdata.layoutTable.map((list, index) => { // 先将列表型table其它选项清空
          list.addClass = false
        })
        this.layoutdata.layoutFilter[i].addClass = true // 再给点击的项添加
        /* this.$store.commit('reportDesign/EDIT_ITEM_INDEX', i)
        this.$store.commit('reportDesign/EDIT_ITEM_LAYOUTTYPE', 'layoutFilter') */
        this.$store.commit('reportDesign/EDIT_REPORT_ITEM', this.layoutdata.layoutFilter[i])
      } else if (type === 'table') {
        this.layoutdata.layoutFilter.map((list, index) => { // 先将列表型Filter其它选项清空
          list.addClass = false
        })
        this.layoutdata.layoutTable.map((list, index) => { // 先将列表型table其它选项清空
          list.addClass = false
        })
        this.layoutdata.layoutTable[i].addClass = true // 再给点击的项添加
        /* this.$store.commit('reportDesign/EDIT_ITEM_INDEX', i) // 列表表格不需要传值，所以传默认值
        this.$store.commit('reportDesign/EDIT_ITEM_LAYOUTTYPE', 'table') */
        this.$store.commit('reportDesign/EDIT_REPORT_ITEM', this.layoutdata.layoutTable[i])
      }
      this.$store.commit('reportDesign/EDIT_ITEM_INDEX', i)
      this.$store.commit('reportDesign/EDIT_ITEM_LAYOUTTYPE', type)
      // this.addClass(e.target, 'item-addClass')
    },
    onclickDelete(e, i, type) { // 点击选中模块右上角删除事件
      if (type === 'form') {
        this.layout.layoutForm.splice(i, 1)
        console.log(this.layout)
        if (!this.layout.layoutForm.length) {
          this.$store.commit('reportDesign/DATAID', '') // 重置数据集id
        }
        // this.$store.commit('reportDesign/LAYOUT_DATA', this.layout) // 在删除之后将其存入store
      } else if (type === 'tableFilter') {
        this.layoutdata.layoutFilter.splice(i, 1)
        console.log(this.layoutdata)
      } else if (type === 'table') {
        this.layoutdata.layoutTable.splice(i, 1)
      }
      if (type === 'tableFilter' || type === 'table') {
        if (!this.layoutdata.layoutFilter.length && !this.layoutdata.layoutTable.length) {
          this.$store.commit('reportDesign/DATAID', '') // 重置数据集id
        }
      }
      this.$store.commit('reportDesign/EDIT_REPORT_ITEM', {}) // 置空当前选中
      this.$store.commit('reportDesign/EDIT_ITEM_INDEX', 0) // 重置选中标识
    },
    checkListChange(e, i) { // 报表型 操作按钮 改变方法
      this.layoutdata.layoutFilter.map((list, index) => { // 先将列表型Filter其它选项清空
        list.addClass = false
      })
      this.layoutdata.layoutTable.map((list, index) => { // 先将列表型table其它选项清空
        list.addClass = false
      })
      if (e) { // 当为选中时传递选中信息
        this.$store.commit('reportDesign/EDIT_ITEM_INDEX', i)
        this.$store.commit('reportDesign/EDIT_ITEM_LAYOUTTYPE', 'check')
        this.$store.commit('reportDesign/EDIT_REPORT_ITEM', this.layoutdata.checkList[i])
      } else { // 当取消选择时，置空他的地址，取消是否控制权限标识
        // this.layoutdata.checkList[i].address = ''
        // this.layoutdata.checkList[i].permissions = false
        this.$store.commit('reportDesign/EDIT_REPORT_ITEM', {})
        this.$store.commit('reportDesign/EDIT_ITEM_LAYOUTTYPE', 'check')
        this.$store.commit('reportDesign/EDIT_ITEM_INDEX', i)
      }
    },
    getReportData(id) { // 通过id获取填报型数据
      getReportDetailInfoNew({ reportId: id }).then(res => {
        if (res.state === 2000) {
          if (this.reportType === 'form') { // 填报型
            this.formTitle = res.data.reportInfo.report_nickname || '' // 获取设置报表名称
            this.layout.layoutForm = res.data.reportCols || []
            if (res.data.reportCols.length) {
              this.$store.commit('reportDesign/DATAID', res.data.reportInfo.report_use_data_id) // 存储当前的数据集id
              // this.$store.commit('reportDesign/TABLEID', res.data.reportInfo.main_table_id) // 存储table_id
            } else {
              this.$store.commit('reportDesign/DATAID', '') // 存储当前的数据集id
              // this.$store.commit('reportDesign/TABLEID', '') // 存储table_id
            }
            // this.layoutMap = this.genereatePlaneArr(this.layout.layoutForm)
            console.log(this.layoutMap)
          } else if (this.reportType === 'excel') { // 列表型
            this.formTitle = res.data.formTitle || ''
            this.layoutdata.requeryView = res.data.requeryView || false
            this.layoutdata.layoutTable = res.data.layoutTable || []
            this.layoutdata.layoutFilter = res.data.layoutFilter || []
            if (!res.data.checkList.length) { // 为空时赋值默认
              this.layoutdata.checkList = [
                { name: '新增', label: 'add', checked: false, permissions: false, address: '' },
                { name: '编辑', label: 'edit', checked: false, permissions: false, address: '' },
                { name: '删除', label: 'delete', checked: false, permissions: false, address: '' },
                { name: '导出', label: 'export', checked: false, permissions: false, address: '' }
              ]
            } else {
              this.layoutdata.checkList = res.data.checkList
            }
            const dataId = res.data.dataId || '' // 当返回为0时置为空
            // const tablecols = res.data.tablecols || []
            this.$store.commit('reportDesign/DATAID', dataId) // 存储当前的数据集id
            // this.$store.commit('reportDesign/TABLECOLS', tablecols) // 存储当前的表头数据

            // this.$store.commit('reportDesign/TABLEID', res.data.reportId) // 报表id
          }
        } else {
          this.$store.commit('reportDesign/DATAID', '') // 存储当前的数据集id
          // this.$store.commit('reportDesign/TABLEID', '') // 存储table_id
          this.layout.layoutForm = []
          this.formTitle = '' // 获取设置报表名称
        }
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '失败',
          message: '获取数据失败',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
.gutter-example >>> .el-row > div {
  background: transparent;
  border: 0;
}
.gutter-example >>> .el-row {
  margin-bottom: 0
}
.gutter-example >>> .el-row:last-child {
  margin-bottom: 0px;
}
.gutter-box {
  /* padding: 5px 0; */
  height: 27px;
}
.lpc-gutter-bg {
  /* background: #00a0e921; */
  border: 1px solid #e6e3e3;
}
.el-modal-wrap >>> .el-modal-body {
  padding-bottom: 0;
}
.item-form >>> .el-input .el-input__inner {
  cursor: move;
  /* width: 65%; */
  /* pointer-events: none; */
}
.item-form >>> .el-form-item--medium .el-form-item__label {
  cursor: move;
  line-height: 52px;
  overflow: hidden;
  white-space: nowrap;
}
.item-form >>> .el-form-item--medium .el-form-item__content {
  line-height: 52px;
}
.reportTitle .el-input >>> input {
  width: 50%!important;
}
/* 切换布局方式时改变start */
.item-content .item-form >>> .el-radio-group .block {
  line-height: 52px;
}
.item-content .item-form >>> .el-checkbox-group .block {
  line-height: 52px;
}
/* 切换布局方式时改变end */
</style>

<style scoped lang='scss'>

.design-content {

  width: 100%;
  // height: 100%;
  height: calc(100vh - 150px);
  // overflow: hidden;
  .reportTitle {
    padding: 5px 10px 0 10px;
    hr {
      color: #e0dcdc;
      border: .5px solid;
    }
  }
  .layout-container {
    padding: 0 10px;
    // height: calc(100vh - 155px);
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .gutter-example {
      table {
        width: 100%;
        overflow-y: auto;
      }
    }
    .lpc-canvas {
      position: absolute;
      // border: 1px solid red;
      padding: 0 10px;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      .grid-item {
        border: 1px dashed hsla(0,0%,66.7%,.5);
        background-color: rgba(236,245,255,.3);
        .item-content {
          height: 100%;
          position: relative;
          overflow: hidden;
          padding: 0 10px 0 0;
          &::after {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: block;
            z-index: 8;
            content: "";
          }
          .delectIcon {
            height: 23px;
            position: absolute;
            top: 0;
            right: 0;
            width: 23px;
            display: block;
            border-radius:  0 0 0 5px;
            text-align: center;
            color: #FFF;
            background-color: #409eff;
            z-index: 9999;
            display: none;
            cursor: pointer;
            .el-icon-close {
              font-weight: bolder;
              vertical-align: middle;
            }
          }
        }
        .item-addClass {
          border: 3px solid #409eff;
          .delectIcon {
            display: block;
          }
        }
      }
      .lpc-report {
        width: 100%;
        height: 100%;
      }
    }
  }
  .table-layout-container {
    padding: 0 10px;
    // height: calc(100vh - 155px);
    overflow-x: hidden;
    overflow-y: auto;
    .table-content-header,.table-content {
      position: relative;
      .table-gutter-example-header,.table-content-example {
        table {
          width: 100%;
          overflow-y: auto;
        }
      }
    }
    .table-header-lpc-canvas,.table-lpc-canvas {
      position: absolute;
      // border: 1px solid red;
      // padding: 0 10px;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      .grid-item {
        border: 1px dashed hsla(0,0%,66.7%,.5);
        background-color: rgba(236,245,255,.3);
        .item-content {
          height: 100%;
          position: relative;
          overflow: hidden;
          &::after {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: block;
            z-index: 8;
            content: "";
          }
          .delectIcon {
            height: 25px;
            position: absolute;
            top: 0;
            right: 0;
            width: 25px;
            display: block;
            border-radius:  0 0 0 5px;
            text-align: center;
            color: #FFF;
            background-color: #409eff;
            z-index: 9999;
            display: none;
            cursor: pointer;
            .el-icon-close {
              font-weight: bolder;
              vertical-align: middle;
            }
          }
        }
        .item-addClass {
          border: 3px solid #409eff;
          .delectIcon {
            display: block;
          }
        }
      }
    }
  }
  .footer-button-container {
    padding: 20px 10px;
  }
}
</style>
