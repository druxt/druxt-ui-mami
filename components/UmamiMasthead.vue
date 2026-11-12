<template>
  <div class="masthead">
    <!-- Below lg: toggle and wordmark on one row. The menu is a drawer
         (UmamiMobileDrawer), not a collapse. -->
    <button
      v-b-toggle="drawer"
      :aria-label="menuLabel"
      class="masthead__toggle"
      type="button"
    >
      <span class="masthead__toggle-bar" />
      <span class="masthead__toggle-bar" />
    </button>

    <!-- The brand. Whatever fills the slot, this box is the one that grows. -->
    <div class="masthead__brand-slot">
      <slot name="brand" />
    </div>

    <!-- An empty box the size of a search button keeps the wordmark centred
         on the row; the theme hides it from lg up. -->
    <span aria-hidden="true" class="masthead__search-icon" />

    <!-- lg and up: the full editorial row. -->
    <div class="masthead__desktop">
      <slot name="menu" />

      <div class="masthead__utils">
        <UmamiLanguageSwitch :label="languageLabel" :languages="languages" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * The site's masthead: the drawer toggle, the brand, the main menu and the
 * language links.
 */
export default {
  props: {
    /** The id of the UmamiMobileDrawer the toggle opens. */
    drawer: { type: String, default: 'menu' },

    /** The toggle's accessible name. */
    menuLabel: { type: String, default: 'Open menu' },

    /** The language links' accessible name. */
    languageLabel: { type: String, default: 'Language' },

    /** The language links, as UmamiLanguageSwitch takes them. */
    languages: { type: Array, default: () => [] },
  },
}
</script>

<style>
.masthead__menu {
  align-items: center;
  display: flex;
  gap: 1.625rem;
}

.masthead__menu .nav-item .dropdown-menu {
  border: 1px solid #e6ddcd;
  border-radius: 0;
  box-shadow: 0 8px 24px rgb(36 31 26 / 10%);
}
</style>
