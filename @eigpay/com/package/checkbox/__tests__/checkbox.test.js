import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { buildCssNamespace } from '../../util'
import { formContextKey, formItemContextKey } from '../../form/src/formLib'
import Checkbox from '../src/checkbox.vue'
import { EpIcon } from '../../icon'

describe('package/checkbox/src/checkbox.vue', () => {
  const ns = buildCssNamespace('checkbox')

  it('Form is disabled', () => {
    const wrapper = mount(Checkbox, {
      props: {
        disabled: false
      },
      global: {
        provide: {
          [formContextKey]: { disabled: true }
        },
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    expect(wrapper.classes(`${ns.is('disabled', true)}`)).to.be.true
    wrapper.unmount()
  })
  it('Props set disabled', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    expect(wrapper.classes(`${ns.is('disabled', true)}`)).to.be.true

    await wrapper.setProps({
      disabled: false
    })

    expect(wrapper.classes(`${ns.is('disabled', true)}`)).to.be.false
    wrapper.unmount()
  })
  it('ModelValue is an array, change to check on', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a'],
        value: 'b'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).setValue(true)
    expect(wrapper.emitted('update:modelValue')[0][0]).to.includes('b')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
  it('ModelValue is an Array, change to uncheck', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a', 'b'],
        value: 'b'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).setValue(false)
    expect(wrapper.emitted('update:modelValue')[0][0]).to.be.not.includes('b')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
  it('ModelValue is not an Array, change to check on', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: '',
        trueValue: 'a',
        falseValue: 'b'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).setValue(true)
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('a')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
  it('ModelValue is not an Array, change to uncheck', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: 'a',
        trueValue: 'a',
        falseValue: 'b'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).setValue(false)
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('b')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })

  it('ModelValue is an array and value already was inclueded in model value , change to check on', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a', 'b'],
        value: 'a'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
  it('ModelValue is an array and value already was excluded in model value , change to uncheck', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a', 'b'],
        value: 'c'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
  it('ModelValue is string and true value is undefined , change to check on', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: 'a',
        trueValue: undefined,
        falseValue: 'a'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).setValue(true)
    expect(wrapper.emitted('update:modelValue')[0][0]).to.be.true
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
  it('ModelValue is string and false value is undefined , change to uncheck', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: 'a',
        trueValue: 'a',
        falseValue: undefined
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).setValue(false)
    expect(wrapper.emitted('update:modelValue')[0][0]).to.be.false
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })

  it('ModelValue is an array and this array includes value, state must is check on', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a'],
        value: 'a'
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    expect(wrapper.classes(`${ns.is('checked', true)}`)).to.be.true
    wrapper.unmount()
  })
  it('ModelValue is true, trueValue is unfined, state must is check on', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
        trueValue: undefined,
        falseValue: undefined
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    expect(wrapper.classes(`${ns.is('checked', true)}`)).to.be.true
    wrapper.unmount()
  })
  it('ModelValue is a string, trueValue is unfined, state must is uncheck', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: 'abc',
        trueValue: undefined,
        falseValue: undefined
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    expect(wrapper.classes(`${ns.is('checked', true)}`)).to.be.false
    wrapper.unmount()
  })

  describe('Trigger validation', () => {
    it('Enable validation and valiation execute', async () => {
      const validate = vi.fn()
      const wrapper = mount(Checkbox, {
        props: {
          modelValue: 'a',
          trueValue: 'a',
          falseValue: 'b'
        },
        global: {
          provide: {
            [formItemContextKey]: { validate }
          },
          components: {
            'ep-icon': EpIcon
          }
        }
      })
      validate.mockRejectedValue()
      await wrapper.setProps({ modelValue: 'b' })
      await wrapper.vm.$nextTick()

      expect(validate.mock.calls).toHaveLength(1)
      validate.mockRestore()
      wrapper.unmount()
    })
    it('Enable validation and valiation does not execute', async () => {
      const validate = vi.fn()
      const wrapper = mount(Checkbox, {
        props: {
          modelValue: 'a',
          trueValue: 'a',
          falseValue: 'b'
        },
        global: {
          provide: {
            [formItemContextKey]: { validate: null }
          },
          components: {
            'ep-icon': EpIcon
          }
        }
      })
      await wrapper.setProps({ modelValue: 'b' })
      await wrapper.vm.$nextTick()
      expect(validate.mock.calls).toHaveLength(0)
      validate.mockRestore()
      wrapper.unmount()
    })

    it('Disabled validation', async () => {
      const validate = vi.fn()
      const wrapper = mount(Checkbox, {
        props: {
          modelValue: 'a',
          trueValue: 'a',
          falseValue: 'b',
          validateEvent: false
        },
        global: {
          provide: {
            [formItemContextKey]: { validate }
          },
          components: {
            'ep-icon': EpIcon
          }
        }
      })
      await wrapper.setProps({ modelValue: 'b' })
      await wrapper.vm.$nextTick()
      expect(validate.mock.calls).toHaveLength(0)
      validate.mockRestore()
      wrapper.unmount()
    })
  })
  it('Focus states', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: 'a',
        trueValue: 'a',
        falseValue: undefined
      },
      global: {
        components: {
          'ep-icon': EpIcon
        }
      }
    })
    await wrapper.find(`.${ns.e('original')}`).trigger('focus')
    expect(wrapper.classes(`${ns.is('focus', true)}`)).to.be.true
    await wrapper.find(`.${ns.e('original')}`).trigger('blur')
    expect(wrapper.classes(`${ns.is('focus', true)}`)).to.be.false
    wrapper.unmount
  })
})
