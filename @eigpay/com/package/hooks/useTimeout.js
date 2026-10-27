export const useTimeout = () => {
  let timeoutId
  const cancelTimeout = () => {
    window.clearTimeout(timeoutId)
  }
  const launchTimeout = (fn, delay = 0) => {
    cancelTimeout()
    timeoutId = window.setTimeout(fn, delay)
  }
  return {
    launchTimeout,
    cancelTimeout
  }
}
