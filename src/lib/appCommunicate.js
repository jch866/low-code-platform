let microSubApp = null
/*
 * 是否是子应用实例
 */
function hasSubAppInstance() {
  return !!microSubApp
}

export function getAppName(appEl) {
  const rootEl =
    appEl instanceof HTMLElement ? appEl : document.querySelector(appEl)
  const microApp = rootEl?.closest('micro-app')
  return microApp?.getAttribute('name')
}

/**
 * 初始化与基座应用的通信
 * @param appRoot
 * @return Boolean 是否初始化成功
 */
export function initCommunicate(appEl) {
  const appName = getAppName(appEl)
  const subApp = window[`__SUB_APP__${appName || ''}`] || window.microApp
  if (subApp) {
    microSubApp = subApp
  }
  return hasSubAppInstance()
}

/**
 * 获取基座应用下发的数据，是最后一次下发的数据。
 * @return 下发的数据
 */
function getAppData() {
  if (hasSubAppInstance()) {
    return microSubApp.getData()
  }
}
/**
 * 添加基座应用下发数据的监听器
 * @param listener 监听器
 * @param autoTrigger 是否在注册后成功后用最后下发数据调用监听器
 */
export function addDataListener(listener, autoTrigger) {
  if (hasSubAppInstance()) {
    microSubApp.addDataListener(listener, autoTrigger)
  }
}

/**
 * 移除基座应用下发数据的监听器
 * @param listener 监听器
 */
export function removeDataListener(listner) {
  if (hasSubAppInstance()) {
    microSubApp.removeDataListener(listner)
  }
}
/**
 * 清空所有基座应用下发数据的监听器
 */
export function clearAllListener() {
  if (hasSubAppInstance()) {
    microSubApp.clearDataListener()
  }
}

/**
 * 向基座应用发送数据
 * @param event 被发送的数据
 */
export function dispatchEvent(event) {
  if (hasSubAppInstance()) {
    microSubApp.dispatch(event)
  }
}
/**
 * 向基座应用强制发送数据
 * @param event 被发送的数据
 */
export function forceDispatch(event) {
  if (hasSubAppInstance()) {
    microSubApp.forceDispatch(event)
  }
}
export default {
  initCommunicate,
  addDataListener,
  removeDataListener,
  clearAllListener,
  dispatchEvent,
  getAppData,
  forceDispatch
}
