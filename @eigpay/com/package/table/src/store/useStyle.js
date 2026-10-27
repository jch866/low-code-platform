import {
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect
} from 'vue'
import { useResizeObserver } from '@vueuse/core'

function useStyle(props, layout, store, table) {
  const isHidden = ref(false)
  const renderExpanded = ref(null)
  const resizeProxyVisible = ref(false)
  const setDragVisible = (visible) => {
    resizeProxyVisible.value = visible
  }
  const resizeState = ref({
    width: null,
    height: null,
    headerHeight: null
  })

  let stopResizeObserver
  // 用来记录是不是多行表头
  const isGroup = ref(false)
  const scrollbarViewStyle = {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
  // 表的宽度
  const tableWidth = ref()
  // 表的滚动高度
  const tableScrollHeight = ref(0)
  // 表数据区的滚动高度
  const bodyScrollHeight = ref(0)
  // 表头的滚动高度
  const headerScrollHeight = ref(0)
  // 表脚的滚动高度
  const footerScrollHeight = ref(0)

  watchEffect(() => {
    layout.setHeight(props.height)
  })
  watchEffect(() => {
    layout.setMaxHeight(props.maxHeight)
  })
  watch(
    () => props.data,
    (data) => {
      table.store.commit('setData', data)
    },
    {
      immediate: true,
      deep: true
    }
  )

  // 计算属性，是否应更新高度
  const shouldUpdateHeight = computed(() => {
    return (
      props.height ||
      props.maxHeight ||
      store.states.fixedColumns.value.length > 0 ||
      store.states.rightFixedColumns.value.length > 0
    )
  })
  // 计算属性，表style，宽度
  const tableBodyStyles = computed(() => {
    return {
      width: layout.bodyWidth.value ? `${layout.bodyWidth.value}px` : ''
    }
  })

  // 执行布局计算
  const doLayout = () => {
    if (shouldUpdateHeight.value) {
      layout.updateElsHeight()
    }
    layout.updateColumnsWidth()
    requestAnimationFrame(syncPosition)
  }
  onMounted(async () => {
    await nextTick()
    store.updateColumns()
    bindEvents()
    requestAnimationFrame(doLayout)

    const el = table.vnode.el
    const tableHeader = table.refs.headerWrapper
    if (props.flexible && el && el.parentElement) {
      // Automatic minimum size of flex-items
      // Ensure that the main axis does not follow the width of the items
      el.parentElement.style.minWidth = '0'
    }

    resizeState.value = {
      width: (tableWidth.value = el.offsetWidth),
      height: el.offsetHeight,
      headerHeight:
        props.showHeader && tableHeader ? tableHeader.offsetHeight : null
    }

    table.$ready = true
  })

  onBeforeUnmount(() => {
    stopResizeObserver?.()
  })

  const setScrollClassByEl = (el, className) => {
    if (!el) return
    const classList = Array.from(el.classList).filter(
      (item) => !item.startsWith('is-scrolling-')
    )
    classList.push(layout.scrollX.value ? className : 'is-scrolling-none')
    el.className = classList.join(' ')
  }
  const setScrollClass = (className) => {
    const { tableWrapper } = table.refs
    setScrollClassByEl(tableWrapper, className)
  }
  const hasScrollClass = (className) => {
    const { tableWrapper } = table.refs
    return !!(tableWrapper && tableWrapper.classList.contains(className))
  }
  const syncPosition = function () {
    if (!table.refs.scrollBarRef) return
    if (!layout.scrollX.value) {
      const scrollingNoneClass = 'is-scrolling-none'
      if (!hasScrollClass(scrollingNoneClass)) {
        setScrollClass(scrollingNoneClass)
      }
      return
    }
    const scrollContainer = table.refs.scrollBarRef.wrapElement
    if (!scrollContainer) return
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer
    const { headerWrapper, footerWrapper } = table.refs
    if (headerWrapper) headerWrapper.scrollLeft = scrollLeft
    if (footerWrapper) footerWrapper.scrollLeft = scrollLeft
    const maxScrollLeftPosition = scrollWidth - offsetWidth - 1
    if (scrollLeft >= maxScrollLeftPosition) {
      setScrollClass('is-scrolling-right')
    } else if (scrollLeft === 0) {
      setScrollClass('is-scrolling-left')
    } else {
      setScrollClass('is-scrolling-middle')
    }
  }
  const bodyWidth = computed(() => {
    const { bodyWidth: bodyWidth_, scrollY, gutterWidth } = layout
    return bodyWidth_.value
      ? `${bodyWidth_.value - (scrollY.value ? gutterWidth : 0)}px`
      : ''
  })

  const tableLayout = computed(() => {
    if (props.maxHeight) return 'fixed'
    return props.tableLayout
  })

  const emptyBlockStyle = computed(() => {
    if (props.data && props.data.length) return null
    let height = '100%'
    if (props.height && bodyScrollHeight.value) {
      height = `${bodyScrollHeight.value}px`
    }
    const width = tableWidth.value
    return {
      width: width ? `${width}px` : '',
      height
    }
  })

  const tableInnerStyle = computed(() => {
    if (props.height) {
      return {
        height: !Number.isNaN(Number(props.height))
          ? `${props.height}px`
          : props.height
      }
    }
    if (props.maxHeight) {
      return {
        maxHeight: !Number.isNaN(Number(props.maxHeight))
          ? `${props.maxHeight}px`
          : props.maxHeight
      }
    }
    return {}
  })

  const scrollbarStyle = computed(() => {
    if (props.height) {
      return {
        height: '100%'
      }
    }
    if (props.maxHeight) {
      if (!Number.isNaN(Number(props.maxHeight))) {
        const maxHeight = props.maxHeight
        const reachMaxHeight = tableScrollHeight.value >= Number(maxHeight)
        if (reachMaxHeight) {
          return {
            maxHeight: `${
              tableScrollHeight.value -
              headerScrollHeight.value -
              footerScrollHeight.value
            }px`
          }
        }
      } else {
        return {
          maxHeight: `calc(${props.maxHeight} - ${
            headerScrollHeight.value + footerScrollHeight.value
          }px)`
        }
      }
    }

    return {}
  })

  /**
   * fix layout
   */
  const handleFixedMousewheel = (event, data) => {
    const bodyWrapper = table.refs.bodyWrapper
    if (Math.abs(data.spinY) > 0) {
      const currentScrollTop = bodyWrapper.scrollTop
      if (data.pixelY < 0 && currentScrollTop !== 0) {
        event.preventDefault()
      }
      if (
        data.pixelY > 0 &&
        bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop
      ) {
        event.preventDefault()
      }
      bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5)
    } else {
      bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5)
    }
  }

  const handleContentScroll = () => {
    syncPosition()
  }
  const bindEvents = () => {
    const { stop } = useResizeObserver(table.vnode.el, resizeListener)
    stopResizeObserver = stop
  }

  const resizeListener = () => {
    const el = table.vnode.el
    if (!table.$ready || !el) return

    let shouldUpdateLayout = false
    const {
      width: oldWidth,
      height: oldHeight,
      headerHeight: oldHeaderHeight
    } = resizeState.value

    const width = (tableWidth.value = el.offsetWidth)
    if (oldWidth !== width) {
      shouldUpdateLayout = true
    }

    const height = el.offsetHeight
    if ((props.height || shouldUpdateHeight.value) && oldHeight !== height) {
      shouldUpdateLayout = true
    }

    const tableHeader =
      props.tableLayout === 'fixed'
        ? table.refs.headerWrapper
        : table.refs.tableHeaderRef?.$el
    if (props.showHeader && tableHeader?.offsetHeight !== oldHeaderHeight) {
      shouldUpdateLayout = true
    }

    tableScrollHeight.value = table.refs.tableWrapper?.scrollHeight || 0
    headerScrollHeight.value = tableHeader?.scrollHeight || 0
    footerScrollHeight.value = table.refs.footerWrapper?.offsetHeight || 0
    bodyScrollHeight.value =
      tableScrollHeight.value -
      headerScrollHeight.value -
      footerScrollHeight.value

    if (shouldUpdateLayout) {
      resizeState.value = {
        width,
        height,
        headerHeight: (props.showHeader && tableHeader?.offsetHeight) || 0
      }
      doLayout()
    }
  }

  return {
    isHidden,
    renderExpanded,
    setDragVisible,
    isGroup,
    emptyBlockStyle,
    handleFixedMousewheel,
    handleContentScroll,
    resizeProxyVisible,
    bodyWidth,
    resizeState,
    doLayout,
    tableBodyStyles,
    tableLayout,
    scrollbarViewStyle,
    tableInnerStyle,
    scrollbarStyle
  }
}

export default useStyle
