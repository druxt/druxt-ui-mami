import UmamiMasthead from '../../components/UmamiMasthead.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const languages = [
  { code: 'en', to: '/', active: true },
  { code: 'es', to: '/es' },
]

describe('UmamiMasthead', () => {
  test('renders the toggle for the `menu` drawer and empty slots by default', () => {
    const wrapper = mount(UmamiMasthead)
    const toggle = wrapper.find('button.masthead__toggle')
    expect(toggle.attributes()).toMatchObject({
      type: 'button',
      'aria-label': 'Open menu',
      'aria-controls': 'menu',
      'aria-expanded': 'false',
    })
    expect(toggle.findAll('.masthead__toggle-bar')).toHaveLength(2)
    expect(wrapper.find('.masthead__brand-slot').text()).toBe('')
    expect(wrapper.find('nav.masthead__lang').attributes('aria-label')).toBe(
      'Language'
    )
  })

  test('opens the drawer it names', async () => {
    const wrapper = mount(UmamiMasthead, { propsData: { drawer: 'drawer-1' } })
    const toggled = jest.fn()
    wrapper.vm.$root.$on('bv::toggle::collapse', toggled)
    expect(wrapper.find('button').attributes('aria-controls')).toBe('drawer-1')
    // BootstrapVue binds the toggle's click handler a frame after mounting.
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await wrapper.find('button').trigger('click')
    expect(toggled).toHaveBeenCalledWith('drawer-1')
  })

  test('labels the toggle and the language links', () => {
    const wrapper = mount(UmamiMasthead, {
      propsData: { menuLabel: 'Abrir menú', languageLabel: 'Idioma' },
    })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Abrir menú')
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Idioma')
  })

  test('passes the languages to the language links', () => {
    const wrapper = mount(UmamiMasthead, { propsData: { languages } })
    expect(
      wrapper.findAll('.masthead__utils a').wrappers.map((a) => a.text())
    ).toEqual(['EN', 'ES'])
  })

  test('renders the brand in its box and the menu in the desktop row', () => {
    const wrapper = mount(UmamiMasthead, {
      slots: { brand: marker('brand'), menu: marker('menu') },
    })
    expect(
      wrapper.find('.masthead__brand-slot [data-slot=brand]').exists()
    ).toBe(true)
    expect(
      wrapper.find('.masthead__desktop').element.firstElementChild.dataset.slot
    ).toBe('menu')
  })

  test('keeps the spacer that centres the wordmark out of the reading', () => {
    expect(
      mount(UmamiMasthead)
        .find('.masthead__search-icon')
        .attributes('aria-hidden')
    ).toBe('true')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiMasthead, { propsData: { languages } })
    expectThemed(wrapper, ['masthead'])
    for (const part of [
      'toggle',
      'toggle-bar',
      'brand-slot',
      'search-icon',
      'desktop',
      'utils',
    ]) {
      expectThemed(wrapper, [`masthead__${part}`], `.masthead__${part}`)
    }
  })

  test('is accessible', async () => {
    const wrapper = mount(UmamiMasthead, {
      propsData: { languages },
      slots: { brand: '<a href="/">Umami</a>' },
    })
    // The drawer the toggle controls is elsewhere in the layout.
    await expectAccessible(wrapper, '<div id="menu"></div>')
  })
})
