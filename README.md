# druxt-umami-ui

The look of the [Umami demo](https://umami.demo.druxtjs.org) for a Druxt 0.x
site on Nuxt 2: its theme, its layouts and the Druxt wrapper components that
render Drupal's Umami content. Read-only: no editing, sign-in or search.

## Install

The package isn't on npm yet. Install it from GitHub, as a tarball of a
commit on `0.x`:

```sh
npm install https://codeload.github.com/druxt/druxt-umami-ui/tar.gz/<commit>
```

The compiled theme, `dist/umami.css`, is committed, so the tarball needs no
build step, no git and no Sass. That is what lets it install in StackBlitz,
which has no git. `npm run build` recompiles it from `src/scss/theme.scss`,
and a change to the theme commits the rebuilt file with it.

Add the module after `druxt-site`, and give Druxt the query settings the
components expect:

```js
// nuxt.config.js
export default {
  modules: ['druxt-site', 'druxt-umami-ui'],
  druxt: {
    baseUrl: 'https://your-drupal-site',
    site: { theme: 'umami' },
    blocks: { query: { fields: [] } },
    entity: { components: { fields: false }, query: { schema: true } },
    menu: { query: { requiredOnly: true } },
  },
}
```

`entity.query.schema` is the setting the look depends on: without it an
entity's fields do not follow its display, and teasers and cards have no
image. The Umami demo also sets `views: { query: { bundleFilter: true } }`;
leave that out against a backend that answers only recorded queries, such as
decoupled-drupal-mock, where those requests find nothing.

Leave out a `pages/` directory, or keep it free of a catch-all page: the
layout's main content block renders the route that `druxt-router` adds.

## What it adds

- `dist/umami.css`, the Umami theme, compiled. It re-skins Bootstrap 4.6,
  which the module adds too, and names three Google Fonts (Newsreader,
  Archivo, IBM Plex Mono), which the module links in the page head.
- BootstrapVue, with the components and plugins the wrapper components use.
- The default layout (the Umami regions and the phone menu drawer) and the
  error layout. A site's own `layouts/default.vue` or `layouts/error.vue`
  wins.
- An i18n plugin, on `vue-i18n` 8, with English and Spanish strings. The
  language comes from the path prefix, `/en` or `/es`.
- The wrapper components, named as the Umami demo names them:
  `components/druxt/entity/node/recipe/Full.vue` is
  `DruxtEntityNodeRecipeFull`, and `components/app/MobileDrawer.vue` is
  `AppMobileDrawer`. A component of the same name in the site's own
  `components/` directory wins.

## Options

Under `druxtUmamiUi` in `nuxt.config.js`, or as module options:

| Option | Default | |
| ------ | ------- | - |
| `bootstrapCSS` | `true` | Add Bootstrap 4's CSS. |
| `fonts` | `true` | Link the theme's Google Fonts. |
| `layouts` | `true` | Use the package's default and error layouts. |

## Build

```sh
npm install
npm run build
```

## License

MIT, as the Umami demo it comes from.
