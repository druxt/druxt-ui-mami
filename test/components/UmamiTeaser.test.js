import UmamiTeaser from '../../components/UmamiTeaser.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const props = {
  to: '/recipes/borscht',
  kicker: 'Recipe',
  title: 'Borscht with pork ribs',
  meta: '40 min · Medium',
}

describe('UmamiTeaser', () => {
  test('renders a link with an empty title and no kicker or meta by default', () => {
    const wrapper = mount(UmamiTeaser)
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.find('h3.teaser__title').text()).toBe('')
    expect(wrapper.find('.teaser__kicker').exists()).toBe(false)
    expect(wrapper.find('.teaser__meta').exists()).toBe(false)
  })

  test('is one link, holding the meta chip, kicker and title on the photograph', () => {
    const wrapper = mount(UmamiTeaser, { propsData: props })
    expect(wrapper.attributes('href')).toBe(props.to)
    const media = wrapper.find('.teaser__media')
    expect(media.find('.teaser__meta').text()).toBe('40 min · Medium')
    expect(media.find('.teaser__text .teaser__kicker').text()).toBe('Recipe')
    expect(media.find('.teaser__text h3').text()).toBe(props.title)
  })

  test('renders the media slot first on the photograph', () => {
    const wrapper = mount(UmamiTeaser, {
      propsData: props,
      slots: { media: marker('media') },
    })
    expect(
      wrapper.find('.teaser__media').element.firstElementChild.dataset.slot
    ).toBe('media')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiTeaser, { propsData: props })
    expectThemed(wrapper, ['teaser'])
    for (const part of ['media', 'meta', 'scrim', 'text', 'kicker', 'title']) {
      expectThemed(wrapper, [`teaser__${part}`], `.teaser__${part}`)
    }
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiTeaser, {
        propsData: props,
        slots: { media: '<img src="/b.jpg" alt="">' },
      })
    )
  })
})
