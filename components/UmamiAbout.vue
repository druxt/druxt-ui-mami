<template>
  <section class="about-druxt">
    <div class="about-druxt__head">
      <slot name="mark" />
      <div>
        <span class="about-druxt__kicker">{{ kicker }}</span>
        <h2 class="about-druxt__title">{{ title }}</h2>
      </div>
    </div>
    <p v-for="(paragraph, i) of paragraphs" :key="i">{{ paragraph }}</p>
  </section>
</template>

<script>
/**
 * A section in the promo layer: a mark beside a kicker and title, then
 * paragraphs. Put the mark in the `mark` slot, with the class
 * `about-druxt__mark`. The class names are the theme's.
 */
export default {
  props: {
    kicker: { type: String, default: '' },
    title: { type: String, default: '' },
    paragraphs: { type: Array, default: () => [] },
  },
}
</script>
