<template>
  <!-- A real img under a gradient scrim, so the photograph can be cropped
       per breakpoint. The banner's height and scrim live in the theme. -->
  <div class="banner">
    <img
      v-if="img"
      ref="media"
      class="banner__media"
      :class="{ 'banner__media--held': held }"
      :style="held ? { width: `${held}px` } : null"
      :src="img"
      alt=""
      @load="hold"
    />
    <div class="banner__scrim" />

    <b-container>
      <div class="banner__body">
        <span class="banner__kicker">{{ kicker }}</span>

        <h2 class="banner__title">{{ title }}</h2>

        <p class="banner__summary">{{ summary }}</p>

        <div class="d-flex align-items-center flex-wrap" style="gap: 1.25rem">
          <b-button v-if="cta" :to="cta.to" variant="primary">
            {{ cta.text }}
            <span class="sr-only">: {{ title }}</span>
          </b-button>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
/**
 * A full-width photograph with a kicker, a title, a summary and a button
 * on it. An image narrower than the banner is held at its own width.
 */
export default {
  props: {
    /** The photograph's URL. */
    img: { type: [String, Boolean], default: '' },
    kicker: { type: String, default: '' },
    title: { type: String, default: '' },
    summary: { type: String, default: '' },
    /** The button: `{ text, to }`. The title is read out after the text. */
    cta: { type: Object, default: null },
  },

  data: () => ({
    // The image's own width while it is narrower than the banner, else 0.
    held: 0,
  }),

  // A server-rendered image can finish loading before hydration.
  mounted() {
    if (this.$refs.media && this.$refs.media.complete) this.hold()
  },

  beforeDestroy() {
    if (this.observer) this.observer.disconnect()
  },

  methods: {
    hold() {
      const media = this.$refs.media
      if (!media) return
      const fit = () => {
        this.held =
          media.naturalWidth < this.$el.clientWidth ? media.naturalWidth : 0
      }
      fit()
      if (!this.observer && window.ResizeObserver) {
        this.observer = new ResizeObserver(fit)
        this.observer.observe(this.$el)
      }
    },
  },
}
</script>
