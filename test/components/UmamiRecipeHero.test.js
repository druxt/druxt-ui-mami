import UmamiRecipeHero from '../../components/UmamiRecipeHero.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiRecipeHero', () => {
  test('renders the photograph frame and an empty title by default', () => {
    const wrapper = mount(UmamiRecipeHero)
    expect(wrapper.find('.node-hero--recipe').exists()).toBe(true)
    expect(wrapper.find('h1.node-head__title').text()).toBe('')
  })

  test('renders the title as text', () => {
    const wrapper = mount(UmamiRecipeHero, {
      propsData: { title: 'Borscht <b>with</b> pork ribs' },
    })
    expect(wrapper.find('h1').text()).toBe('Borscht <b>with</b> pork ribs')
  })

  test('renders the photograph, the breadcrumb above the title, and the summary', () => {
    const wrapper = mount(UmamiRecipeHero, {
      propsData: { title: 'Borscht' },
      slots: {
        media: marker('media'),
        breadcrumb: marker('breadcrumb'),
        summary: marker('summary'),
      },
    })
    expect(wrapper.find('.node-hero > [data-slot=media]').exists()).toBe(true)
    expect(
      wrapper.find('.node-head').element.firstElementChild.dataset.slot
    ).toBe('breadcrumb')
    expect(
      wrapper.find('.node-head__summary > [data-slot=summary]').exists()
    ).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiRecipeHero)
    expectThemed(wrapper, ['recipe-hero', 'bleed'])
    expectThemed(wrapper, ['node-hero', 'node-hero--recipe'], '.node-hero')
    expectThemed(wrapper, ['recipe-hero__scrim'], '.recipe-hero__scrim')
    expectThemed(wrapper, ['node-head', 'recipe-hero__head'], '.node-head')
    expectThemed(wrapper, ['node-head__title'], 'h1')
    expectThemed(
      wrapper,
      ['node-head__summary', 'field--field-summary'],
      '.node-head__summary'
    )
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiRecipeHero, {
        propsData: { title: 'Borscht' },
        slots: { media: '<img src="/b.jpg" alt="A bowl of borscht">' },
      })
    )
  })
})
