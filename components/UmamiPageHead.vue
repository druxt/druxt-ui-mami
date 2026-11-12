<template>
  <!-- The head band: breadcrumb, kicker, title, description and count. -->
  <div class="term-head bleed">
    <b-container class="term-head__inner">
      <slot name="breadcrumb" />
      <span v-if="kicker" class="term-head__kicker">{{ kicker }}</span>
      <h1 class="term-head__title" v-text="title" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="description" class="term-head__blurb" v-html="description" />
      <span v-if="count !== null" class="term-head__count">{{ count }}</span>
    </b-container>
  </div>
</template>

<script>
/** A page's head band, full width on the warm ground. */
export default {
  props: {
    title: { type: String, default: '' },
    kicker: { type: String, default: '' },
    /** Under the title, as trusted HTML. */
    description: { type: String, default: '' },
    /** A line such as "18 recipes and 4 articles". Null for none. */
    count: { type: String, default: null },
  },
}
</script>
