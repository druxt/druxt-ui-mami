import UmamiGrid from '../../components/UmamiGrid.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiGrid', () => {
  test('is a card grid by default, holding the default slot', () => {
    const wrapper = mount(UmamiGrid, { slots: { default: marker('default') } })
    expect(wrapper.classes()).toEqual(['card-grid'])
    expect(wrapper.find('[data-slot=default]').exists()).toBe(true)
  })

  test.each([
    ['cards', ['card-grid']],
    ['articles', ['article-grid']],
    ['aside', ['article-grid', 'article-grid--aside']],
  ])('`%s` is styled by the theme as %j', (variant, classes) => {
    const wrapper = mount(UmamiGrid, { propsData: { variant } })
    expect(wrapper.classes()).toEqual(classes)
    expectThemed(wrapper, classes)
  })

  test('falls back to cards for a variant it does not know', () => {
    expect(
      mount(UmamiGrid, { propsData: { variant: 'masonry' } }).classes()
    ).toEqual(['card-grid'])
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiGrid, { slots: { default: '<a href="/a">Card</a>' } })
    )
  })
})
