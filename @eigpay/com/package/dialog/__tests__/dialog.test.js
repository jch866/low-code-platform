import { describe, test, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import Dialog from '../src/dialog.vue'
import plugin from '../../index'
config.global.plugins = [plugin]
import { nextTick } from 'vue'

const DIDLOG_HEADER = 'I am header'
const DIALOG_FOOTER = 'I am footer'
const DIALOG_CONTENT = 'this is dialog content'

describe('Dialog.vue', () => {
  test('normal render', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, appendToBody: false },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__body').text()).toBe(DIALOG_CONTENT)
    wrapper.unmount()
  })

  test('header title', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, appendToBody: false, title: DIDLOG_HEADER }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__title').text()).toBe(DIDLOG_HEADER)
    wrapper.unmount()
  })

  test('header slot', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, appendToBody: false },
      slots: {
        header: () => DIDLOG_HEADER
      }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__header').text()).toBe(DIDLOG_HEADER)
    wrapper.unmount()
  })

  test('footer slot', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, appendToBody: false },
      slots: {
        footer: () => DIALOG_FOOTER
      }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__footer').exists()).toBe(true)
    expect(wrapper.find('.ep-dialog__footer').text()).toBe(DIALOG_FOOTER)
    wrapper.unmount()
  })

  test('width props with number or string', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, appendToBody: false, width: '30%' },
      slots: {
        footer: () => DIALOG_FOOTER
      }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__content').attributes('style')).toBe(
      'width: 30%;'
    )
    await wrapper.setProps({ width: 300 })
    expect(wrapper.find('.ep-dialog__content').attributes('style')).toBe(
      'width: 300px;'
    )
    wrapper.unmount()
  })

  test('center dialog', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, appendToBody: false, center: true }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__content.is-center').exists()).toBe(true)
    wrapper.unmount()
  })

  test('should show close button', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, appendToBody: false, showClose: false }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__closebtn').exists()).toBe(false)
    await wrapper.setProps({ showClose: true })
    expect(wrapper.find('.ep-dialog__closebtn').exists()).toBe(true)
    wrapper.unmount()
  })

  test('should close dialog when click on close button', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        appendToBody: false
      }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog').isVisible()).toBe(true)
    await wrapper.find('.ep-dialog__closebtn').trigger('click')
    expect(wrapper.find('.ep-dialog').isVisible()).toBe(false)
    wrapper.unmount()
  })

  test('appendToBody', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        appendToBody: true
      },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    expect(document.body.firstElementChild).not.toBeNull()
    wrapper.unmount()
  })

  test('mask props', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        modal: true,
        appendToBody: false
      },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    expect(wrapper.find('.ep-dialog__overlay.is-modal').exists()).toBe(true)
    await wrapper.setProps({ modal: false })
    expect(wrapper.find('.ep-dialog__overlay.is-modal').exists()).toBe(false)
    wrapper.unmount()
  })

  test('should close dialog when click mask when `closeOnClickModal` is true', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        appendToBody: false,
        closeOnClickModal: false
      },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    await wrapper.find('.ep-dialog__overlay').trigger('click')
    expect(wrapper.find('.ep-dialog__overlay').isVisible()).toBe(true)
    await wrapper.setProps({ closeOnClickModal: true })
    await wrapper.find('.ep-dialog__overlay').trigger('click')
    expect(wrapper.find('.ep-dialog__overlay').isVisible()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  test('should call before-close', async () => {
    const beforeClose = vi.fn()
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        appendToBody: false,
        beforeClose: beforeClose
      },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    await wrapper.find('.ep-dialog__closebtn').trigger('click')
    expect(beforeClose).toHaveBeenCalled()
    wrapper.unmount()
  })

  test('should not close dialog when user cancelled', async () => {
    const beforeClose = vi.fn().mockImplementation((done) => done())
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        appendToBody: false,
        beforeClose: beforeClose
      },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    await wrapper.find('.ep-dialog__closebtn').trigger('click')
    expect(beforeClose).toHaveBeenCalled()
    expect(wrapper.find('.ep-dialog').isVisible()).toBe(false)
    wrapper.unmount()
  })

  test('modalValue props change', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: false,
        appendToBody: false,
        'onUpdate:modelValue': (e) => {
          wrapper.setProps({ modelValue: e })
        }
      },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.ep-dialog').isVisible()).toBe(true)
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('.ep-dialog').isVisible()).toBe(false)
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('.ep-dialog').isVisible()).toBe(false)
    wrapper.unmount()
  })

  test('close-on-press-escape', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        appendToBody: false,
        closeOnPressEscape: false
      },
      slots: { default: () => DIALOG_CONTENT }
    })
    await nextTick()
    await wrapper.setProps({ closeOnPressEscape: true })
    await wrapper.setProps({ closeOnPressEscape: false })
    // todo 怎么测试点击`ESC`键
    wrapper.unmount()
  })
})
