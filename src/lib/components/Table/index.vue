<template>
  <div style="width: 100%">
    <!-- 查询组件 -->
    <zzForm
      v-if="tableConfig.showSearch"
      ref="zzFormRef"
      :formFields="searchFields"
      :formConfig="searchConfig">
      <template #custom>
        <span style="display: inline-block; margin-left: 16px; height: 50px">
          <el-button
            :icon="Search"
            type="primary"
            @click="handleSearch"
            :loading="false">
            查询
          </el-button>
          <el-button
            :icon="RefreshLeft"
            style="margin-left: 20px"
            :loading="false"
            @click="handleRest">
            重置
          </el-button>
        </span>
      </template>
    </zzForm>
    <!--  表格头部组件 -->
    <slot name="tableHeader"></slot>
    <!-- 表格组件 -->
    <el-table
      ref="tableRef"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        textAlign: 'center',
        background: 'var(--el-table-row-hover-bg-color)',
        color: 'var(--el-text-color-primary)'
      }"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      v-loading="loading"
      :row-key="tableConfig.rowKey"
      :highlight-current-row="tableConfig.singleSelect"
      @selection-change="selectionChange"
      border>
      <el-table-column
        v-if="tableConfig.multiple"
        :reserve-selection="tableConfig.reserveSelection"
        type="selection"
        width="55" />
      <el-table-column
        fixed="left"
        type="index"
        :index="indexMethod"
        label="序号"
        width="80" />
      <template v-for="item in tableColumns">
        <el-table-column
          v-if="!item.slot"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed ? item.fixed : false"
          :key="item.prop"
          show-overflow-tooltip
          :formatter="item.formatter ? (row: any, column: any, )=>item.formatter(row,column) : null">
          <template #default="{ row }">
            <span :style="item.style || null">{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed ? item.fixed : false"
          :key="item.prop + 1"
          show-overflow-tooltip
          :formatter="item.formatter ? (row: any, column: any, )=>item.formatter(row,column) : null">
          <template v-slot="scope">
            <slot
              :name="item.slot"
              :row="scope.row"
              :column="scope.column"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div
      v-if="!tableConfig.hiddenPageInfo"
      style="text-align: right; width: 100%; margin-top: 20px">
      <el-pagination
        v-model:current-page="pageInfo.current"
        :page-size="pageInfo.size"
        layout="total, sizes,prev, pager, next,jumper"
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange" />
    </div>
  </div>
</template>
<script setup lang="ts">
import zzForm from '../Form/index.vue';
import { ref, onMounted, toRefs } from 'vue';
import { Search, RefreshLeft } from '@element-plus/icons-vue';
defineOptions({
  name: 'zz-table'
});
const props = defineProps({
  tableColumns: {
    type: Object,
    default: () => {
      return {};
    }
  },
  tableConfig: {
    default: () => ({
      rowKey: 'id', // 表格数据唯一标识
      showSearch: false, //是否显示搜索
      multiple: false, //是否多选
      singleSelect: false, //是否单选
      pageApi: () => {}, //请求接口
      hiddenPageInfo: false, //是否隐藏分页信息
      reserveSelection: false //是否保留已选择项
    }),
    type: Object
  },
  searchFields: {
    default: () => {
      return {};
    },
    type: Object
  },
  searchConfig: {
    default: () => ({
      defaultSearch: {}, //搜索默认
      labelWidth: '120px',
      type: 'search',
      labelPosition: 'right'
    }),
    type: Object
  }
});
const { tableColumns, tableConfig, searchFields, searchConfig } = toRefs(props);

const total = ref(0);
const pageInfo = ref({ current: 1, size: 10 });
const loading = ref(false);
const tableData = ref([]);
const allResponse = ref({});
onMounted(() => {
  getTableData();
});
// 获取分页数据
const zzFormRef = ref();
const getTableData = async (searchFormData?: any) => {
  if (!tableConfig.value.pageApi) return;
  loading.value = true;
  tableConfig.value
    .pageApi({
      ...searchConfig.value.defaultSearch,
      ...pageInfo.value,
      ...searchFormData
    })
    .then((response: any) => {
      tableData.value = response?.records;
      total.value = Number(response.total);
      allResponse.value = response;
    })
    .finally(() => {
      loading.value = false;
      //暴露所有查询参数
      emits('sendSearchInfo', {
        total: total.value,
        pageInfo: pageInfo.value,
        searchFormData,
        loading: loading.value,
        allResponse: allResponse.value
      });
    });
};
const emits = defineEmits(['selectionChange', 'sendSearchInfo']);
// 查询
const handleSearch = () => {
  const searchFormData = zzFormRef.value.form;
  getTableData(searchFormData);
};
// 重置
const handleRest = () => {
  zzFormRef.value.resetFields();
  pageInfo.value = {
    current: 1,
    size: 10
  };
  getTableData();
};
//页码改变
const currentChange = (current: number) => {
  pageInfo.value.current = current;
  handleSearch();
};
// 每页数量
const sizeChange = (size: number) => {
  pageInfo.value.size = size;
  handleSearch();
};
// 多选
const selectionChange = (selection: any) => {
  emits('selectionChange', selection);
};
//设置序号
const indexMethod = (index: number) => {
  return (pageInfo.value.current - 1) * pageInfo.value.size + index + 1;
};
defineExpose({
  getTableData,
  tableData,
  selectionChange,
  handleRest
});
</script>
<style scoped lang="scss"></style>
