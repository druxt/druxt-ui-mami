<template>
  <div class="promo">
    <!-- v-if, so a missing image collapses instead of reserving two thirds
         of the band for an img with no src. -->
    <img v-if="img" alt="" class="promo__cover" :src="img" />

    <div class="promo__body">
      <span class="promo__kicker">{{ kicker }}</span>

      <h2 class="promo__title">
        <slot name="title" />
      </h2>

      <!-- The summary, in an element with the class `promo__summary`. -->
      <slot name="summary" />

      <b-button v-if="cta" :to="cta.to" variant="secondary">
        {{ cta.text }}
        <span v-if="cta.target" class="sr-only">: {{ cta.target }}</span>
      </b-button>
    </div>
  </div>
</template>

<script>
/**
 * A promotion: a cover image beside a kicker, a title, a summary and a
 * button. The button is `{ text, to, target }`; `target` names what it leads
 * to, for a screen reader, after a generic text such as "Find out more".
 */
export default {
  props: {
    /** The cover's URL. */
    img: { type: [String, Boolean], default: '' },
    kicker: { type: String, default: 'In print' },
    cta: { type: Object, default: null },
  },
}
</script>
