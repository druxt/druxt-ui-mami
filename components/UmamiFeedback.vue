<template>
  <div class="feedback">
    <h2 class="feedback__title">{{ title }}</h2>

    <slot />
  </div>
</template>

<script>
/** A heading and, in the slot, the button that answers it. */
export default {
  props: {
    title: { type: String, default: 'Tell us what you think' },
  },
}
</script>
