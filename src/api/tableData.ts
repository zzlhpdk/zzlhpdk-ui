import request from '../utils/request';

export function tableDataApi(query?: Object) {
  return request({
    url: 'http://localhost:5173/public/json/tableData.json',
    method: 'get',
    params: query
  });
}
