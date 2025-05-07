<template>
  <zz-form
    v-model="formData"
    :formConfig="formConfig"
    :formFields="formFields"
    ref="formRef">
  </zz-form>
  <div class="button">
    <el-button type="primary" @click="initForm">表单回显</el-button>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
    <el-button type="primary" @click="handleAdd">新增专业</el-button>
  </div>
  <el-alert
    title="模拟更新：性别选择男，会更新籍贯选项"
    :show-icon="false"
    :center="true" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const formConfig = {
  labelWidth: '120px',
  type: 'submit',
  labelPosition: 'right'
};
const formData = ref({
  name: '张三',
  age: '26',
  sex: 2,
  area: '1-1-1',
  birthday: '2025-04-03',
  signDate: '2025-04-03 12:00:00',
  workStart: '2025',
  studyDate: ['2025-04-03', '2025-04-04'],
  like: ['swim', 'run'],
  work: ['1', '1-1', '1-1-1'],
  address: 'city',
  remark: '备注'
});
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
    label: '性别',
    change: value => sexChange(value),
    options: []
  },
  area: {
    type: 'treeSelect',
    label: '籍贯',
    options: []
  },
  birthday: {
    type: 'date',
    label: '出生日期',
    required: true,
    showFormat: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
    remove: formData.value.sex === 1
  },
  signDate: {
    type: 'date',
    label: '签到日期',
    required: true,
    showFormat: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss'
  },
  workStart: {
    type: 'date',
    label: '开始工作时间',
    picker: 'year',
    required: true,
    showFormat: 'YYYY',
    valueFormat: 'YYYY'
  },
  studyDate: {
    type: 'date',
    label: '大学时间',
    picker: 'daterange',
    required: true,
    showFormat: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  },
  like: {
    type: 'checkBox',
    label: '爱好',
    required: true,
    options: [
      { label: '游泳', value: 'swim' },
      { label: '跑步', value: 'run' },
      { label: '篮球', value: 'basketball' }
    ]
  },
  work: {
    type: 'cascader',
    label: '职务',
    required: true,
    options: []
  },
  address: {
    type: 'radio',
    label: '户籍',
    required: true,
    options: []
  },
  remark: {
    type: 'textarea',
    label: '备注',
    required: true,
    rows: 4,
    style: {
      width: '100%'
    }
  }
});
const formRef = ref();

//提交
const handleSubmit = async () => {
  const check = await formRef.value?.check();
  if (check) {
    console.log(formData.value);
  }
};
//性别改变
const sexChange = (value: any) => {
  formFields.value.birthday.remove = value === 1 ? true : false;
};
//初始化表单
const initForm = () => {
  setTimeout(() => {
    const data = {
      name: '张三',
      age: '26',
      sex: 2,
      area: '1-1-1',
      birthday: '2025-04-03',
      signDate: '2025-04-07 00:00:00',
      workStart: '2021',
      studyDate: ['2021-09-01', '2025-06-28'],
      like: ['run', 'swim'],
      work: ['1', '1-1', '1-1-1'],
      address: 'city',
      remark: '1212'
    };
    formRef.value.form = data;
  }, 100);
};
//新增专业
const handleAdd = () => {
  const timer = new Date().getTime();
  formFields.value = {
    ...formFields.value,
    [`new${timer}`]: {
      type: 'input',
      label: `新增项`,
      required: true
    }
  };
};
//初始化设置下拉
const setOptions = () => {
  let sexOptions: any = [];
  let workOptions: any = [];
  let addressOptions: any = [];
  let areaOption: any = [];
  setTimeout(() => {
    sexOptions = [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ];
    workOptions = [
      {
        value: '1',
        label: '董事会',
        children: [
          {
            value: '1-1',
            label: '经理',
            children: [
              {
                value: '1-1-1',
                label: '副经理'
              }
            ]
          }
        ]
      },
      {
        value: '2',
        label: '秘书处',
        children: [
          {
            value: '2-1',
            label: '秘书',
            children: [
              {
                value: '2-1-1',
                label: '助理'
              }
            ]
          }
        ]
      }
    ];
    addressOptions = [
      { label: '城镇', value: 'city' },
      { label: '农村', value: 'country' }
    ];
    areaOption = [
      {
        value: '1',
        label: '重庆市',
        children: [
          {
            value: '1-1',
            label: '江北区',
            children: [
              {
                value: '1-1-1',
                label: '五里店街道'
              }
            ]
          }
        ]
      },
      {
        value: '2',
        label: '成都市',
        children: [
          {
            value: '2-1',
            label: '锦江区',
            children: [
              {
                value: '2-1-1',
                label: '春熙路街道'
              }
            ]
          },
          {
            value: '2-2',
            children: [
              {
                value: '2-2-1',
                label: '宽窄巷子街道'
              }
            ]
          }
        ]
      },
      {
        value: '3',
        label: '北京市',
        children: [
          {
            value: '3-1',
            label: '朝阳区',
            children: [
              {
                value: '3-1-1',
                label: '大屯门街道'
              }
            ]
          },
          {
            value: '3-2',
            label: '东城区',
            children: [
              {
                value: '3-2-1',
                label: '长安街街道'
              }
            ]
          }
        ]
      }
    ];
  }, 500);

  setTimeout(() => {
    formFields.value.sex.options = sexOptions || [];
    formFields.value.work.options = workOptions || [];
    formFields.value.address.options = addressOptions || [];
    formFields.value.area.options = areaOption || [];
  }, 1000);
};
onMounted(() => {
  setOptions();
});
</script>
<style scoped lang="scss">
.button {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>
