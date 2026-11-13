import UmamiCarousel from '../../components/UmamiCarousel.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
const titles = ['Pasta bake', 'Borscht', 'Crema catalana']

const slide = `<template #default="{ item, index, active }">
  <p :data-id="item.id" :data-index="index" :data-active="String(active)">
    Slide {{ item.id }}
  </p>
</template>`

const carousel = (propsData = { items, titles }) =>
  mount(UmamiCarousel, { propsData, scopedSlots: { default: slide } })

const shown = (wrapper) =>
  wrapper
    .findAll('.carousel__slide')
    .wrappers.findIndex((s) => s.classes().includes('carousel__slide--on'))

const touch = (wrapper, type, clientX) =>
  wrapper.trigger(type, { changedTouches: [{ clientX }] })

describe('UmamiCarousel', () => {
  test('renders an empty carousel region with its defaults', () => {
    const wrapper = mount(UmamiCarousel)
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes()).toMatchObject({
      role: 'region',
      'aria-roledescription': 'carousel',
      'aria-label': 'Featured',
    })
    expect(wrapper.findAll('.carousel__slide')).toHaveLength(0)
    expect(wrapper.find('.carousel__controls').exists()).toBe(false)
  })

  test('renders each item through the default slot with item, index and active', () => {
    const wrapper = carousel()
    const slides = wrapper.findAll('[data-id]').wrappers
    expect(slides.map((s) => s.attributes())).toEqual([
      { 'data-id': 'a', 'data-index': '0', 'data-active': 'true' },
      { 'data-id': 'b', 'data-index': '1', 'data-active': 'false' },
      { 'data-id': 'c', 'data-index': '2', 'data-active': 'false' },
    ])
  })

  test('shows one slide, and hides the others from reading and focus', () => {
    const slides = carousel().findAll('.carousel__slide')
    expect(slides.at(0).attributes('aria-hidden')).toBeUndefined()
    expect(slides.at(0).attributes('inert')).toBeUndefined()
    expect(slides.at(1).attributes()).toMatchObject({
      'aria-hidden': 'true',
      inert: 'inert',
    })
  })

  test('names each slide by position, with the role and labels it is given', () => {
    const wrapper = carousel({
      items,
      titles,
      label: 'Destacado',
      slideRole: 'diapositiva',
      slidesLabel: 'Diapositivas',
      previousLabel: 'Anterior',
      nextLabel: 'Siguiente',
      positionLabel: (n, count) => `${n} de ${count}`,
      slideLabel: (n, title) => `Diapositiva ${n}: ${title}`,
    })
    expect(wrapper.attributes('aria-label')).toBe('Destacado')
    expect(wrapper.find('.carousel__slide').attributes()).toMatchObject({
      role: 'group',
      'aria-roledescription': 'diapositiva',
      'aria-label': '1 de 3',
    })
    expect(wrapper.find('.carousel__bars').attributes('aria-label')).toBe(
      'Diapositivas'
    )
    expect(
      wrapper
        .findAll('.carousel__bar')
        .wrappers.map((b) => b.attributes('aria-label'))
    ).toEqual([
      'Diapositiva 1: Pasta bake',
      'Diapositiva 2: Borscht',
      'Diapositiva 3: Crema catalana',
    ])
    const arrows = wrapper.findAll('.carousel__arrow')
    expect(arrows.at(0).attributes('aria-label')).toBe('Anterior')
    expect(arrows.at(1).attributes('aria-label')).toBe('Siguiente')
  })

  test('uses English labels by default', () => {
    const wrapper = carousel()
    expect(wrapper.find('.carousel__slide').attributes('aria-label')).toBe(
      '1 of 3'
    )
    expect(wrapper.find('.carousel__bar').attributes('aria-label')).toBe(
      'Slide 1: Pasta bake'
    )
    expect(
      wrapper
        .findAll('.carousel__arrow')
        .wrappers.map((b) => b.attributes('aria-label'))
    ).toEqual(['Previous slide', 'Next slide'])
  })

  test('shows the controls only once there are two titles', () => {
    expect(
      carousel({ items: items.slice(0, 1), titles: titles.slice(0, 1) })
        .find('.carousel__controls')
        .exists()
    ).toBe(false)
    expect(carousel().find('.carousel__controls').exists()).toBe(true)
  })

  test('moves with the arrows, wrapping at either end, and counts', async () => {
    const wrapper = carousel()
    const [previous, next] = wrapper.findAll('.carousel__arrow').wrappers
    expect(wrapper.find('.carousel__count').text()).toBe('01 / 03')
    await next.trigger('click')
    expect(shown(wrapper)).toBe(1)
    expect(wrapper.find('.carousel__count').text()).toBe('02 / 03')
    await previous.trigger('click')
    await previous.trigger('click')
    expect(shown(wrapper)).toBe(2)
    await next.trigger('click')
    expect(shown(wrapper)).toBe(0)
  })

  test('goes to a slide from its bar, and marks that bar current', async () => {
    const wrapper = carousel()
    await wrapper.findAll('.carousel__bar').at(2).trigger('click')
    expect(shown(wrapper)).toBe(2)
    const bars = wrapper.findAll('.carousel__bar')
    expect(bars.at(2).classes()).toContain('carousel__bar--on')
    expect(bars.at(2).attributes('aria-current')).toBe('true')
    expect(bars.at(0).attributes('aria-current')).toBeUndefined()
  })

  test('moves with the arrow keys', async () => {
    const wrapper = carousel()
    await wrapper.trigger('keydown.right')
    expect(shown(wrapper)).toBe(1)
    await wrapper.trigger('keydown.left')
    await wrapper.trigger('keydown.left')
    expect(shown(wrapper)).toBe(2)
  })

  test('moves with a swipe, and ignores a tap', async () => {
    const wrapper = carousel()
    await touch(wrapper, 'touchstart', 200)
    await touch(wrapper, 'touchend', 100)
    expect(shown(wrapper)).toBe(1)
    await touch(wrapper, 'touchstart', 100)
    await touch(wrapper, 'touchend', 200)
    expect(shown(wrapper)).toBe(0)
    await touch(wrapper, 'touchstart', 100)
    await touch(wrapper, 'touchend', 120)
    expect(shown(wrapper)).toBe(0)
    // A touchend with no touchstart before it.
    await touch(wrapper, 'touchend', 0)
    expect(shown(wrapper)).toBe(0)
  })

  test('starts again from the first slide when the items change', async () => {
    const wrapper = carousel()
    await wrapper.findAll('.carousel__bar').at(2).trigger('click')
    await wrapper.setProps({ items: [...items].reverse() })
    expect(shown(wrapper)).toBe(0)
  })

  test('stays on one slide with no titles to count', () => {
    const wrapper = carousel({ items, titles: [] })
    wrapper.vm.next()
    expect(wrapper.vm.active).toBe(0)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = carousel()
    expectThemed(wrapper, ['carousel'])
    expectThemed(wrapper, ['carousel__track'], '.carousel__track')
    expectThemed(
      wrapper,
      ['carousel__slide', 'carousel__slide--on'],
      '.carousel__slide'
    )
    expectThemed(wrapper, ['carousel__controls'], '.carousel__controls')
    expectThemed(wrapper, ['carousel__frame'], '.carousel__frame')
    expectThemed(wrapper, ['carousel__bars'], '.carousel__bars')
    expectThemed(
      wrapper,
      ['carousel__bar', 'carousel__bar--on'],
      '.carousel__bar'
    )
    expectThemed(wrapper, ['carousel__nav'], '.carousel__nav')
    expectThemed(wrapper, ['carousel__arrow'], '.carousel__arrow')
    expectThemed(wrapper, ['carousel__count'], '.carousel__count')
  })

  test('is accessible', async () => {
    await expectAccessible(carousel())
  })
})
