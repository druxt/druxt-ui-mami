import UmamiCard from '../../components/UmamiCard.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const props = {
  to: '/recipes/borscht',
  kicker: 'Recipe',
  title: 'Borscht with pork ribs',
  meta: '45 min · Medium',
}

describe('UmamiCard', () => {
  test('renders a link with an empty title and no kicker or meta by default', () => {
    const wrapper = mount(UmamiCard)
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.find('h2.recipe-card__title').text()).toBe('')
    expect(wrapper.find('.recipe-card__kicker').exists()).toBe(false)
    expect(wrapper.find('.recipe-card__meta').exists()).toBe(false)
  })

  test('is all one link, to `to`, holding the kicker, title and meta', () => {
    const wrapper = mount(UmamiCard, { propsData: props })
    expect(wrapper.findAll('a')).toHaveLength(1)
    expect(wrapper.attributes('href')).toBe(props.to)
    expect(wrapper.find('.recipe-card__kicker').text()).toBe('Recipe')
    expect(wrapper.find('.recipe-card__title').text()).toBe(props.title)
    expect(wrapper.find('.recipe-card__meta').text()).toBe('45 min · Medium')
  })

  test('renders the media slot before the body', () => {
    const wrapper = mount(UmamiCard, {
      propsData: props,
      slots: { media: marker('media') },
    })
    expect(wrapper.element.firstElementChild.dataset.slot).toBe('media')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiCard, { propsData: props })
    expectThemed(wrapper, ['recipe-card'])
    expectThemed(wrapper, ['recipe-card__body'], '.recipe-card__body')
    expectThemed(wrapper, ['recipe-card__kicker'], '.recipe-card__kicker')
    expectThemed(wrapper, ['recipe-card__title'], 'h2')
    expectThemed(wrapper, ['recipe-card__meta'], 'p')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiCard, {
        propsData: props,
        slots: { media: '<img src="/x.jpg" alt="">' },
      })
    )
  })
})
