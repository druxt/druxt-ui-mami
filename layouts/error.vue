<template>
  <div class="error-page">
    <b-container>
      <span class="error-page__kicker">{{ kicker }}</span>
      <h1 class="error-page__title">{{ title }}</h1>
      <p class="error-page__text">{{ text }}</p>
      <p v-if="error.message" class="error-page__detail">
        {{ error.message }}
      </p>
      <nuxt-link class="error-page__home" :to="prefix">{{
        $t('error.home')
      }}</nuxt-link>
    </b-container>
  </div>
</template>

<script>
import { langMixin } from '../utils/lang'

/** The error page: a not found, or any other error, with a way home. */
export default {
  mixins: [langMixin],

  props: {
    error: { type: Object, default: () => ({}) },
  },

  computed: {
    status: ({ error }) => Number(error.statusCode) || 500,
    notFound: ({ status }) => status === 404,
    kicker() {
      return this.notFound
        ? this.$t('error.notFoundKicker')
        : this.$t('error.kicker')
    },
    title() {
      return this.notFound
        ? this.$t('error.notFound')
        : this.$t('error.title', { status: this.status })
    },
    text() {
      return this.notFound
        ? this.$t('error.notFoundText')
        : this.$t('error.text')
    },
  },
}
</script>
