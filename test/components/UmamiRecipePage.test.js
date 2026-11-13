import UmamiRecipePage from '../../components/UmamiRecipePage.vue'
import { expectAccessible, marker, mount } from '../helpers'

describe('UmamiRecipePage', () => {
  test('renders an empty article by default', () => {
    const wrapper = mount(UmamiRecipePage)
    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.text()).toBe('')
  })

  test('renders the default slot', () => {
    const wrapper = mount(UmamiRecipePage, {
      slots: { default: marker('default') },
    })
    expect(wrapper.find('article > [data-slot=default]').exists()).toBe(true)
  })

  test('carries the class the theme hangs the recipe layout on', () => {
    expect(mount(UmamiRecipePage).classes()).toEqual(['recipe-page'])
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiRecipePage, { slots: { default: '<h1>Borscht</h1>' } })
    )
  })
})
