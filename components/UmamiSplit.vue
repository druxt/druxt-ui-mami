<template>
  <!-- A row only: the band around it holds the container. -->
  <b-row>
    <b-col class="mb-4 mb-md-0" md="8">
      <slot name="main" />
    </b-col>

    <b-col md="4">
      <slot name="aside" />
    </b-col>
  </b-row>
</template>

<script>
/** Two columns from md, two thirds and one third; stacked below. */
export default {}
</script>
