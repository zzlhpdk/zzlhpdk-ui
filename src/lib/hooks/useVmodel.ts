import { computed } from 'vue';

const useVModel = (props: any, propName: string, emit: any) => {
  return computed({
    get() {
      // 使用可选链操作符和空值合并操作符
      const propValue = props[propName] ?? {};
      return new Proxy(propValue, {
        get(target, key) {
          return Reflect.get(target, key);
        },
        set(target, key, value) {
          // 使用扩展运算符更新对象
          emit(`update:${propName}`, {
            ...target,
            [key]: value
          });
          return true;
        }
      });
    },
    set(newValue) {
      emit(`update:${propName}`, newValue);
    }
  });
};

export default useVModel;
