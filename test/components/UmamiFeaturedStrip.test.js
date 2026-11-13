import UmamiFeaturedStrip from '../../components/UmamiFeaturedStrip.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

describe('UmamiFeaturedStrip', () => {
  test('renders the default label over an empty strip', () => {
    const wrapper = mount(UmamiFeaturedStrip)
    expect(wrapper.find('.band__label').text()).toBe('This week')
    expect(wrapper.find('.featured-strip').text()).toBe('')
  })

  test('renders the label it is given, and the teasers in the strip', () => {
    const wrapper = mount(UmamiFeaturedStrip, {
      propsData: { label: 'Esta semana' },
      slots: { default: marker('default') },
    })
    expect(wrapper.find('.band__label').text()).toBe('Esta semana')
    expect(
      wrapper.find('.container .featured-strip > [data-slot=default]').exists()
    ).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiFeaturedStrip)
    expectThemed(wrapper, ['band', 'band--warm'])
    expectThemed(wrapper, ['band__label'], '.band__label')
    expectThemed(wrapper, ['featured-strip'], '.featured-strip')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiFeaturedStrip, {
        slots: { default: '<a href="/a">A teaser</a>' },
      })
    )
  })
})
