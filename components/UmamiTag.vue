<template>
  <NuxtLink class="mr-1" :to="to">
    <b-badge variant="info">{{ label }}</b-badge>
  </NuxtLink>
</template>

<script>
/** A tag: a linked badge. */
export default {
  props: {
    label: { type: String, default: '' },
    to: { type: [String, Object], default: '' },
  },
}
</script>
