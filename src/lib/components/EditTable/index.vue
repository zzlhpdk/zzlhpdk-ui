<template>
  <div>
    <el-form :model="form" ref="formRef">
      <el-table
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          background: 'var(--el-table-row-hover-bg-color)',
          color: 'var(--el-text-color-primary)',
          textAlign: 'center'
        }"
        :row-key="formConfig.rowKey || 'id'"
        border
        :data="form.tableData"
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column
          v-if="formConfig.showIndex"
          prop="index"
          label="序号"
          width="80">
          <template #default="{ row }">
            {{ row['index'] + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, key) in formFields"
          :prop="key"
          :label="item.label"
          :label-width="item.labelWidth || formConfig.labelWidth || '120px'">
          <template #default="{ row }">
            <el-form-item
              v-if="item.type === 'select'"
              :prop="`tableData[${row.index}].${key}`"
              :rules="setRule(item, '选择')"
              :placeholder="setPlaceholder(item, '选择')">
              <el-select
                :mode="item.mode || 'default'"
                style="width: 100%"
                :multiple="item.multiple"
                :filterable="item.filterable || true"
                :clearable="item.clearable || true"
                :collapse-tags="item.collapseTags"
                :collapse-tags-tooltip="item.collapseTagsTooltip"
                :disabled="setDisabled(item)"
                v-model="row[key]">
                <el-option
                  v-for="option in item.options"
                  :key="option.key || option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled || false" />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.type === 'input'"
              :prop="`tableData[${row.index}].${key}`"
              :rules="setRule(item, '输入')"
              :placeholder="setPlaceholder(item, '输入')">
              <el-input
                :type="item.inputType || 'text'"
                :disabled="setDisabled(item)"
                v-model.trim="row[key]"
                :maxlength="item.maxlength || 30"
                :placeholder="setPlaceholder(item, '输入')" />
            </el-form-item>
            <el-form-item
              v-if="item.type === 'date'"
              :prop="`tableData[${row.index}].${key}`"
              :rules="setRule(item, '选择')"
              :placeholder="setPlaceholder(item, '选择')">
              <el-date-picker
                :key="key"
                :disabled="setDisabled(item)"
                v-model="row[key]"
                :type="item.picker || 'date'"
                :format="item.showFormat || 'YYYY-MM-DD HH:mm:ss'"
                :placeholder="setPlaceholder(item, '选择')"
                :value-format="
                  item.valueFormat || item.showFormat || 'YYYY-MM-DD HH:mm:ss'
                "
                style="width: 100%"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled-date="item.disabledDate || null"
                :picker-options="item.pickerOptions || ''"
                :shortcuts="item.shortcuts || []"
                :default-time="item.defaultTime"
                range-separator="/" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="120px">
          <template #default="scope">
            <div class="buttons">
              <el-button
                v-if="scope.$index === form.tableData.length - 1"
                link
                type="primary"
                @click="handleLink(scope.row)">
                添加
              </el-button>
              <el-button
                :disabled="form.tableData.length === 1"
                link
                type="danger"
                @click="handleRemove(scope.row.uuId)">
                移除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted, computed } from 'vue';
import { getUUId } from '../../utils/func';

const form: any = ref({
  tableData: []
});

const props = defineProps({
  formConfig: {
    type: Object,
    default: () => {
      return {
        labelWidth: '120px',
        type: 'submit',
        labelPosition: 'right',
        showIndex: true,
        rowKey: 'id'
      };
    }
  },
  formFields: {
    default: () => {},
    type: Object
  }
});

const { formFields, formConfig } = toRefs(props);

// 把每一行的索引放进 row
const tableRowClassName = ({
  row,
  rowIndex
}: {
  row: any;
  rowIndex: number;
}) => {
  row.index = rowIndex;
};

const handleAdd = (data?: any) => {
  const uuId = getUUId();
  const keys = Object.keys(formFields.value);
  const row: any = {};
  if (!row) return;
  keys.forEach(key => {
    row[key] = data[key] || '';
  });
  form.value.tableData.push({ ...row, uuId: uuId });
};

onMounted(() => {
  handleAdd({});
});

const handleLink = (row: any) => {
  handleAdd({});
};

const handleRemove = (uuId: string) => {
  form.value.tableData = form.value.tableData.filter(
    (row: any) => row.uuId !== uuId
  );
};

const handleSave = (row: any) => {
  // 这里可以添加保存数据的逻辑
  console.log('保存数据:', row);
};

const handleCancel = (row: any) => {
  // 这里可以添加取消编辑的逻辑
  console.log('取消编辑:', row);
};

const setRule = (item: any, desc: string) => {
  if (formConfig.value.type === 'view') return [];
  if (formConfig.value.type === 'submit') {
    // 只有必输条件 eg:年龄必输
    if (item.required && !item.rules) {
      return [
        {
          required: item.required,
          message: `请${desc}${item.label || '此项内容'}`,
          trigger: ['change', 'blur']
        }
      ];
    }
    // 必输，并且有其他条件 eg:年龄必输，并且要超过 18 岁
    if (item.required && item.rules && item.rules.length > 0) {
      return [
        ...item.rules,
        {
          required: item.required,
          message: `请${desc}${item.label || '此项内容'}`,
          trigger: ['change', 'blur']
        }
      ];
    }
    // 非必输，有其他条件 eg:年龄非必输，超过 18 岁
    if (item.rules && item.rules.length > 0) {
      return [
        ...item.rules,
        {
          required: item.required,
          message: `请${desc}${item.label || '此项内容'}`,
          trigger: ['change', 'blur']
        }
      ];
    }
  }
  return [];
};

const setPlaceholder = (item: any, desc: string) => {
  if (item.placeholder) return item.placeholder;
  if (formConfig.value.type !== 'view') {
    return `请${desc}${item.label}`;
  }
  return '';
};

const setDisabled = (item: any) => {
  if (formConfig.value.type === 'view') return true;
  else return item.disabled || false;
};
const result = computed(() => {
  return form.value?.tableData;
});
defineExpose({
  handleAdd,
  result
});
</script>

<style scoped lang="scss">
.buttons {
  position: absolute;
  top: 18%;
}
</style>
