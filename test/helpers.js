import fs from 'node:fs'
import path from 'node:path'

import { createLocalVue, mount as mountWith } from '@vue/test-utils'
import * as BootstrapVue from 'bootstrap-vue'
import { configureAxe } from 'jest-axe'

const ROOT = path.resolve(__dirname, '..')
const COMPONENTS = path.join(ROOT, 'components')

/**
 * The options module.js hands to `bootstrap-vue/nuxt`, read by running the
 * module against a stub, so the tests install exactly what a site gets.
 */
export const bootstrapVueOptions = () => {
  const added = []
  require('../module.js').call({
    options: { build: { transpile: [] }, css: [], head: {} },
    addModule: (entry) => added.push(entry),
    nuxt: { hook: () => {} },
  })
  return added.find(([name]) => name === 'bootstrap-vue/nuxt')[1]
}

/**
 * Nuxt's `<NuxtLink>`, without a router: an `<a>` whose `href` is the
 * route, so a test can read where a link goes.
 */
export const NuxtLink = {
  name: 'NuxtLink',
  props: { to: { type: [String, Object], required: true } },
  render(h) {
    const href = typeof this.to === 'string' ? this.to : this.to.path
    return h('a', { attrs: { href } }, this.$slots.default)
  },
}

/**
 * A Vue with what a site that adds the module has: the BootstrapVue
 * components and plugins module.js names, `<NuxtLink>`, and every Umami
 * component under its file name, as Nuxt's components option registers
 * them.
 */
export const createUmamiVue = () => {
  const localVue = createLocalVue()
  const { components, componentPlugins } = bootstrapVueOptions()
  componentPlugins.forEach((plugin) => localVue.use(BootstrapVue[plugin]))
  components.forEach((name) => localVue.component(name, BootstrapVue[name]))
  localVue.component('NuxtLink', NuxtLink)
  for (const file of fs.readdirSync(COMPONENTS)) {
    localVue.component(
      path.basename(file, '.vue'),
      require(path.join(COMPONENTS, file)).default
    )
  }
  return localVue
}

const localVue = createUmamiVue()

export const mount = (component, options = {}) =>
  mountWith(component, { localVue, ...options })

/**
 * Mounts a functional component that renders more than one root, inside a
 * `<div>`, since a wrapper needs a single element.
 */
export const mountFunctional = (component, props = {}) =>
  mount({
    render: (h) => h('div', { class: 'host' }, [h(component, { props })]),
  })

/** Slot content that says which slot it came from. */
export const marker = (name) => `<i data-slot="${name}">${name} content</i>`

/**
 * The compiled theme. A class the components emit for the theme to style is
 * a contract between the two: renaming it on either side breaks the look
 * with no error anywhere, so the tests check both halves.
 */
const THEME = fs.readFileSync(path.join(ROOT, 'dist/umami.css'), 'utf8')

export const themeStyles = (className) =>
  new RegExp(`\\.${className.replace(/[-_]/g, '\\$&')}(?![\\w-])`).test(THEME)

/**
 * Asserts that `wrapper`'s element (or the element `selector` finds) carries
 * each class, and that the theme has a rule for each.
 */
export const expectThemed = (wrapper, classes, selector) => {
  const element = selector ? wrapper.find(selector) : wrapper
  expect(element.exists()).toBe(true)
  for (const name of classes) {
    expect(element.classes()).toContain(name)
    expect({ class: name, styled: themeStyles(name) }).toEqual({
      class: name,
      styled: true,
    })
  }
}

/**
 * axe over the rendered markup. Two rules are about a whole page, not a
 * component in isolation, and are left to the page-level checks: where the
 * landmarks are (`region`), and whether heading levels run in order
 * (`heading-order`), which depends on the page a component is placed in.
 */
const axe = configureAxe({
  rules: {
    region: { enabled: false },
    'heading-order': { enabled: false },
  },
})

export const expectAccessible = async (wrapper, around = '') => {
  const html = typeof wrapper === 'string' ? wrapper : wrapper.html()
  expect(await axe(`<main>${html}${around}</main>`)).toHaveNoViolations()
}
