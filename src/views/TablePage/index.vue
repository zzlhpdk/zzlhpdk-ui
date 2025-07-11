<template>
  <zz-table
    :searchFields="searchFields"
    :searchConfig="searchConfig"
    :searchformData="searchformData"
    :tableColumns="tableColumns"
    :tableConfig="tableConfig"
    ref="tableRef">
    <template #ageSlot="{ row }">
      <el-tag>{{ row.age }}</el-tag>
    </template>
    <template #nameSlot>
      <el-input placeholder="请输入姓名"></el-input>
    </template>
  </zz-table>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { tableDataApi } from '../../api/tableData';

const searchConfig = computed(() => {
  return {
    type: 'search',
    defaultSearch: {
      id: '123'
    }
  };
});

const searchformData = ref({});
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
  reserveSelection: true,
  cellPosition: 'left',
  border: false
});
const tableColumns = ref([
  { prop: 'id', label: '编号' },
  { prop: 'name', label: '姓名', headerSlot: 'nameSlot' },
  { prop: 'age', label: '年龄', slot: 'ageSlot', sortable: true },
  { prop: 'work', label: '职业' },
  {
    prop: 'sex',
    label: '性别',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
  }
]);
</script>
<style scoped lang="scss"></style>
