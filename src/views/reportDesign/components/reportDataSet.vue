<template>
  <div class="report-data-set-container">
    <div class="r-d-s-main">
      <el-row class="r-d-s-header" type="flex" justify="space-between">
        <el-col>
          <h4>数据集</h4>
        </el-col>
        <el-col>
          <div class="header-icon tr">
            <img src="./../img/icon_add.png" @click="addDataSet">
            <img src="./../img/icon_edit.png" @click="editDataSet">

            <img src="./../img/icon_trash.png" @click="delDataSet">
          </div>
        </el-col>
      </el-row>
      <el-row class="r-d-s-data-set">
        <el-col>
          <el-tree
            ref="tree"
            node-key="id"
            :data="dataList"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandKeys"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            get-checked-nodes="getCh"
            style="width: 100%"
            accordion
            @node-expand="handleNodeClick"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{node, data}" class="custom-tree-node" style="width: 100%">
              <span v-if="data.data_info">
                <span class="tree-node-parent">
                  {{ data.data_info.data_name }}</span>
              </span>
              <span v-else>
                <span
                  style="width: 100%; display:inline-block;"
                  class="tree-node-child"
                  draggable="true"
                  @dragstart="dragstart($event,data)"
                  @dragend="dragend"
                >{{ data.col_name }}</span>
              </span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      activeNodeParent: '',
      activeNodeChild: '',
      data: [
        {
          label: '一级 1',
          type: 'folder',
          children: [{
            type: 'report',
            label: '二级 1-1'
          }]
        },
        {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            type: 'report'
          }, {
            label: '二级 2-2',
            type: 'report'
          }]
        }, {
          label: '一级 3',
          type: 'folder',
          children: [{
            label: '二级 3-1',
            type: 'report'

          }, {
            label: '二级 3-2',
            type: 'report'
          }]
        }],
      defaultProps: {
        children: 'child'
        // label: (data, node) => {
        //   // return data.label
        // }
      },
      activeTreeNode: {},
      defaultExpandKeys: [] // 默认展开的节点
    }
  },
  created() {

  },
  methods: {
    handleNodeClick(data) {
      // console.log(data)
      if (data.child && data.data_info) {
        // 点击的父元素
        this.activeNodeParent = data
        return
      }
      // this.activeNodeParent = ''
      // 点击子元素
    },
    addDataSet() {
      this.$emit('addDataSet', this.activeNodeParent)
    },
    editDataSet() {
      this.$emit('editDataSet', this.activeNodeParent)
    },
    delDataSet() {
      if (!this.activeNodeParent) {
        this.$message({
          type: 'error',
          showClose: true,
          message: '请选择数据集'
        })
        return
      }
      this.$emit('delDataSet', this.activeNodeParent)
    },
    dragstart(e, data) {
      e.dataTransfer.setData('data-set-info', JSON.stringify(this.activeNodeParent))
      e.dataTransfer.setData('node-info', JSON.stringify(data))
    },
    dragend() {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
  .report-data-set-container{
    @include scrollBar;
    padding:0px 36px;
    padding-bottom:40px;
    background:#fff;
    box-shadow:0px 0px  5px 0px #ccc;
    height: calc(100vh - 640px);
    min-height: 200px;
    margin-top: 10px;
    overflow: auto;
  }
  .r-d-s-header{
    border-bottom:1px solid  #F0F0F0;
    padding:30px 0 24px 0px;

    h4{
      font-size:16px;
      font-weight:600;
      height:24px;
      line-height:24px;
    }
    .header-icon{
      display:flex;
      align-items:center;
      justify-content: flex-end;
      img{
        margin:0px 5px;
        cursor:pointer;
        &:last-child{
          margin-right:0px;
        }
      }
    }
  }
  .el-tree {
    /deep/ .el-tree-node__content{
      padding-top:2px;
      padding-bottom:2px;
      margin-bottom:4px;
      height:32px;
    }
  }

  .custom-tree-node{

    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #666666;
    // margin:5px 0px;

    .tree-node-parent{
      padding-top:4px;
      padding-bottom:4px;
      padding-left:25px;
      background-image:url('./../img/icon_dsl01.png');
      // background-size:100% 100%;
      background-repeat:no-repeat;
      background-position:3px;
    }
    .tree-node-child{
      padding:5px 0px;
      margin-left:-40px;
      padding-left:65px;
      // padding-left:25px;
      background-image:url('./../img/icon_information01.png');
      // background-size:100% 100%;
      background-repeat:no-repeat;
      background-position: 40px 3px;
    }
  }

  .el-tree /deep/ {
    .el-tree-node__content{
      &:hover{
        background: #35B9F9;

        .custom-tree-node{
          color:#fff;
          .tree-node-parent{
            background-image:url('./../img/icon_dsl02.png');
          }
        }
      }
    }
    .el-tree-node:focus>.el-tree-node__content{
      background: #35B9F9;
      .custom-tree-node{
        color:#fff;
        .tree-node-parent{

          background-image:url('./../img/icon_dsl02.png');
          // background-size:100% 100%;

        }
      }
    }

  }
</style>
