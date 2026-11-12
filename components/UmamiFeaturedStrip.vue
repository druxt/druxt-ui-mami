<template>
  <div class="band band--warm">
    <b-container>
      <span class="band__label">{{ label }}</span>

      <!-- A snap scroller below md, with the next teaser cut at the edge so
           it says swipe. Put UmamiTeasers in the slot; a wrapper around them
           needs the class `contents`, so each teaser is an item of the strip. -->
      <div class="featured-strip">
        <slot />
      </div>
    </b-container>
  </div>
</template>

<script>
/** A labelled strip of teasers on the warm ground. */
export default {
  props: {
    label: { type: String, default: 'This week' },
  },
}
</script>
