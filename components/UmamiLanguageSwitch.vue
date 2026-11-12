<template>
  <!-- The drawer's buttons. -->
  <div v-if="variant === 'drawer'" class="drawer__lang">
    <nuxt-link
      v-for="language in languages"
      :key="language.code"
      :class="['drawer__lang-btn', { 'is-active': language.active }]"
      :to="language.to"
      @click.native="$emit('navigate', language)"
    >
      {{ language.label || language.code.toUpperCase() }}
    </nuxt-link>
  </div>

  <!-- The masthead's links. -->
  <nav v-else :aria-label="label" class="masthead__lang">
    <nuxt-link
      v-for="language in languages"
      :key="language.code"
      :class="{ 'is-active': language.active }"
      :to="language.to"
      @click.native="$emit('navigate', language)"
    >
      {{ language.label || language.code.toUpperCase() }}
    </nuxt-link>
  </nav>
</template>

<script>
/**
 * A link to each language's version of the page. Each language is
 * `{ code, to, active, label }`; the label defaults to the code in capitals.
 * Emits `navigate` with the language when a link is followed.
 */
export default {
  props: {
    /** The languages, in order. */
    languages: { type: Array, default: () => [] },

    /** The list's accessible name, in the masthead. */
    label: { type: String, default: 'Language' },

    /** `masthead` for the masthead's links, `drawer` for the drawer's buttons. */
    variant: { type: String, default: 'masthead' },
  },
}
</script>
