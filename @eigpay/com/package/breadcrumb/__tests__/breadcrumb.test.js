import { mount, config } from '@vue/test-utils'
import { describe, expect, test, it, afterEach, vi } from 'vitest'
import Breadcrumb from '../src/breadcrumb.vue'
import BreadcrumbItem from '../src/breadcrumb-item.vue'
import merge from 'lodash/merge'
import { breadcrumbKey } from '../src/breadcrumbLib'
import { reactive, h } from 'vue'

import plugin from '../../index'
config.global.plugins = [plugin]

describe('Breadcrumb.vue', () => {
  test('test separator', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        separator: '?'
      },
      slots: {
        default: h(BreadcrumbItem, null, {
          default: () => h('span')
        })
      }
    })
    expect(wrapper.find('.ep-breadcrumb__separator').text()).toBe('?')
  })

  test('test separatorIcon', () => {
    const iconName = 'ep-i-arrow-to-right'
    const wrapper = mount(Breadcrumb, {
      props: {
        separatorIcon: iconName
      },
      slots: {
        default: h(BreadcrumbItem, null, {
          default: () => h('span')
        })
      }
    })
    expect(wrapper.find('.ep-breadcrumb__separator.is-icon').classes(iconName))
      .to.be.true
    expect(wrapper.find('.ep-breadcrumb__separator.is-icon').exists()).toBe(
      true
    )
  })
  describe('breadcrumb-item.vue click', () => {
    let wrap
    const router = {
      replace: vi.fn(),
      push: vi.fn()
    }
    const create = (options = {}) => {
      wrap = mount(
        BreadcrumbItem,
        merge(
          {
            props: {},
            slots: {
              default: '<span>abc</span>'
            },
            global: {
              provide: {
                [breadcrumbKey]: reactive({
                  separator: '-',
                  separatorIcon: 'icon'
                })
              }
            }
          },
          options
        )
      )
    }
    it('There is no props to', async () => {
      create({
        props: {}
      })
      await wrap.find('[role=link]').trigger('click')
      expect(router.push.mock.calls).to.be.empty
    })
    it('There is no router', async () => {
      create({
        to: '/target'
      })
      await wrap.find('[role=link]').trigger('click')
      expect(router.push.mock.calls).to.be.empty
    })
    it('Navigate to target', async () => {
      create({
        props: {
          to: '/target'
        },
        global: {
          plugins: [
            {
              install(app) {
                app.config.globalProperties.$router = router
              }
            }
          ]
        }
      })
      await wrap.find('[role=link]').trigger('click')
      expect(router.push.mock.lastCall[0]).to.be.equal('/target')
    })
    it('Replace to target', async () => {
      create({
        props: {
          to: '/target',
          replace: true
        },
        global: {
          plugins: [
            {
              install(app) {
                app.config.globalProperties.$router = router
              }
            }
          ]
        }
      })
      await wrap.find('[role=link]').trigger('click')

      expect(router.replace.mock.lastCall[0]).to.be.equal('/target')
    })
    afterEach(() => {
      wrap.unmount()
      router.push.mockReset()
      router.replace.mockReset()
    })
  })
})
