<template>
  <b-navbar-brand class="masthead__brand" :to="to">
    <span class="masthead__wordmark">{{ name }}</span>
    <span class="masthead__tagline">{{ tagline }}</span>
  </b-navbar-brand>
</template>

<script>
/** The masthead's type wordmark and tagline, linked home. */
export default {
  props: {
    name: { type: String, default: 'Umami' },
    tagline: { type: String, default: 'Food magazine' },
    to: { type: [String, Object], default: '/' },
  },
}
</script>
