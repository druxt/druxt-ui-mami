# Agent instructions

This package is the Umami demo's look for a Nuxt 2 site. It holds a compiled
theme on Bootstrap 4.6 and presentational `Umami*` Vue components that take
props and slots only. It will be published to npm as `druxt-ui-mami`, and is
unreleased at 0.1.0.

## Rules

- **This repository is public.** Nothing that resolves only on a private
  network may reach a tracked file: no internal URLs, hostnames, repository
  names or issue links, in any file including comments. `npm run lint:private`
  enforces the URL-shaped half of this and runs in the pipeline. It cannot
  catch an internal name written as prose, so that part is on you.
- **`0.x` is the base branch**, and the Vue 2 line. Nuxt 2, Vue 2.7,
  Bootstrap 4.6 and BootstrapVue 2 are frozen here on purpose; Renovate is
  configured not to offer them. The Druxt 2.x version is a different package,
  `@druxt/ui-mami`, not an upgrade of this one.
- **The version stays at 0.1.0 until the first release.** No version bumps,
  and no upgrade or breaking-change notes: there is nobody to upgrade yet.
- **Conventional Commits**, and the same for pull request and merge request
  titles. This repository squash-merges, so the title becomes the commit
  subject, and a prose title breaks the next push to the target branch.
- **The components don't read Drupal or Druxt data.** Props and slots only,
  every visible string a prop or slot with an English default. A site maps
  its content onto them.
- **The theme's class names are a contract.** A component emits a class, the
  theme styles it. The unit tests check both halves against the compiled
  `dist/umami.css`, so renaming one side fails a test. Rename both together.
- **`dist/umami.css` is committed.** A change to `src/scss/` runs
  `npm run build` and commits the result with it; the pipeline rebuilds it
  and fails on a difference.
- **The coverage floor in `jest.config.js` goes up, never down.** If a change
  drops coverage, the change needs a test.
- **No test may run git against this repository.** The pre-commit hook runs
  the tests with `GIT_DIR` and `GIT_INDEX_FILE` set, and a child process
  inherits them. A test that shells out to git strips every `GIT_` variable
  from the child's environment, as `test/private-refs.test.js` does.
- **No AI tool is credited.** No co-author trailer naming an assistant, no
  generated-with footer, no session link, in commits, merge request
  descriptions or tracked files. The commit-msg hook rejects it locally, and
  `npm run lint:attribution` and the pipeline check the rest.
- **Prose is linted with Vale.** `npm run lint:prose:install` once, then
  `npm run lint:prose`.

## Layout

| Path               | Purpose                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| `module.js`        | The Nuxt 2 module: CSS, fonts, BootstrapVue and the components            |
| `components/`      | The `Umami*` components, registered by file name                          |
| `src/scss/`        | The theme's Sass, compiled to `dist/umami.css` by `npm run build`         |
| `dist/`            | The compiled theme, committed so a tarball installs without a build       |
| `test/`            | Jest: `module.test.js`, and `components/<Component>.test.js` for each one |
| `scripts/`         | Repository tooling, excluded from the package                             |
| `.githooks/`       | Committed hooks, enabled by `npm install`                                 |
| `.gitlab/scripts/` | Content checks and merge-request note helpers, copied from the standard   |

## Commands

```bash
npm install          # dependencies, the theme build, and the git hooks
npm run build        # compile src/scss/theme.scss to dist/umami.css
npm test             # jest with jest-axe, coverage floor enforced
npm run lint         # every linter except prose and the audit
npm run lint:audit   # audit what a site installs
npm run size         # the stylesheets against their budget
npm run lint:prose   # Vale, after `npm run lint:prose:install`
```

## Tests

`test/helpers.js` mounts a component the way a site gets it: on a Vue with
only the BootstrapVue components and plugins `module.js` names, every `Umami*`
component registered, and a `<NuxtLink>` that renders an `<a href>`.
`test/setup.js` fails any test that logs a Vue warning or console output, so
an unregistered `b-*` element or a failed prop check is a failure, not noise.

Each component's test covers its defaults, every prop and slot the README
lists, its events, the theme classes it emits (checked against the compiled
CSS), and an axe run on realistic markup.

## Toolchain

Node 22 is pinned in `.mise.toml` and `.nvmrc`. It is the oldest maintained
line, and the lowest the lint and test tooling runs on. A site that uses the package
needs only what Nuxt 2.18 needs, which `engines` states. npm is the package
manager, pinned in `packageManager` and activated by corepack.

## The repository standard

This repository follows the Druxt repository standard as a Nuxt module. Not
yet in place: visual regression with committed baselines and its update job,
visual-failure notes, a preview tunnel and its note, and an end-to-end suite.
They need something to render, and arrive with a component gallery that runs
Playwright visual and accessibility checks against every component.
