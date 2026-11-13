import UmamiMobileDrawer from '../../components/UmamiMobileDrawer.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const languages = [
  { code: 'en', to: '/', active: true },
  { code: 'es', to: '/es' },
]

const credit = {
  creditLabel: 'Built with',
  creditHref: 'https://druxtjs.org',
  creditText: 'Druxt',
}

const menu = `<template #menu="{ hide }">
  <nav aria-label="Main"><a href="/recipes" data-slot="menu" @click="hide">Recipes</a></nav>
</template>`

/** The sidebar's transitions run on animation frames. */
const frames = async (count = 4) => {
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
}

const drawers = []
const drawer = (propsData = {}, options = {}) => {
  const wrapper = mount(UmamiMobileDrawer, {
    attachTo: document.body,
    propsData,
    // The sidebar's `shown` and `hidden` come from its transition hooks,
    // which a stubbed transition never calls.
    stubs: { transition: false },
    scopedSlots: { menu },
    ...options,
  })
  drawers.push(wrapper)
  return wrapper
}

const sidebar = (wrapper) => wrapper.find('.b-sidebar')

const open = async (wrapper, id = 'menu') => {
  wrapper.vm.$root.$emit('bv::toggle::collapse', id)
  await frames()
}

const isOpen = (wrapper) => sidebar(wrapper).element.style.display !== 'none'

// Following a link is navigation, which jsdom does not implement and reports
// as an error. A site's router handles it; here it is stopped.
const stopNavigation = (event) => event.preventDefault()

describe('UmamiMobileDrawer', () => {
  let scrollTo

  beforeAll(() => document.addEventListener('click', stopNavigation))
  afterAll(() => document.removeEventListener('click', stopNavigation))

  beforeEach(() => {
    scrollTo = jest.fn()
    window.scrollTo = scrollTo
    window.scrollY = 0
  })

  afterEach(() => {
    drawers.splice(0).forEach((wrapper) => wrapper.destroy())
    document.body.removeAttribute('style')
  })

  test('renders a closed drawer named `menu`, with its English defaults', () => {
    const wrapper = drawer()
    expect(sidebar(wrapper).attributes()).toMatchObject({
      id: 'menu',
      role: 'dialog',
      'aria-label': 'Menu',
    })
    expect(isOpen(wrapper)).toBe(false)
    expect(wrapper.find('.drawer__wordmark').text()).toBe('Umami')
    expect(wrapper.find('.drawer__tagline').text()).toBe('Food magazine')
    expect(wrapper.find('.drawer__brand').attributes('href')).toBe('/')
    expect(wrapper.find('.drawer__close').attributes('aria-label')).toBe(
      'Close menu'
    )
    expect(wrapper.find('.drawer__druxt').exists()).toBe(false)
  })

  test('renders the id, brand, link and close label it is given', () => {
    const wrapper = drawer({
      id: 'drawer-es',
      name: 'Umami ES',
      tagline: 'Revista',
      to: '/es',
      label: 'Menú',
      closeLabel: 'Cerrar menú',
    })
    expect(sidebar(wrapper).attributes('id')).toBe('drawer-es')
    expect(sidebar(wrapper).attributes('aria-label')).toBe('Menú')
    expect(wrapper.find('.drawer__wordmark').text()).toBe('Umami ES')
    expect(wrapper.find('.drawer__tagline').text()).toBe('Revista')
    expect(wrapper.find('.drawer__brand').attributes('href')).toBe('/es')
    expect(wrapper.find('.drawer__close').attributes('aria-label')).toBe(
      'Cerrar menú'
    )
  })

  test('opens from the left when its toggle names it', async () => {
    const wrapper = drawer({ id: 'drawer-es' })
    await open(wrapper, 'menu')
    expect(isOpen(wrapper)).toBe(false)
    await open(wrapper, 'drawer-es')
    expect(isOpen(wrapper)).toBe(true)
    expect(sidebar(wrapper).classes()).not.toContain('b-sidebar-right')
    expect(wrapper.find('.b-sidebar-backdrop').exists()).toBe(true)
  })

  test('closes from its close button', async () => {
    const wrapper = drawer()
    await open(wrapper)
    await wrapper.find('.drawer__close').trigger('click')
    await frames()
    expect(isOpen(wrapper)).toBe(false)
  })

  test('closes when the brand is followed', async () => {
    const wrapper = drawer()
    await open(wrapper)
    await wrapper.find('.drawer__brand').trigger('click')
    await frames()
    expect(isOpen(wrapper)).toBe(false)
  })

  test('passes `hide` to the menu slot, to close when a link is followed', async () => {
    const wrapper = drawer()
    await open(wrapper)
    await wrapper.find('[data-slot=menu]').trigger('click')
    await frames()
    expect(isOpen(wrapper)).toBe(false)
  })

  test('renders the language buttons, and closes when one is followed', async () => {
    const wrapper = drawer({ languages })
    expect(
      wrapper.findAll('.drawer__lang-btn').wrappers.map((a) => a.text())
    ).toEqual(['EN', 'ES'])
    await open(wrapper)
    await wrapper.findAll('.drawer__lang-btn').at(1).trigger('click')
    await frames()
    expect(isOpen(wrapper)).toBe(false)
  })

  test('renders the credit line, with the icon slot before its label', () => {
    const wrapper = drawer(credit, {
      slots: { 'credit-icon': '<svg data-slot="credit-icon"></svg>' },
    })
    const kicker = wrapper.find('.drawer__druxt-kicker')
    expect(kicker.element.firstElementChild.dataset.slot).toBe('credit-icon')
    expect(kicker.text()).toBe('Built with')
    const link = wrapper.find('a.drawer__druxt-link')
    expect(link.text()).toBe('Druxt →')
    expect(link.attributes()).toMatchObject({
      href: 'https://druxtjs.org',
      rel: 'noopener',
      target: '_blank',
    })
    expect(link.find('[aria-hidden=true]').text()).toBe('→')
  })

  test('holds the page still while open, and puts the reader back on close', async () => {
    const wrapper = drawer()
    window.scrollY = 640
    await open(wrapper)
    expect(document.body.style).toMatchObject({
      position: 'fixed',
      top: '-640px',
      width: '100%',
    })
    await wrapper.find('.drawer__close').trigger('click')
    await frames()
    expect(document.body.style).toMatchObject({
      position: '',
      top: '',
      width: '',
    })
    expect(scrollTo).toHaveBeenCalledWith(0, 640)
  })

  test('starts a new page at the top rather than the saved position', async () => {
    const wrapper = drawer({ path: '/recipes' })
    window.scrollY = 640
    await open(wrapper)
    await wrapper.setProps({ path: '/recipes/borscht' })
    await wrapper.find('.drawer__close').trigger('click')
    await frames()
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  test('releases the page if it is destroyed while open', async () => {
    const wrapper = drawer()
    window.scrollY = 120
    await open(wrapper)
    drawers.splice(drawers.indexOf(wrapper), 1)
    wrapper.destroy()
    expect(document.body.style.position).toBe('')
    expect(scrollTo).toHaveBeenCalledWith(0, 120)
  })

  test('leaves a page it did not hold alone', () => {
    const wrapper = drawer()
    document.body.style.position = 'relative'
    wrapper.vm.lockPage(false)
    expect(document.body.style.position).toBe('relative')
    expect(scrollTo).not.toHaveBeenCalled()
  })

  test('carries the classes the theme styles', () => {
    const wrapper = drawer({ ...credit, languages })
    expect(sidebar(wrapper).classes()).toContain('b-sidebar')
    for (const part of [
      'head',
      'brand',
      'wordmark',
      'tagline',
      'close',
      'lang',
    ]) {
      expectThemed(wrapper, [`drawer__${part}`], `.drawer__${part}`)
    }
    expectThemed(wrapper, ['drawer'], '.drawer')
    expectThemed(wrapper, ['drawer__druxt'], '.drawer__druxt')
    expectThemed(wrapper, ['drawer__druxt-kicker'], '.drawer__druxt-kicker')
    expectThemed(wrapper, ['drawer__druxt-link'], '.drawer__druxt-link')
  })

  test('is accessible while open', async () => {
    const wrapper = drawer({ ...credit, languages })
    await open(wrapper)
    await expectAccessible(wrapper)
  })
})
