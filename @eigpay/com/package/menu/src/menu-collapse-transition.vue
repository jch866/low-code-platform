<template>
  <transition mode="out-in" v-bind="listeners">
    <slot />
  </transition>
</template>
<script setup>
import { buildCssNamespace } from '@package/util'

const ns = buildCssNamespace('menu')

const hasClass = (el, cls) => {
  if (!el || !cls) return false
  return el.classList.contains(cls)
}

const addClass = (el, cls) => {
  if (!el || !cls.trim()) return
  el.classList.add(cls)
}

const removeClass = (el, cls) => {
  if (!el || !cls.trim()) return
  el.classList.remove(cls)
}

const listeners = {
  onBeforeEnter: (el) => {
    el.style.opacity = '0.2'
  },

  onEnter(el, done) {
    addClass(el, `${ns.b()}-opacity-transition`)
    el.style.opacity = '1'
    done()
  },

  onAfterEnter(el) {
    removeClass(el, `${ns.b()}-opacity-transition`)
    el.style.opacity = ''
  },

  onBeforeLeave(el) {
    if (!el.dataset) {
      el.dataset = {}
    }

    if (hasClass(el, ns.m('collapse'))) {
      removeClass(el, ns.m('collapse'))
      el.dataset.oldOverflow = el.style.overflow
      el.dataset.scrollWidth = el.clientWidth.toString()
      addClass(el, ns.m('collapse'))
    } else {
      addClass(el, ns.m('collapse'))
      el.dataset.oldOverflow = el.style.overflow
      el.dataset.scrollWidth = el.clientWidth.toString()
      removeClass(el, ns.m('collapse'))
    }

    el.style.width = `${el.scrollWidth}px`
    el.style.overflow = 'hidden'
  },

  onLeave(el) {
    addClass(el, `${ns.b()}-horizontal-collapse-transition`)
    el.style.width = `${el.dataset.scrollWidth}px`
  }
}
</script>
