import UmamiBreadcrumb from '../../components/UmamiBreadcrumb.vue'
import { expectAccessible, mount } from '../helpers'

const items = [
  { text: 'Home', to: '/' },
  { text: 'Recipes', to: '/recipes' },
  { text: 'Borscht', to: '/recipes/borscht' },
]

describe('UmamiBreadcrumb', () => {
  test('renders an empty trail by default', () => {
    const wrapper = mount(UmamiBreadcrumb)
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.classes()).toContain('breadcrumb')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  test('links each step, and marks the last one current', () => {
    const wrapper = mount(UmamiBreadcrumb, { propsData: { items } })
    const steps = wrapper.findAll('li.breadcrumb-item')
    expect(steps.wrappers.map((li) => li.text())).toEqual([
      'Home',
      'Recipes',
      'Borscht',
    ])
    expect(steps.at(0).find('a').attributes('href')).toBe('/')
    expect(steps.at(1).find('a').attributes('href')).toBe('/recipes')
    expect(steps.at(2).classes()).toContain('active')
    expect(steps.at(2).find('a').exists()).toBe(false)
    expect(steps.at(2).find('[aria-current=location]').exists()).toBe(true)
  })

  test('is accessible', async () => {
    const wrapper = mount(UmamiBreadcrumb, { propsData: { items } })
    await expectAccessible(
      `<nav aria-label="Breadcrumb">${wrapper.html()}</nav>`
    )
  })
})
