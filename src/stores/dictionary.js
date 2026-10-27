/* eslint-disable no-console */
// stores/dictionary.js
import { defineStore } from "pinia";
import { getMultiDictsMore } from "@/api/common/common";
import { SUCCESS_STATUS } from "@/config/config";

export const useDictionaryStore = defineStore("dictionary", () => {
  const dictCache = {}; // 存储已获取的数据字典
  const pendingRequests = {}; // 记录正在进行的请求

  const toResult = (keys) => {
    if (keys.length == 1) {
      // 只有一个 key 直接返回
      return dictCache[keys[0]];
    } else {
      return keys.reduce((acc, key) => {
        // 处理多个 key, 返回一个对象
        acc[key] = dictCache[key];
        return acc;
      }, {});
    }
  };

  const getDictionary = async (queryKey) => {
    const keys = queryKey.split(",").map((item) => item.trim());
    const missingKeys = keys.filter((key) => !(key in dictCache)); // 过滤出未缓存的 key
    const newKeys = missingKeys.filter((key) => !(key in pendingRequests)); // 从未缓存的key中过滤出未请求的 key
    // ✅ 如果已缓存，直接返回
    if (missingKeys.length === 0) {
      return toResult(keys);
    }

    // ✅ 如果没有缓存但未请求的 key不存在，等待请求完成
    if (newKeys.length === 0) {
      await Promise.all(missingKeys.map((key) => pendingRequests[key]));
      return toResult(keys);
    }

    // 📡 发送新的 AJAX 请求，并存入 pendingRequests
    // console.log(`📡 发送 AJAX 请求获取数据字典: ${key}`);
    const result = getMultiDictsMore(newKeys.join(","))
      .then((res) => {
        if (res.returnCode === SUCCESS_STATUS) {
          const result = res.result;
          Object.entries(result).forEach(([key, value]) => {
            if (value.length === 0) return;
            dictCache[key] = value; // 存入缓存
          });
        }
      })
      .catch(() => {
        console.error(`❌ 获取数据字典失败: ${newKeys.join(",")}`);
        return [];
      })
      .finally(() => {
        newKeys.forEach((item) => {
          if (item in pendingRequests) {
            delete pendingRequests[item]; // 删除请求
          }
        });
      });
    newKeys.forEach((key) => {
      pendingRequests[key] = result; // 存入请求
    });
    await Promise.all(newKeys.map((key) => pendingRequests[key]));
    return toResult(keys);
  };

  return { getDictionary };
});
