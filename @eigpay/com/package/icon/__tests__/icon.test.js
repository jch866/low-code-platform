import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'
import Icon from '../src/icon.vue'

describe('Icon.vue', () => {
  const iconName = 'ep-i-cycle-solid-exclamation-mark-inverted'

  test('render icon with all props', () => {
    const wrapper = mount(Icon, {
      props: {
        icon: iconName,
        size: '20px',
        color: 'rgb(1, 99, 202)'
      }
    })
    expect(wrapper.html()).toContain(iconName)
    expect(wrapper.element.getAttribute('style')).toContain('font-size: 20px')
    expect(wrapper.element.getAttribute('style')).toContain(
      'color: rgb(1, 99, 202)'
    )
    wrapper.unmount()
  })

  test('render icon with size of type stringNumber', () => {
    const wrapper = mount(Icon, {
      props: {
        icon: iconName,
        size: '20'
      }
    })
    expect(wrapper.html()).toContain(iconName)
    expect(wrapper.element.getAttribute('style')).toContain('font-size: 20px')
    wrapper.unmount()
  })

  test('render icon with size of type number', () => {
    const wrapper = mount(Icon, {
      props: {
        icon: iconName,
        size: 20
      }
    })
    expect(wrapper.html()).toContain(iconName)
    expect(wrapper.element.getAttribute('style')).toContain('font-size: 20px')
    wrapper.unmount()
  })

  test('render icon with icon and color', () => {
    const wrapper = mount(Icon, {
      props: {
        icon: iconName,
        color: 'rgb(1, 99, 202)'
      }
    })
    expect(wrapper.html()).toContain(iconName)
    expect(wrapper.element.getAttribute('style')).toContain(
      'color: rgb(1, 99, 202)'
    )
    wrapper.unmount()
  })

  test('render icon with porps none props', () => {
    const wrapper = mount(Icon)
    expect(wrapper.html()).toContain('ep-icon')
    wrapper.unmount()
  })

  test('render icon with porps only color', () => {
    const wrapper = mount(Icon, {
      props: {
        color: '10'
      }
    })
    expect(wrapper.html()).not.toContain('color')
    wrapper.unmount()
  })

  test('render icon with porps only color underfined', () => {
    const wrapper = mount(Icon, {
      props: {
        color: undefined,
        size: 'max'
      }
    })
    expect(wrapper.html()).not.toContain('color')
    wrapper.unmount()
  })

  test('render icon with porps size NaN', () => {
    const wrapper = mount(Icon, {
      props: {
        size: NaN
      }
    })
    expect(wrapper.html()).not.toContain('font-size')
    wrapper.unmount()
  })

  test('render icon with not string size', () => {
    const wrapper = mount(Icon, {
      props: {
        size: 'NaN'
      }
    })
    expect(wrapper.html()).not.toContain('font-size')
    wrapper.unmount()
  })

  test('size not string', async () => {
    const wrapper = mount(Icon, {
      props: {
        size: undefined
      }
    })
    await nextTick()
    expect(wrapper.html()).not.toContain('font-size')
    await wrapper.setProps({ size: '' })
    expect(wrapper.html()).not.toContain('font-size')
    wrapper.unmount()
  })
})
