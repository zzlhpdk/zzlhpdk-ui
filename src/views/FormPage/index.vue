<template>
  <zz-form :formConfig="formConfig" :formFields="formFields" ref="formRef">
  </zz-form>
  <div class="button">
    <el-button type="primary" @click="initForm">表单回显</el-button>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
  <el-alert
    title="模拟更新：性别选择男，会更新籍贯选项"
    :show-icon="false"
    :center="true" />
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

const areaOption = ref([
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
        label: '青羊区',
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
]);
const formConfig = {
  labelWidth: '120px',
  type: 'submit',
  labelPosition: 'right'
};
const formFields = computed(() => {
  return {
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
      change: value => sexChange(value),
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ]
    },
    area: {
      type: 'treeSelect',
      label: '籍贯',
      defaultValue: '1-1-1',
      options: areaOption.value
    },
    birthday: {
      type: 'date',
      label: '出生日期',
      defaultValue: '',
      required: true,
      showFormat: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    },
    signDate: {
      type: 'date',
      label: '签到日期',
      defaultValue: [],
      required: true,
      showFormat: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    workStart: {
      type: 'date',
      label: '开始工作时间',
      picker: 'year',
      defaultValue: '',
      required: true,
      showFormat: 'YYYY',
      valueFormat: 'YYYY'
    },
    studyDate: {
      type: 'date',
      label: '大学时间',
      picker: 'daterange',
      defaultValue: '',
      required: true,
      showFormat: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    },
    like: {
      type: 'checkBox',
      label: '爱好',
      defaultValue: undefined,
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
      defaultValue: '',
      required: true,
      options: [
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
      ]
    },
    address: {
      type: 'radio',
      label: '户籍',
      defaultValue: undefined,
      required: true,
      options: [
        { label: '城镇', value: 'city' },
        { label: '农村', value: 'country' }
      ]
    },
    remark: {
      type: 'textarea',
      label: '备注',
      defaultValue: '',
      required: true,
      rows: 4,
      style: {
        width: '100%'
      }
    }
  };
});
const formRef = ref();

//提交
const handleSubmit = async () => {
  const check = await formRef.value?.check();
  if (check) {
    const data = formRef.value?.submit();
    console.log(data);
  }
};
//性别改变
const sexChange = (value: any) => {
  formRef.value.form.area = '';
  if (value === 1) {
    areaOption.value = [
      {
        value: '3',
        label: '天津市',
        children: [
          {
            value: '3-1',
            label: '和平区',
            children: [
              {
                value: '3-1-1',
                label: '和平街道'
              }
            ]
          }
        ]
      },
      {
        value: '4',
        label: '上海市',
        children: [
          {
            value: '4-1',
            label: '黄浦区',
            children: [
              {
                value: '4-1-1',
                label: '黄浦区街道'
              }
            ]
          },
          {
            value: '4-2',
            label: '徐汇区',
            children: [
              {
                value: '4-2-1',
                label: '徐汇街道'
              }
            ]
          }
        ]
      }
    ];
  } else {
    areaOption.value = [
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
            label: '青羊区',
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
  }
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
</script>
<style scoped lang="scss">
.button {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>
