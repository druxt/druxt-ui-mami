import UmamiHeading from '../../components/UmamiHeading.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

describe('UmamiHeading', () => {
  test('renders an empty second-level heading by default', () => {
    const wrapper = mount(UmamiHeading)
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.text()).toBe('')
  })

  test('renders its text as text, not markup', () => {
    const wrapper = mount(UmamiHeading, {
      propsData: { text: 'More <em>recipes</em>' },
    })
    expect(wrapper.text()).toBe('More <em>recipes</em>')
    expect(wrapper.find('em').exists()).toBe(false)
  })

  test('carries the classes the theme styles', () => {
    expectThemed(mount(UmamiHeading), ['recipe-body__heading'])
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiHeading, { propsData: { text: 'More recipes' } })
    )
  })
})
