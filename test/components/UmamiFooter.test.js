import UmamiFooter from '../../components/UmamiFooter.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiFooter', () => {
  test('renders an empty footer in a container by default', () => {
    const wrapper = mount(UmamiFooter)
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  test('renders the default slot in the container', () => {
    const wrapper = mount(UmamiFooter, {
      slots: { default: marker('default') },
    })
    expect(wrapper.find('.container > [data-slot=default]').exists()).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    expectThemed(mount(UmamiFooter), ['site-footer'])
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiFooter, { slots: { default: '<p>Footer</p>' } })
    )
  })
})
