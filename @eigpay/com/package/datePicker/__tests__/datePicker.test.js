import { mount, config } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { buildCssNamespace } from '../../util'
import DatePicker from '../src/datePicker.vue'

import plugin from '../../index'
config.global.plugins = [plugin]

describe('/package/src/datePicker.vue', () => {
  const ns = buildCssNamespace('date-picker')

  describe('Single panel', () => {
    it('Has modelValue and not disabled, then mouse enter', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          type: 'month',
          modelValue: '2023/05',
          valueFormat: 'YYYY/MM',
          disabled: false
        }
      })
      await wrapper.find(`.${ns.b()}`).trigger('mouseover')
      expect(wrapper.find(`.ep-i-delete`).isVisible()).to.be.true
    })
    it('Has modelValue and not disabled, then mouse leave', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          type: 'date',
          modelValue: '2023/05/01',
          valueFormat: 'YYYY/MM/DD',
          disabled: false
        }
      })
      await wrapper.find(`.${ns.b()}`).trigger('mouseover')
      await wrapper.find(`.${ns.b()}`).trigger('mouseleave')
      expect(wrapper.find(`.ep-i-delete`).exists()).to.be.false
    })
    it('Show calendar without disabled', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          type: 'date',
          modelValue: '2023/05/01',
          valueFormat: 'YYYY/MM/DD',
          disabled: false
        }
      })
      await wrapper.find(`.${ns.b()}`).trigger('click')
      expect(wrapper.findComponent({ name: 'SinglePanelManager' }).isVisible())
        .to.be.true
    })
    it('Does not show calendar with disabled', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          type: 'date',
          modelValue: '2023/05/01',
          valueFormat: 'YYYY/MM/DD',
          disabled: true
        }
      })
      await wrapper.find(`.${ns.b()}`).trigger('click')
      expect(wrapper.findComponent({ name: 'SinglePanelManager' }).isVisible())
        .to.be.false
    })
    it('Click clear icon', async () => {
      let value = null
      const wrapper = mount(DatePicker, {
        props: {
          type: 'year',
          modelValue: '2023',
          'onUpdate:modelValue': (e) => {
            value = e
          },
          disabled: false
        }
      })
      await wrapper.find(`.${ns.b()}`).trigger('mouseover')
      await wrapper.find(`.ep-i-delete`).trigger('click')
      expect(value).to.be.empty
    })
    it('input blur with valid value', async () => {
      let value = null
      const wrapper = mount(DatePicker, {
        props: {
          type: 'date',
          modelValue: '2023/05/01',
          valueFormat: 'YYYY/MM/DD',
          'onUpdate:modelValue': (e) => {
            value = e
          },
          disabled: false
        }
      })
      const epInput = wrapper.findComponent({ name: 'ep-input' })
      await epInput.setValue('2023-06-15')
      await epInput.find('input').trigger('blur')
      // await wrapper.find(`.ep-i-delete`).trigger('click')
      expect(value).to.be.equal('2023/06/15')
    })
    it('input blur with invalid value', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          type: 'date',
          modelValue: '2023/05/01',
          valueFormat: 'YYYY/MM/DD',
          'onUpdate:modelValue': (e) => {
            wrapper.setProps({
              modelValue: e
            })
          },
          disabled: false
        }
      })
      const epInput = wrapper.findComponent({ name: 'ep-input' })
      await epInput.setValue('abc')
      await epInput.find('input').trigger('blur')
      // await wrapper.find(`.ep-i-delete`).trigger('click')
      expect(wrapper.vm.modelValue).to.be.equal('2023/05/01')
    })
  })
  describe('Range panel', () => {
    it('Input wrapper focus in', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          type: 'daterange',
          modelValue: [],
          disabled: false
        }
      })
      await wrapper.find(`.${ns.e('wrapper')}`).trigger('focusin')
      expect(wrapper.find(`.${ns.b()}`).classes(ns.is('focus', true))).to.be
        .true
      await wrapper.find(`.${ns.e('wrapper')}`).trigger('focusout')
      expect(wrapper.find(`.${ns.b()}`).classes(ns.is('focus', true))).to.be
        .false
    })
    it('Input wrapper focus out', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          type: 'daterange',
          modelValue: [],
          disabled: false
        }
      })
      await wrapper.find(`.${ns.e('wrapper')}`).trigger('focusout')
      expect(wrapper.find(`.${ns.b()}`).classes(ns.is('focus', true))).to.be
        .false
    })
    it('input blur', async () => {
      let value = null
      const wrapper = mount(DatePicker, {
        props: {
          type: 'daterange',
          modelValue: [],
          format: 'YYYY/MM/DD',
          disabled: false,
          'onUpdate:modelValue': (e) => {
            value = e
          }
        }
      })
      const [left, right] = wrapper.findAll('input')
      await right.setValue('2023/12/01')
      await right.trigger('blur')
      await left.setValue('2022/05/20')
      await left.trigger('blur')
      expect(value).toEqual(['2022-05-20', '2023-12-01'])
    })
    it('Click clear icon', async () => {
      let value = null
      const wrapper = mount(DatePicker, {
        props: {
          type: 'yearrange',
          modelValue: ['2035', '2045'],
          'onUpdate:modelValue': (e) => {
            value = e
          },
          disabled: false
        }
      })
      await wrapper.find(`.${ns.b()}`).trigger('mouseover')
      await wrapper.find(`.ep-i-delete`).trigger('click')
      expect(value).to.be.empty
    })
  })
})
