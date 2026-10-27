import { computed, watch, reactive } from "vue";
import { computedAsync } from "@vueuse/core";
import { useDictionaryStore } from "@/stores/dictionary";

/**
 *
 * @param {*} key  支持多个 key 以逗号分隔
 * @returns {{ dict, reactiveDict, labelValue, map, toLabelValue, toMap }}
 * dict: 一步计算属性，返回数据字典，如果查询的字典key只有一个，返回数组，如果有多个字典key，返回对象，对象的key为字典key，值为字典项数组
 * reactiveDict: 响应式对象，返回对象，对象的key为字典key，值为数组，如果要保持每个字典key的响应式，使用 const { dictKey } = toRefs(reactiveDict)，来保持每个字典key的响应式。
 * labelValue: 计算属性，是如果查询的字典key只有一个， 返回数据字典项的label和value的数组，如果查询的字典key是多个，返回空数组
 * map: 计算属性，是如果查询的字典key只有一个， 返回数据字典项value为字段名,字典项的label为字段对应的值，如果查询的字典key是多个，返回空对象
 * toLabelValue: 方法，参数为字典项数组，返回数据字典项的label和value的数组
 * toMap: 方法，参数为字典项数组，返回对象格式，数据字典项value为字段名,字典项的label为字段对应的值
 */

export const useDict = (key) => {
  const store = useDictionaryStore();
  const keys = key.split(',').map((item) => item.trim())
  const defaultValue =
    keys.length <= 1
      ? []
      : keys.reduce((pre, item) => {
          pre[item] = [];
          return pre;
        }, {});
  // const dictKey = unref(key);
  const dict = computedAsync(async () => {
    const data = await store.getDictionary(key);
    return data;
  }, defaultValue);

  const toLabelValue = (options) => {
    return options?.map((item) => {
      return {
        value: item.lemmaItem,
        label: item.itemName,
      };
    });
  };
  const toMap = (options) => {
    return options?.reduce((pre, item) => {
      pre[item.lemmaItem] = item.itemName;
      return pre;
    }, {});
  };
  const labelValue = computed(() => {
    return keys.length === 1 ? toLabelValue(dict.value) : [];
  });
  const map = computed(() => {
    return keys.length === 1 ? toMap(dict.value) : {};
  });

  const reactiveDict = reactive(
    keys.length <= 1
      ? {
          [key]: [],
        }
      : dict.value,
  );

  watch(
    dict,
    (newVal) => {
      Object.assign(
        reactiveDict,
        keys.length <= 1 ? { [key]: newVal } : newVal,
      );
    },
    { immediate: true },
  );

  return { dict, reactiveDict, labelValue, map, toLabelValue, toMap };
};

export default useDict;
