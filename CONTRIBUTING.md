# Contributing

Thanks for helping. This package is the look of the Umami demo, so a change
here is a change to how that demo, and any site built on the package, looks.

## Getting set up

```bash
npm install
```

That installs dependencies, compiles the theme and enables the git hooks. If
you skipped install scripts, run `npm run hooks:install` by hand, or the hooks
stay on disk doing nothing.

The toolchain is pinned in `.mise.toml`. With [mise](https://mise.jdx.dev)
installed, `mise install` gives you the same Node the pipeline uses.

## Before you push

```bash
npm run lint     # every check below except prose, which needs Vale installed
npm test         # jest and jest-axe, with the coverage floor enforced
```

The pre-commit hook runs both, so this is usually already done.

## Components

A component takes props and slots, and nothing else. It reads from no store
and fetches nothing. Every visible string is a prop or a slot with an English default, so a
multilingual site can pass its own. Document a new prop or slot on the
component's line in the README, and test it in
`test/components/<Component>.test.js`.

## The theme

The theme is `src/scss/theme.scss`. After changing it, run `npm run build` and
commit `dist/umami.css` with the change. The package publishes the compiled
file, and the pipeline fails if it does not match the Sass.

A class a component emits for the theme to style is a contract between the
two. The tests check it against the compiled CSS, so a rename has to change
both sides in the same commit.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org). The commit-msg
hook checks them, and the pipeline checks the whole merge-request range.

This repository squash-merges, so the pull request or merge request
**title** becomes the commit subject. Title it the same way you would title a
commit.

## Changesets

The package is not published yet, and its first release is 0.1.0 as it
stands. Until then nothing needs a changeset. From the first release on, a
change a site would notice records one with `npm run changeset`.

## Coverage

`jest.config.js` carries a coverage floor measured from the current tests. It
is a floor. Raise it when coverage improves. Do not lower it to make a change
pass: if a change drops coverage, the change needs a test.

## What not to put in a file

This repository is public. Nothing that only resolves on a private network may
reach a tracked file, whether as a URL or in a comment. `npm run lint:private`
checks this and runs in the pipeline. When you need to cite something private,
describe it without the URL or point at a public equivalent.
