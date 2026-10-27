import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Card from '../src/card.vue'

const AXIOM = 'This a default string'

describe('Card.vue', () => {
  test('test render', () => {
    const wrapper = mount(Card, {
      slots: {
        default: AXIOM
      }
    })
    expect(wrapper.text()).toBe(AXIOM)
  })

  test('string header', () => {
    const headerString = 'I am header'
    const wrapper = mount(Card, {
      props: {
        header: headerString
      }
    })
    expect(wrapper.text()).toBe(headerString)
  })

  test('slot header', () => {
    const header = '<div>header slot content</div>'
    const wrapper = mount(Card, {
      slots: {
        default: AXIOM,
        header: header
      }
    })
    expect(wrapper.html()).toContain(header)
  })

  test('test body style', () => {
    const wrapper = mount(Card, {
      props: {
        bodyStyle: { 'font-size': '40px' }
      },
      slots: {
        default: AXIOM
      }
    })
    expect(wrapper.find('.ep-card__body').attributes('style')).toBe(
      'font-size: 40px;'
    )
  })

  test('shadow', () => {
    const wrapper = mount(Card, {
      props: {
        shadow: 'always'
      },
      slots: {
        default: AXIOM
      }
    })
    expect(wrapper.find('.ep-card.is-always-shadow').exists()).toBe(true)
  })
})
