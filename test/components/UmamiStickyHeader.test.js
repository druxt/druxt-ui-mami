import UmamiStickyHeader from '../../components/UmamiStickyHeader.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiStickyHeader', () => {
  test('renders an empty box by default', () => {
    expect(mount(UmamiStickyHeader).text()).toBe('')
  })

  test('renders the default slot', () => {
    const wrapper = mount(UmamiStickyHeader, {
      slots: { default: marker('default') },
    })
    expect(wrapper.find('[data-slot=default]').exists()).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    expectThemed(mount(UmamiStickyHeader), ['masthead-sticky'])
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiStickyHeader, { slots: { default: '<a href="/">Umami</a>' } })
    )
  })
})
