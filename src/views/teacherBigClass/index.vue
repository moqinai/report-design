<template>
  <div class="teacherBigClass">
    <header class="header-title">
      <h3 class="pageTitle">教师大课表</h3>
    </header>
    <div class="class-container">
      <aside class="container-side">
        <div>
          <el-autocomplete
            v-model="state"
            placeholder="请输入内容"
            clearable
            :trigger-on-focus="false"
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
            <template slot-scope="{ item }">
              <div class="name">{{ item.teacher_name | nameFilter }}</div>
              <!-- <span class="addr">{{ item.teacher_code }}</span> -->
            </template>
            <el-button slot="append" icon="el-icon-search" />
          </el-autocomplete>
        </div>
        <div class="list">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="checkedTeacher" class="list-group" @change="handleCheckedTeacherChange">
            <el-checkbox v-for="(list, index) in tearcherData" :key="index" class="teacherList" :label="list.teacher_code" style="width: 100%;">
              {{ list.teacher_name | nameFilter }}
              <template><span class="colorlist" :style="{ 'backgroundColor': list.color }" /></template>
              <!-- <el-color-picker v-model="list.color" size="mini"></el-color-picker> -->
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </aside>
      <section class="container-section">
        <full-calendar
          id="calendar"
          ref="calendar"
          :events="events"
          :config="config"
          class="test-fc"
          locale="zh-cn"
        />
      </section>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import moment from 'moment'
import 'fullcalendar/dist/fullcalendar.css'
import { FullCalendar } from 'vue-full-calendar'
import $ from 'jquery'
import { getTeacherInfo, getTimetable } from '@/api/api'

export default {
  name: 'TeacherBigClass',
  components: { FullCalendar },
  filters: {
    nameFilter(str) {
      if (str.length > 9) {
        return str.substr(0, 9) + '...'
      } else {
        return str
      }
    }
  },
  data() {
    return {
      calendar: '',
      config: {
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推。
        locale: 'zh-cn', // 中文
        defaultView: 'agendaWeek', // 默认视图
        height: 'auto',
        aspectRatio: '0.1',
        // themeSystem: 'bootstrap4',
        weekNumbers: false, // 是否显示第几周
        header: {
          left: '',
          center: 'title', // title标题放中间
          right: 'prev, today, next' // 右侧显示按钮 及按钮内容
        },
        /* agenda 模式 */
        allDaySlot: false, // 在agenda视图模式下，是否在日历上方显示all-day(全天)
        slotLabelFormat: 'HH:mm', // axisFormat 'H(:mm)'
        slotLabelInterval: 5,
        slotEventOverlap: false, // 是否可以重叠覆盖
        slotDuration: '02:00:00', // 时间间隔
        minTime: '6:00', // 设置左侧时间范围
        maxTime: '24:00', // 设置左侧时间范围
        editable: false, // 是否可操作
        displayEventTime: true, // 是否显示时间
        navLinks: false, // 禁止点击
        /* 设置按钮文字 */
        buttonText: { today: '今天', month: '月', week: '周', day: '日', prev: '上周', next: '下周' },
        // eventClick: this.eventCLick, // 点击事件
        // select: this.selectFun, // 选中
        selectable: false, // 禁止拖拽选中
        eventTextColor: '#333',
        eventRender: function(e, ele) { // 被渲染时触发
          const html = `<div class="fc-curricula_name">${e.curricula_name}</div><div class="fc-room_name">${e.room_name}</div>`
          ele.find('.fc-content').append(html)
        },
        eventMouseover: function(calEvent, jsEvent, view) {
          $('#tooltip').remove()
          const top = $(this).offset().top
          const left = $(this).offset().left
          const thisHeight = $(this).height()
          let tooltipTop, tooltipLeft
          // 创建提示信息的容器，样式自定;
          $('body').append('<div id="tooltip"><div class="demo"><p>' + calEvent.title + '</p><p>' + calEvent.curricula_name + '</p><p>' + calEvent.room_name + '</p></div></div>')
          console.log(document.body.clientWidth)
          if ((left + 36 + 100) > document.body.clientWidth) {
            console.log('aa')
            tooltipTop = top - ((thisHeight + 2) / 2) // 当前模块的高度+border2 / 2，取一半
            tooltipLeft = left - 100 - 20
            $('#tooltip').find('div').removeClass('demo').addClass('rightdemo')
          } else {
            tooltipTop = top - $('#tooltip').height() - 12
            tooltipLeft = left + 36
          }
          /* tooltipTop = top - ((thisHeight+2) / 2),
              tooltipLeft =  left - 100 - 10
              $("#tooltip").find('div').removeClass('demo').addClass('rightdemo') */
          // 取得鼠标坐标来指定提示容器的位置;
          $('#tooltip').css({
            position: 'fixed',
            border: '1px solid #ddd',
            // backgroundColor: calEvent.color,
            zIndex: '99999',
            top: tooltipTop, // top - $('#tooltip').height() - 12,
            left: tooltipLeft // left + 36
          }).show()
          // $(this).find(".fc-content").attr({ "data-toggle": "popover", "title": calEvent.title, "data-content": calEvent.title, "data-container": "body" });
        },
        eventMouseout: function(calEvent, jsEvent, view) {
          $('#tooltip').hide()
        }
      },
      events: [ // editable 是否可编辑，移动改变大小等
        /* { title: '赵子龙', teacher_code: 'zhangminghui', room_name: "ZY北京理工大学东校区实验楼三号楼三单元", curricula_name: "初一语文", start: '2020-03-16 12:30', end: '2020-03-16 13:00' },
          { title: '刘备', teacher_code: 'zhangminghui1', room_name: "ZY北京理工大学东校区实验楼三号楼三单元", curricula_name: "初一语文", start: '2020-03-16 10:00', end: '2020-03-16 11:00', color: 'red' },
          { title: '关羽', teacher_code: 'zhangminghui2', room_name: "ZY北京理工大学东校区实验楼三号楼三单元", curricula_name: "初一语文", start: '2020-03-16 14:20', end: '2020-03-16 14:30', backgroundColor: 'green'},
          { title: '张飞', teacher_code: 'zhangminghui3', room_name: "ZY北京理工大学东校区实验楼三号楼三单元", curricula_name: "初一语文", start: '2020-03-17 16:00', end: '2020-03-17 17:00', color: 'orange', editable: false },
          { title: '曹操', teacher_code: 'zhangminghui4', room_name: "ZY北京理工大学东校区实验楼三号楼三单元", curricula_name: "初一语文", start: '2020-03-16 18:40', end: '2020-03-16 19:20' } */
      ],
      restaurants: [],
      state: '',
      timeout: null,
      checkAll: false,
      checkedTeacher: [], // 选中的
      isIndeterminate: true,
      colorI: 0, // 颜色取值下标
      tearcherListColor: ['#FFE991', '#F0C093', '#FA9895', '#FFCACA', '#8ED7FB', '#94B6F3', '#CBA1FB', '#E3FC94', '#BEEDAC'],
      tearcherData: [
        /* {
            "teacher_code": "huyuanyuan",
            "teacher_name": "张明慧diyi张明慧diyi张明慧diyi张明慧diyi张明慧diyi张明慧diyi",
            'color': 'red',
          },
          {
            "teacher_code": "zhangwy",
            "teacher_name": "张利花",
            'color': 'blue'
          } */
      ],
      viewStart: '',
      viewEnd: ''
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      const view = $('#calendar').fullCalendar('getView')
      this.viewStart = moment(view.start).format('YYYY-MM-DD')
      this.viewEnd = moment(view.end).subtract(1, 'days').format('YYYY-MM-DD')
    })
    const that = this
    // console.log(moment(getDate).format('YYYY-MM-DD HH:mm:ss')) // 获取当前时间
    $('.fc-prev-button').click(function() { // 点击上一周
      const view = $('#calendar').fullCalendar('getView')
      /*  console.log(view)
        console.log(moment(view.start).format('YYYY-MM-DD'))
        console.log(moment(view.end).subtract(1, 'days').format('YYYY-MM-DD')) */
      that.viewStart = moment(view.start).format('YYYY-MM-DD')
      that.viewEnd = moment(view.end).subtract(1, 'days').format('YYYY-MM-DD')
      that.queryGetClassFun() // 请求课表数据
    })
    $('.fc-next-button').click(function() { // 点击下一周
      const view = $('#calendar').fullCalendar('getView')
      that.viewStart = moment(view.start).format('YYYY-MM-DD')
      that.viewEnd = moment(view.end).subtract(1, 'days').format('YYYY-MM-DD')
      that.queryGetClassFun() // 请求课表数据
    })
    $('.fc-today-button').click(function() {
      const view = $('#calendar').fullCalendar('getView')
      that.viewStart = moment(view.start).format('YYYY-MM-DD')
      that.viewEnd = moment(view.end).subtract(1, 'days').format('YYYY-MM-DD') // 因为获取的end日期多一天，所以获取前一天的
      that.queryGetClassFun() // 请求课表数据
    })
    // $(this).find(".fc-content").attr({"data-toggle":"popover","title":calEvent.title,"data-content":calEvent.title, "data-container": "body"});
    $('#calendar').fullCalendar({ //
      navLinks: false // 禁止点击添加空白事件
    })
  },
  methods: {
    dayClick(date, allDay, jsEvent, view) { // 点击日程表上的某天
      console.log(view)
    },
    /* selectFun (date, allDay, jsEvent, view) { // 拖拽选中后
        $('#calendar').fullCalendar( 'unselect' )
      }, */
    /* 输入搜索start */
    querySearchAsync(queryString, cb) {
      let results = []
      getTeacherInfo({ 'teacher_name': queryString }).then((res) => {
        if (res.state) {
          results = res.data
        } else {
          results = []
        }
        cb(results) // 内置回调
      }).catch(err => {
        console.log(err)
        cb(results) // 内置回调
        results = []
        this.$notify.error({
          title: '失败',
          message: '搜索教师请求失败',
          duration: 2000
        })
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      const flag = this.tearcherData.some(list => { // 判断如果已经添加了则不再添加
        return list.teacher_code === item.teacher_code
      })
      if (flag) {
        this.$message('该教师已添加')
      } else {
        this.tearcherData.push(item)
        item.color = this.tearcherListColor[(this.colorI % 9)]
        this.colorI++
      }
    },
    /* 输入搜索end */
    handleCheckAllChange(val) { // 全选or全不选
      const checkedTeacher = []
      this.tearcherData.map((list) => {
        checkedTeacher.push(list.teacher_code)
      })
      this.checkedTeacher = val ? checkedTeacher : [] // 如果是true选中，则把所有都勾选
      this.isIndeterminate = false

      if (val) {
        const params = {
          'teacher_code': this.checkedTeacher,
          'begin_date': this.viewStart,
          'end_date': this.viewEnd
        }
        getTimetable(params).then((res) => {
          if (res.state) {
            if (!res.data.length) {
              this.$message('当前选中教师排课为空')
              // return false
            }
            this.dealColorMatching(res.data)
          } else {
            this.$message(res.message)
          }
        }).catch((err) => {
          console.log(err)
          this.$notify.error({
            title: '失败',
            message: '请求排课信息失败',
            duration: 2000
          })
        })
      } else {
        this.events = [] // 取消选择则清空课表数据
      }
    },
    handleCheckedTeacherChange(value) { // 单选某个时
      const checkedCount = value.length
      this.checkAll = checkedCount === this.tearcherData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tearcherData.length
      if (checkedCount) { // 当有选中
        this.checkedTeacher.concat(value)
      }
      this.queryGetClassFun() // 请求课表数据
    },
    queryGetClassFun() {
      if (this.checkedTeacher.length) { // 如果没有了选中值，则清空，有则继续请求
        const params = {
          'teacher_code': this.checkedTeacher,
          'begin_date': this.viewStart,
          'end_date': this.viewEnd
        }
        getTimetable(params).then((res) => {
          if (res.state) {
            if (!res.data.length) {
              this.$message('当前选中教师排课为空')
              // return false
            }
            this.dealColorMatching(res.data)
          } else {
            this.$message(res.message)
          }
        }).catch((err) => {
          console.log(err)
          this.$notify.error({
            title: '失败',
            message: '请求排课信息失败',
            duration: 2000
          })
        })
      } else {
        this.events = []
      }
    },
    dealColorMatching(data) { // 处理颜色匹配
      this.tearcherData.map((list, index) => {
        data.map((item, ind) => {
          if (list.teacher_code === item.teacher_code) {
            item.color = list.color
          }
        })
      })
      /* data.map(list => {
          list.className = '' // 添加class类名
        }) */
      this.events = data
    }
  }
}
</script>

<style scoped lang='scss'>
/deep/.fc-time-grid .fc-slats td {
  height: 4.5em;
  border-bottom: 0;
  /* 重置表格高度 */
  }
/deep/.fc-content {
  .fc-time,.fc-title,.fc-curricula_name,.fc-room_name {
    margin-bottom: 5px;
    width: 100%;
  }
  .fc-time:before,.fc-time:after {
    content: none!important;
  }
  .fc-time span {
    display: block!important;
  }
}
/deep/.fc-content:hover {
  cursor: pointer;
}
/deep/.fc-unthemed td.fc-today {
  background: rgba(53,185,249,0.10);;
}
/deep/.fc-unthemed th,
.fc-unthemed td,
.fc-unthemed thead,
.fc-unthemed tbody,
.fc-unthemed .fc-divider,
.fc-unthemed .fc-row,
.fc-unthemed .fc-content,
.fc-unthemed .fc-popover,
.fc-unthemed .fc-list-view,
.fc-unthemed .fc-list-heading td {
  border-color: #F0F0F0;
}
/deep/.fc-view-container .fc-day-header {
    color: #35B9F9;
}
/deep/.fc-toolbar.fc-header-toolbar {
  padding-top: 10px;
  padding-right: 10px;
}

  .teacherBigClass {
    // width: 100%;
    background:#F8F8F8;
    // height: calc(100vh - 80px);
    min-width: 1200px;
    height: 100vh;
    .header-title {
      padding: 20px 0 20px 20px;
      // margin: -20px -20px 6px -20px;
      margin: 0 0 6px 0px;
      /* position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: all .2s;
      transform: translateZ(0);
      height: 60px;
      line-height: 60px; */
      background:#fff;
      font-family: 'SourceHanSansCN-Bold';
      font-size: 24px;
      color: #333333;
    }
    .class-container {
      // margin-top: 70px;
      height: calc(100vh - 86px);
      display: flex;
      .container-side {
        flex: 0 0 220px;
        max-width: 220px;
        margin-right: 10px;
        background: #FFF;
        /* box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
        .my-autocomplete {
          li {
            line-height: normal;
            padding: 7px;
            .name {
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .addr {
              font-size: 12px;
              color: #b4b4b4;
            }
            .highlighted .addr {
              color: #ddd;
            }
          }
        }
        .list {
          padding-left: 10px;
          margin-top: 10px;
          .list-group {
            overflow: auto;
            height: calc(100vh - 155px);
            .teacherList {
              line-height: 45px;
              .colorlist {
                display: inline-block;
                width: 16px;
                height: 16px;
                border-radius: 3px;
                box-shadow: 1px 1px 1px #d4d0d0;
                position: absolute;
                right: 20px;
                top: 16px;
              }
            }
          }
        }
      }
      .container-section {
        flex: 1;
        min-width: 800px;
        overflow-x: auto;
        background: #FFF;
        /* box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
      }
    }
  }

  /* 修改复选框样式 start*/
  /deep/.el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  /deep/ .el-checkbox__input .el-checkbox__inner::after {
    // 对号
    border: 2px solid #fff;
    // 不覆盖下面的 会 导致对号变形
    box-sizing: content-box;
    content: "";
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    width: 3px;
    //
    transform: rotate(45deg) scaleY(1);
  }
  /* 修改复选框样式end */
</style>
