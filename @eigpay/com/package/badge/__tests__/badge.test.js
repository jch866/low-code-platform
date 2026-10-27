import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../src/badge.vue'

describe('Badge.vue', () => {
  test('test value badge', async () => {
    const wrapper = mount(Badge, {
      props: { value: 90 },
      slots: { default: '<button>badge</button>' }
    })
    expect(wrapper.find('.ep-badge .ep-badge__content').text()).toBe('90')
    await wrapper.setProps({ value: 'new' })
    expect(wrapper.find('.ep-badge .ep-badge__content').text()).toBe('new')
    await wrapper.setProps({ value: undefined })
    expect(wrapper.find('.ep-badge .ep-badge__content').text()).toBe('')
    wrapper.unmount()
  })

  test('test badge is-dot', () => {
    const wrapper = mount(Badge, {
      props: { isDot: true },
      slots: { default: '<button>badge</button>' }
    })
    expect(wrapper.find('.ep-badge__content.is-dot').exists()).toBe(true)
    wrapper.unmount()
  })

  test('test badge color', () => {
    const wrapper = mount(Badge, {
      props: { value: 99, color: 'rgb(235,235,250)' },
      slots: { default: '<button>badge</button>' }
    })
    expect(wrapper.find('.ep-badge .ep-badge__content').text()).toBe('99')
    expect(wrapper.find('.ep-badge__content').attributes('style')).toBe(
      'background-color: rgb(235, 235, 250);'
    )
    wrapper.unmount()
  })

  test('max is not number', () => {
    const wrapper = mount(Badge, {
      props: { value: 9999, max: NaN },
      slots: { default: '<button>badge</button>' }
    })
    expect(wrapper.find('.ep-badge .ep-badge__content').text()).toBe('9999')
    wrapper.unmount()
  })

  test('max is lessThan value', () => {
    const wrapper = mount(Badge, {
      props: { value: 9999, max: 1000 },
      slots: { default: '<button>badge</button>' }
    })
    expect(wrapper.find('.ep-badge .ep-badge__content').text()).toBe('1000+')
    wrapper.unmount()
  })

  test('test badge placement and space', async () => {
    const wrapper = mount(Badge, {
      props: { placement: 'left', isDot: true, space: 10 },
      slots: { default: '<button>badge</button>' }
    })

    expect(wrapper.find('.ep-badge__content').classes()).toContain('is-left')
    expect(wrapper.find('.ep-badge__content').attributes('style')).toBe(
      'left: -10px;'
    )
    await wrapper.setProps({ placement: 'right' })
    expect(wrapper.find('.ep-badge__content').classes()).toContain('is-right')
    await wrapper.setProps({ placement: 'bottom-left' })
    expect(wrapper.find('.ep-badge__content').classes()).toContain(
      'is-bottom-left'
    )
    await wrapper.setProps({ placement: 'top' })
    expect(wrapper.find('.ep-badge__content').classes()).toContain('is-top')
    await wrapper.setProps({ placement: 'bottom' })
    expect(wrapper.find('.ep-badge__content').classes()).toContain('is-bottom')
    await wrapper.setProps({ placement: 'top-left' })
    expect(wrapper.find('.ep-badge__content').classes()).toContain(
      'is-top-left'
    )
    await wrapper.setProps({ placement: 'top-right' })
    expect(wrapper.find('.ep-badge__content').classes()).toContain(
      'is-top-right'
    )
    await wrapper.setProps({ placement: 'bottom-right' })
    expect(wrapper.find('.ep-badge__content').classes()).toContain(
      'is-bottom-right'
    )
    wrapper.unmount()
  })
})
