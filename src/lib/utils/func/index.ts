/**
 * @description 设置唯一值
 */
const getUUId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
//深拷贝
const deepClone = (obj, hash = new WeakMap()) => {
  // 处理基本类型和null
  if (obj === null || typeof obj !== 'object') return obj;
  // 处理特殊对象类型
  switch (Object.prototype.toString.call(obj)) {
    case '[object Date]':
      return new Date(obj);
    case '[object RegExp]':
      return new RegExp(obj);
    case '[object Array]':
      return obj.map(item => deepClone(item, hash));
  }
  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);
  // 创建新对象并保持原型链
  const cloneObj = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, cloneObj);
  // 递归拷贝属性
  for (const key of Reflect.ownKeys(obj)) {
    cloneObj[key] = deepClone(obj[key], hash);
  }
  return cloneObj;
};
//删除对象里值为 null  undefind  '' 的方法
const removeEmptyValues = (obj: Record<string, any>): Record<string, any> => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    // 过滤掉 null、undefined、空字符串和 NaN
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !Number.isNaN(value)
    ) {
      // 如果是对象，递归处理
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = removeEmptyValues(value);
        // 只有当递归处理后对象不为空时才保留
        if (Object.keys(cleanedValue).length > 0) {
          result[key] = cleanedValue;
        }
      } else if (Array.isArray(value)) {
        // 处理数组，过滤掉空值和 NaN
        const filteredArray = value.filter(
          item =>
            item !== null &&
            item !== undefined &&
            item !== '' &&
            !Number.isNaN(item)
        );
        if (filteredArray.length > 0) {
          result[key] = filteredArray;
        }
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};

export { getUUId, deepClone, removeEmptyValues };
