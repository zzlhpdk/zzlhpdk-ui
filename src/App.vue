<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="表单" name="first"> <FormPage /></el-tab-pane>
    <el-tab-pane label="表格" name="second"> <TablePage /></el-tab-pane>
    <el-tab-pane label="编辑表格" name="three"> <EditTablePage /></el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import FormPage from '@/views/FormPage/index.vue';
import TablePage from '@/views/TablePage/index.vue';
import EditTablePage from '@/views/EditTablePage/index.vue';

const activeName = ref('first');
const handleClick = (tab: TabsPaneContext, event: Event) => {};
</script>
<style scoped lang="scss"></style>
