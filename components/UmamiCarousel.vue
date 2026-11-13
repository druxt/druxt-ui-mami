<template>
  <!-- One slide at a time. The bars and arrows sit on a layer of their own
       above the slides, so they stay put while the slides change. -->
  <section
    class="carousel"
    role="region"
    aria-roledescription="carousel"
    :aria-label="label"
    @keydown.left="prev"
    @keydown.right="next"
    @touchstart.passive="touchStart"
    @touchend="touchEnd"
  >
    <div class="carousel__track" aria-live="polite" aria-atomic="false">
      <div
        v-for="(item, i) of items"
        :key="item.id || i"
        class="carousel__slide"
        :class="{ 'carousel__slide--on': i === active }"
        role="group"
        :aria-roledescription="slideRole"
        :aria-label="positionLabel(i + 1, items.length)"
        :aria-hidden="i === active ? null : 'true'"
        :inert="i === active ? null : ''"
      >
        <slot :item="item" :index="i" :active="i === active" />
      </div>
    </div>

    <div v-if="titles.length > 1" class="carousel__controls">
      <b-container class="carousel__frame">
        <div class="carousel__bars" role="group" :aria-label="slidesLabel">
          <button
            v-for="(title, i) of titles"
            :key="i"
            type="button"
            class="carousel__bar"
            :class="{ 'carousel__bar--on': i === active }"
            :aria-label="slideLabel(i + 1, title)"
            :aria-current="i === active ? 'true' : null"
            @click="go(i)"
          >
            <span />
          </button>
        </div>

        <div class="carousel__nav">
          <button
            type="button"
            class="carousel__arrow"
            :aria-label="previousLabel"
            @click="prev"
          >
            &#8592;
          </button>
          <button
            type="button"
            class="carousel__arrow"
            :aria-label="nextLabel"
            @click="next"
          >
            &#8594;
          </button>
          <span class="carousel__count" aria-hidden="true">{{ count }}</span>
        </div>
      </b-container>
    </div>
  </section>
</template>

<script>
// A swipe shorter than this is a tap or a scroll.
const SWIPE = 40

/**
 * Slides, one at a time, with a bar per slide, arrows and a count. The
 * default slot renders each item; the controls show once there are two
 * titles. Arrow keys and swipes move between slides.
 */
export default {
  props: {
    /** One per slide, each with an `id`. */
    items: { type: Array, default: () => [] },
    /** One per slide, for the bars' names. */
    titles: { type: Array, default: () => [] },

    label: { type: String, default: 'Featured' },
    slideRole: { type: String, default: 'slide' },
    slidesLabel: { type: String, default: 'Slides' },
    previousLabel: { type: String, default: 'Previous slide' },
    nextLabel: { type: String, default: 'Next slide' },
    /** A slide's name, from its position and the count. */
    positionLabel: {
      type: Function,
      default: (n, count) => `${n} of ${count}`,
    },
    /** A bar's name, from its position and its slide's title. */
    slideLabel: {
      type: Function,
      default: (n, title) => `Slide ${n}: ${title}`,
    },
  },

  data: () => ({
    active: 0,
    touchX: null,
  }),

  computed: {
    count() {
      const pad = (n) => String(n).padStart(2, '0')
      return `${pad(this.active + 1)} / ${pad(this.titles.length)}`
    },
  },

  watch: {
    items() {
      this.active = 0
    },
  },

  methods: {
    go(i) {
      const n = this.titles.length || 1
      this.active = (i + n) % n
    },

    next() {
      this.go(this.active + 1)
    },

    prev() {
      this.go(this.active - 1)
    },

    touchStart(event) {
      this.touchX = event.changedTouches[0].clientX
    },

    touchEnd(event) {
      if (this.touchX === null) return
      const dx = event.changedTouches[0].clientX - this.touchX
      this.touchX = null
      if (dx <= -SWIPE) this.next()
      if (dx >= SWIPE) this.prev()
    },
  },
}
</script>
