<template>
  <div class="band band--warm collections">
    <b-container>
      <b-row class="align-items-center">
        <b-col cols="12" md="4">
          <h2 class="mb-0">{{ title }}</h2>
        </b-col>

        <b-col class="mt-3 mt-md-0" cols="12" md="8">
          <div class="collections__list">
            <b-link
              v-for="(link, i) of links"
              :key="link.id || i"
              class="collections__link"
              nuxt
              :to="link.to"
            >
              {{ link.text }}
            </b-link>
            <b-link v-if="more" class="collections__more" nuxt :to="more.to">{{
              more.text
            }}</b-link>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
/** A heading beside a set of pill links, on the warm ground. */
export default {
  props: {
    title: { type: String, default: 'Recipe collections' },
    /** The pills: `{ text, to }` each. */
    links: { type: Array, default: () => [] },
    /** A last link, after the pills: `{ text, to }`. */
    more: { type: Object, default: null },
  },
}
</script>
