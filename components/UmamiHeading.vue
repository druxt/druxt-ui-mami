<template>
  <h2 class="recipe-body__heading" v-text="text" />
</template>

<script>
/** A section's heading inside a page, as the recipe and article pages head theirs. */
export default {
  props: {
    text: { type: String, default: '' },
  },
}
</script>
