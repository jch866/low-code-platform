import { useTimeout } from './useTimeout'
import { unref } from 'vue'
/**
 * 延迟的打开和关闭, 当触发函数时使用启动延时函数，延时函数启动会清除当前scope中已经存在的延迟执行。
 *
 * @param {
 *  showDelay, // open函数执行的延迟时间
 *  hideDelay, // close函数执行的延迟时间
 *  open, // open函数
 *  close // close函数
 * }
 * @returns {
 *  onOpen, // 包装了延迟设置的open函数
 *  onClose // 包装了延迟设置的close函数
 * }
 */
export const useDelayedToggle = ({ showDelay, hideDelay, open, close }) => {
  const { launchTimeout } = useTimeout()
  const onOpen = (event) => {
    launchTimeout(() => {
      open(event)
    }, unref(showDelay))
  }
  const onClose = (event) => {
    launchTimeout(() => {
      close(event)
    }, unref(hideDelay))
  }
  return { onOpen, onClose }
}
