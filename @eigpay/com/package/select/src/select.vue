<template>
  <div ref="selectWrapper" :class="ns.b()" @mouseover="handleMouseEnter" @mouseleave="handleMouseLeave"
    @click.stop="toggleMenu">
    <ep-tooltip ref="tooltipRef" v-model="dropdownVisible" trigger="click" :offset="10" effect="light" :show-arrow="false"
      :pure="true" :disabled="true" :teleported="teleportedComputed" placement="bottom-start" @show="handleMenuEnter"
      @hide="handleMenuClose">
      <template #default>
        <div :class="ns.e('trigger')" @mouseenter="inputHovering = true" @mouseleave="inputHovering = false">
          <div v-if="multiple" ref="tags" :class="ns.e('tags')">
            <transition @after-leave="resetInputHeight">
              <span :class="[
                ns.e('tags-wrapper'),
                {
                  [ns.e('tags-wrapper-has-prefix')]:
                    prefixWidth && selected.length
                }
              ]">
                <ep-tag v-for="item in selected" :key="getValueKey(item)" :closable="!selectDisabled && !item.isDisabled"
                  :hit="item.hitState" disable-transitions @close="deleteTag($event, item)">
                  <span :class="ns.e('tags-text')" :style="{ maxWidth: inputWidth - 75 + 'px' }">
                    {{ item.currentLabel }}
                  </span>
                </ep-tag>
              </span>
            </transition>
            <input v-if="filterable" ref="input" v-model="query" type="text" :class="[ns.e('input')]"
              :disabled="selectDisabled" :style="{
                marginLeft:
                  (prefixWidth && !selected.length) || tagInMultiLine
                    ? `${prefixWidth}px`
                    : '',
                flexGrow: 1,
                width: `${inputLength / (inputWidth - 32)}%`,
                maxWidth: `${inputWidth - 42}px`
              }" @focus="handleFocus" @blur="handleBlur" @keyup="managePlaceholder" @keydown="resetInputState"
              @compositionstart="handleComposition" @compositionupdate="handleComposition"
              @compositionend="handleComposition" @keydown.down.prevent="navigateOptions('next')"
              @keydown.up.prevent="navigateOptions('prev')" @keydown.esc="handleKeydownEscape"
              @keydown.enter.stop.prevent="selectOption" @keydown.delete="deletePrevTag" @keydown.tab="visible = false"
              @input="debouncedQueryChange" />
          </div>
          <ep-input ref="reference" v-model="selectedLabel" type="text" :placeholder="currentPlaceholder"
            :disabled="selectDisabled" :readonly="readonly" :validate-event="false"
            :class="ns.is('focus', states.visible)" @focus="handleFocus" @blur="handleBlur"
            @input="debouncedOnInputChange" @compositionstart="handleComposition" @compositionupdate="handleComposition"
            @compositionend="handleComposition" @keydown.down.stop.prevent="navigateOptions('next')"
            @keydown.up.stop.prevent="navigateOptions('prev')" @keydown.enter.stop.prevent="selectOption"
            @keydown.esc="handleKeydownEscape" @keydown.tab="visible = false">
            <template #suffix>
              <span v-if="!showClear" :class="[
                ns.e('dropdown-icon'),
                ns.is('expand', !dropdownVisible)
              ]">
                <ep-icon icon="ep-i-unfold-up"></ep-icon>
              </span>
              <span v-if="showClear" :class="ns.e('clear-icon')" @click="handleClearClick">
                <ep-icon icon="ep-i-delete"></ep-icon>
              </span>
            </template>
          </ep-input>
        </div>
      </template>

      <template #content>
        <div :class="ns.e('dropdown')" :style="dropdownStyle">
          <scroll-bar v-show="options.size > 0 && !loading" ref="scrollbar" :max-height="192">
            <slot />
          </scroll-bar>
          <template v-if="emptyText">
            <slot v-if="$slots.empty" name="empty" />
            <p v-else :class="ns.em('dropdown', 'empty')">
              {{ emptyText }}
            </p>
          </template>
        </div>
      </template>
    </ep-tooltip>
  </div>
</template>
<script setup>
import { reactive, toRefs, computed, provide } from 'vue'
import { selectContextKey } from './selectLib.js'
import ScrollBar from '../../scrollBar/src/scrollBar.vue'
import EpTag from '../../tag/src/tag.vue'
import { buildCssNamespace } from '../../util'
import { useResizeObserver } from '@vueuse/core'

import { useStates, useSelect } from './useSelect'

const props = defineProps({
  placeholder: {
    type: String,
    default: undefined
  },
  modelValue: {
    type: [String, Number, Array, Object],
    default: undefined
  },
  clearable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  multipleLimit: {
    type: Number,
    default: -1
  },
  reserveKeyword: {
    type: Boolean,
    default: true
  },
  filterable: {
    type: Boolean,
    default: false
  },
  filterMethod: {
    type: Function,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: undefined
  },
  remote: {
    type: Boolean,
    default: false
  },
  remoteMethod: {
    type: Function,
    default: undefined
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  teleported: {
    type: Boolean,
    default: true
  },
  disabledIsShow: {
    type: Boolean,
    default: true
  }
})

const ns = buildCssNamespace('select')

const emit = defineEmits([
  'change',
  'visible-change',
  'update:modelValue',
  'clear',
  'blur',
  'focus'
])

const states = useStates(props)

const {
  optionsArray,
  handleResize,
  debouncedOnInputChange,
  debouncedQueryChange,
  deletePrevTag,
  deleteTag,
  // deleteSelected,
  handleOptionSelect,
  // scrollToOption,
  readonly,
  resetInputHeight,
  showClear,
  setSelected,
  managePlaceholder,
  selectDisabled,
  emptyText,
  // toggleLastOptionHitState,
  resetInputState,
  handleComposition,
  onOptionCreate,
  onOptionDestroy,
  handleMenuEnter,
  handleFocus,
  // blur,
  handleBlur,
  handleClearClick,
  handleMenuClose,
  handleKeydownEscape,
  toggleMenu,
  selectOption,
  getValueKey,
  navigateOptions,
  dropdownVisible,
  queryChange,
  // groupQueryChange,

  // DOM ref
  reference,
  input,
  tooltipRef,
  tags,
  selectWrapper,
  scrollbar,

  // Mouser Event
  handleMouseEnter,
  handleMouseLeave
} = useSelect(props, states, {
  emit
})

const {
  inputWidth,
  inputLength,
  inputHovering,
  selectedLabel,
  currentPlaceholder,
  selected,
  hoverIndex,
  filteredOptionsCount,
  prefixWidth,
  options,
  visible,
  query,
  tagInMultiLine
} = toRefs(states)

//存储select的属性

useResizeObserver(selectWrapper, handleResize)

const dropdownStyle = computed(() => {
  return {
    width: inputWidth.value + 'px'
  }
})

const dataType = 'input-select';

provide(
  selectContextKey,
  reactive({
    props,
    options,
    handleOptionSelect,
    selected,
    hoverIndex,
    optionsArray,
    queryChange,
    filteredOptionsCount,
    setSelected,
    onOptionDestroy,
    onOptionCreate,
    dataType
  })
)

const teleportedComputed = computed(() => props.teleported)
</script>

<script>
import { componetName } from '@package/constant'
export default {
  name: componetName('Select')
}
</script>
