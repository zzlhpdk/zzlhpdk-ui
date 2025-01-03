import form from './components/Form/index.vue';
import table from './components/Table/index.vue';

const components = {
  form,
  table
};
// 批量组件注册
const install = function (Vue) {
  for (const key in components) {
    Vue.component(`zz-${key}`, components[key]);
  }
};

export default install;
