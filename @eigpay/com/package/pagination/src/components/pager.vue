<template>
  <ul :class="ns.e('pager')">
    <li
      v-if="pageCount > 0"
      data-type="pagination"
      data-name="1"
      :class="[ns.is('active', currentPage === 1), ns.is('disabled', disabled)]"
      class="number"
      :aria-current="currentPage === 1"
      :tabindex="tabindex"
      @click="onPagerClick('normal', 1)"
    >
      1
    </li>
    <li
      v-if="showPrevMore"
      data-type="pagination"
      data-name="+"
      :class="['more', 'btn-quickprev', ns.is('disabled', disabled)]"
      :tabindex="tabindex"
      @mouseenter="onMouseEnter(true)"
      @mouseleave="quickPrevHover = false"
      @focus="onFocus(true)"
      @blur="quickPrevFocus = false"
      @click="onPagerClick('quickprev')"
    >
      <ep-icon
        v-if="quickPrevHover || quickPrevFocus"
        icon="ep-i-vector"
        style="transform: rotate(180deg)"
      />
      <ep-icon v-else icon="ep-i-plus" />
    </li>
    <li
      v-for="pager in pagers"
      :key="pager"
      data-type="pagination"
      :data-name="pager"
      :class="[
        ns.is('active', currentPage === pager),
        ns.is('disabled', disabled)
      ]"
      class="number"
      :aria-current="currentPage === pager"
      :tabindex="tabindex"
      @click="onPagerClick('normal', pager)"
    >
      {{ pager }}
    </li>
    <li
      v-if="showNextMore"
      data-type="pagination"
      data-name="+"
      :class="['more', 'btn-quicknext', ns.is('disabled', disabled)]"
      :tabindex="tabindex"
      @mouseenter="onMouseEnter()"
      @mouseleave="quickNextHover = false"
      @focus="onFocus()"
      @blur="quickNextFocus = false"
      @click="onPagerClick('quicknext')"
    >
      <ep-icon v-if="quickNextHover || quickNextFocus" icon="ep-i-vector" />
      <ep-icon v-else icon="ep-i-plus" />
    </li>
    <li
      v-if="pageCount > 1"
      data-type="pagination"
      :data-name="pageCount"
      :class="[
        ns.is('active', currentPage === pageCount),
        ns.is('disabled', disabled)
      ]"
      class="number"
      :aria-current="currentPage === pageCount"
      :tabindex="tabindex"
      @click="onPagerClick('normal', pageCount)"
    >
      {{ pageCount }}
    </li>
  </ul>
</template>

<script setup>
import { buildCssNamespace } from '@package/util'
import { computed, ref, watchEffect } from 'vue'
const props = defineProps({
  disabled: Boolean,
  // 一共有多少页
  pageCount: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  // 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠，默认是7
  pagerCount: {
    type: Number,
    default: 7
  }
})

const emit = defineEmits(['change'])
const ns = buildCssNamespace('pagination')

const showPrevMore = ref(false)
const showNextMore = ref(false)
const quickPrevHover = ref(false)
const quickNextHover = ref(false)
const quickPrevFocus = ref(false)
const quickNextFocus = ref(false)
const pagers = computed(() => {
  const pagerCount = props.pagerCount
  const halfPagerCount = (pagerCount - 1) / 2
  const currentPage = Number(props.currentPage)
  const pageCount = Number(props.pageCount)
  let showPrevMore = false
  let showNextMore = false
  if (pageCount > pagerCount) {
    if (currentPage > pagerCount - halfPagerCount) {
      showPrevMore = true
    }
    if (currentPage < pageCount - halfPagerCount) {
      showNextMore = true
    }
  }
  const array = []
  if (showPrevMore && !showNextMore) {
    // 只显示preMore按钮
    // pagercount - 2 去除第一个和最后一个，这两页是默认显示的
    const startPage = pageCount - (pagerCount - 2)
    for (let i = startPage; i < pageCount; i++) {
      array.push(i)
    }
  } else if (!showPrevMore && showNextMore) {
    // 只显示nextMore按钮
    // 只需要将 2 之后并且小于`设置的最大页码按钮`添加到数组
    for (let i = 2; i < pagerCount; i++) {
      array.push(i)
    }
  } else if (showPrevMore && showNextMore) {
    // preMore 和 nextMore按钮都显示
    // currentPage 当前选中的页，总是最中间的那个按钮
    // offset 计算 currentPage 两侧的按钮数量(不包括1和pageCount按钮)
    const offset = Math.floor(pagerCount / 2) - 1
    // 将currentPage及两侧的数添加到数组
    for (let i = currentPage - offset; i <= currentPage + offset; i++) {
      array.push(i)
    }
  } else {
    // preMore 和 nextMore按钮都不显示
    for (let i = 2; i < pageCount; i++) {
      array.push(i)
    }
  }
  return array
})
const tabindex = computed(() => (props.disabled ? -1 : 0))
watchEffect(() => {
  //计算currentPage左右两侧数字按钮数(包括1和pageCount)
  const halfPagerCount = (props.pagerCount - 1) / 2
  showPrevMore.value = false
  showNextMore.value = false
  //pageCount 一共有多少页
  //pagerCount 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠，默认是7
  if (props.pageCount > props.pagerCount) {
    // 左侧剩余按钮数：props.pagerCount - halfPagerCount （包括当前页）
    if (props.currentPage > props.pagerCount - halfPagerCount) {
      showPrevMore.value = true
    }
    // 当前页 + halfPagerCount < 总页数
    if (props.currentPage < props.pageCount - halfPagerCount) {
      showNextMore.value = true
    }
  }
})
function onMouseEnter(forward = false) {
  if (props.disabled) return
  if (forward) {
    quickPrevHover.value = true
  } else {
    quickNextHover.value = true
  }
}
function onFocus(forward = false) {
  if (props.disabled) return
  if (forward) {
    quickPrevFocus.value = true
  } else {
    quickNextFocus.value = true
  }
}

function onPagerClick(type, content) {
  if (props.disabled) {
    return
  }
  let newPage
  const pageCount = props.pageCount
  const currentPage = props.currentPage
  const pagerCountOffset = props.pagerCount - 2
  if (type === 'normal') {
    // 点击正常数字
    newPage = Number(content)
  } else {
    // 点击更多
    if (type === 'quickprev') {
      newPage = currentPage - pagerCountOffset
    } else if (type === 'quicknext') {
      newPage = currentPage + pagerCountOffset
    }
  }

  if (!Number.isNaN(+newPage)) {
    if (newPage < 1) {
      newPage = 1
    }
    if (newPage > pageCount) {
      newPage = pageCount
    }
  }
  if (newPage !== currentPage) {
    emit('change', newPage)
  }
}
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('PaginationPager')
}
</script>
