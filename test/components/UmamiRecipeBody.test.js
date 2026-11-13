import UmamiRecipeBody from '../../components/UmamiRecipeBody.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiRecipeBody', () => {
  test('renders the English headings by default', () => {
    const headings = mount(UmamiRecipeBody).findAll('h2')
    expect(headings.wrappers.map((h) => h.text())).toEqual([
      'Ingredients',
      'Method',
    ])
  })

  test('renders the headings it is given', () => {
    const headings = mount(UmamiRecipeBody, {
      propsData: {
        ingredientsHeading: 'Ingredientes',
        methodHeading: 'Preparación',
      },
    }).findAll('h2')
    expect(headings.wrappers.map((h) => h.text())).toEqual([
      'Ingredientes',
      'Preparación',
    ])
  })

  test('renders the ingredients, then the method with the tags under it', () => {
    const wrapper = mount(UmamiRecipeBody, {
      slots: {
        ingredients: marker('ingredients'),
        method: marker('method'),
        tags: marker('tags'),
      },
    })
    expect(
      wrapper.find('.recipe-ingredients > [data-slot=ingredients]').exists()
    ).toBe(true)
    expect(wrapper.find('.recipe-method > [data-slot=method]').exists()).toBe(
      true
    )
    expect(
      wrapper.find('.recipe-method .recipe-tags > [data-slot=tags]').exists()
    ).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiRecipeBody)
    expectThemed(wrapper, ['recipe-body'])
    expectThemed(wrapper, ['recipe-ingredients'], '.recipe-ingredients')
    expectThemed(wrapper, ['recipe-method'], '.recipe-method')
    expectThemed(wrapper, ['recipe-body__heading'], 'h2')
    expectThemed(wrapper, ['recipe-tags'], '.recipe-tags')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiRecipeBody, {
        slots: { ingredients: '<p>2 carrots</p>', method: '<p>Chop.</p>' },
      })
    )
  })
})
