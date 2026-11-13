<template>
  <!-- The photograph leads at every width. At lg the title sits on it. -->
  <div class="recipe-hero bleed">
    <div class="node-hero node-hero--recipe" :class="mediaClass">
      <slot name="media" />
    </div>
    <div class="recipe-hero__scrim" />
    <b-container class="node-head recipe-hero__head">
      <slot name="breadcrumb" />
      <h1 class="node-head__title">
        <slot name="title">{{ title }}</slot>
      </h1>
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
    /** The title, as text. The `#title` slot replaces it. */
    title: { type: String, default: '' },
    /** Classes for the photograph's box, in any form `:class` takes. */
    mediaClass: { type: [String, Array, Object], default: null },
  },
}
</script>
