import UmamiFeedback from '../../components/UmamiFeedback.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiFeedback', () => {
  test('renders the default heading', () => {
    expect(mount(UmamiFeedback).find('h2').text()).toBe(
      'Tell us what you think'
    )
  })

  test('renders the title it is given, and the button after it', () => {
    const wrapper = mount(UmamiFeedback, {
      propsData: { title: 'Cuéntanos qué piensas' },
      slots: { default: marker('default') },
    })
    expect(wrapper.find('h2').text()).toBe('Cuéntanos qué piensas')
    expect(wrapper.element.lastElementChild.dataset.slot).toBe('default')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiFeedback)
    expectThemed(wrapper, ['feedback'])
    expectThemed(wrapper, ['feedback__title'], 'h2')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiFeedback, {
        slots: { default: '<button type="button">Give feedback</button>' },
      })
    )
  })
})
