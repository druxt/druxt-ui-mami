<!--
Title this pull request the way you would title a commit:

    <type>(<scope>): <description>

This repository squash-merges, so the title becomes the commit subject. A prose
title passes review and then breaks the next push to the target branch.
-->

## What changed

## Why

## How it was checked

- [ ] `npm run lint` passes
- [ ] `npm test` passes, and coverage did not drop
- [ ] A change to `src/scss/` commits the rebuilt `dist/umami.css` with it
- [ ] A change a site would notice has a changeset (`npm run changeset`)
- [ ] Nothing that resolves only on a private network reached a tracked file
