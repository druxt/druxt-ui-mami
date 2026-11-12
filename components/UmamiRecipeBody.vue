<template>
  <!-- Ingredients first, then the method; side by side from md. -->
  <div class="recipe-body">
    <section class="recipe-ingredients">
      <h2 class="recipe-body__heading">{{ ingredientsHeading }}</h2>
      <slot name="ingredients" />
    </section>

    <section class="recipe-method">
      <h2 class="recipe-body__heading">{{ methodHeading }}</h2>
      <slot name="method" />

      <div class="recipe-tags">
        <slot name="tags" />
      </div>
    </section>
  </div>
</template>

<script>
/** A recipe's ingredients beside its method, with tags under the method. */
export default {
  props: {
    ingredientsHeading: { type: String, default: 'Ingredients' },
    methodHeading: { type: String, default: 'Method' },
  },
}
</script>
