<template>
  <b-list-group>
    <b-list-group-item v-for="(item, key) of items" :key="key">
      <span v-text="item" />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
/** A list of ingredients, one line each. */
export default {
  props: {
    /** The ingredients, as text. */
    items: { type: Array, default: () => [] },
  },
}
</script>
