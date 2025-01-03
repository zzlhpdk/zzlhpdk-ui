# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## 打包步骤

- npm config set registry https://registry.npmjs.org
- npm run build
- cd /src/lib/package.json
- copy package.json to dist
- change version
- npm publish
- npm config set registry https://registry.npmmirror.com
- npm config set registry  https://registry.npm.taobao.org/  
