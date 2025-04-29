<template>
  <el-form
    :label-position="formConfig.labelPosition"
    layout="inline"
    class="form"
    :style="formConfig.style"
    ref="formRef"
    :label-width="formConfig.labelWidth || '120px'"
    :model="form">
    <FormItem :formConfig="formConfig" :formFields="formFields" :form="form">
      <template #custom>
        <slot name="custom"></slot>
      </template>
    </FormItem>
  </el-form>
</template>

<script lang="ts" setup>
import FormItem from './components/FormItem/index.vue';
import { getCurrentInstance, onMounted, ref, toRefs, watch } from 'vue';
defineOptions({
  name: 'zz-form'
});
const props = defineProps({
  formConfig: {
    type: Object,
    default: () => {
      return {
        labelWidth: '120px',
        type: 'submit',
        labelPosition: 'right',
        style: {
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }
      };
    }
  },
  formFields: {
    default: () => {},
    type: Object
  }
});
const { formFields, formConfig } = toRefs(props);

// 初始化表单
const form = ref<any>({});
const init = (data: any) => {
  if (data && Object.keys(data).length > 0)
    Object.keys(data).forEach(key => {
      form.value[key] = data[key].defaultValue;
    });
};

// ref提升,formRef方法暴露到实力上。
const formRef = ref<any>(null);
const refUp = () => {
  const instance: any = getCurrentInstance();
  const entries = Object.entries(formRef.value.$.exposed);
  for (const [key, value] of entries) {
    instance.exposed[key] = value;
  }
};
onMounted(() => {
  refUp();
  init(formFields.value);
});
//表单校验
const check = async () => {
  return formRef.value.validate((valid: boolean) => {
    if (!valid) {
      setTimeout(() => {
        const el = document.querySelectorAll('.el-form-item__error')[0];
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
    return valid;
  });
};
//表单提交
const submit = () => {
  let submitData: any = {};
  for (const key in form.value) {
    submitData[key] = form.value[key];
    // 空值处理
    if (form.value[key] === null || form.value[key] === undefined) {
      submitData[key] = '';
    }
    // //数字处理
    // if (Array.isArray(form.value[key])) {
    //   submitData[key] = form.value[key].join(',');
    // }
  }
  return submitData;
};
defineExpose({ form, check, submit });
</script>
<style scoped lang="scss">
.form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
</style>
