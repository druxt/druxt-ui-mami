import UmamiErrorPage from '../../components/UmamiErrorPage.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const props = {
  kicker: '404',
  title: 'No hay ninguna página aquí',
  text: 'No se pudo mostrar la página.',
  detail: 'Not found: /es/nowhere',
  homeText: 'Volver al inicio',
  homeTo: '/es',
}

describe('UmamiErrorPage', () => {
  test('renders the English defaults, with a link home and no detail', () => {
    const wrapper = mount(UmamiErrorPage)
    expect(wrapper.find('.error-page__kicker').text()).toBe(
      'Something went wrong'
    )
    expect(wrapper.find('h1').text()).toBe('There is no page here')
    expect(wrapper.find('.error-page__text').text()).toBe(
      'The page could not be shown.'
    )
    expect(wrapper.find('.error-page__detail').exists()).toBe(false)
    const home = wrapper.find('a.error-page__home')
    expect(home.text()).toBe('Back to the home page')
    expect(home.attributes('href')).toBe('/')
  })

  test('renders every string, the detail and the link it is given', () => {
    const wrapper = mount(UmamiErrorPage, { propsData: props })
    expect(wrapper.find('.error-page__kicker').text()).toBe('404')
    expect(wrapper.find('h1').text()).toBe(props.title)
    expect(wrapper.find('.error-page__text').text()).toBe(props.text)
    expect(wrapper.find('.error-page__detail').text()).toBe(props.detail)
    expect(wrapper.find('a').text()).toBe('Volver al inicio')
    expect(wrapper.find('a').attributes('href')).toBe('/es')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiErrorPage, { propsData: props })
    expectThemed(wrapper, ['error-page'])
    for (const part of ['kicker', 'title', 'text', 'detail', 'home']) {
      expectThemed(wrapper, [`error-page__${part}`], `.error-page__${part}`)
    }
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiErrorPage, { propsData: props }))
  })
})
