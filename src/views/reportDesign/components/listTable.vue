<template>
  <el-table-column :label="coloumnHeader.title" :prop="coloumnHeader.dataColFieldId" align="center">
    <template v-for="(list, ind) in coloumnHeader.child">
      <listTable v-if="list.child && list.child.length" :key="ind" :coloumn-header="list" />
      <el-table-column v-else :key="ind" :label="list.title" :prop="list.dataColFieldId" align="center" />
    </template>
  </el-table-column>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'ListTable',
  props: {
    coloumnHeader: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {}
}
</script>

<style scoped lang='scss'>

</style>
