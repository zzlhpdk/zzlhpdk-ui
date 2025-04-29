<template>
  <zz-table
    :searchFields="searchFields"
    :searchConfig="searchConfig"
    :tableColumns="tableColumns"
    :tableConfig="tableConfig"
    ref="tableRef"></zz-table>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { tableDataApi } from '../../api/tableData';

const searchConfig = computed(() => {
  return {
    labelWidth: '100px',
    type: 'search',
    defaultSearch: {
      id: '123'
    }
  };
});
const searchFields = {
  name: {
    type: 'input',
    label: '姓名',
    defaultValue: '',
    required: true
  },
  age: {
    type: 'input',
    label: '年龄',
    inputType: 'number',
    defaultValue: '',
    required: true
  },
  sex: {
    type: 'select',
    label: '性别',
    defaultValue: 1,
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
  }
};
//表格配置
const tableConfig = ref({
  pageApi: tableDataApi,
  showSearch: true,
  rowKey: 'id',
  multiple: true,
  reserveSelection: true
});
const tableColumns = [
  { prop: 'id', label: '编号' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'work', label: '职业' }
];
</script>
<style scoped lang="scss"></style>
