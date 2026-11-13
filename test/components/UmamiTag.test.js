import UmamiTag from '../../components/UmamiTag.vue'
import { expectAccessible, mount } from '../helpers'

describe('UmamiTag', () => {
  test('renders an empty linked badge by default', () => {
    const wrapper = mount(UmamiTag)
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.classes()).toEqual(['mr-1'])
    expect(wrapper.find('.badge').text()).toBe('')
  })

  test('renders the label in an info badge, linked to `to`', () => {
    const wrapper = mount(UmamiTag, {
      propsData: { label: 'Vegetarian', to: '/tags/vegetarian' },
    })
    expect(wrapper.attributes('href')).toBe('/tags/vegetarian')
    const badge = wrapper.find('.badge')
    expect(badge.classes()).toContain('badge-info')
    expect(badge.text()).toBe('Vegetarian')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiTag, { propsData: { label: 'Vegetarian', to: '/tags/veg' } })
    )
  })
})
