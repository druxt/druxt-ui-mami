import Vue from 'vue'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

Vue.config.productionTip = false
Vue.config.devtools = false

/**
 * Any warning fails the test that caused it.
 *
 * An unknown element, a failed prop validation or a duplicate key is a
 * warning, not an error, so a component can render half-broken and every
 * assertion still pass. Collecting Vue's warnings, and BootstrapVue's and
 * jsdom's console output, and asserting there were none after each test
 * turns that into a failure with the message in it. It is also what proves
 * the module registers every BootstrapVue component the Umami components
 * use: test/helpers.js installs only what module.js lists, so a `b-*` the
 * module leaves out is an unknown element here.
 */
const warnings = []

Vue.config.warnHandler = (message, vm, trace) => {
  warnings.push(`[Vue warn]: ${message}${trace}`)
}

beforeEach(() => {
  for (const method of ['warn', 'error']) {
    jest.spyOn(console, method).mockImplementation((...args) => {
      warnings.push(args.map(String).join(' '))
    })
  }
})

afterEach(() => {
  jest.restoreAllMocks()
  expect(warnings.splice(0)).toEqual([])
})
