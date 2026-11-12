<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
const VARIANTS = {
  articles: ['article-grid'],
  aside: ['article-grid', 'article-grid--aside'],
  cards: ['card-grid'],
}

/** A grid of cards. */
export default {
  props: {
    /** `cards` (the default), `articles`, or `aside` for a narrow column. */
    variant: { type: String, default: 'cards' },
  },

  computed: {
    classes: ({ variant }) => VARIANTS[variant] || VARIANTS.cards,
  },
}
</script>
