<!-- eslint-disable vue/no-v-html -->
<template>
  <div v-if="!codeShow" class="operation" @click="codeShow = true">
    显示源码
  </div>
  <transition name="preview-transition" v-on="on">
    <div v-if="codeShow" class="preview">
      <span class="fold" @click="codeShow = false">收起源码</span>
      <span class="copy" @click="copySourceCode">Copy</span>
      <pre
        ref="pre"
        class="language-html"
      ><code class="language-html" v-html="codeHighlighted"></code></pre>
    </div>
  </transition>
  <div v-if="codeShow" class="operation" @click="codeShow = false">
    收起源码
  </div>
</template>

<script>
import 'prismjs/themes/prism.css'
import Prism from 'prismjs'
import { ref } from 'vue'
import copy from 'copy-to-clipboard'
export default {
  props: {
    /** 组件名称 */
    compName: {
      type: String,
      default: '',
      require: true
    },
    /** 要显示代码的组件 */
    demoName: {
      type: String,
      default: '',
      require: true
    }
  },
  setup() {
    const pre = ref()
    const on = {
      beforeEnter(el) {
        if (!el.dataset) el.dataset = {}

        el.dataset.oldPaddingTop = el.style.paddingTop
        el.dataset.oldPaddingBottom = el.style.paddingBottom

        el.style.maxHeight = 0
        el.style.paddingTop = 0
        el.style.paddingBottom = 0
      },

      enter(el) {
        el.dataset.oldOverflow = el.style.overflow
        if (el.scrollHeight !== 0) {
          el.style.maxHeight = `${el.scrollHeight}px`
          el.style.paddingTop = el.dataset.oldPaddingTop
          el.style.paddingBottom = el.dataset.oldPaddingBottom
        } else {
          el.style.maxHeight = 0
          el.style.paddingTop = el.dataset.oldPaddingTop
          el.style.paddingBottom = el.dataset.oldPaddingBottom
        }

        el.style.overflow = 'hidden'
      },

      afterEnter(el) {
        el.style.maxHeight = ''
        el.style.overflow = el.dataset.oldOverflow
      },

      beforeLeave(el) {
        if (!el.dataset) el.dataset = {}
        el.dataset.oldPaddingTop = el.style.paddingTop
        el.dataset.oldPaddingBottom = el.style.paddingBottom
        el.dataset.oldOverflow = el.style.overflow

        el.style.maxHeight = `${el.scrollHeight}px`
        el.style.overflow = 'hidden'
      },

      leave(el) {
        if (el.scrollHeight !== 0) {
          el.style.maxHeight = 0
          el.style.paddingTop = 0
          el.style.paddingBottom = 0
        }
      },

      afterLeave(el) {
        el.style.maxHeight = ''
        el.style.overflow = el.dataset.oldOverflow
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      }
    }
    return {
      pre,
      on
    }
  },
  data() {
    return {
      sourceCode: '',
      codeShow: false,
      codeHighlighted: ''
    }
  },
  async mounted() {
    let source
    const isDev = import.meta.env.MODE === 'development'

    if (isDev) {
      this.sourceCode = (
        await import(
          /* @vite-ignore */ `../../package/${this.compName}/docs/${this.demoName}.vue?raw`
        )
      ).default
    } else {
      source = await fetch(
        `/package/${this.compName}/docs/${this.demoName}.vue`
      )
      this.sourceCode = await source.text()
    }
    // await this.$nextTick()
    const highlighted = Prism.highlight(
      this.sourceCode,
      Prism.languages.html,
      'html'
    )
    this.codeHighlighted = highlighted
    // Prism.highlightAllUnder(this.pre)
  },
  methods: {
    copySourceCode() {
      copy(this.sourceCode)
      this.$message.info('Copied')
    }
  }
}
</script>
<style lang="scss" scoped>
/* .preview-enter-active,
.preview-leave-active {
  transition: opacity 0.5s ease-out;
}

.preview-enter-from,
.preview-leave-to {
  opacity: 0;
} */

.preview-transition {
  transition: 0.5s height ease-in-out, 0.5s padding-top ease-in-out,
    0.5s padding-bottom ease-in-out;
}

.preview-transition-leave-active,
.preview-transition-enter-active {
  transition: 0.5s max-height ease-in-out, 0.5s padding-top ease-in-out,
    0.5s padding-bottom ease-in-out;
}

.preview {
  @apply relative  max-w-5xl;
  .copy {
    @apply absolute top-2 right-2 bg-sky-800/[.06] text-indigo-400 p-1 cursor-pointer select-none;
  }
  .fold {
    @apply absolute top-2 right-[4.5rem] bg-sky-800/[.06] text-indigo-400 p-1 cursor-pointer select-none;
  }
  &:hover {
    .copy,
    .fold {
      @apply inline-block;
    }
  }
}
.operation {
  @apply text-amber-600 font-medium p-3 cursor-pointer inline-block;
  :hover {
    @apply text-amber-500/90;
  }
}
</style>
