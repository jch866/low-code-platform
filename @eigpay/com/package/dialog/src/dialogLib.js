import { ref } from 'vue'

// 记录dialog弹出的层级，当层级为零时，重新让`document.body`恢复可以滚动
export const dialogLevel = ref(0)
