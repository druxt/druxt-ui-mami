# druxt-umami-ui

The look of the [Umami demo](https://umami.demo.druxtjs.org) for a Nuxt 2
site: its theme, on Bootstrap 4, and the presentational Vue components that
draw it. The components take props and slots only. They know nothing of
Drupal or Druxt: a site maps its own content onto them.

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

## What it adds

- `dist/umami.css`, the Umami theme, compiled. It re-skins Bootstrap 4.6,
  which the module adds too, and names three Google Fonts (Newsreader,
  Archivo, IBM Plex Mono), which the module links in the page head.
- BootstrapVue, with the components and plugins the Umami components use:
  `BBadge`, `BButton`, `BLink`, and the breadcrumb, form input, form select,
  layout, list group, navbar and sidebar plugins.
- The `Umami*` components in `components/`, registered by their file names.
  A component of the same name in the site's own components wins.

## Use it

Add the module, then build the site's pages and layouts from the
components:

```js
// nuxt.config.js
export default {
  modules: ['druxt-umami-ui'],
}
```

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <UmamiStickyHeader>
      <b-navbar sticky :toggleable="false">
        <UmamiMasthead :languages="languages">
          <template #brand><UmamiBrand /></template>
        </UmamiMasthead>
      </b-navbar>
    </UmamiStickyHeader>

    <UmamiBand><Nuxt /></UmamiBand>

    <UmamiFooter><UmamiFooterGrid copyright="© 2026" /></UmamiFooter>
    <UmamiMobileDrawer :languages="languages" />
  </div>
</template>
```

A Druxt site maps its Drupal content in its own Druxt components. In
[druxt-drupal-mock-umami](https://github.com/druxt/druxt-drupal-mock-umami),
`components/druxt/entity/node/recipe/Full.vue` renders a recipe with
`UmamiRecipePage`, `UmamiRecipeHero`, `UmamiStatGrid` and `UmamiRecipeBody`,
and its `layouts/default.vue` places Drupal's block regions in the Umami
chrome. That site is the one to read.

Every visible string is a prop or a slot with an English default, so a
multilingual site passes its own.

## Components

Props are listed by name; a slot is named `#slot`, and `#default` is the
default slot. A link target (`to`) is a route string or object.

### Chrome

- `UmamiStickyHeader`: the box the masthead sticks in. `#default`.
- `UmamiMasthead`: the drawer toggle, brand, main menu and language links. Props `drawer` (the drawer's id, `menu`), `menuLabel`, `languageLabel`, `languages`. Slots `#brand`, `#menu`.
- `UmamiBrand`: the type wordmark and tagline, linked home. Props `name`, `tagline`, `to`.
- `UmamiLanguageSwitch`: a link to each language's version of the page. Props `languages` (`{ code, to, active, label }` each), `label`, `variant` (`masthead` or `drawer`). Emits `navigate`.
- `UmamiMobileDrawer`: the phone menu, a drawer from the left that holds the page still while open. Props `id`, `name`, `tagline`, `to`, `closeLabel`, `languages`, `creditLabel`, `creditHref`, `creditText`, `path` (the current path, which resets the saved scroll). Slots `#menu` (gets `hide`), `#credit-icon`.
- `UmamiBand`: a full-width band of the page. Props `ground` (`paper` or `warm`), `modifiers` (`head`, `flush`, `footer`), `contained`. `#default`.
- `UmamiSplit`: two columns from md, two thirds and one third. Slots `#main`, `#aside`.
- `UmamiFooter`: the dark site footer. `#default`.
- `UmamiFooterGrid`: the footer's columns and copyright line. Props `name`, `kicker`, `creditLabel`, `creditHref`, `creditText`, `copyright` (HTML). Slots `#brand`, `#menu` (a column of links).
- `UmamiDisclaimer`: the publisher's note under the footer's wordmark. `#default`.
- `UmamiFeedback`: a heading and the button that answers it. Prop `title`. `#default`.
- `UmamiBreadcrumb`: the trail to the page. Prop `items` (`{ text, to }` each).
- `UmamiErrorPage`: an error page with a way home. Props `kicker`, `title`, `text`, `detail`, `homeText`, `homeTo`.

### Front page and listings

- `UmamiBanner`: a full-width photograph with a kicker, title, summary and button on it. Props `img`, `kicker`, `title`, `summary`, `cta` (`{ text, to }`).
- `UmamiCarousel`: slides one at a time, with bars, arrows, a count, arrow keys and swipes. Props `items` (each with an `id`), `titles`, `label`, `slideRole`, `slidesLabel`, `previousLabel`, `nextLabel`, `positionLabel(n, count)`, `slideLabel(n, title)`. `#default` (gets `item`, `index`, `active`).
- `UmamiFeaturedStrip`: a labelled strip of teasers on the warm ground. Prop `label`. `#default`.
- `UmamiTeaser`: a photograph with a meta chip, and the kicker and title on it. Props `to`, `kicker`, `title`, `meta`. Slot `#media`.
- `UmamiTiles`: a heading, a row of columns and a button. Props `ctaText`, `ctaTo`. Slots `#heading`, `#default`.
- `UmamiCollections`: a heading beside pill links. Props `title`, `links` (`{ text, to }` each), `more` (`{ text, to }`).
- `UmamiPromo`: a cover image beside a kicker, title, summary and button. Props `img`, `kicker`, `cta` (`{ text, to, target }`). Slots `#title`, `#summary`.
- `UmamiArticleLead`: the lead story at full width. Props `to`, `img`, `kicker`, `title`, `summary`, `ctaText`.
- `UmamiGrid`: a grid of cards. Prop `variant` (`cards`, `articles` or `aside`). `#default`.
- `UmamiCard`: a card, all one link: image, kicker, title and a meta line. Props `to`, `kicker`, `title`, `meta`. Slot `#media`.
- `UmamiRecipeListing`: recipe cards under a text filter, difficulty buttons, a sort and a count; it filters nothing itself. Props `items`, `query`, `difficulty`, `sort` (all three `.sync`), `filterPlaceholder`, `difficulties` (`{ value, text }` each), `difficultyLabel`, `sortOptions`, `sortLabel`, `sortLabelId`, `countText`, `emptyText`. Slots `#card` (gets `item`), `#note`.

### Pages

- `UmamiRecipePage`: a recipe, whole. `#default`.
- `UmamiRecipeHero`: the photograph full width, with the breadcrumb, title and summary on it. Prop `title`. Slots `#media`, `#breadcrumb`, `#summary`.
- `UmamiStatGrid`: a row of figures, each a label over its value. Prop `stats` (`{ label, value }` each).
- `UmamiRecipeBody`: ingredients beside the method, with tags under it. Props `ingredientsHeading`, `methodHeading`. Slots `#ingredients`, `#method`, `#tags`.
- `UmamiIngredients`: a list of ingredients. Prop `items` (text).
- `UmamiMethodSteps`: numbered steps from a method's HTML list, with the prose around it kept. Prop `html`. Renders no element of its own.
- `UmamiIconStat`: a figure under an icon. Props `icon` (`clock`, `people`, `puzzle`, `stopwatch`), `label`, `value`, `unit`. Renders no element of its own.
- `UmamiTag`: a tag, a linked badge. Props `label`, `to`.
- `UmamiArticle`: an article: photograph, kicker, title, byline, date, body, tags and what follows. Props `title`, `kicker`, `byline`, `date`, `rail` (the left margin's lines, from lg). Slots `#media`, `#body`, `#tags`, `#more`, `#note`.
- `UmamiHeading`: a section's heading inside a page. Prop `text`.
- `UmamiPageHead`: a page's head band. Props `title`, `kicker`, `description` (HTML), `count`. Slot `#breadcrumb`.
- `UmamiPage`: a basic page: head band, body at a reading measure, then anything after. Prop `title`. Slots `#breadcrumb`, `#default`, `#after`.
- `UmamiCollection`: a collection's page: head band, then its cards. Props `title`, `kicker`, `description` (HTML), `count`, `empty`, `emptyText`. Slots `#breadcrumb`, `#default`, `#note`.
- `UmamiAbout`: a mark beside a kicker and title, then paragraphs. Props `kicker`, `title`, `paragraphs`. Slot `#mark`.
- `UmamiNote`: an aside on how the page is made, with a link and a code sample. Props `kicker`, `title`, `file`, `code` (HTML), `cta`, `to`, `href`. `#default`.

Props that take HTML render it as is: pass only trusted HTML.

Some class names in the theme, and so in `UmamiNote`, `UmamiAbout` and the
drawer's credit line, start with `druxt`: they are the theme's promo layer,
drawn in Druxt blue.

## Options

Under `druxtUmamiUi` in `nuxt.config.js`, or as module options:

| Option | Default | |
| ------ | ------- | - |
| `bootstrapCSS` | `true` | Add Bootstrap 4's CSS. |
| `fonts` | `true` | Link the theme's Google Fonts. |

A `bootstrapVue` key in `nuxt.config.js` is merged into the BootstrapVue
options the module sets.

## Build

```sh
npm install
npm run build
```

## License

MIT, as the Umami demo it comes from.
