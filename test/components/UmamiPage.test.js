import UmamiPage from '../../components/UmamiPage.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiPage', () => {
  test('renders the head band with an empty title by default', () => {
    const wrapper = mount(UmamiPage)
    expect(wrapper.find('.term-head h1').text()).toBe('')
    expect(wrapper.find('.term-head__count').exists()).toBe(false)
    expect(wrapper.find('.page-node__body').text()).toBe('')
  })

  test('passes the title to the head band', () => {
    const wrapper = mount(UmamiPage, { propsData: { title: 'About Umami' } })
    expect(wrapper.find('h1.term-head__title').text()).toBe('About Umami')
  })

  test('renders the breadcrumb in the head, the body, then what comes after', () => {
    const wrapper = mount(UmamiPage, {
      slots: {
        breadcrumb: marker('breadcrumb'),
        default: marker('default'),
        after: marker('after'),
      },
    })
    expect(wrapper.find('.term-head [data-slot=breadcrumb]').exists()).toBe(
      true
    )
    expect(
      wrapper.find('.page-node__body > [data-slot=default]').exists()
    ).toBe(true)
    const measure = wrapper.find('.page-node__measure').element
    expect(measure.lastElementChild.dataset.slot).toBe('after')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiPage)
    expect(wrapper.classes()).toEqual(['page-node'])
    expectThemed(wrapper, ['page-node__measure'], '.page-node__measure')
    expectThemed(wrapper, ['page-node__body'], '.page-node__body')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiPage, {
        propsData: { title: 'About Umami' },
        slots: { default: '<p>Umami is a food magazine.</p>' },
      })
    )
  })
})
