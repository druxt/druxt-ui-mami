import UmamiDisclaimer from '../../components/UmamiDisclaimer.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiDisclaimer', () => {
  test('renders an empty note by default', () => {
    const wrapper = mount(UmamiDisclaimer)
    expect(wrapper.text()).toBe('')
  })

  test('renders the default slot', () => {
    const wrapper = mount(UmamiDisclaimer, {
      slots: { default: marker('default') },
    })
    expect(wrapper.find('[data-slot=default]').exists()).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    expectThemed(mount(UmamiDisclaimer), ['disclaimer'])
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiDisclaimer, {
        slots: { default: '<p>Umami is a fictional magazine.</p>' },
      })
    )
  })
})
