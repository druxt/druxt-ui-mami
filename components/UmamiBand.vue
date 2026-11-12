<template>
  <!-- Every band is full-bleed with its own ground; the content inside every
       band sits in the same container. -->
  <div :class="classes">
    <b-container v-if="contained">
      <slot />
    </b-container>
    <slot v-else />
  </div>
</template>

<script>
/** A full-width band of the page, on the paper or the warm ground. */
export default {
  props: {
    /** `paper` or `warm`. */
    ground: { type: String, default: 'paper' },

    /** Theme modifiers: `head`, `flush` (closer to the masthead), `footer`. */
    modifiers: { type: Array, default: () => [] },

    /** Wrap the content in a container. */
    contained: { type: Boolean, default: true },
  },

  computed: {
    classes: ({ ground, modifiers }) => [
      'band',
      `band--${ground}`,
      ...modifiers.map((modifier) => `band--${modifier}`),
    ],
  },
}
</script>
