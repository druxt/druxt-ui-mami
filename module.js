const path = require('path')

const FONTS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'

const r = (...parts) => path.resolve(__dirname, ...parts)

/**
 * DruxtUiMami: the Umami look for a Nuxt 2 site.
 *
 * Adds the compiled theme on Bootstrap 4, its fonts, BootstrapVue with the
 * plugins the components use, and the `Umami*` components. The components
 * take props and slots only; the site maps its content onto them.
 *
 * Options, under `druxtUiMami` in nuxt.config.js or as module options:
 * - `bootstrapCSS` (true): add Bootstrap 4's CSS. Turn off to bring your own.
 * - `fonts` (true): link the Google Fonts the theme names.
 */
module.exports = function DruxtUiMamiModule(moduleOptions = {}) {
  const options = {
    bootstrapCSS: true,
    fonts: true,
    ...(this.options.druxtUiMami || {}),
    ...moduleOptions,
  }

  // The components are Vue files in node_modules: transpiled like the
  // site's own, since they use syntax webpack 4 cannot parse.
  this.options.build.transpile.push('druxt-ui-mami')

  // Styles: Bootstrap 4 first, then the theme that re-skins it.
  if (options.bootstrapCSS) {
    this.options.css.push(require.resolve('bootstrap/dist/css/bootstrap.min.css'))
  }
  this.options.css.push(r('dist/umami.css'))

  if (options.fonts) {
    const head = this.options.head
    head.link = head.link || []
    head.link.push(
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { hid: 'umami-fonts', rel: 'stylesheet', href: FONTS }
    )
  }

  // BootstrapVue, with what the components use. The theme brings
  // Bootstrap's CSS itself, above.
  this.addModule([
    'bootstrap-vue/nuxt',
    {
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
      ...(this.options.bootstrapVue || {}),
    },
  ])

  // The components, by their file names (`UmamiMasthead`). Level 1, so a
  // component of the same name in the site's own components wins.
  this.options.components = this.options.components ?? true
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({ path: r('components'), pathPrefix: false, level: 1 })
  })
}

module.exports.meta = require('./package.json')
