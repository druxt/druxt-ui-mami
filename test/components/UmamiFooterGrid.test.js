import UmamiFooterGrid from '../../components/UmamiFooterGrid.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const props = {
  name: 'Umami',
  kicker: 'Food magazine',
  creditLabel: 'Built with',
  creditHref: 'https://druxtjs.org',
  creditText: 'Druxt',
  copyright: '© 2026 <a href="/about">Umami</a>',
}

const menu = `<div class="site-footer__col site-footer__col--menu">
  <span class="site-footer__kicker">Menu</span>
  <a class="site-footer__link" href="/recipes">Recipes</a>
</div>`

describe('UmamiFooterGrid', () => {
  test('renders the brand column only, by default', () => {
    const wrapper = mount(UmamiFooterGrid)
    expect(wrapper.find('.site-footer__wordmark').text()).toBe('Umami')
    expect(wrapper.find('.site-footer__kicker--brand').text()).toBe('Umami')
    expect(wrapper.find('.site-footer__col--demo').exists()).toBe(false)
    expect(wrapper.find('.site-footer__base').exists()).toBe(false)
  })

  test('renders the name and the brand kicker', () => {
    const wrapper = mount(UmamiFooterGrid, {
      propsData: { ...props, name: 'Umami ES' },
    })
    expect(wrapper.find('.site-footer__wordmark').text()).toBe('Umami ES')
    expect(wrapper.find('.site-footer__kicker--brand').text()).toBe(
      'Food magazine'
    )
  })

  test('renders the credit column, opening its link in a new tab', () => {
    const wrapper = mount(UmamiFooterGrid, { propsData: props })
    const demo = wrapper.find('.site-footer__col--demo')
    expect(demo.find('.site-footer__kicker--demo').text()).toBe('Built with')
    expect(demo.find('a').text()).toBe('Druxt')
    expect(demo.find('a').attributes()).toMatchObject({
      href: 'https://druxtjs.org',
      rel: 'noopener',
      target: '_blank',
    })
  })

  test('renders the copyright line as HTML', () => {
    const wrapper = mount(UmamiFooterGrid, { propsData: props })
    expect(wrapper.find('.site-footer__base').html()).toContain(
      '© 2026 <a href="/about">Umami</a>'
    )
  })

  test('renders the brand slot in the brand column, and the menu after it', () => {
    const wrapper = mount(UmamiFooterGrid, {
      propsData: props,
      slots: { brand: '<p data-slot="brand">Note</p>', menu },
    })
    const columns = wrapper.findAll('.site-footer__col')
    expect(columns.at(0).find('[data-slot=brand]').exists()).toBe(true)
    expect(columns.at(1).classes()).toContain('site-footer__col--menu')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiFooterGrid, { propsData: props })
    expectThemed(wrapper, ['site-footer__grid'])
    expectThemed(wrapper, ['site-footer__col'], '.site-footer__col')
    expectThemed(wrapper, ['site-footer__wordmark'], '.site-footer__wordmark')
    expectThemed(
      wrapper,
      ['site-footer__kicker', 'site-footer__kicker--brand'],
      '.site-footer__kicker--brand'
    )
    // The credit column is laid out as any other column; only its kicker and
    // link are drawn differently.
    expectThemed(wrapper, ['site-footer__col'], '.site-footer__col--demo')
    expectThemed(
      wrapper,
      ['site-footer__kicker', 'site-footer__kicker--demo'],
      '.site-footer__kicker--demo'
    )
    expectThemed(
      wrapper,
      ['site-footer__link', 'site-footer__link--demo'],
      '.site-footer__link'
    )
    expectThemed(wrapper, ['site-footer__base'], '.site-footer__base')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiFooterGrid, { propsData: props, slots: { menu } })
    )
  })
})
