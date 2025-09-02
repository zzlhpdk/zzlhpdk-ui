<template>
  <div style="width: 100%">
    <!-- 查询组件 -->
    <div v-if="collapse" style="width: 100%; text-align: right">
      <el-button :icon="ArrowDown" @click="() => handleCollapse(false)"
        >展开筛选条件</el-button
      >
    </div>
    <transition name="collapse">
      <zzForm
        v-if="tableConfig.showSearch && !collapse"
        v-model="searchFormData"
        :formFields="formFields"
        :formConfig="searchConfig">
        <template #buttonSlot>
          <span class="search-buttons">
            <el-button
              :icon="Search"
              type="primary"
              @click="handleSearch"
              :loading="loading">
              查询
            </el-button>
            <el-button
              :icon="RefreshLeft"
              style="margin-left: 20px"
              :loading="loading"
              @click="handleRest">
              重置
            </el-button>
            <el-button :icon="ArrowUp" @click="() => handleCollapse(true)"
              >收起</el-button
            >
          </span>
        </template>
        <slot name="searchSlot">
          
        </slot>
      </zzForm>
    </transition>
    <!--  表格头部组件 -->
    <slot name="tableHeader"></slot>
    <!-- 表格组件 -->
    <el-table
      ref="tableRef"
      :cell-style="{ textAlign: tableConfig.cellPosition || 'center' }"
      :header-cell-style="{
        textAlign: tableConfig.cellPosition || 'center',
        background: 'var(--el-table-row-hover-bg-color)',
        color: 'var(--el-text-color-primary)'
      }"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      v-loading="loading"
      :row-key="tableConfig.rowKey"
      :highlight-current-row="tableConfig.singleSelect"
      @selection-change="selectionChange"
      @sort-change="tableConfig.sortChange"
      :border="tableConfig.border ?? true">
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
          v-if="!item.slot && !item.remove"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed ? item.fixed : false"
          :key="item.prop"
          :sortable="item?.sortable ?? false"
          show-overflow-tooltip>
          <template #header v-if="item.headerSlot">
            <slot :name="item.headerSlot"></slot>
          </template>
          <template #default="{ row }">
            <span :style="item.style || null">{{ showLable(row, item) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="item.slot && !item.remove"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed ? item.fixed : false"
          :key="item.prop + 1"
          :sortable="item?.sortable ?? false"
          show-overflow-tooltip>
          <template #header v-if="item.headerSlot">
            <slot :name="item.headerSlot"></slot>
          </template>
          <template #default="{ row, column }">
            <slot :name="item.slot" :row="row" :column="column"></slot>
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
        @current-change="(current:number)=>handleChangePagination(current, 'current')"
        @size-change="(size:number)=>handleChangePagination(size, 'size')" />
    </div>
  </div>
</template>
<script setup lang="ts">
import zzForm from '../Form/index.vue';
import { ref, onMounted, toRefs, getCurrentInstance, computed } from 'vue';
import {
  Search,
  RefreshLeft,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue';
import { deepClone } from '../../utils/func';

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
      reserveSelection: false, //是否保留已选择项
      beforeRequest: null, // 新增请求拦截器
      sortChange: () => {},
      border: true,
      cellPosition: 'center'
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
      type: 'search'
    }),
    type: Object
  },
  modelValue: {
    default: () => ({}),
    type: Object
  }
});
const { tableColumns, tableConfig, searchFields, searchConfig } = toRefs(props);

const searchFormData = defineModel('modelValue', {
  default: () => ({}),
  type: Object
});
const formFields = computed(() => {
  return {
    ...searchFields.value,
    custom: {
      type: 'custom',
      slot: 'buttonSlot'
    }
  };
});
const total = ref(0);
const pageInfo = ref({ current: 1, size: 10 });
const loading = ref(false);
const tableData = ref([]);
const allResponse = ref({});

// 将子组件方法提升到父实例
const tableRef = ref<any>(null);
const refUp = () => {
  const instance: any = getCurrentInstance();
  // 暴露表单组件所有方法
  Object.entries(tableRef.value).forEach(([key, value]) => {
    instance.exposed[key] = value;
  });
};
onMounted(() => {
  getTableData();
  refUp();
});

// 获取分页数据
const getTableData = async () => {
  if (!tableConfig.value.pageApi) return;
  loading.value = true;
  let params: any = {
    ...searchConfig.value.defaultSearch,
    ...pageInfo.value,
    ...searchFormData.value
  };
  // 请求拦截逻辑
  if (typeof tableConfig.value.beforeRequest === 'function') {
    params = await tableConfig.value.beforeRequest(params);
  }
  tableConfig.value
    .pageApi(params)
    .then((response: any) => {
      tableData.value = response?.records || response?.data?.records || [];
      total.value = Number(response?.total ?? response?.data?.total ?? 0);
      allResponse.value = response;
    })
    .finally(() => {
      loading.value = false;
      emits('sendSearchData', deepClone(searchFormData.value));
      emits('sendResponseData', deepClone(allResponse.value));
      emits(
        'sendPageData',
        deepClone({ ...pageInfo.value, total: total.value })
      );
      emits('sendTableData', deepClone(tableData.value));
    });
};

const emits = defineEmits([
  'sendSelectData',
  'sendSearchData',
  'sendResponseData',
  'sendPageData',
  'sendTableData'
]);
// 查询
const handleSearch = () => {
  getTableData();
};
// 重置
const handleRest = () => {
  Object.keys(searchFormData.value).forEach(key => {
    delete searchFormData.value[key];
  });
  pageInfo.value = {
    current: 1,
    size: 10
  };
  getTableData();
};
// 多选
const selectionChange = (selection: any) => {
  emits('sendSelectData', selection);
};
//设置序号
const indexMethod = (index: number) => {
  return (pageInfo.value.current - 1) * pageInfo.value.size + index + 1;
};
//展示中文
const showLable = (row: any, item: any) => {
  if (item.options) {
    const thisOption = item.options.find(
      (i: any) => String(i.value) === String(row[item.prop])
    );
    if (thisOption) return thisOption?.label ?? '';
  }
  return row[item.prop];
};
//折叠
const collapse = ref(false);
const handleCollapse = (isCollapse: boolean) => {
  collapse.value = isCollapse;
};
//分页处理
const handleChangePagination = (val: any, type: string) => {
  pageInfo.value[type] = val;
  handleSearch();
};
defineExpose({
  getTableData,
  tableData,
  selectionChange,
  handleRest,
  handleChangePagination
});
</script>
<style scoped lang="scss">
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: top;
}

.collapse-enter-from,
.collapse-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}
</style>
