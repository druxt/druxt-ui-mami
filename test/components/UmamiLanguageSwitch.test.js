import UmamiLanguageSwitch from '../../components/UmamiLanguageSwitch.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const languages = [
  { code: 'en', to: '/recipes', active: true },
  { code: 'es', to: '/es/recipes', label: 'Español' },
]

// Following a link is navigation, which jsdom does not implement and reports
// as an error. A site's router handles it; here it is stopped.
const stopNavigation = (event) => event.preventDefault()
beforeAll(() => document.addEventListener('click', stopNavigation))
afterAll(() => document.removeEventListener('click', stopNavigation))

describe('UmamiLanguageSwitch', () => {
  test('renders an empty, labelled navigation in the masthead by default', () => {
    const wrapper = mount(UmamiLanguageSwitch)
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Language')
    expect(wrapper.findAll('a')).toHaveLength(0)
  })

  test('links each language, labelled with its label or its code in capitals', () => {
    const wrapper = mount(UmamiLanguageSwitch, { propsData: { languages } })
    expect(
      wrapper.findAll('a').wrappers.map((a) => [a.text(), a.attributes('href')])
    ).toEqual([
      ['EN', '/recipes'],
      ['Español', '/es/recipes'],
    ])
  })

  test('marks the active language', () => {
    const links = mount(UmamiLanguageSwitch, {
      propsData: { languages },
    }).findAll('a')
    expect(links.at(0).classes()).toContain('is-active')
    expect(links.at(1).classes()).not.toContain('is-active')
  })

  test('names the navigation with `label`', () => {
    const wrapper = mount(UmamiLanguageSwitch, {
      propsData: { languages, label: 'Idioma' },
    })
    expect(wrapper.attributes('aria-label')).toBe('Idioma')
  })

  test.each(['masthead', 'drawer'])(
    'emits `navigate` with the language when a %s link is followed',
    async (variant) => {
      const wrapper = mount(UmamiLanguageSwitch, {
        propsData: { languages, variant },
        attachTo: document.body,
      })
      await wrapper.findAll('a').at(1).trigger('click')
      wrapper.destroy()
      expect(wrapper.emitted('navigate')).toEqual([[languages[1]]])
    }
  )

  test('renders the drawer’s buttons for the `drawer` variant', () => {
    const wrapper = mount(UmamiLanguageSwitch, {
      propsData: { languages, variant: 'drawer' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expectThemed(wrapper, ['drawer__lang'])
    const buttons = wrapper.findAll('a')
    expect(buttons.wrappers.map((a) => a.text())).toEqual(['EN', 'Español'])
    expectThemed(wrapper, ['drawer__lang-btn', 'is-active'], 'a')
    expect(buttons.at(1).classes()).toEqual(['drawer__lang-btn'])
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiLanguageSwitch, { propsData: { languages } })
    expectThemed(wrapper, ['masthead__lang'])
    expectThemed(wrapper, ['is-active'], 'a')
  })

  test.each(['masthead', 'drawer'])(
    'is accessible as the %s variant',
    async (variant) => {
      await expectAccessible(
        mount(UmamiLanguageSwitch, { propsData: { languages, variant } })
      )
    }
  )
})
