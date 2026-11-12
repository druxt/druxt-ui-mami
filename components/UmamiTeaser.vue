<template>
  <nuxt-link class="teaser" :to="to">
    <!-- The photograph carries everything: the meta chip on top, the kicker
         and headline on a scrim at the foot. Nothing sits below the image,
         which is what tells a teaser from a card. -->
    <div class="teaser__media">
      <slot name="media" />

      <span v-if="meta" class="teaser__meta">{{ meta }}</span>

      <div class="teaser__scrim" />

      <div class="teaser__text">
        <span v-if="kicker" class="teaser__kicker">{{ kicker }}</span>
        <h3 class="teaser__title">{{ title }}</h3>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
/** A teaser: a photograph with a meta chip, and the kicker and title on it. */
export default {
  props: {
    to: { type: [String, Object], default: '' },
    kicker: { type: String, default: '' },
    title: { type: String, default: '' },
    /** The chip on the photograph, such as "40 min · Medium". */
    meta: { type: String, default: '' },
  },
}
</script>
