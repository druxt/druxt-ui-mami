<template>
  <!-- The wrapper is what sticks: a sticky element can only stay within its
       parent's box, and this parent is the page. -->
  <div class="masthead-sticky">
    <slot />
  </div>
</template>

<script>
/** The box the masthead sticks in. Put the masthead in the default slot. */
export default {}
</script>
