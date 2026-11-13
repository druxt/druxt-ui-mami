import UmamiArticleLead from '../../components/UmamiArticleLead.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const props = {
  to: '/articles/give-it-a-go',
  img: '/images/lead.jpg',
  kicker: 'Editor’s pick',
  title: 'Give it a go and grow your own herbs',
  summary: 'There is nothing like fresh herbs.',
  ctaText: 'Read the story',
}

describe('UmamiArticleLead', () => {
  test('renders its defaults: the kicker, the button, no image or summary', () => {
    const wrapper = mount(UmamiArticleLead)
    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.find('.article-lead__kicker').text()).toBe('Latest')
    expect(wrapper.find('.article-lead__cta').text()).toBe('Read article')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.article-lead__summary').exists()).toBe(false)
  })

  test('renders the image, kicker, title, summary and button text', () => {
    const wrapper = mount(UmamiArticleLead, { propsData: props })
    expect(wrapper.find('img').attributes()).toMatchObject({
      src: props.img,
      alt: '',
    })
    expect(wrapper.find('.article-lead__kicker').text()).toBe(props.kicker)
    expect(wrapper.find('.article-lead__title').text()).toBe(props.title)
    expect(wrapper.find('.article-lead__summary').text()).toBe(props.summary)
    expect(wrapper.find('.article-lead__cta').text()).toBe(props.ctaText)
  })

  test('links the photograph, the title and the button to the article', () => {
    const wrapper = mount(UmamiArticleLead, { propsData: props })
    const hrefs = wrapper.findAll('a').wrappers.map((a) => a.attributes('href'))
    expect(hrefs).toEqual([props.to, props.to, props.to])
  })

  test('keeps the photograph link out of the tab order and the reading', () => {
    // The title link names the article. A second link holding only an image
    // with empty alt text has no name of its own.
    const media = mount(UmamiArticleLead, { propsData: props }).find(
      '.article-lead__media'
    )
    expect(media.attributes()).toMatchObject({
      'aria-hidden': 'true',
      tabindex: '-1',
    })
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiArticleLead, { propsData: props })
    expectThemed(wrapper, ['article-lead'])
    expectThemed(wrapper, ['article-lead__media'], '.article-lead__media')
    expectThemed(wrapper, ['article-lead__body'], '.article-lead__body')
    expectThemed(wrapper, ['article-lead__title'], 'h2')
    expectThemed(wrapper, ['article-lead__cta'], '.btn')
    expect(wrapper.find('.btn').classes()).toEqual(
      expect.arrayContaining([
        'btn-outline-dark',
        'd-none',
        'd-lg-inline-block',
      ])
    )
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiArticleLead, { propsData: props }))
  })
})
