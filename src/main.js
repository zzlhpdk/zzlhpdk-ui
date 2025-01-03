import { createApp } from 'vue';
import './styles/index.scss';
import App from './App.vue';
// import zzlhpdk from 'zzlhpdk-ui/zzlhpdk-ui';
import zzlhpdk from './lib/index';

import element from 'element-plus';

const app = createApp(App);
app.use(element).use(zzlhpdk).mount('#app');
