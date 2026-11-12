const fs = require('fs')
const path = require('path')

const FONTS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'

const r = (...parts) => path.resolve(__dirname, ...parts)

/**
 * DruxtUmamiUi: the Umami demo's look for a Druxt site.
 *
 * Adds the compiled theme and Bootstrap 4, BootstrapVue, the default and
 * error layouts, the i18n plugin, and the Druxt wrapper components, named as
 * the Umami demo names them (`DruxtEntityNodeRecipeFull`, `AppMobileDrawer`).
 * A component of the same name in the site's own `components/` wins.
 *
 * Options, under `druxtUmamiUi` in nuxt.config.js or as module options:
 * - `bootstrapCSS` (true): add Bootstrap 4's CSS. Turn off to bring your own.
 * - `fonts` (true): link the Google Fonts the theme names.
 * - `layouts` (true): use the package's default and error layouts, unless
 *   the site has its own `layouts/default.vue` or `layouts/error.vue`.
 */
module.exports = function DruxtUmamiUiModule(moduleOptions = {}) {
  const options = {
    bootstrapCSS: true,
    fonts: true,
    layouts: true,
    ...(this.options.druxtUmamiUi || {}),
    ...moduleOptions,
  }

  // The components are Vue files in node_modules: transpiled like the
  // site's own, since they use syntax webpack 4 cannot parse.
  this.options.build.transpile.push('druxt-umami-ui')

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

  // BootstrapVue, with only what the read-only components use. The theme
  // brings Bootstrap's CSS itself, above.
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

  // The frontend's own words, in the page's language.
  this.options.plugins.push(r('plugins/i18n.js'))

  // The wrapper components. `druxt/` keeps its path in the name, as the
  // Umami demo's `~/components` does; `app/` is prefixed `App`.
  this.options.components = this.options.components ?? true
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push(
      { path: r('components/druxt'), prefix: 'Druxt', level: 1 },
      { path: r('components/app'), prefix: 'App', pathPrefix: false, level: 1 }
    )
  })

  // Layouts. DruxtSite adds its own default layout when the site has none,
  // so these are set once every module has run.
  if (options.layouts) {
    const own = (name) =>
      ['vue', 'js'].some((ext) =>
        fs.existsSync(
          path.resolve(
            this.options.srcDir,
            this.options.dir.layouts,
            `${name}.${ext}`
          )
        )
      )
    this.nuxt.hook('modules:done', () => {
      if (!own('default')) {
        this.options.layouts.default = r('layouts/default.vue')
      }
      if (!own('error') && !this.options.ErrorPage) {
        this.options.ErrorPage = r('layouts/error.vue')
      }
    })
  }
}

module.exports.meta = require('./package.json')
