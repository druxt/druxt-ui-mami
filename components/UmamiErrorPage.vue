<template>
  <div class="error-page">
    <b-container>
      <span class="error-page__kicker">{{ kicker }}</span>
      <h1 class="error-page__title">{{ title }}</h1>
      <p class="error-page__text">{{ text }}</p>
      <p v-if="detail" class="error-page__detail">
        {{ detail }}
      </p>
      <nuxt-link class="error-page__home" :to="homeTo">{{
        homeText
      }}</nuxt-link>
    </b-container>
  </div>
</template>

<script>
/** An error page, with a way home. */
export default {
  props: {
    kicker: { type: String, default: 'Something went wrong' },
    title: { type: String, default: 'There is no page here' },
    text: { type: String, default: 'The page could not be shown.' },
    /** The error's own message, under the text. */
    detail: { type: String, default: '' },
    homeText: { type: String, default: 'Back to the home page' },
    homeTo: { type: [String, Object], default: '/' },
  },
}
</script>
