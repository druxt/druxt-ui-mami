<template>
  <div>
    <h2 v-if="$scopedSlots.heading" class="band__title">
      <slot name="heading" />
    </h2>

    <b-row>
      <slot />
    </b-row>

    <b-button
      v-if="ctaTo"
      class="band__cta"
      :to="ctaTo"
      variant="outline-secondary"
      >{{ ctaText }}</b-button
    >
  </div>
</template>

<script>
/**
 * A band's heading, a row of columns in the default slot, and a button
 * under them.
 */
export default {
  props: {
    ctaText: { type: String, default: 'All recipes' },
    /** Where the button goes. No route, no button. */
    ctaTo: { type: [String, Object], default: '' },
  },
}
</script>
