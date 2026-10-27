import { describe, expect, test } from 'vitest'
import { mount, config } from '@vue/test-utils'
import Step from '../src/step.vue'
import StepItem from '../src/stepItem.vue'
import { h, nextTick } from 'vue'

import plugin from '../../index'
config.global.plugins = [plugin]

describe('Step.vue', () => {
  test('type props', async () => {
    const wrapper = mount(Step, {
      props: { type: 'dot' },
      slots: {
        default: [StepItem, StepItem]
      }
    })
    expect(wrapper.find('.ep-step-item').classes()).toContain('is-dot')
    await wrapper.setProps({ type: 'square' })
    expect(wrapper.find('.ep-step-item').classes()).toContain('is-square')
    wrapper.unmount()
  })

  test('test space', async () => {
    const wrapper = mount(Step, {
      props: { space: '200px' },
      slots: {
        default: [StepItem, StepItem]
      }
    })
    await nextTick()
    expect(wrapper.findAll('.ep-step-item')).toHaveLength(2)
    expect(wrapper.find('.ep-step-item').attributes('style')).toBe(
      'flex-basis: 200px;'
    )
    await wrapper.setProps({ space: 300 })
    expect(wrapper.find('.ep-step-item').attributes('style')).toBe(
      'flex-basis: 300px;'
    )
    wrapper.unmount()
  })

  test('test direction', () => {
    const wrapper = mount(Step, {
      props: { direction: 'vertical' },
      slots: {
        default: StepItem
      }
    })
    expect(wrapper.find('.ep-step').classes()).toContain('ep-step--vertical')
    wrapper.unmount()
  })

  test('test alignCenter', () => {
    const wrapper = mount(Step, {
      props: { alignCenter: true },
      slots: {
        default: StepItem
      }
    })
    expect(wrapper.find('.ep-step-item').classes()).toContain('is-center')
    wrapper.unmount()
  })

  test('isStraight', async () => {
    const wrapper = mount(Step, {
      props: { titleLineStraight: true },
      slots: {
        default: [StepItem, StepItem, StepItem]
      }
    })
    await nextTick()
    expect(wrapper.find('.ep-step-item').classes()).toContain('is-straight')
    wrapper.unmount()
  })

  test('test active', async () => {
    const wrapper = mount(Step, {
      props: { active: 2 },
      slots: {
        default: [StepItem, StepItem, StepItem]
      }
    })
    await nextTick()
    expect(wrapper.findAll('.ep-step-item')).toHaveLength(3)
    expect(
      wrapper.findAll('.ep-step-item')[0].find('.ep-step-item__head').classes()
    ).toContain('is-finish')
    expect(
      wrapper.findAll('.ep-step-item')[1].find('.ep-step-item__head').classes()
    ).toContain('is-process')
    expect(
      wrapper.findAll('.ep-step-item')[2].find('.ep-step-item__head').classes()
    ).toContain('is-wait')
    wrapper.unmount()
  })

  test('stepItem slot attributes', async () => {
    const wrapper = mount(Step, {
      props: { active: 0 },
      slots: {
        default: h(StepItem, {
          icon: 'ep-i-home',
          title: 'header name',
          description: 'detail content',
          status: 'process'
        })
      }
    })
    await nextTick()
    expect(wrapper.find('.ep-step-item__head').classes()).toContain(
      'is-process'
    )
    expect(wrapper.find('.ep-step-item__title').text()).toBe('header name')
    expect(wrapper.find('.ep-step-item__description').text()).toBe(
      'detail content'
    )
    expect(wrapper.find('.ep-step-item__icon-inner').exists()).toBe(true)
    wrapper.unmount()
  })
})
