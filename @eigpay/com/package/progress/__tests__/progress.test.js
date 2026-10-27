import { describe, expect, test } from 'vitest'
import { mount, config } from '@vue/test-utils'
import Progress from '../src/progress.vue'
import { nextTick } from 'vue'

import plugin from '../../index'
config.global.plugins = [plugin]

describe('Progress.vue', () => {
  test('percentage', () => {
    const wrapper = mount(Progress, { props: { percentage: 44 } })
    expect(
      wrapper.find('.ep-progress-bar__inner').attributes('style')
    ).toContain('width: 44%;')
    expect(wrapper.find('.ep-progress__text span').text()).toBe('44%')
    wrapper.unmount()
  })

  test('status with type is line', async () => {
    const wrapper = mount(Progress, {
      props: { type: 'line', percentage: 44, status: 'success' }
    })
    await nextTick()
    expect(wrapper.find('.ep-progress').classes()).toContain('is-success')
    expect(wrapper.find('.ep-i-cycle-solid-tick').exists()).toBe(true)
    await wrapper.setProps({ status: 'error' })
    expect(wrapper.find('.ep-progress').classes()).toContain('is-error')
    expect(wrapper.find('.ep-i-solid-cycle-cross').exists()).toBe(true)
    await wrapper.setProps({ status: 'warning' })
    expect(wrapper.find('.ep-progress').classes()).toContain('is-warning')
    expect(wrapper.find('.ep-i-cycle-solid-exclamation-mark').exists()).toBe(
      true
    )
    await wrapper.setProps({ status: 'paused' })
    expect(wrapper.find('.ep-progress').classes()).toContain('is-paused')
    wrapper.unmount()
  })

  test('status with type is circle', async () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percentage: 44, status: 'success' }
    })
    await nextTick()
    expect(wrapper.find('.ep-progress').classes()).toContain('is-success')
    expect(wrapper.find('.ep-i-cycle-solid-tick').exists()).toBe(true)
    await wrapper.setProps({ status: 'error' })
    expect(wrapper.find('.ep-progress').classes()).toContain('is-error')
    expect(wrapper.find('.ep-i-solid-cycle-cross').exists()).toBe(true)
    await wrapper.setProps({ status: 'warning' })
    expect(wrapper.find('.ep-progress').classes()).toContain('is-warning')
    expect(wrapper.find('.ep-i-cycle-solid-exclamation-mark').exists()).toBe(
      true
    )
    await wrapper.setProps({ status: 'paused' })
    expect(wrapper.find('.ep-progress').classes()).toContain('is-paused')
    wrapper.unmount()
  })

  test('type circle', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percentage: 44 }
    })
    expect(wrapper.find('.ep-progress').classes()).toContain(
      'ep-progress--circle'
    )
    wrapper.unmount()
  })

  test('type dashborad', () => {
    const wrapper = mount(Progress, {
      props: { type: 'dashboard', percentage: 44 }
    })
    expect(wrapper.find('.ep-progress').classes()).toContain(
      'ep-progress--dashboard'
    )
    wrapper.unmount()
  })

  test('color with type line', async () => {
    const wrapper = mount(Progress, {
      props: { percentage: 44, color: 'yellow' }
    })
    expect(
      wrapper.find('.ep-progress-bar__inner').attributes('style')
    ).toContain('background-color: yellow;')
    await wrapper.setProps({ color: 'green' })
    expect(
      wrapper.find('.ep-progress-bar__inner').attributes('style')
    ).toContain('background-color: green;')
    wrapper.unmount()
  })

  test('text-inside', () => {
    const wrapper = mount(Progress, {
      props: { percentage: 44, textInside: true }
    })
    expect(wrapper.find('.ep-progress').classes()).toContain(
      'ep-progress--text-inside'
    )
    wrapper.unmount()
  })

  test('show-text', () => {
    const wrapper = mount(Progress, {
      props: { percentage: 44, showText: false }
    })
    expect(wrapper.find('.ep-progress__text').exists()).toBe(false)
    wrapper.unmount()
  })

  test('strokeLinecap', async () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percentage: 44, strokeLinecap: 'round' }
    })
    expect(
      wrapper.find('.ep-progress-circle__path').attributes('stroke-linecap')
    ).toBe('round')
    await wrapper.setProps({ strokeLinecap: 'butt' })
    expect(
      wrapper.find('.ep-progress-circle__path').attributes('stroke-linecap')
    ).toBe('butt')
    await wrapper.setProps({ strokeLinecap: 'square' })
    expect(
      wrapper.find('.ep-progress-circle__path').attributes('stroke-linecap')
    ).toBe('square')
    await wrapper.setProps({ strokeLinecap: '' })
    expect(
      wrapper.find('.ep-progress-circle__path').attributes('stroke-linecap')
    ).toBe('')
    wrapper.unmount()
  })
})
