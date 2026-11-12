<template>
  <div class="masthead">
    <!-- Below lg: toggle and wordmark on one row. The menu is a drawer
         (AppMobileDrawer), not a collapse. -->
    <button
      v-b-toggle.menu
      :aria-label="$t('nav.openMenu')"
      class="masthead__toggle"
      type="button"
    >
      <span class="masthead__toggle-bar" />
      <span class="masthead__toggle-bar" />
    </button>

    <!-- Branding. DruxtBlock wraps each block in a div of its own, so the
         growing element has to be this one, not the block's own class. -->
    <div class="masthead__brand-slot">
      <slot name="umami_branding" />
    </div>

    <!-- The Umami demo's search button sits here. This package has no
         search, so an empty box of the same size keeps the wordmark centred
         on the row; the theme hides it from lg up, as it hid the button. -->
    <span aria-hidden="true" class="masthead__search-icon" />

    <!-- lg and up: the full editorial row. -->
    <div class="masthead__desktop">
      <DruxtBlockSystemMenuBlockMain />

      <div class="masthead__utils">
        <nav :aria-label="$t('nav.language')" class="masthead__lang">
          <nuxt-link
            v-for="code in ['en', 'es']"
            :key="code"
            :class="{ 'is-active': code === current }"
            :to="path(code)"
          >
            {{ code.toUpperCase() }}
          </nuxt-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { langSwitchMixin } from '../../../utils/lang'

export default {
  // The language links: each one to that language's version of the page.
  mixins: [langSwitchMixin],

  fetchKey: 'lang-switch-header',
}
</script>
