<template>
  <!-- The photograph leads at every width. At lg the title sits on it. -->
  <div class="recipe-hero bleed">
    <div class="node-hero node-hero--recipe">
      <slot name="media" />
    </div>
    <div class="recipe-hero__scrim" />
    <b-container class="node-head recipe-hero__head">
      <slot name="breadcrumb" />
      <h1 class="node-head__title" v-text="title" />
      <div class="node-head__summary field--field-summary">
        <slot name="summary" />
      </div>
    </b-container>
  </div>
</template>

<script>
/** A recipe's photograph, full width, with the breadcrumb, title and summary on it. */
export default {
  props: {
    title: { type: String, default: '' },
  },
}
</script>
