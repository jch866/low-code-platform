import { mount, config } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Input from '../src/input.vue'
import plugin from '../../index'
config.global.plugins = [plugin]

const INPUT_PLACEHOLDER = 'Please enter content'

describe('Input.vue', () => {
  let wrapper
  afterEach(() => {
    wrapper && wrapper.unmount()
  })

  test('create', () => {
    wrapper = mount(Input, {
      props: {
        placeholder: INPUT_PLACEHOLDER,
        maxlength: 10
      }
    })
    const inputElement = wrapper.find('input')
    expect(inputElement.element.placeholder).toBe(INPUT_PLACEHOLDER)
    expect(inputElement.element.maxLength).toBe(10)
    expect(inputElement.element.value).toBe('')
  })

  test('disabled', () => {
    wrapper = mount(Input, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.find('input').element.disabled).toBe(true)
  })

  test('type', async () => {
    wrapper = mount(Input, {
      props: {
        type: 'text'
      }
    })
    expect(wrapper.find('input').attributes('type')).toBe('text')
    await wrapper.setProps({ type: 'textarea' })
    expect(wrapper.find('textarea').exists()).toBe(true)
    await wrapper.setProps({ type: 'password' })
    expect(wrapper.find('input').attributes('type')).toBe('password')
    await wrapper.setProps({ type: 'number' })
    expect(wrapper.find('input').attributes('type')).toBe('number')
  })

  test('show-password', async () => {
    wrapper = mount(Input, {
      props: {
        modelValue: '123456',
        type: 'password',
        showPassword: true
      }
    })
    await wrapper.findComponent({ name: 'ep-icon' }).trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
    await wrapper.findComponent({ name: 'ep-icon' }).trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  test('showWordLimit', () => {
    wrapper = mount(Input, {
      props: {
        modelValue: '123456',
        showWordLimit: true,
        maxlength: 100
      }
    })
    expect(wrapper.find('.ep-input__count-inner').text()).toBe('6 / 100')
  })

  test('clearable', async () => {
    wrapper = mount(Input, {
      props: {
        modelValue: '123456',
        clearable: true
      }
    })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.html()).toContain('ep-i-delete')
  })

  test('prefix slots', () => {
    wrapper = mount(Input, {
      slots: {
        prefix: () => 'prefix slot content'
      }
    })
    expect(wrapper.html()).toContain('prefix slot content')
  })

  test('suffix slot', async () => {
    wrapper = mount(Input, {
      props: {
        modelValue: '123456',
        showWordLimit: false
      },
      slots: {
        suffix: () => 'suffix slot content'
      }
    })
    expect(wrapper.html()).toContain('suffix slot content')
  })

  test('event:focus & blur', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()

    wrapper = mount(Input, {
      props: {
        modelValue: '',
        onBlur: handleBlur,
        onFocus: handleFocus
      }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(handleFocus).toHaveBeenCalled()
    await input.trigger('blur')
    expect(handleBlur).toHaveBeenCalled()
  })

  test('event:change', async () => {
    const content = ref('')
    const value = ref('')
    const handleChange = (val) => {
      value.value = val
    }

    wrapper = mount(Input, {
      props: {
        modelValue: content.value,
        onChange: handleChange
      }
    })

    const el = wrapper.find('input').element
    const simulateEvent = (text, event) => {
      el.value = text
      el.dispatchEvent(new Event(event))
    }
    simulateEvent('2', 'change')
    await nextTick()
    expect(value.value).toBe('2')
    simulateEvent('1', 'input')
    await nextTick()
    expect(value.value).toBe('2')
  })

  test('event:clear', async () => {
    const handleChange = vi.fn()
    const handleInput = vi.fn()
    const handleUpdateModelValue = vi.fn()
    const content = ref('123456')

    wrapper = mount(Input, {
      props: {
        clearable: true,
        modelValue: content.value,
        'onUpdate:modelValue': handleUpdateModelValue,
        onChange: handleChange,
        onInput: handleInput
      }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await wrapper.find('.ep-i-delete').trigger('click')
    expect(handleChange).toHaveBeenCalledWith('')
    expect(handleInput).toHaveBeenCalledWith('')
    expect(handleUpdateModelValue).toHaveBeenCalledWith('')
  })

  test('event:input', async () => {
    const handleInput = vi.fn()
    const content = ref('a')
    wrapper = mount(Input, {
      props: {
        clearable: true,
        modelValue: content.value,
        onInput: handleInput
      }
    })
    const inputWrapper = wrapper.find('input')
    const nativeInput = inputWrapper.element
    nativeInput.value = 'test'
    await inputWrapper.trigger('compositionstart')
    await inputWrapper.trigger('input')
    nativeInput.value = 'testValue'
    await inputWrapper.trigger('compositionupdate')
    await inputWrapper.trigger('input')
    await inputWrapper.trigger('compositionend')
    expect(handleInput).toHaveBeenCalledTimes(1)
    expect(content.value).toEqual('a')
    expect(nativeInput.value).toEqual('a')
  })

  test('modelValue with special value', async () => {
    wrapper = mount(Input, {
      props: {
        modelValue: undefined
      }
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('')
    await wrapper.setProps({ modelValue: null })
    expect(input.element.value).toBe('')
    await wrapper.setProps({ modelValue: 'message' })
    expect(input.element.value).toBe('message')
    await wrapper.setProps({ modelValue: 100 })
    expect(input.element.value).toBe('100')
  })

  test('event:keyup', async () => {
    const handleKeyup = vi.fn()
    wrapper = mount(Input, {
      props: {
        onKeyup: handleKeyup
      }
    })
    await wrapper.find('input').trigger('keyup')
    expect(handleKeyup).toHaveBeenCalled()
  })

  test('event:keydown', async () => {
    const handleKeydown = vi.fn()
    wrapper = mount(Input, {
      props: {
        modelValue: '123456',
        onKeydown: handleKeydown
      }
    })
    await wrapper.find('input').trigger('keydown')
    expect(handleKeydown).toHaveBeenCalled()
  })

  test('mouseenter & mouseleave', async () => {
    const handleFocus = vi.fn()
    const handleMouseenter = vi.fn()
    const handleMouseleave = vi.fn()
    wrapper = mount(Input, {
      props: {
        modelValue: '123456',
        onFocus: handleFocus,
        onMouseenter: handleMouseenter,
        onMouseleave: handleMouseleave
      }
    })
    await wrapper.trigger('mouseenter')
    expect(handleMouseenter).toHaveBeenCalled()
    await wrapper.trigger('mouseleave')
    expect(handleMouseleave).toHaveBeenCalled()
  })

  test('render input then focus input', async () => {
    wrapper = mount(Input, {
      props: {
        ref: 'inputRef'
      }
    })
    await nextTick()
    const refInput = wrapper.vm.$refs.inputRef
    // todo 不走 input中 defineExpose的 `focus` 方法
    await refInput.focus()
  })
})
