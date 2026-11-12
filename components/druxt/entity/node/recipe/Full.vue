<template>
  <article class="recipe-page">
    <!-- The photograph leads at every width. At lg the title sits on it. -->
    <div class="recipe-hero bleed">
      <div class="node-hero node-hero--recipe">
        <slot name="field_media_image" />
      </div>
      <div class="recipe-hero__scrim" />
      <b-container class="node-head recipe-hero__head">
        <DruxtBreadcrumb />
        <h1 class="node-head__title" v-text="entity.attributes.title" />
        <div class="node-head__summary field--field-summary">
          <slot name="field_summary" />
        </div>
      </b-container>
    </div>

    <dl class="stat-grid bleed">
      <div v-for="stat of stats" :key="stat.label" class="stat-grid__cell">
        <dt class="stat-grid__label">{{ stat.label }}</dt>
        <dd class="stat-grid__value">{{ stat.value }}</dd>
      </div>
    </dl>

    <!-- Ingredients first, then the method; side by side from md. -->
    <div class="recipe-body">
      <section class="recipe-ingredients">
        <h2 class="recipe-body__heading">{{ $t('recipe.ingredients') }}</h2>
        <slot name="field_ingredients" />
      </section>

      <section class="recipe-method">
        <h2 class="recipe-body__heading">{{ $t('recipe.method') }}</h2>
        <slot name="field_recipe_instruction" />

        <div class="recipe-tags">
          <slot name="field_recipe_category" />
          <slot name="field_tags" />
        </div>
      </section>
    </div>

    <!-- The note follows the recipe. -->
    <AppDruxtNote
      class="mt-5"
      :title="$t('note.recipeTitle')"
      :cta="$t('note.recipeCta')"
      href="https://druxtjs.org/modules/entity"
      :code="code"
      >{{ $t('note.recipeBody', { mode: 'full' }) }}</AppDruxtNote
    >
  </article>
</template>

<script>
import { DruxtEntityMixin } from 'druxt-entity'
import { langMixin } from '../../../../../utils/lang'

export default {
  mixins: [langMixin, DruxtEntityMixin],

  computed: {
    stats() {
      const a = this.entity.attributes
      const level = a.field_difficulty || ''
      const minutes = (n) => (n || n === 0 ? this.$t('recipe.min', { n }) : '')
      // A recipe without a value shows no stat rather than "undefined min".
      return [
        {
          label: this.$t('recipe.prep'),
          value: minutes(a.field_preparation_time),
        },
        {
          label: this.$t('recipe.cook'),
          value: minutes(a.field_cooking_time),
        },
        { label: this.$t('recipe.serves'), value: a.field_number_of_servings },
        {
          label: this.$t('recipe.difficulty'),
          value: level && this.$t(`listing.${level}`),
        },
      ].filter(({ value }) => value || value === 0)
    },

    code: () =>
      [
        '<span class="t">&lt;DruxtEntity</span>',
        '  <span class="a">type</span>=<span class="v">"node--recipe"</span>',
        '  <span class="a">mode</span>=<span class="v">"full"</span>',
        '  <span class="a">:uuid</span>=<span class="v">"uuid"</span>',
        '<span class="t">/&gt;</span>',
      ].join('\n'),
  },

  // The display carries no title: the page title block does, and this
  // template draws its own.
  druxt: {
    query: {
      fields: ['title'],
    },
  },
}
</script>
