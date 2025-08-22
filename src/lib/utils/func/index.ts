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
export { getUUId, deepClone };
