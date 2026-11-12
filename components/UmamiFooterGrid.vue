<template>
  <div class="site-footer__grid">
    <div class="site-footer__col">
      <span class="site-footer__wordmark">{{ name }}</span>
      <span class="site-footer__kicker site-footer__kicker--brand">{{
        kicker
      }}</span>
      <slot name="brand" />
    </div>

    <!-- A column of links: an element with the classes
         `site-footer__col site-footer__col--menu`, holding a
         `site-footer__kicker` and `site-footer__link`s. -->
    <slot name="menu" />

    <div v-if="creditHref" class="site-footer__col site-footer__col--demo">
      <span class="site-footer__kicker site-footer__kicker--demo">{{
        creditLabel
      }}</span>
      <a
        class="site-footer__link site-footer__link--demo"
        :href="creditHref"
        rel="noopener"
        target="_blank"
      >
        {{ creditText }}
      </a>
    </div>

    <!-- The copyright, on its own line under the columns. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="copyright" class="site-footer__base" v-html="copyright" />
  </div>
</template>

<script>
/**
 * The footer's columns: the brand with a note under it, a menu, a credit
 * link, and the copyright line.
 */
export default {
  props: {
    name: { type: String, default: 'Umami' },
    kicker: { type: String, default: 'Umami' },

    /** The credit column: a kicker and a link. No link, no column. */
    creditLabel: { type: String, default: '' },
    creditHref: { type: String, default: '' },
    creditText: { type: String, default: '' },

    /** The copyright line, as trusted HTML. */
    copyright: { type: String, default: '' },
  },
}
</script>
