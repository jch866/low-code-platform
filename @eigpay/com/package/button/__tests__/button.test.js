import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Button from '../src/index.vue'

const AXIOM = 'This is content'

describe('Button.vue', () => {
  test('type', async () => {
    const wrpper = mount(Button, { props: { type: 'primary' } })
    expect(wrpper.classes()).toContain('ep-button-primary')
    wrpper.unmount()
  })

  test('plain', async () => {
    const wrpper = mount(Button, { props: { plain: true } })
    expect(wrpper.classes()).toContain('is-plain')
    wrpper.unmount()
  })

  test('round', async () => {
    const wrpper = mount(Button, { props: { round: true } })
    expect(wrpper.classes()).toContain('is-round')
    wrpper.unmount()
  })

  test('native-type', async () => {
    const wrpper = mount(Button, { props: { nativeType: 'button' } })
    expect(wrpper.attributes('type')).toBe('button')
    await wrpper.setProps({ nativeType: 'submit' })
    expect(wrpper.attributes('type')).toBe('submit')
    await wrpper.setProps({ nativeType: 'reset' })
    expect(wrpper.attributes('type')).toBe('reset')
    wrpper.unmount()
  })

  test('disabled', async () => {
    const wrpper = mount(Button, { props: { disabled: true } })
    expect(wrpper.classes()).toContain('is-disabled')
    wrpper.unmount()
  })

  test('click emit event', async () => {
    const wrpper = mount(Button)
    await wrpper.trigger('click')
    expect(wrpper.emitted('click')).toHaveLength(1)
    wrpper.unmount()
  })

  test('slot', () => {
    const wrpper = mount(Button, { slots: { default: () => AXIOM } })
    expect(wrpper.text()).toBe(AXIOM)
    wrpper.unmount()
  })
})
