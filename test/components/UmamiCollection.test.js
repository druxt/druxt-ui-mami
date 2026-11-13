import UmamiCollection from '../../components/UmamiCollection.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const props = {
  title: 'Vegetarian',
  kicker: 'Tag',
  description: '<p>Recipes <em>without</em> meat.</p>',
  count: '18 recipes',
}

describe('UmamiCollection', () => {
  test('renders the head band with the default kicker, and an empty grid', () => {
    const wrapper = mount(UmamiCollection)
    expect(wrapper.find('.term-head__kicker').text()).toBe('Collection')
    expect(wrapper.find('h1.term-head__title').text()).toBe('')
    expect(wrapper.find('.card-grid').exists()).toBe(true)
    expect(wrapper.find('.term-page__empty').exists()).toBe(false)
  })

  test('passes the title, kicker, description and count to the head band', () => {
    const wrapper = mount(UmamiCollection, { propsData: props })
    expect(wrapper.find('.term-head__title').text()).toBe('Vegetarian')
    expect(wrapper.find('.term-head__kicker').text()).toBe('Tag')
    expect(wrapper.find('.term-head__blurb').html()).toContain(
      '<p>Recipes <em>without</em> meat.</p>'
    )
    expect(wrapper.find('.term-head__count').text()).toBe('18 recipes')
  })

  test('renders the cards in the grid, the breadcrumb in the head, then the note', () => {
    const wrapper = mount(UmamiCollection, {
      propsData: props,
      slots: {
        default: marker('default'),
        breadcrumb: marker('breadcrumb'),
        note: marker('note'),
      },
    })
    expect(wrapper.find('.card-grid [data-slot=default]').exists()).toBe(true)
    expect(wrapper.find('.term-head [data-slot=breadcrumb]').exists()).toBe(
      true
    )
    expect(wrapper.element.lastElementChild.dataset.slot).toBe('note')
  })

  test('shows the empty text instead of the grid when empty', () => {
    const wrapper = mount(UmamiCollection, {
      propsData: { ...props, empty: true, emptyText: 'Nothing here yet.' },
      slots: { default: marker('default') },
    })
    expect(wrapper.find('.card-grid').exists()).toBe(false)
    expect(wrapper.find('.term-page__empty').text()).toBe('Nothing here yet.')
  })

  test('shows nothing in the grid’s place while empty with no text', () => {
    const wrapper = mount(UmamiCollection, { propsData: { empty: true } })
    expect(wrapper.find('.card-grid').exists()).toBe(false)
    expect(wrapper.find('.term-page__empty').exists()).toBe(false)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiCollection, { propsData: props })
    expectThemed(wrapper, ['term-page'])
    expectThemed(wrapper, ['card-grid'], '.card-grid')
    const empty = mount(UmamiCollection, {
      propsData: { empty: true, emptyText: 'None' },
    })
    expectThemed(empty, ['term-page__empty'], 'p')
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiCollection, { propsData: props }))
  })
})
