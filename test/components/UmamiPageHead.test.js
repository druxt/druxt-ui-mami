import UmamiPageHead from '../../components/UmamiPageHead.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const props = {
  title: 'Vegetarian',
  kicker: 'Tag',
  description: '<p>Recipes <em>without</em> meat.</p>',
  count: '18 recipes and 4 articles',
}

describe('UmamiPageHead', () => {
  test('renders an empty title and nothing optional by default', () => {
    const wrapper = mount(UmamiPageHead)
    expect(wrapper.find('h1.term-head__title').text()).toBe('')
    for (const part of ['kicker', 'blurb', 'count']) {
      expect(wrapper.find(`.term-head__${part}`).exists()).toBe(false)
    }
  })

  test('renders the title as text', () => {
    const wrapper = mount(UmamiPageHead, {
      propsData: { title: 'Fish & <i>chips</i>' },
    })
    expect(wrapper.find('h1').text()).toBe('Fish & <i>chips</i>')
    expect(wrapper.find('i').exists()).toBe(false)
  })

  test('renders the kicker, the description as HTML, and the count', () => {
    const wrapper = mount(UmamiPageHead, { propsData: props })
    expect(wrapper.find('.term-head__kicker').text()).toBe('Tag')
    expect(wrapper.find('.term-head__blurb').element.innerHTML).toBe(
      props.description
    )
    expect(wrapper.find('.term-head__count').text()).toBe(props.count)
  })

  test('renders the breadcrumb first', () => {
    const wrapper = mount(UmamiPageHead, {
      propsData: props,
      slots: { breadcrumb: marker('breadcrumb') },
    })
    expect(
      wrapper.find('.term-head__inner').element.firstElementChild.dataset.slot
    ).toBe('breadcrumb')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiPageHead, { propsData: props })
    expectThemed(wrapper, ['term-head', 'bleed'])
    for (const part of ['inner', 'kicker', 'title', 'blurb', 'count']) {
      expectThemed(wrapper, [`term-head__${part}`], `.term-head__${part}`)
    }
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiPageHead, { propsData: props }))
  })
})
