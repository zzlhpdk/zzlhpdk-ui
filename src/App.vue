<template>
  <zz-form :formConfig="formConfig" :formFields="formFields" ref="formRef">
    <template #custom>
      <span
        style="display: inline-block; margin-left: 20px; margin-bottom: 20px">
        <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
      </span>
    </template>
  </zz-form>
  <hr style="margin: 100px 0" />
  <zz-table
    :searchFields="searchFields"
    :searchConfig="searchConfig"
    :tableColumns="tableColumns"
    :tableConfig="tableConfig"
    ref="tableRef"></zz-table>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { tableDataApi } from './api/tableData';

const formConfig = {
  labelWidth: '120px',
  type: 'submit',
  labelPosition: 'right'
};
const formFields = {
  input: {
    type: 'input',
    label: '输入框',
    defaultValue: '输入框',
    required: true,
    style: {
      width: '300px',
      border: '1px blue solid'
    }
  },
  input1: {
    type: 'input',
    label: '输入框1',
    defaultValue: '',
    required: true,
    style: {
      width: '300px',
      border: '1px blue solid'
    }
  },
  select: {
    type: 'select',
    label: '下拉框',
    defaultValue: 1,
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
  }
};
const formRef = ref();
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
    defaultValue: '11',
    required: true,
    style: {
      width: '600px',
      border: '1px red solid'
    }
  },
  six: {
    type: 'select',
    label: '性别',
    defaultValue: 1,
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
  },
  haha: {
    type: 'children',
    children: [
      {
        name: {
          type: 'input',
          label: '姓名1',
          defaultValue: '11'
        }
      },
      {
        six: {
          type: 'select',
          label: '性别2',
          options: [
            { label: '男', value: 1 },
            { label: '女', value: 2 }
          ]
        }
      }
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
//提交
const handleSubmit = async () => {
  const check = await formRef.value?.check();
  if (check) {
    const data = formRef.value?.submit();
    console.log(data);
  }
};
</script>
<style scoped lang="scss"></style>
