import UmamiAbout from '../../components/UmamiAbout.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const props = {
  kicker: 'About this demo',
  title: 'Built with Druxt',
  paragraphs: ['First paragraph.', 'Second paragraph.'],
}

describe('UmamiAbout', () => {
  test('renders an empty section with its defaults', () => {
    const wrapper = mount(UmamiAbout)
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.find('.about-druxt__kicker').text()).toBe('')
    expect(wrapper.find('h2.about-druxt__title').text()).toBe('')
    expect(wrapper.findAll('p')).toHaveLength(0)
  })

  test('renders the kicker, the title and a paragraph for each entry', () => {
    const wrapper = mount(UmamiAbout, { propsData: props })
    expect(wrapper.find('.about-druxt__kicker').text()).toBe('About this demo')
    expect(wrapper.find('.about-druxt__title').text()).toBe('Built with Druxt')
    expect(
      wrapper.findAll('section > p').wrappers.map((p) => p.text())
    ).toEqual(props.paragraphs)
  })

  test('renders the mark slot in the head, before the kicker', () => {
    const wrapper = mount(UmamiAbout, {
      propsData: props,
      slots: { mark: marker('mark') },
    })
    const head = wrapper.find('.about-druxt__head')
    expect(head.element.firstElementChild.dataset.slot).toBe('mark')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiAbout, { propsData: props })
    expectThemed(wrapper, ['about-druxt'])
    expectThemed(wrapper, ['about-druxt__head'], '.about-druxt__head')
    expectThemed(wrapper, ['about-druxt__kicker'], 'span')
    expectThemed(wrapper, ['about-druxt__title'], 'h2')
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiAbout, { propsData: props }))
  })
})
