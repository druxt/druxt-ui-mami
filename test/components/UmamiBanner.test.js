import UmamiBanner from '../../components/UmamiBanner.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const props = {
  img: '/images/banner.jpg',
  kicker: 'Recipe of the week',
  title: 'Super easy vegetarian pasta bake',
  summary: 'A wholesome pasta bake is the ultimate comfort food.',
  cta: { text: 'View recipe', to: '/recipes/pasta-bake' },
}

/** Gives the image and the banner the widths a browser would lay out. */
const size = (wrapper, natural, banner) => {
  Object.defineProperty(wrapper.vm.$refs.media, 'naturalWidth', {
    configurable: true,
    value: natural,
  })
  Object.defineProperty(wrapper.element, 'clientWidth', {
    configurable: true,
    value: banner,
  })
}

describe('UmamiBanner', () => {
  afterEach(() => {
    delete window.ResizeObserver
  })

  test('renders the scrim and empty text, with no image or button, by default', () => {
    const wrapper = mount(UmamiBanner)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.banner__scrim').exists()).toBe(true)
    expect(wrapper.find('.banner__title').text()).toBe('')
    expect(wrapper.find('.btn').exists()).toBe(false)
  })

  test('renders the image, kicker, title and summary', () => {
    const wrapper = mount(UmamiBanner, { propsData: props })
    expect(wrapper.find('img.banner__media').attributes()).toMatchObject({
      src: props.img,
      alt: '',
    })
    expect(wrapper.find('.banner__kicker').text()).toBe(props.kicker)
    expect(wrapper.find('h2.banner__title').text()).toBe(props.title)
    expect(wrapper.find('.banner__summary').text()).toBe(props.summary)
  })

  test('renders the button, with the title after its text for a screen reader', () => {
    const wrapper = mount(UmamiBanner, { propsData: props })
    const button = wrapper.find('a.btn')
    expect(button.attributes('href')).toBe(props.cta.to)
    expect(button.classes()).toContain('btn-primary')
    expect(button.find('.sr-only').text()).toBe(`: ${props.title}`)
    expect(button.text().replace(/\s+/g, ' ')).toBe(
      `View recipe : ${props.title}`
    )
  })

  test('holds an image narrower than the banner at its own width', async () => {
    const wrapper = mount(UmamiBanner, { propsData: props })
    size(wrapper, 800, 1200)
    await wrapper.find('img').trigger('load')
    const img = wrapper.find('img')
    expect(img.classes()).toContain('banner__media--held')
    expect(img.attributes('style')).toBe('width: 800px;')
  })

  test('lets an image at least as wide as the banner fill it', async () => {
    const wrapper = mount(UmamiBanner, { propsData: props })
    size(wrapper, 1600, 1200)
    await wrapper.find('img').trigger('load')
    expect(wrapper.find('img').classes()).not.toContain('banner__media--held')
    expect(wrapper.find('img').attributes('style')).toBeUndefined()
  })

  test('measures an image that loaded before it mounted', () => {
    const complete = jest
      .spyOn(window.HTMLImageElement.prototype, 'complete', 'get')
      .mockReturnValue(true)
    const hold = jest.spyOn(UmamiBanner.methods, 'hold')
    mount(UmamiBanner, { propsData: props })
    expect(hold).toHaveBeenCalledTimes(1)
    complete.mockRestore()
  })

  test('re-measures on resize, and stops watching when destroyed', async () => {
    const observe = jest.fn()
    const disconnect = jest.fn()
    let callback
    window.ResizeObserver = jest.fn(function (fit) {
      callback = fit
      this.observe = observe
      this.disconnect = disconnect
    })
    const wrapper = mount(UmamiBanner, { propsData: props })
    size(wrapper, 800, 1200)
    await wrapper.find('img').trigger('load')
    await wrapper.find('img').trigger('load')
    expect(window.ResizeObserver).toHaveBeenCalledTimes(1)
    expect(observe).toHaveBeenCalledWith(wrapper.element)

    size(wrapper, 800, 600)
    callback()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').classes()).not.toContain('banner__media--held')

    wrapper.destroy()
    expect(disconnect).toHaveBeenCalled()
  })

  test('does nothing on a load with no image', () => {
    const wrapper = mount(UmamiBanner)
    wrapper.vm.hold()
    expect(wrapper.vm.held).toBe(0)
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiBanner, { propsData: props })
    expectThemed(wrapper, ['banner'])
    expectThemed(wrapper, ['banner__media'], 'img')
    expectThemed(wrapper, ['banner__scrim'], '.banner__scrim')
    expectThemed(wrapper, ['banner__body'], '.banner__body')
    expectThemed(wrapper, ['banner__kicker'], '.banner__kicker')
    expectThemed(wrapper, ['banner__title'], 'h2')
    expectThemed(wrapper, ['banner__summary'], 'p')
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiBanner, { propsData: props }))
  })
})
