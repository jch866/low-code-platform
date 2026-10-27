import { buildCssNamespace, useZIndex } from '../../util'
import { createPopper } from '@popperjs/core'
import { useDelayedToggle } from '../../hooks/useDelayedToggle'
export const tableContextKey = Symbol('table')

export function parseWidth(width) {
  if (width === '') return width
  if (width !== undefined) {
    width = Number.parseInt(width, 10)
    if (Number.isNaN(width)) {
      width = ''
    }
  }
  return width
}

export function parseMinWidth(minWidth) {
  if (minWidth === '') return minWidth
  if (minWidth !== undefined) {
    minWidth = parseWidth(minWidth)
    if (Number.isNaN(minWidth)) {
      minWidth = 80
    }
  }
  return minWidth
}

export function parseHeight(height) {
  if (typeof height === 'number') {
    return height
  }
  if (typeof height === 'string') {
    if (/^\d+(?:px)?$/.test(height)) {
      return Number.parseInt(height, 10)
    } else {
      return height
    }
  }
  return null
}

export let removePopper

export function createTablePopper(
  parentNode,
  trigger,
  popperContent,
  popperOptions,
  tooltipEffect = 'light'
) {
  const ns = buildCssNamespace('').namespace
  const { nextZIndex } = useZIndex()
  const scrollContainer = parentNode?.querySelector(`.${ns}-scrollbar__wrap`)
  function renderContent() {
    const isLight = tooltipEffect === 'light'
    const content = document.createElement('div')
    content.className = `${ns}-popper ${isLight ? 'is-light' : 'is-dark'} ${ns}-table-popper`
    popperContent = document.createTextNode(popperContent)
    content.appendChild(popperContent)
    content.style.zIndex = `${nextZIndex()}`
    // Avoid side effects caused by append to body
    parentNode?.appendChild(content)
    return content
  }
  function renderArrow() {
    const isLight = tooltipEffect === 'light'
    const arrow = document.createElement('div')
    arrow.className = `${ns}-popper__arrow ${isLight ? 'is-light' : 'is-dark'}`
    return arrow
  }
  function showPopper() {
    popperInstance && popperInstance.update()
  }
  removePopper?.()
  removePopper = () => {
    try {
      popperInstance && popperInstance.destroy()
      content && parentNode?.removeChild(content)
      trigger.removeEventListener('mouseenter', onOpen)
      trigger.removeEventListener('mouseleave', onClose)
      scrollContainer?.removeEventListener('scroll', onClose)
      content.removeEventListener('mouseenter', onOpen)
      content.removeEventListener('mouseleave', onClose)
      removePopper = undefined
    } catch {
      void 0
    }
  }
  const { onOpen, onClose } = useDelayedToggle({
    showDelay: 0,
    hideDelay: 350,
    open: showPopper,
    close: removePopper
  })
  let popperInstance = null
  const content = renderContent()
  const arrow = renderArrow()
  content.appendChild(arrow)
  content.addEventListener('mouseenter', onOpen)
  content.addEventListener('mouseleave', onClose)
  popperInstance = createPopper(trigger.querySelector('.cell'), content, {
    strategy: 'absolute',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      },
      {
        name: 'arrow',
        options: {
          element: arrow,
          padding: 10
        }
      }
    ],
    ...popperOptions
  })
  trigger.addEventListener('mouseenter', onOpen)
  trigger.addEventListener('mouseleave', onClose)
  scrollContainer?.addEventListener('scroll', onClose)
  return popperInstance
}
