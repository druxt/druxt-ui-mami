import UmamiPromo from '../../components/UmamiPromo.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const props = {
  img: '/images/magazine.jpg',
  kicker: 'Subscribe',
  cta: { text: 'Find out more', to: '/magazine', target: 'the print edition' },
}

const slots = {
  title: 'Umami in print',
  summary: '<p class="promo__summary" data-slot="summary">Twelve issues.</p>',
}

describe('UmamiPromo', () => {
  test('renders the default kicker, with no cover or button', () => {
    const wrapper = mount(UmamiPromo)
    expect(wrapper.find('.promo__kicker').text()).toBe('In print')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.btn').exists()).toBe(false)
  })

  test('renders the cover, kicker and button', () => {
    const wrapper = mount(UmamiPromo, { propsData: props })
    expect(wrapper.find('img.promo__cover').attributes()).toMatchObject({
      src: props.img,
      alt: '',
    })
    expect(wrapper.find('.promo__kicker').text()).toBe('Subscribe')
    const button = wrapper.find('a.btn')
    expect(button.classes()).toContain('btn-secondary')
    expect(button.attributes('href')).toBe('/magazine')
  })

  test('names what the button leads to, for a screen reader', () => {
    const button = mount(UmamiPromo, { propsData: props }).find('.btn')
    expect(button.find('.sr-only').text()).toBe(': the print edition')
    const plain = mount(UmamiPromo, {
      propsData: { cta: { text: 'Subscribe', to: '/magazine' } },
    }).find('.btn')
    expect(plain.find('.sr-only').exists()).toBe(false)
    expect(plain.text()).toBe('Subscribe')
  })

  test('renders the title slot in the heading and the summary after it', () => {
    const wrapper = mount(UmamiPromo, { propsData: props, slots })
    expect(wrapper.find('h2.promo__title').text()).toBe('Umami in print')
    expect(wrapper.find('h2 + [data-slot=summary]').exists()).toBe(true)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiPromo, { propsData: props, slots })
    expectThemed(wrapper, ['promo'])
    for (const part of ['cover', 'body', 'kicker', 'title', 'summary']) {
      expectThemed(wrapper, [`promo__${part}`], `.promo__${part}`)
    }
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiPromo, { propsData: props, slots }))
  })
})
