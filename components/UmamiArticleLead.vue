<template>
  <article class="article-lead">
    <!-- The title links the article and names it. This second link holds
         only a decorative image, so it stays out of the tab order and the
         accessibility tree rather than reading as a link with no name. -->
    <nuxt-link
      aria-hidden="true"
      class="article-lead__media"
      tabindex="-1"
      :to="to"
    >
      <img v-if="img" :src="img" alt="" />
    </nuxt-link>
    <div class="article-lead__body">
      <span class="article-lead__kicker">{{ kicker }}</span>
      <h2 class="article-lead__title">
        <nuxt-link :to="to">{{ title }}</nuxt-link>
      </h2>
      <p v-if="summary" class="article-lead__summary">
        {{ summary }}
      </p>
      <b-button
        class="article-lead__cta d-none d-lg-inline-block"
        :to="to"
        variant="outline-dark"
        >{{ ctaText }}</b-button
      >
    </div>
  </article>
</template>

<script>
/** The lead story at full width: a photograph beside its kicker, title, summary and button. */
export default {
  props: {
    to: { type: [String, Object], default: '' },
    /** The photograph's URL. */
    img: { type: [String, Boolean], default: '' },
    kicker: { type: String, default: 'Latest' },
    title: { type: String, default: '' },
    summary: { type: String, default: '' },
    ctaText: { type: String, default: 'Read article' },
  },
}
</script>
