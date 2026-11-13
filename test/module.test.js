import fs from 'node:fs'
import path from 'node:path'

import DruxtUiMamiModule from '../module.js'
import pkg from '../package.json'

const ROOT = path.resolve(__dirname, '..')
const BOOTSTRAP_CSS = require.resolve('bootstrap/dist/css/bootstrap.min.css')
const THEME_CSS = path.join(ROOT, 'dist/umami.css')

/** A Nuxt 2 module container, holding what the module reads and writes. */
const container = (options = {}) => {
  const hooks = {}
  return {
    options: {
      build: { transpile: [] },
      css: [],
      head: {},
      ...options,
    },
    addModule: jest.fn(),
    nuxt: {
      hook: jest.fn((name, fn) => {
        hooks[name] = fn
      }),
    },
    hooks,
  }
}

const run = (nuxt, moduleOptions) => {
  DruxtUiMamiModule.call(nuxt, moduleOptions)
  return nuxt
}

const bootstrapVue = (nuxt) =>
  nuxt.addModule.mock.calls.find(
    ([[name]]) => name === 'bootstrap-vue/nuxt'
  )[0][1]

describe('DruxtUiMamiModule', () => {
  test('adds Bootstrap’s CSS, then the theme that re-skins it', () => {
    const nuxt = run(container({ css: ['~/assets/site.css'] }))
    expect(nuxt.options.css).toEqual([
      '~/assets/site.css',
      BOOTSTRAP_CSS,
      THEME_CSS,
    ])
  })

  test('adds only the theme when `bootstrapCSS` is off', () => {
    const nuxt = run(container(), { bootstrapCSS: false })
    expect(nuxt.options.css).toEqual([THEME_CSS])
  })

  test('reads its options from `druxtUiMami` in the Nuxt config', () => {
    const nuxt = run(container({ druxtUiMami: { bootstrapCSS: false } }))
    expect(nuxt.options.css).toEqual([THEME_CSS])
  })

  test('lets module options win over the Nuxt config', () => {
    const nuxt = run(container({ druxtUiMami: { bootstrapCSS: false } }), {
      bootstrapCSS: true,
    })
    expect(nuxt.options.css).toEqual([BOOTSTRAP_CSS, THEME_CSS])
  })

  test('the CSS it adds is shipped in the package', () => {
    // `dist` is in `files`; the compiled theme is committed so a tarball
    // installs without a build.
    expect(pkg.files).toEqual(expect.arrayContaining(['dist', 'components']))
    expect(require('node:fs').existsSync(THEME_CSS)).toBe(true)
  })

  test('links the theme’s fonts after the site’s own head links', () => {
    const own = { rel: 'icon', href: '/favicon.ico' }
    const nuxt = run(container({ head: { link: [own] } }))
    const [first, ...links] = nuxt.options.head.link
    expect(first).toBe(own)
    expect(links).toEqual([
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        hid: 'umami-fonts',
        rel: 'stylesheet',
        href: expect.stringMatching(
          /^https:\/\/fonts\.googleapis\.com\/css2\?family=Newsreader.*&family=Archivo.*&family=IBM\+Plex\+Mono.*&display=swap$/
        ),
      },
    ])
  })

  test('starts the head links when the site has none', () => {
    const nuxt = run(container())
    expect(nuxt.options.head.link).toHaveLength(3)
  })

  test('links no fonts when `fonts` is off', () => {
    const nuxt = run(container(), { fonts: false })
    expect(nuxt.options.head.link).toBeUndefined()
  })

  test('transpiles the package, whose components are Vue source', () => {
    const nuxt = run(container({ build: { transpile: ['other'] } }))
    expect(nuxt.options.build.transpile).toEqual(['other', 'druxt-ui-mami'])
  })

  test('adds BootstrapVue with what the components use, and not its CSS', () => {
    const options = bootstrapVue(run(container()))
    expect(options).toEqual({
      bootstrapCSS: false,
      components: ['BBadge', 'BButton', 'BLink'],
      componentPlugins: [
        'BreadcrumbPlugin',
        'FormInputPlugin',
        'FormSelectPlugin',
        'LayoutPlugin',
        'ListGroupPlugin',
        'NavbarPlugin',
        'SidebarPlugin',
      ],
    })
  })

  test('merges the site’s `bootstrapVue` options into its own', () => {
    const options = bootstrapVue(
      run(container({ bootstrapVue: { icons: true, bootstrapCSS: true } }))
    )
    expect(options).toMatchObject({ icons: true, bootstrapCSS: true })
    expect(options.components).toEqual(['BBadge', 'BButton', 'BLink'])
  })

  test('registers the components below the site’s own, so a site can override one', () => {
    const nuxt = run(container())
    expect(nuxt.nuxt.hook).toHaveBeenCalledWith(
      'components:dirs',
      expect.any(Function)
    )
    const dirs = [{ path: '~/components' }]
    nuxt.hooks['components:dirs'](dirs)
    expect(dirs).toEqual([
      { path: '~/components' },
      { path: path.join(ROOT, 'components'), pathPrefix: false, level: 1 },
    ])
    // @nuxt/components gives the site's own directory level 0, and a lower
    // level wins a name clash.
    expect(dirs[1].level).toBeGreaterThan(0)
  })

  test('turns Nuxt’s components option on, and leaves a site’s own setting', () => {
    expect(run(container()).options.components).toBe(true)
    const own = { dirs: ['~/components', '~/ui'] }
    expect(run(container({ components: own })).options.components).toBe(own)
  })

  test('carries the package metadata Nuxt reports a module by', () => {
    expect(DruxtUiMamiModule.meta).toBe(pkg)
    expect(DruxtUiMamiModule.meta.name).toBe('druxt-ui-mami')
  })
})

describe('package.json', () => {
  // A site installs the package with whatever Node its Nuxt 2 runs on, and a
  // strict install refuses a package whose engines are narrower. The module
  // and components run wherever Nuxt does, so engines states Nuxt's range.
  // `nuxt` declares none of its own; its @nuxt/core does, found from nuxt.
  test('declares the Node range Nuxt 2 runs on', () => {
    const nuxtDir = path.dirname(require.resolve('nuxt/package.json'))
    const core = JSON.parse(
      fs.readFileSync(
        path.join(nuxtDir, '..', '@nuxt', 'core', 'package.json'),
        'utf8'
      )
    )
    expect(pkg.engines.node).toBe(core.engines.node)
  })
})
