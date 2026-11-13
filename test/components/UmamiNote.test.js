import UmamiNote from '../../components/UmamiNote.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const code =
  '<span class="t">&lt;UmamiCard</span> <span class="a">:to</span>=<span class="v">"path"</span> <span class="t">/&gt;</span>'

const props = {
  kicker: 'Cómo funciona esta página',
  title: 'A card per recipe',
  file: 'components/druxt/entity/node/Card.vue',
  code,
  cta: 'Read about entities',
}

describe('UmamiNote', () => {
  test('renders the default kicker and link text, with nothing optional', () => {
    const wrapper = mount(UmamiNote, { slots: { default: 'Body' } })
    expect(wrapper.find('.druxt-note__kicker').text()).toBe(
      'How this page works'
    )
    expect(wrapper.find('.druxt-note__body').text()).toBe('Body')
    for (const part of ['title', 'file', 'link', 'sample']) {
      expect(wrapper.find(`.druxt-note__${part}`).exists()).toBe(false)
    }
    expect(wrapper.classes()).toEqual(['druxt-note'])
  })

  test('renders the kicker, title, file and the code sample as HTML', () => {
    const wrapper = mount(UmamiNote, { propsData: props })
    expect(wrapper.find('.druxt-note__kicker').text()).toBe(props.kicker)
    expect(wrapper.find('h3.druxt-note__title').text()).toBe(props.title)
    expect(wrapper.find('code.druxt-note__file').text()).toBe(props.file)
    expect(wrapper.find('pre code').element.innerHTML).toBe(code)
    expect(wrapper.classes()).toContain('druxt-note--code')
  })

  test('links within the site with `to`', () => {
    const link = mount(UmamiNote, {
      propsData: { ...props, to: '/guide', href: 'https://druxtjs.org' },
    }).find('.druxt-note__link')
    expect(link.attributes('href')).toBe('/guide')
    expect(link.attributes('target')).toBeUndefined()
    expect(link.text()).toBe('Read about entities →')
  })

  test('links anywhere else with `href`, in a new tab', () => {
    const link = mount(UmamiNote, {
      propsData: { href: 'https://druxtjs.org/guide' },
    }).find('.druxt-note__link')
    expect(link.attributes()).toMatchObject({
      href: 'https://druxtjs.org/guide',
      rel: 'noopener',
      target: '_blank',
    })
    expect(link.text()).toBe('Read the guide →')
  })

  test('renders the default slot as the body', () => {
    const wrapper = mount(UmamiNote, {
      slots: { default: '<em data-slot="default">Body</em>' },
    })
    expect(wrapper.find('.druxt-note__body [data-slot=default]').exists()).toBe(
      true
    )
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiNote, { propsData: { ...props, to: '/guide' } })
    expectThemed(wrapper, ['druxt-note'])
    for (const part of ['kicker', 'title', 'body', 'file', 'link']) {
      expectThemed(wrapper, [`druxt-note__${part}`], `.druxt-note__${part}`)
    }
    expectThemed(wrapper, ['druxt-code', 'druxt-code--fill'], 'pre')
  })

  test('marks the prose, the sample and a note with code for the theme', () => {
    // The theme has no rule for these yet, so the prose and the sample stack
    // at every width rather than splitting two thirds to one third. They are
    // asserted here so the hook for that layout stays in place.
    const wrapper = mount(UmamiNote, { propsData: props })
    expect(wrapper.classes()).toContain('druxt-note--code')
    expect(wrapper.find('.druxt-note__prose').exists()).toBe(true)
    expect(wrapper.find('.druxt-note__sample').classes()).toContain('d-flex')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiNote, {
        propsData: { ...props, to: '/guide' },
        slots: { default: 'Each recipe is drawn by one component.' },
      })
    )
  })
})
