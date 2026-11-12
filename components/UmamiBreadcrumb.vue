<template>
  <b-breadcrumb :items="items" />
</template>

<script>
/** The trail to this page: `{ text, to }` for each step, the last one current. */
export default {
  props: {
    items: { type: Array, default: () => [] },
  },
}
</script>
