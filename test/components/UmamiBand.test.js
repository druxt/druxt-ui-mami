import UmamiBand from '../../components/UmamiBand.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiBand', () => {
  test('renders a contained band on the paper ground by default', () => {
    const wrapper = mount(UmamiBand, { slots: { default: marker('default') } })
    expect(wrapper.classes()).toEqual(['band', 'band--paper'])
    expect(wrapper.find('.container > [data-slot=default]').exists()).toBe(true)
  })

  test('takes its ground from `ground`', () => {
    const wrapper = mount(UmamiBand, { propsData: { ground: 'warm' } })
    expectThemed(wrapper, ['band', 'band--warm'])
  })

  test('adds a class for each modifier', () => {
    const wrapper = mount(UmamiBand, {
      propsData: { modifiers: ['head', 'flush', 'footer'] },
    })
    expectThemed(wrapper, ['band--head', 'band--flush', 'band--footer'])
  })

  test('renders the content without a container when not `contained`', () => {
    const wrapper = mount(UmamiBand, {
      propsData: { contained: false },
      slots: { default: marker('default') },
    })
    expect(wrapper.find('.container').exists()).toBe(false)
    expect(wrapper.find('.band > [data-slot=default]').exists()).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    expectThemed(mount(UmamiBand), ['band', 'band--paper'])
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiBand, { slots: { default: '<p>Band content</p>' } })
    )
  })
})
