import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 50000 // 全局超时时间
});

//响应拦截器
service.interceptors.response.use(
  //请求头200处理
  response => {
    const {
      config: {
        responseType,
        headers: { showSuccessMessage }
      },
      data: { code, msg, data, encryption }
    } = response;
    if (code === 401) {
      failureToken();
      return;
    }
    //成功
    if (code === 0) {
      return data;
    }
    // 失败
    else {
      Promise.reject(response);
    }
  },
  // 请求头非200处理
  error => {
    //token失效
    if (error.response.status === 424) {
      failureToken();
      return;
    }

    return Promise.reject(error);
  }
);
// 常用header
export enum CommonHeaderEnum {
  'TENANT_ID' = 'TENANT-ID',
  'ENC_FLAG' = 'Enc-Flag',
  'AUTHORIZATION' = 'Authorization'
}
// 登录失效操作 token失效
const failureToken = () => {
  // controller.abort();
};

// 导出 axios 实例
export default service;
