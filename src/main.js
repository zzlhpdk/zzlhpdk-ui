import { createApp } from 'vue';
import './styles/index.scss';
import App from './App.vue';
// import zzlhpdk from 'zzlhpdk-ui/zzlhpdk-ui';
import zzlhpdk from './lib/index';
import element from 'element-plus';
//图标
import * as ElIcons from '@element-plus/icons-vue';
const app = createApp(App);

app.use(element).use(zzlhpdk).mount('#app');
for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component);
}
