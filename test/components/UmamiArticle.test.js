import UmamiArticle from '../../components/UmamiArticle.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const props = {
  title: 'The real deal for supermarket savvy shopping',
  kicker: 'Article · 4 min read',
  byline: 'By Umami',
  date: '12 November 2026',
  rail: ['Filed under', 'Shopping'],
}

const slots = Object.fromEntries(
  ['media', 'body', 'tags', 'more', 'note'].map((name) => [name, marker(name)])
)

describe('UmamiArticle', () => {
  test('renders the article frame with its defaults', () => {
    const wrapper = mount(UmamiArticle)
    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.find('h1.article-page__title').text()).toBe('')
    expect(wrapper.find('.article-page__rail').text()).toBe('')
    expect(wrapper.find('.article-page__byline').text()).toBe('')
  })

  test('renders the title, kicker, byline and date', () => {
    const wrapper = mount(UmamiArticle, { propsData: props })
    expect(wrapper.find('h1').text()).toBe(props.title)
    expect(wrapper.find('.article-page__kicker').text()).toBe(props.kicker)
    expect(wrapper.find('.article-page__byline').text()).toBe(
      'By Umami · 12 November 2026'
    )
    expect(wrapper.find('.article-page__date').text()).toBe(
      '· 12 November 2026'
    )
  })

  test('leaves the separator out when there is no date', () => {
    const wrapper = mount(UmamiArticle, {
      propsData: { ...props, date: '' },
    })
    expect(wrapper.find('.article-page__byline').text()).toBe('By Umami')
    expect(wrapper.find('.article-page__date').exists()).toBe(false)
  })

  test('breaks the rail lines, with no break after the last', () => {
    const wrapper = mount(UmamiArticle, { propsData: props })
    const rail = wrapper.find('.article-page__rail')
    expect(rail.html()).toContain('Filed under<br>Shopping')
    expect(rail.findAll('br')).toHaveLength(1)
  })

  test('renders every slot in its place', () => {
    const wrapper = mount(UmamiArticle, { propsData: props, slots })
    expect(wrapper.find('.node-hero [data-slot=media]').exists()).toBe(true)
    expect(wrapper.find('.article-page__body [data-slot=body]').exists()).toBe(
      true
    )
    expect(wrapper.find('.recipe-tags [data-slot=tags]').exists()).toBe(true)
    expect(wrapper.find('.article-page__more [data-slot=more]').exists()).toBe(
      true
    )
    expect(
      wrapper.find('.article-page__column > [data-slot=note]').exists()
    ).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiArticle, { propsData: props })
    expect(wrapper.classes()).toContain('article-page')
    expectThemed(
      wrapper,
      ['node-hero', 'node-hero--article', 'bleed'],
      '.node-hero'
    )
    expectThemed(wrapper, ['article-page__grid'], '.article-page__grid')
    expectThemed(wrapper, ['article-page__rail'], 'aside')
    expectThemed(wrapper, ['article-page__column'], '.article-page__column')
    expectThemed(wrapper, ['article-page__title'], 'h1')
    expectThemed(wrapper, ['field--body', 'article-page__body'], '.field--body')
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiArticle, { propsData: props, slots }))
  })
})
