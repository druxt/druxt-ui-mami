import UmamiCollections from '../../components/UmamiCollections.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const props = {
  title: 'Collections',
  links: [
    { text: 'Vegetarian', to: '/tags/vegetarian' },
    { id: 'desserts', text: 'Desserts', to: '/tags/desserts' },
  ],
  more: { text: 'All recipes', to: '/recipes' },
}

describe('UmamiCollections', () => {
  test('renders the default heading, with no links', () => {
    const wrapper = mount(UmamiCollections)
    expect(wrapper.find('h2').text()).toBe('Recipe collections')
    expect(wrapper.findAll('a')).toHaveLength(0)
  })

  test('renders the title and a pill link for each entry', () => {
    const wrapper = mount(UmamiCollections, { propsData: props })
    expect(wrapper.find('h2').text()).toBe('Collections')
    const pills = wrapper.findAll('.collections__link').wrappers
    expect(pills.map((a) => [a.text(), a.attributes('href')])).toEqual([
      ['Vegetarian', '/tags/vegetarian'],
      ['Desserts', '/tags/desserts'],
    ])
  })

  test('renders the `more` link last', () => {
    const wrapper = mount(UmamiCollections, { propsData: props })
    const more = wrapper.find('.collections__list').element.lastElementChild
    expect(more.className).toBe('collections__more')
    expect(more.getAttribute('href')).toBe('/recipes')
    expect(more.textContent).toBe('All recipes')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiCollections, { propsData: props })
    expectThemed(wrapper, ['band', 'band--warm', 'collections'])
    expectThemed(wrapper, ['collections__list'], '.collections__list')
    expectThemed(wrapper, ['collections__link'], '.collections__link')
    expectThemed(wrapper, ['collections__more'], '.collections__more')
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiCollections, { propsData: props }))
  })
})
