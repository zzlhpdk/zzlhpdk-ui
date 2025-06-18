<template>
  <el-form
    :label-position="formConfig.labelPosition"
    layout="inline"
    class="form"
    :style="formConfig.style"
    ref="formRef"
    :label-width="formConfig.labelWidth || '120px'"
    :model="form">
    <FormItem :formConfig="formConfig" :formFields="formFields" v-model="form">
      <template #custom>
        <slot name="custom"></slot>
      </template>
    </FormItem>
  </el-form>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref, toRefs } from 'vue';
import useVmodel from '../../hooks/useVmodel';
import FormItem from './components/FormItem/index.vue';

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
  },
  modelValue: {
    default: () => {},
    type: Object
  }
});
const { formFields, formConfig } = toRefs(props);
const emit = defineEmits(['update:modelValue']);
const form = useVmodel(props, 'modelValue', emit);

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

defineExpose({ check });
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
