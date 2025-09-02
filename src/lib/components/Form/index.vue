<template>
  <el-form
    :label-position="mergeFormConfig.labelPosition ?? 'left'"
    :inline="mergeFormConfig.inline ?? true"
    :style="mergeFormConfig.style"
    ref="formRef"
    :label-width="mergeFormConfig.labelWidth || '120px'"
    :model="form">
    <FormItem
      :formConfig="mergeFormConfig"
      :formFields="formFields"
      v-model="form">
      <template v-for="(_, name) in $slots" #[name]="scope">
        <slot :name="name" v-bind="scope" />
      </template>
    </FormItem>
  </el-form>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref, toRefs, computed } from 'vue';
import FormItem from './components/FormItem/index.vue';

// 组件属性定义
const props = defineProps({
  // 表单配置对象，包含布局、样式等设置
  formConfig: {
    type: Object,
    default: () => ({})
  },
  // 表单项配置对象，定义各个表单字段
  formFields: {
    default: () => ({}),
    type: Object
  }
});

// 解构props响应式引用
const { formFields, formConfig } = toRefs(props);

// 合并表单配置（默认配置 + 传入配置）
const mergeFormConfig = computed(() => ({
  labelWidth: '120px', // 标签宽度
  type: 'submit', // 表单类型（submit/view/search）
  labelPosition: 'left', // 标签对齐方式
  inline: true, // 是否行内布局
  ...formConfig.value, // 合并传入的表单字段配置
  style: {
    width: '100%',
    ...(formConfig.value.style || {}) // 深度合并样式配置
  }
}));

// 表单数据双向绑定
const form = defineModel('modelValue', {
  default: () => ({}),
  type: Object
});

// 表单引用和实例方法暴露
const formRef = ref<any>(null);
// 将子组件方法提升到父实例
const refUp = () => {
  const instance: any = getCurrentInstance();
  // 暴露表单组件所有方法
  Object.entries(formRef.value.$.exposed).forEach(([key, value]) => {
    instance.exposed[key] = value;
  });
};

// 组件挂载后执行实例方法提升
onMounted(() => {
  refUp();
});

// 表单校验方法
const check = async () => {
  return formRef.value.validate((valid: boolean) => {
    if (!valid) {
      // 验证失败时滚动到第一个错误项
      setTimeout(() => {
        const el = document.querySelectorAll('.el-form-item__error')[0];
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
    return valid;
  });
};

// 暴露校验方法给父组件
defineExpose({ check });
</script>
<style scoped lang="scss"></style>
