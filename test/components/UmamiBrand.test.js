import UmamiBrand from '../../components/UmamiBrand.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

describe('UmamiBrand', () => {
  test('renders the default wordmark and tagline, linked home', () => {
    const wrapper = mount(UmamiBrand)
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.find('.masthead__wordmark').text()).toBe('Umami')
    expect(wrapper.find('.masthead__tagline').text()).toBe('Food magazine')
    expect(wrapper.attributes('href')).toBe('/')
  })

  test('renders the name, tagline and link it is given', () => {
    const wrapper = mount(UmamiBrand, {
      propsData: { name: 'Umami ES', tagline: 'Revista', to: '/es' },
    })
    expect(wrapper.find('.masthead__wordmark').text()).toBe('Umami ES')
    expect(wrapper.find('.masthead__tagline').text()).toBe('Revista')
    expect(wrapper.attributes('href')).toBe('/es')
  })

  test('takes a route object as its link', () => {
    const wrapper = mount(UmamiBrand, { propsData: { to: { path: '/es' } } })
    expect(wrapper.attributes('href')).toBe('/es')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiBrand)
    expectThemed(wrapper, ['masthead__brand'])
    expect(wrapper.classes()).toContain('navbar-brand')
    expectThemed(wrapper, ['masthead__wordmark'], '.masthead__wordmark')
    expectThemed(wrapper, ['masthead__tagline'], '.masthead__tagline')
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiBrand))
  })
})
