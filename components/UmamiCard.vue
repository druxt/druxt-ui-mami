<template>
  <nuxt-link class="recipe-card" :to="to">
    <slot name="media" />

    <div class="recipe-card__body">
      <span v-if="kicker" class="recipe-card__kicker">{{ kicker }}</span>

      <h2 class="recipe-card__title">{{ title }}</h2>

      <p v-if="meta" class="recipe-card__meta">{{ meta }}</p>
    </div>
  </nuxt-link>
</template>

<script>
/**
 * A card: the image in the `media` slot, then a kicker, a title and a meta
 * line under it. The whole card is the link.
 */
export default {
  props: {
    to: { type: [String, Object], default: '' },
    kicker: { type: String, default: '' },
    title: { type: String, default: '' },
    /** One line, such as "45 min · Medium". */
    meta: { type: String, default: '' },
  },
}
</script>

<style scoped>
.recipe-card,
.recipe-card:hover {
  color: inherit;
  text-decoration: none;
}
</style>
