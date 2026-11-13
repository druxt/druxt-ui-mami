import UmamiTiles from '../../components/UmamiTiles.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiTiles', () => {
  test('renders an empty row, with no heading or button, by default', () => {
    const wrapper = mount(UmamiTiles)
    expect(wrapper.find('h2').exists()).toBe(false)
    expect(wrapper.find('.row').text()).toBe('')
    expect(wrapper.find('.btn').exists()).toBe(false)
  })

  test('renders the heading slot in a heading', () => {
    const wrapper = mount(UmamiTiles, { slots: { heading: 'Recipes' } })
    expect(wrapper.find('h2').text()).toBe('Recipes')
  })

  test('renders the columns in the row', () => {
    const wrapper = mount(UmamiTiles, {
      slots: { default: marker('default') },
    })
    expect(wrapper.find('.row > [data-slot=default]').exists()).toBe(true)
  })

  test('renders the button to `ctaTo`, with the default text', () => {
    const button = mount(UmamiTiles, {
      propsData: { ctaTo: '/recipes' },
    }).find('a.btn')
    expect(button.attributes('href')).toBe('/recipes')
    expect(button.text()).toBe('All recipes')
    expect(button.classes()).toContain('btn-outline-secondary')
  })

  test('renders the button text it is given', () => {
    const button = mount(UmamiTiles, {
      propsData: { ctaTo: '/es/recipes', ctaText: 'Todas las recetas' },
    }).find('.btn')
    expect(button.text()).toBe('Todas las recetas')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiTiles, {
      propsData: { ctaTo: '/recipes' },
      slots: { heading: 'Recipes' },
    })
    expectThemed(wrapper, ['band__title'], 'h2')
    expectThemed(wrapper, ['band__cta'], '.btn')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiTiles, {
        propsData: { ctaTo: '/recipes' },
        slots: { heading: 'Recipes', default: '<div class="col">A</div>' },
      })
    )
  })
})
