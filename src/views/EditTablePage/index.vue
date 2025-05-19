<template>
  <zz-editTable :formConfig="formConfig" :formFields="formFields" ref="formRef">
  </zz-editTable>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const formConfig = {
  labelWidth: '120px',
  type: 'submit',
  labelPosition: 'right'
};
const formFields = ref({
  name: {
    type: 'input',
    label: '姓名',
    required: true
  },
  age: {
    type: 'input',
    label: '年龄',
    inputType: 'number',
    required: true
  },
  sex: {
    type: 'select',
    required: true,
    label: '性别',
    options: [
      {
        label: '男',
        value: '男'
      },
      {
        label: '女',
        value: '女'
      }
    ]
  }
});
const formRef = ref();
</script>
<style scoped lang="scss"></style>
