<template>
  <div>
    <div class="flex items-center">
      <el-icon color="red" class="mr-1"><WarningFilled /></el-icon
      ><span>{{ '您目前还未上传资料' }}</span>
    </div>
    <div class="box">
      <el-upload
        :class="
          props.type === 'view' || fileList.length >= fileLimit
            ? 'hiddenPlus'
            : ''
        "
        v-loading="loading"
        action="#"
        :http-request="(data:any) => handleUpload(data)"
        :auto-upload="autoUpload"
        :before-upload="handleBeforeUpload"
        :disabled="props.type === 'view' ? true : false"
        :multiple="false"
        list-type="picture-card"
        :accept="props.fileType.join(',')"
        ref="uploadRef"
        :file-list="fileList"
        :limit="props.fileLimit"
        :on-exceed="handleExceed">
        <Plus style="width: 5em; height: 5em; color: var(--el-color-primary)" />
        <template #file="{ file }">
          <div class="upload-item">
            <div class="item-content">
              <img
                class="el-upload-list__item-thumbnail"
                :src="setImageSrc(file)"
                alt="" />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)">
                  <zoom-in style="width: 1em; height: 1em; color: #fff" />
                </span>
                <span
                  v-if="file.url"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)">
                  <Download style="width: 1em; height: 1em; color: #fff" />
                </span>
                <span
                  v-show="type !== 'view' && file.url"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)">
                  <Delete
                    style="width: 1em; height: 1em; color: #fff"
                    v-if="props?.fileLimit !== 1" />
                </span>
              </span>
            </div>
            <div class="file-name">
              {{ file?.originalFileName + '.' + file?.name?.split('.')?.[1] }}
            </div>
          </div>
        </template>
      </el-upload>
      <div class="mt-5" v-if="props.type !== 'view'">
        <div class="flex items-center">
          <el-icon color="red" class="mr-1"><InfoFilled /></el-icon>
          <span
            >{{
              `仅支持上传${props.fileType.join(',')}格式的文件,`
            }}并且文件大小不超过{{ props.fileSize }}M</span
          >
        </div>
      </div>
    </div>
    <el-dialog width="auto" v-model="dialogVisible">
      <img :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  Delete,
  Download,
  Plus,
  ZoomIn,
  InfoFilled
} from '@element-plus/icons-vue';
import { ElMessage, type UploadFile } from 'element-plus';
import word from '@/assets/file/word.png';
import excel from '@/assets/file/excel.png';
import pdf from '@/assets/file/pdf.png';
import txt from '@/assets/file/txt.png';
import ppt from '@/assets/file/ppt.png';
import zip from '@/assets/file/zip.png';
import rar from '@/assets/file/rar.png';
import other from '@/assets/file/other.png';
import type { UploadProps } from 'element-plus';
import { computed, defineEmits, defineProps, nextTick, watch } from 'vue';
const props = defineProps({
  modelValue: [String, Array],
  // 单个文件大小限制(MB)
  fileSize: {
    type: Number,
    default: 500
  },
  //文件个数限制
  fileLimit: {
    type: Number,
    default: 100
  },
  fileType: {
    type: Array,
    default: () => [
      '.png',
      '.jpg',
      '.jpeg',
      '.doc',
      '.xls',
      '.ppt',
      '.txt',
      '.pdf',
      '.docx',
      '.xlsx',
      '.pptx'
    ]
  },
  data: {
    type: Object,
    default: () => {
      return {};
    }
  },
  dir: {
    type: String,
    default: ''
  },
  autoUpload: {
    type: Boolean,
    default: true
  },
  // submit, 可以删除，view 只能预览
  type: {
    type: String,
    default: 'submit'
  },
  idDelete: {
    type: Boolean,
    default: true
  },
  fileUploadApi: {
    type: Function,
    default: () => {}
  },
  fileDownloadApi: {
    type: Function,
    default: () => {}
  },
  fileDeleteApi: {
    type: Function,
    default: () => {}
  }
});

watch(
  () => props.modelValue,
  (val: any) => {
    if (val && val?.length > 0) {
      nextTick(() => {
        return fileList.value;
      });
    } else {
      nextTick(() => {
        fileList.value = [];
      });
    }
  },
  { deep: true, immediate: true }
);
const number = ref(0);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const fileList = ref([]) as any;
const loading = ref(false);
const emit = defineEmits(['update:modelValue', 'change']);

//设置文件图片
const setImageSrc = (file: any) => {
  let src = other;
  switch (file.name.replace(/.+\./, '')) {
    case 'zip':
      src = zip;
      break;
    case 'doc':
    case 'docx':
      src = word;
      break;
    case 'pdf':
      src = pdf;
      break;
    case 'ppt':
      src = ppt;
      break;
    case 'rar':
      src = rar;
      break;
    case 'xls':
    case 'xlsx':
      src = excel;
      break;
    case 'txt':
      src = txt;
      break;
    case 'jpg':
    case 'png':
    case 'jpeg':
      src = file.url;
      break;
    default:
      src = other;
      break;
  }
  return src;
};
//个数提示
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`最多支持上传${props.fileLimit}个文件`);
};
// 上传前校检格式和大小
const handleBeforeUpload = (file: File) => {
  // 校检文件类型
  if (props.fileType.length) {
    const fileName = file.name.split('.');
    const fileExt = `.${fileName[fileName.length - 1]}`;
    const isTypeOk = props.fileType.includes(fileExt);
    if (!isTypeOk) {
      ElMessage.error(
        `文件格式错误，请上传 ${props.fileType.join(',')} 格式的文件`
      );
      return false;
    }
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      ElMessage.error(`文件大小不能超过 ${props.fileSize}MB`);
      return false;
    }
  }
  setImageSrc(file);
  number.value++;
  return true;
};
const uploadRef = ref();

// 文件上传
loading.value = false;
const handleUpload = ({ file }: { file: any }) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('dir', props.dir);
  loading.value = true;
  props
    .fileUploadApi(formData)
    .then((res: any) => {
      if (res.code === 0) {
        ElMessage.success(res.msg || '成功上传');
        // 保存上传成功返回的信息
        fileList.value.push({
          ...res.data,
          name: res?.data?.name
        });
        emit('change', fileList.value);
        emit('update:modelValue', fileList.value);
      } else {
        uploadRef.value.handleRemove(file);
        ElMessage.error(res.msg || '上传失败');
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

//下载
const handleDownload = (file: any) => {
  //将文件名字转换一下
  let name = file?.originalFileName + '.' + file?.name?.split('.')[1];
  props.fileDownloadApi({ id: file.id }).then((response: any) => {
    // 创建一个临时链接，指向文件流的URL
    const urlObject = URL.createObjectURL(response);
    // 创建一个a标签，用于模拟点击下载
    const link = document.createElement('a');
    link.href = urlObject;
    document.body.appendChild(link);
    link.download = name;
    link.click();
    // 释放URL对象
    URL.revokeObjectURL(urlObject);
  });
};
//删除
const handleRemove = (file: any) => {
  props.fileDeleteApi([file.id]).then(() => {
    fileList.value = fileList.value.filter((f: any) => f.id !== file.id);
    number.value--;
    emit('change', fileList.value);
    emit('update:modelValue', fileList.value);
    ElMessage.success('删除成功');
  });
};
</script>
<style lang="scss" scoped>
.box {
  .upload-item {
    padding: 10px;
    position: relative;
    text-align: center;
    width: 100%;
    .file-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: absolute;
      bottom: 2px;
    }
    .item-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 80%;
    }
  }
}
.hiddenPlus {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}
</style>
