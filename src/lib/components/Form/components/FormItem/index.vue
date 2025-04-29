<template>
  <span
    :style="{
      width: '430px',
      ...item.style
    }"
    v-for="(item, key) of formFields"
    :key="key"
    v-show="!item.hidden">
    <!-- 输入框 -->
    <el-form-item
      v-if="item.type === 'input' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '输入')">
      <el-input
        :show-word-limit="item.showWordLimit || false"
        :show-password="item.showPassword || false"
        :disabled="setDisabled(item)"
        :type="item.inputType || 'text'"
        v-model.trim="form[key]"
        :maxlength="item.maxlength || 30"
        :placeholder="setPlaceholder(item, '输入')"
        @focus="(e:Event) => setFocus(item, e)"
        @blur="(e:Event) => setBlur(item, e)"
        @click="(e:Event) => setClick(item, e)"
        :formatter="item.formatter?(value:string)=> item.formatter(value):null">
        <template v-if="item.append && formConfig.type !== 'view'" #append>
          <el-button
            @click="(e:Event) =>item.appendClick?item.appendClick(e):null"
            :icon="item.icon" />
        </template>
      </el-input>
    </el-form-item>
    <!-- 下拉框 -->
    <el-form-item
      v-if="item.type === 'select' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '输入')">
      <el-select
        :mode="item.mode || 'default'"
        style="width: 100%"
        :multiple="item.multiple"
        :filterable="item.filterable || true"
        :clearable="item.clearable || true"
        :collapse-tags="item.collapseTags"
        :collapse-tags-tooltip="item.collapseTagsTooltip"
        :disabled="setDisabled(item)"
        v-model="form[key]"
        :placeholder="setPlaceholder(item, '选择')"
        @change="
                    (option:Event)  => {
                      item.change ? item.change(option) : null;
                    }
                  ">
        <el-option
          v-for="option in item.options"
          :key="option.key || option.value"
          :label="option.label"
          :value="option.value"
          :disabled="option.disabled || false" />
      </el-select>
    </el-form-item>
    <!-- 树形 -->
    <el-form-item
      v-if="item.type === 'treeSelect' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '选择')">
      <el-tree-select
        :render-after-expand="false"
        v-model="form[key]"
        :data="item.options || []"
        :placeholder="setPlaceholder(item, '选择')"
        :show-checkbox="item.showCheckbox || true"
        :check-strictly="item.checkStrictly || false"
        :disabled="setDisabled(item)"
        :multiple="item.multiple || false"
        :props="item.props || {}"
        :filterable="item.filterable || false"
        :filter-node-method="item.filterNodeMethod || null"
        :expand-on-click-node="item.expandOnClickNode || false"
        :default-expand-all="item.defaultExpandAll || false"
        :default-expanded-keys="item.defaultExpandedKeys || []"
        @node-click="item.nodeClick" />
    </el-form-item>
    <!-- 日期/时间选择 -->
    <el-form-item
      v-if="item.type === 'date' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '输入')">
      <el-date-picker
        :key="key"
        @focus="(e:Event) => setFocus(item, e)"
        @blur="(e:Event)  => setBlur(item, e)"
        @change="(e:Event)  => setChange(item, e)"
        :disabled="setDisabled(item)"
        v-model="form[key]"
        :type="item.picker || 'date'"
        :format="item.showFormat || 'YYYY/MM/DD HH:mm:ss'"
        :placeholder="setPlaceholder(item, '选择')"
        :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
        style="width: 100%"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :disabled-date="item.disabledDate || null"
        :shortcuts="item.shortcuts || []"
        :default-time="item.defaultTime" />
    </el-form-item>
    <!-- 多行输入 -->
    <el-form-item
      v-if="item.type === 'textarea' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '输入')">
      <el-input
        type="textarea"
        show-word-limit
        :placeholder="setPlaceholder(item, '输入')"
        :disabled="setDisabled(item)"
        v-model="form[key]"
        :rows="item.rows || 4"
        :maxlength="item.maxlength || 2000" />
    </el-form-item>
    <!-- 多选框 -->
    <el-form-item
      v-if="item.type === 'checkBox' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '选择')">
      <el-checkbox-group
        v-model="form[key]"
        :disabled="setDisabled(item)"
        :placeholder="setPlaceholder(item, '选择')">
        <el-checkbox
          v-for="option in item.options"
          :label="option.value"
          :key="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <!-- 级联 -->
    <el-form-item
      v-if="item.type === 'cascader' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '选择')">
      <el-cascader
        :placeholder="setPlaceholder(item, '选择')"
        :disabled="setDisabled(item)"
        v-model="form[key]"
        :options="item.options || []"
        :props="item.props || {}"
        :show-all-levels="item.showAllLevels || false"
        :clearable="item.clearable || true"
        collapse-tags
        style="width: 100%"
        filterable
        @change="
									(option:Event)  => {
										item.change ? item.change(option) : null;
									}
								" />
    </el-form-item>
    <!-- 单选框 -->
    <el-form-item
      v-if="item.type === 'radio' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '选择')">
      <el-radio-group
        v-model="form[key]"
        :disabled="setDisabled(item)"
        :placeholder="setPlaceholder(item, '选择')">
        <el-radio
          :key="radio.value"
          v-for="radio in item.options"
          :value="radio.value"
          >{{ radio.label }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <!-- 文件上传 -->
    <!-- <el-form-item
      v-if="item.type === 'file' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '上传')"
    >
      <zzUpload
        :idDelete="item.idDelete"
        :fileType="item.fileType"
        :fileSize="item.fileSize"
        :fileLimit="item.fileLimit || 20"
        :type="item.approvalType || formConfig.type"
        v-model="form[key]"
      />
    </el-form-item> -->
    <!-- 富文本 -->
    <!-- <el-form-item
      v-if="item.type === 'editor' && !item.remove"
      :prop="key"
      :label="item.label"
      :label-width="item.labelWidth || formConfig.labelWidth || '120px'"
      :rules="setRule(item, '输入')"
    >
      <Editor
        :disable="setDisabled(item)"
        :required="item.required"
        v-model:get-html="form[key]"
        :max-length="2000"
        :placeholder="setPlaceholder(item, '输入')"
      ></Editor>
    </el-form-item> -->
  </span>
  <!-- 插槽，自定义内容-->
  <span>
    <slot name="custom"></slot>
  </span>
</template>
<script setup lang="ts">
import { defineProps, toRefs } from 'vue';
// import zzUpload from "/@/components/zzUpload/index.vue";
// import Editor from "/@/components/Editor/index.vue";

const props = defineProps({
  formFields: {
    default: () => {},
    type: Object
  },
  formConfig: {
    type: Object,
    default: () => {
      return {
        labelWidth: '120px',
        type: 'submit'
      };
    }
  },
  form: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const { formFields, formConfig, form } = toRefs(props);

const setRule = (item: any, desc: string) => {
  if (formConfig.value.type === 'view') return [];
  if (formConfig.value.type === 'search') {
    if (item.rules && item.rules.length > 0) {
      return [
        ...item.rules,
        {
          required: false
        }
      ];
    }
    return {
      required: false
    };
  }
  if (formConfig.value.type === 'submit') {
    //只有必输条件 eg:年龄必输
    if (item.required && !item.rules) {
      return [
        {
          required: item.required,
          message: `请${desc}${item.label || '此项内容'}`,
          trigger: ['change', 'blur']
        }
      ];
    }
    //必输，并且有其他条件 eg:年龄必输，并且要超过18岁
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
    //非必输，有其他条件 eg:年龄非必输，超过18岁
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
};
const setDisabled = (item: any) => {
  if (formConfig.value.type === 'view') return true;
  else return item.disabled || false;
};
const setPlaceholder = (item: any, desc: string) => {
  if (item.placeholder) return item.placeholder;
  if (formConfig.value.type !== 'view') {
    return `请${desc}${item.label}`;
  }
  return '';
};
const setFocus = (item: any, e: Event) => {
  if (item.focus) return item.focus(e);
  return null;
};
const setBlur = (item: any, e: Event) => {
  if (item.blur) return item.blur(e);
  return null;
};
const setClick = (item: any, e: Event) => {
  if (item.click) return item.click(e);
  return null;
};
const setChange = (item: any, e: Event) => {
  if (item.change) return item.change(e);
  return null;
};
</script>
<style scoped lang="scss">

</style>
